/**
 * Ads manager helpers (client-safe): the AdminAd shape, status derivation,
 * slot grouping and size labels. Row ↔ form mapping for the server actions.
 */
import { adSizes, adSlots, type AdSizeKey, type AdSlotConfig, type AdSlotKey } from "@/config/ads";
import type { AdInsert, AdRow } from "@/lib/supabase/types";
import type { AdFormValues } from "@/lib/admin/schemas";

export interface AdminAd {
  id: string;
  slotKey: string;
  sponsorName: string;
  imageUrl: string;
  imagePath: string | null;
  href: string;
  alt: string;
  enabled: boolean;
  startsAt: string | null;
  endsAt: string | null;
  weight: number;
  createdAt: string;
  updatedAt: string | null;
}

export function rowToAdminAd(row: AdRow): AdminAd {
  return {
    id: row.id,
    slotKey: row.slot_key,
    sponsorName: row.sponsor_name,
    imageUrl: row.image_url,
    imagePath: row.image_path,
    href: row.href,
    alt: row.alt ?? "",
    enabled: row.enabled,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    weight: row.weight,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export type AdStatus = "active" | "scheduled" | "expired" | "disabled";

/** Disabled beats the window; a future start is "scheduled"; a past end is "expired". */
export function adStatus(ad: Pick<AdminAd, "enabled" | "startsAt" | "endsAt">, now: Date = new Date()): AdStatus {
  if (!ad.enabled) return "disabled";
  const t = now.getTime();
  if (ad.startsAt && Date.parse(ad.startsAt) > t) return "scheduled";
  if (ad.endsAt && Date.parse(ad.endsAt) <= t) return "expired";
  return "active";
}

export const AD_STATUS_LABEL: Record<AdStatus, string> = {
  active: "Active",
  scheduled: "Scheduled",
  expired: "Expired",
  disabled: "Disabled",
};

const nul = (s: string | null | undefined) => (s && s.trim() ? s.trim() : null);

export function adFormToInsert(v: AdFormValues): AdInsert {
  return {
    slot_key: v.slotKey,
    sponsor_name: v.sponsorName.trim(),
    image_url: v.imageUrl,
    image_path: v.imagePath,
    href: v.href,
    alt: nul(v.alt),
    enabled: v.enabled,
    starts_at: v.startsAt ? new Date(v.startsAt).toISOString() : null,
    ends_at: v.endsAt ? new Date(v.endsAt).toISOString() : null,
    weight: v.weight,
  };
}

export function adToForm(ad: AdminAd): AdFormValues {
  return {
    slotKey: ad.slotKey as AdSlotKey,
    sponsorName: ad.sponsorName,
    imageUrl: ad.imageUrl,
    imagePath: ad.imagePath,
    href: ad.href,
    alt: ad.alt,
    enabled: ad.enabled,
    startsAt: ad.startsAt,
    endsAt: ad.endsAt,
    weight: ad.weight,
  };
}

export function emptyAdForm(slotKey: AdSlotKey): AdFormValues {
  return {
    slotKey,
    sponsorName: "",
    imageUrl: "",
    imagePath: null,
    href: "",
    alt: "",
    enabled: true,
    startsAt: null,
    endsAt: null,
    weight: 1,
  };
}

/* ------------------------------------------------------------------ */
/*  Slots                                                              */
/* ------------------------------------------------------------------ */

export type SlotGroupKey = "home" | "section" | "article" | "listing" | "podcast";

export const SLOT_GROUPS: Array<{ key: SlotGroupKey; label: string }> = [
  { key: "home", label: "Home" },
  { key: "section", label: "Sections" },
  { key: "article", label: "Articles" },
  { key: "listing", label: "Listings" },
  { key: "podcast", label: "Podcast" },
];

export interface SlotInfo extends AdSlotConfig {
  key: AdSlotKey;
  group: SlotGroupKey;
}

export const SLOT_LIST: SlotInfo[] = (Object.keys(adSlots) as AdSlotKey[]).map((key) => ({
  key,
  group: key.split(".")[0] as SlotGroupKey,
  ...adSlots[key],
}));

export const sizeText = (s: AdSizeKey) => `${adSizes[s].label} ${adSizes[s].width}×${adSizes[s].height}`;

/** "Billboard 970×250 · tablet 728×90 · mobile 320×100" */
export function slotSizesLabel(slot: AdSlotConfig): string {
  const parts = [sizeText(slot.size)];
  if (slot.tabletSize) parts.push(`tablet ${adSizes[slot.tabletSize].width}×${adSizes[slot.tabletSize].height}`);
  if (slot.mobileSize) parts.push(`mobile ${adSizes[slot.mobileSize].width}×${adSizes[slot.mobileSize].height}`);
  return parts.join(" · ");
}

/** Ratio mismatch between an uploaded image and the slot's primary size, as a fraction (0.05 = 5%). */
export function aspectMismatch(width: number, height: number, size: AdSizeKey): number {
  const s = adSizes[size];
  if (!width || !height) return 0;
  const want = s.width / s.height;
  const got = width / height;
  return Math.abs(got - want) / want;
}
