"use client";

/**
 * Client-side access to the site settings. The (site) layout wraps the page
 * tree with this and passes the result of getSiteSettings(); outside it
 * (the admin, tests) consumers see the siteConfig defaults.
 */
import { createContext, useContext, type ReactNode } from "react";
import { defaultSettings, type SiteSettings } from "@/lib/site-settings";

const SiteSettingsContext = createContext<SiteSettings | null>(null);

export function SiteSettingsProvider({ settings, children }: { settings: SiteSettings; children: ReactNode }) {
  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
}

/** The current site settings; siteConfig defaults when no provider is mounted. */
export function useSiteSettings(): SiteSettings {
  return useContext(SiteSettingsContext) ?? defaultSettings();
}
