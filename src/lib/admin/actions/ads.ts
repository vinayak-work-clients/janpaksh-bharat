"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { requireAdmin } from "@/lib/admin/auth";
import { adSchema, type AdFormValues } from "@/lib/admin/schemas";
import { adFormToInsert } from "@/lib/admin/ads";
import { getAdRow } from "@/lib/admin/queries";
import { BRANDING_BUCKET } from "@/lib/admin/storage";
import { revalidateAds, revalidateSettings } from "@/lib/data/cache";

type Client = SupabaseClient<Database>;

export type AdActionResult =
  | { ok: true; id: string; warning?: string }
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof AdFormValues, string>> };

function fieldErrorsFrom(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Partial<Record<keyof AdFormValues, string>> = {};
  for (const issue of issues) {
    const key = issue.path[0] as keyof AdFormValues | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

function friendly(message: string): string {
  if (/ads_slot_key_sponsor_name_key|duplicate key/.test(message)) return "This sponsor already has a creative in this slot. Edit that one, or use a different sponsor name.";
  if (/row-level security/.test(message)) return "Supabase refused the write (row-level security). Sign in again and retry.";
  return message;
}

/** Every public page shows ads; the admin ads page re-renders too. */
function revalidateAdPages() {
  revalidateAds();
  revalidatePath("/", "layout");
  revalidatePath("/admin/ads");
}

async function removeBranding(supabase: Client, paths: Array<string | null | undefined>): Promise<string | undefined> {
  const clean = paths.filter((p): p is string => Boolean(p));
  if (!clean.length) return undefined;
  const { error } = await supabase.storage.from(BRANDING_BUCKET).remove(clean);
  return error ? `The creative file could not be removed from storage (${error.message}).` : undefined;
}

export async function createAd(values: AdFormValues): Promise<AdActionResult> {
  const { supabase } = await requireAdmin();
  const parsed = adSchema.safeParse(values);
  if (!parsed.success) return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };

  const { data, error } = await supabase.from("ads").insert(adFormToInsert(parsed.data)).select("id").single();
  if (error || !data) return { ok: false, error: friendly(error?.message ?? "Could not save the creative") };

  revalidateAdPages();
  return { ok: true, id: data.id };
}

export async function updateAd(id: string, values: AdFormValues): Promise<AdActionResult> {
  const { supabase } = await requireAdmin();
  const previous = await getAdRow(supabase, id);
  if (!previous) return { ok: false, error: "This creative no longer exists." };

  const parsed = adSchema.safeParse({ ...values, slotKey: previous.slot_key });
  if (!parsed.success) return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };

  const { error } = await supabase.from("ads").update(adFormToInsert(parsed.data)).eq("id", id);
  if (error) return { ok: false, error: friendly(error.message) };

  // A replaced upload leaves the old object behind: remove it.
  const warning = previous.image_path && previous.image_path !== parsed.data.imagePath ? await removeBranding(supabase, [previous.image_path]) : undefined;

  revalidateAdPages();
  return { ok: true, id, warning };
}

export async function deleteAd(id: string): Promise<AdActionResult> {
  const { supabase } = await requireAdmin();
  const row = await getAdRow(supabase, id);
  if (!row) return { ok: false, error: "This creative no longer exists." };

  const { error } = await supabase.from("ads").delete().eq("id", id);
  if (error) return { ok: false, error: friendly(error.message) };

  const warning = await removeBranding(supabase, [row.image_path]);
  revalidateAdPages();
  return { ok: true, id, warning };
}

export async function toggleAd(id: string): Promise<AdActionResult & { enabled?: boolean }> {
  const { supabase } = await requireAdmin();
  const row = await getAdRow(supabase, id);
  if (!row) return { ok: false, error: "This creative no longer exists." };

  const next = !row.enabled;
  const { error } = await supabase.from("ads").update({ enabled: next }).eq("id", id);
  if (error) return { ok: false, error: friendly(error.message) };

  revalidateAdPages();
  return { ok: true, id, enabled: next };
}

/** The global switch on site_settings; every slot on the site follows it. */
export async function setAdsEnabled(enabled: boolean): Promise<AdActionResult> {
  const { supabase } = await requireAdmin();
  const { error } = await supabase.from("site_settings").update({ ads_enabled: Boolean(enabled) }).eq("id", 1);
  if (error) return { ok: false, error: friendly(error.message) };

  revalidateSettings();
  revalidateAdPages();
  revalidatePath("/admin/settings");
  return { ok: true, id: "1" };
}
