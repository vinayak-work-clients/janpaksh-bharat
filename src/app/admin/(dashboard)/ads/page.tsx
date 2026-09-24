import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import { getAllAds, getSettingsRow } from "@/lib/admin/queries";
import { AdsManager } from "@/components/admin/ads/AdsManager";

export const metadata: Metadata = { title: "Ads" };

export default async function AdsPage() {
  const { supabase } = await requireAdmin();
  const [ads, settings] = await Promise.all([getAllAds(supabase), getSettingsRow(supabase)]);
  return <AdsManager ads={ads} adsEnabled={settings?.ads_enabled ?? true} />;
}
