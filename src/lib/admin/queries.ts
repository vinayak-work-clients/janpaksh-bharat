import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, PostRow } from "@/lib/supabase/types";
import { rowToAdminPost, type AdminPost } from "@/lib/admin/mappers";
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

export interface Overview {
  live: number;
  drafts: number;
  expiringSoon: number;
  breakingNow: number;
  unread: number;
  recent: AdminPost[];
  expiring: Array<AdminPost & { daysLeft: number }>;
}

export async function getOverview(supabase: Client): Promise<Overview> {
  const [posts, unread] = await Promise.all([getAllAdminPosts(supabase), getUnreadMessageCount(supabase)]);
  const now = new Date();
  const livePosts = posts.filter((p) => p.status === "published" && !isExpired(p.expiresAt, now));
  const expiring = livePosts
    .map((p) => ({ ...p, daysLeft: daysLeft(p.expiresAt, now) }))
    .filter((p) => p.daysLeft <= 7)
    .sort((a, b) => a.daysLeft - b.daysLeft);
  return {
    live: livePosts.length,
    drafts: posts.filter((p) => p.status === "draft").length,
    expiringSoon: expiring.length,
    breakingNow: livePosts.filter((p) => p.isBreaking).length,
    unread,
    recent: [...posts].sort((a, b) => (b.updatedAt ?? b.createdAt).localeCompare(a.updatedAt ?? a.createdAt)).slice(0, 5),
    expiring: expiring.slice(0, 5),
  };
}
