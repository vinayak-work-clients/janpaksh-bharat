/**
 * Ad creatives. Mock path returns the dummy creatives from src/config/ads.ts;
 * Supabase path reads the ads table (RLS already filters enabled + date
 * window) and picks one creative per slot by weight. AdSlot still renders
 * from config until Phase 6.
 */
import { adSlots, type AdCreative, type AdSlotKey } from "@/config/ads";
import type { AdRow } from "@/lib/supabase/types";
import { dataSource } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/server";
import { cached } from "@/lib/data/cache";

export interface ActiveAd extends AdCreative {
  id: string;
  slotKey: string;
  weight: number;
}

function rowToAd(row: AdRow): ActiveAd {
  return {
    id: row.id,
    slotKey: row.slot_key,
    src: row.image_url,
    href: row.href,
    alt: row.alt ?? `${row.sponsor_name} (advertisement)`,
    sponsorName: row.sponsor_name,
    weight: row.weight,
  };
}

function configAds(): ActiveAd[] {
  return (Object.keys(adSlots) as AdSlotKey[])
    .filter((key) => adSlots[key].enabled)
    .map((key) => ({ id: `config:${key}`, slotKey: key, weight: 1, ...adSlots[key].creative }));
}

const fetchActiveAds = cached(
  async (): Promise<ActiveAd[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("ads").select("*").order("created_at", { ascending: true });
    if (error) throw new Error(`ads: ${error.message}`);
    return (data ?? []).map(rowToAd);
  },
  ["active-ads"],
  "ads",
);

/** Every active creative across all slots (RLS-filtered on the Supabase path). */
export async function getAllActiveAds(): Promise<ActiveAd[]> {
  return dataSource() === "supabase" ? fetchActiveAds() : configAds();
}

/** Weighted random pick — deterministic-friendly: pass `random` for tests. */
export function pickByWeight<T extends { weight: number }>(items: T[], random: () => number = Math.random): T | null {
  if (items.length === 0) return null;
  const total = items.reduce((sum, i) => sum + Math.max(1, i.weight), 0);
  let r = random() * total;
  for (const item of items) {
    r -= Math.max(1, item.weight);
    if (r <= 0) return item;
  }
  return items[items.length - 1];
}

/** All active creatives for a slot (a slot may rotate between several). */
export async function getAdsForSlot(slotKey: AdSlotKey): Promise<ActiveAd[]> {
  const all = await getAllActiveAds();
  return all.filter((a) => a.slotKey === slotKey);
}

/** One creative for a slot, chosen by weight; null when the slot is empty. */
export async function getAdForSlot(slotKey: AdSlotKey): Promise<ActiveAd | null> {
  return pickByWeight(await getAdsForSlot(slotKey));
}
