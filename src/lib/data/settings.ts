/**
 * Site settings. Mock path returns siteConfig; Supabase path reads the single
 * site_settings row and merges it over siteConfig so null columns fall back.
 * The shape, defaults and merge live in src/lib/site-settings.ts (client-safe).
 */
import { dataSource } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/server";
import { cached } from "@/lib/data/cache";
import { defaultSettings, mergeSettings, type SiteSettings } from "@/lib/site-settings";

export { defaultSettings, mergeSettings };
export type { SiteSettings };

const fetchSettings = cached(
  async (): Promise<SiteSettings> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error) throw new Error(`site_settings: ${error.message}`);
    return mergeSettings(data);
  },
  ["site-settings"],
  "settings",
);

export async function getSiteSettings(): Promise<SiteSettings> {
  return dataSource() === "supabase" ? fetchSettings() : defaultSettings();
}
