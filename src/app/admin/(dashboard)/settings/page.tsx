import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import { getSettingsRow } from "@/lib/admin/queries";
import { rowToSettingsForm } from "@/lib/admin/settings-mappers";
import { SETTINGS_TABS, type SettingsTab } from "@/lib/admin/schemas";
import { SettingsTabs } from "@/components/admin/settings/SettingsTabs";

export const metadata: Metadata = { title: "Settings" };

interface Props {
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function SettingsPage({ searchParams }: Props) {
  const { supabase } = await requireAdmin();
  const row = await getSettingsRow(supabase);
  const wanted = Array.isArray(searchParams.tab) ? searchParams.tab[0] : searchParams.tab;
  const initialTab = SETTINGS_TABS.find((t) => t === wanted) as SettingsTab | undefined;
  return <SettingsTabs initial={rowToSettingsForm(row)} updatedAt={row?.updated_at ?? null} initialTab={initialTab} />;
}
