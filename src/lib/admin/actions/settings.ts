"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { settingsPatchSchema, type SettingsPatch } from "@/lib/admin/schemas";
import { settingsPatchToRow } from "@/lib/admin/settings-mappers";
import { getSettingsRow } from "@/lib/admin/queries";
import { BRANDING_BUCKET } from "@/lib/admin/storage";
import { revalidateAds, revalidateSettings } from "@/lib/data/cache";

export type SettingsActionResult =
  | { ok: true; updatedAt: string | null; warning?: string }
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof SettingsPatch, string>> };

/**
 * Save a subset of the settings form (one tab). Unknown keys are dropped by
 * zod; empty strings become null so the siteConfig fallback applies.
 */
export async function updateSettings(patch: SettingsPatch): Promise<SettingsActionResult> {
  const { supabase } = await requireAdmin();
  const parsed = settingsPatchSchema.safeParse(patch);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<keyof SettingsPatch, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof SettingsPatch | undefined;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors };
  }
  const row = settingsPatchToRow(parsed.data);
  if (Object.keys(row).length === 0) return { ok: false, error: "Nothing to save." };

  const previous = await getSettingsRow(supabase);
  const { data, error } = await supabase.from("site_settings").update(row).eq("id", 1).select("updated_at").single();
  if (error) {
    if (/row-level security/.test(error.message)) return { ok: false, error: "Supabase refused the write (row-level security). Sign in again and retry." };
    return { ok: false, error: error.message };
  }

  // Replaced brand assets: delete the previous object from the branding bucket.
  const stale: string[] = [];
  const check = (col: "logo_path" | "logo_dark_path" | "hero_poster_path", next: string | null | undefined) => {
    const prev = previous?.[col];
    if (prev && next !== undefined && next !== prev) stale.push(prev);
  };
  check("logo_path", row.logo_path);
  check("logo_dark_path", row.logo_dark_path);
  check("hero_poster_path", row.hero_poster_path);
  let warning: string | undefined;
  if (stale.length) {
    const { error: rmError } = await supabase.storage.from(BRANDING_BUCKET).remove(stale);
    if (rmError) warning = `The previous file could not be removed from storage (${rmError.message}).`;
  }

  revalidateSettings();
  if ("ads_enabled" in row) revalidateAds();
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/ads");
  return { ok: true, updatedAt: data?.updated_at ?? null, warning };
}

export interface CleanupResult {
  ok: boolean;
  status: number;
  body: unknown;
}

/**
 * "Run cleanup now": POST /api/cron/purge on this deployment with the
 * CRON_SECRET. The secret never leaves the server; the JSON result is
 * returned for the toast.
 */
export async function runCleanupNow(): Promise<CleanupResult> {
  await requireAdmin();
  const secret = process.env.CRON_SECRET;
  if (!secret) return { ok: false, status: 0, body: { error: "CRON_SECRET is not set on the server." } };

  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") || host?.startsWith("127.") ? "http" : "https");
  if (!host) return { ok: false, status: 0, body: { error: "Could not work out this site's address." } };

  try {
    const res = await fetch(`${proto}://${host}/api/cron/purge`, {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}` },
      cache: "no-store",
    });
    const body = await res.json().catch(() => ({ error: `Unexpected response (${res.status})` }));
    if (res.ok) {
      revalidatePath("/admin");
      revalidatePath("/admin/posts");
    }
    return { ok: res.ok, status: res.status, body };
  } catch (e) {
    return { ok: false, status: 0, body: { error: e instanceof Error ? e.message : String(e) } };
  }
}
