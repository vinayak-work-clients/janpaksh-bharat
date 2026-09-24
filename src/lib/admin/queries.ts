import "server-only";

import { unstable_cache } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, PostRow, SiteSettingsRow } from "@/lib/supabase/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { rowToAdminPost, type AdminPost } from "@/lib/admin/mappers";
import { rowToAdminAd, type AdminAd } from "@/lib/admin/ads";
import { rowToAdminMessage, type AdminMessage } from "@/lib/admin/messages";
import { MEDIA_BUCKET } from "@/lib/admin/storage";
import { daysLeft, isExpired } from "@/lib/admin/expiry";

type Client = SupabaseClient<Database>;

/** Every post, drafts and expired included (admin RLS), newest first. */
export async function getAllAdminPosts(supabase: Client): Promise<AdminPost[]> {
  const { data, error } = await supabase.from("posts").select("*").order("published_at", { ascending: false });
  if (error) throw new Error(`posts: ${error.message}`);
  return (data ?? []).map(rowToAdminPost);
}

export async function getAdminPostRow(supabase: Client, id: string): Promise<PostRow | null> {
  const { data, error } = await supabase.from("posts").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`post ${id}: ${error.message}`);
  return data;
}

/** Distinct categories for the editor's datalist. */
export async function getCategories(supabase: Client): Promise<string[]> {
  const { data } = await supabase.from("posts").select("category");
  const set = new Set<string>();
  for (const r of data ?? []) if (r.category) set.add(r.category);
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export async function getUnreadMessageCount(supabase: Client): Promise<number> {
  const { count, error } = await supabase
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("read", false)
    .eq("archived", false);
  if (error) return 0;
  return count ?? 0;
}

/* ------------------------------------------------------------------ */
/*  Ads                                                                */
/* ------------------------------------------------------------------ */

/** Every creative, all slots (admin RLS sees disabled and out-of-window rows too). */
export async function getAllAds(supabase: Client): Promise<AdminAd[]> {
  const { data, error } = await supabase.from("ads").select("*").order("created_at", { ascending: true });
  if (error) throw new Error(`ads: ${error.message}`);
  return (data ?? []).map(rowToAdminAd);
}

export async function getAdRow(supabase: Client, id: string) {
  const { data, error } = await supabase.from("ads").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`ad ${id}: ${error.message}`);
  return data;
}

/* ------------------------------------------------------------------ */
/*  Settings                                                           */
/* ------------------------------------------------------------------ */

export async function getSettingsRow(supabase: Client): Promise<SiteSettingsRow | null> {
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error) throw new Error(`site_settings: ${error.message}`);
  return data;
}

/* ------------------------------------------------------------------ */
/*  Messages                                                           */
/* ------------------------------------------------------------------ */

/** Every contact message, newest first. */
export async function getAllMessages(supabase: Client): Promise<AdminMessage[]> {
  const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(`contact_messages: ${error.message}`);
  return (data ?? []).map(rowToAdminMessage);
}

export async function getMessageRow(supabase: Client, id: string) {
  const { data, error } = await supabase.from("contact_messages").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`message ${id}: ${error.message}`);
  return data;
}

/* ------------------------------------------------------------------ */
/*  Storage usage (media bucket, cached 5 minutes)                     */
/* ------------------------------------------------------------------ */

export interface StorageUsage {
  bytes: number;
  files: number;
  /** ISO time the numbers were computed (cache age hint). */
  computedAt: string;
  error?: string;
}

/** Supabase free tier includes 1 GB of storage. */
export const STORAGE_FREE_TIER_BYTES = 1024 * 1024 * 1024;
export const STORAGE_USAGE_TTL_SECONDS = 300;

async function sumBucket(prefix = ""): Promise<{ bytes: number; files: number }> {
  const storage = createAdminClient().storage.from(MEDIA_BUCKET);
  let bytes = 0;
  let files = 0;
  let offset = 0;
  const limit = 1000;
  for (;;) {
    const { data, error } = await storage.list(prefix, { limit, offset, sortBy: { column: "name", order: "asc" } });
    if (error) throw new Error(`list ${prefix || "/"}: ${error.message}`);
    if (!data || data.length === 0) break;
    for (const entry of data) {
      const full = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (!entry.id) {
        const sub = await sumBucket(full);
        bytes += sub.bytes;
        files += sub.files;
      } else {
        const size = (entry.metadata as { size?: number } | null)?.size ?? 0;
        bytes += size;
        files += 1;
      }
    }
    if (data.length < limit) break;
    offset += limit;
  }
  return { bytes, files };
}

export const getStorageUsage = unstable_cache(
  async (): Promise<StorageUsage> => {
    const computedAt = new Date().toISOString();
    try {
      const { bytes, files } = await sumBucket();
      return { bytes, files, computedAt };
    } catch (e) {
      return { bytes: 0, files: 0, computedAt, error: e instanceof Error ? e.message : String(e) };
    }
  },
  ["admin-storage-usage"],
  { revalidate: STORAGE_USAGE_TTL_SECONDS, tags: ["storage-usage"] },
);

/* ------------------------------------------------------------------ */
/*  Overview                                                           */
/* ------------------------------------------------------------------ */

export interface DayCount {
  /** yyyy-mm-dd (local) */
  day: string;
  label: string;
  count: number;
}

export interface Overview {
  live: number;
  drafts: number;
  expiringSoon: number;
  breakingNow: number;
  unread: number;
  recent: AdminPost[];
  expiring: Array<AdminPost & { daysLeft: number }>;
  /** Live posts that auto-delete within 48 hours, soonest first. */
  expiringUrgent: Array<AdminPost & { hoursLeft: number }>;
  /** Posts created per day, oldest → today (7 entries). */
  perDay: DayCount[];
  /** Three latest unread, un-archived messages. */
  latestUnread: AdminMessage[];
}

function localDayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function postsPerDay(posts: Pick<AdminPost, "createdAt">[], now: Date = new Date(), days = 7): DayCount[] {
  const counts = new Map<string, number>();
  for (const p of posts) {
    const k = localDayKey(new Date(p.createdAt));
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const out: DayCount[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = localDayKey(d);
    out.push({ day: key, label: d.toLocaleDateString("en-IN", { weekday: "short" }), count: counts.get(key) ?? 0 });
  }
  return out;
}

export async function getOverview(supabase: Client): Promise<Overview> {
  const [posts, unread, messages] = await Promise.all([
    getAllAdminPosts(supabase),
    getUnreadMessageCount(supabase),
    supabase.from("contact_messages").select("*").eq("read", false).eq("archived", false).order("created_at", { ascending: false }).limit(3),
  ]);
  const now = new Date();
  const livePosts = posts.filter((p) => p.status === "published" && !isExpired(p.expiresAt, now));
  const expiring = livePosts
    .map((p) => ({ ...p, daysLeft: daysLeft(p.expiresAt, now) }))
    .filter((p) => p.daysLeft <= 7)
    .sort((a, b) => a.daysLeft - b.daysLeft);
  const expiringUrgent = livePosts
    .map((p) => ({ ...p, hoursLeft: Math.max(0, Math.ceil((new Date(p.expiresAt).getTime() - now.getTime()) / 3_600_000)) }))
    .filter((p) => p.hoursLeft <= 48)
    .sort((a, b) => a.hoursLeft - b.hoursLeft);
  return {
    live: livePosts.length,
    drafts: posts.filter((p) => p.status === "draft").length,
    expiringSoon: expiring.length,
    breakingNow: livePosts.filter((p) => p.isBreaking).length,
    unread,
    recent: [...posts].sort((a, b) => (b.updatedAt ?? b.createdAt).localeCompare(a.updatedAt ?? a.createdAt)).slice(0, 5),
    expiring: expiring.slice(0, 5),
    expiringUrgent,
    perDay: postsPerDay(posts, now),
    latestUnread: (messages.data ?? []).map(rowToAdminMessage),
  };
}
