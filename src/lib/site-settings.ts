/**
 * Site settings shape + defaults + row merge. Client-safe (no Supabase
 * imports) so the SiteSettingsProvider can ship it to the browser; the
 * server read lives in src/lib/data/settings.ts.
 */
import { siteConfig } from "@/config/site";
import type { SiteSettingsRow } from "@/lib/supabase/types";

/** Mirrors the shape of siteConfig, minus the static nav/legal/about lists. */
export interface SiteSettings {
  name: string;
  nameHindi: string;
  tagline: string;
  taglineEn: string;
  description: string;
  contact: { name: string; role: string; email: string; phone: string };
  location: string;
  socials: { whatsapp: string; instagram: string; youtube: string; x: string; facebook: string };
  cta: {
    primary: { label: string; href: string };
    secondary: { label: string; href: string };
    whatsappLabel: string;
  };
  hero: {
    kicker: string;
    background: "wash" | "solid";
    poster: string;
    posterPath: string | null;
    deckSize: number;
  };
  logo: { url: string | null; path: string | null; darkUrl: string | null; darkPath: string | null };
  podcast: { showName: string; showNameHindi: string; blurb: string };
  listenOn: { spotify: string; apple: string; youtube: string };
  tickerEnabled: boolean;
  adsEnabled: boolean;
  archiveNotice: string;
  updatedAt: string | null;
}

/** siteConfig as SiteSettings (the mock path and the fallback for null columns). */
export function defaultSettings(): SiteSettings {
  return {
    name: siteConfig.name,
    nameHindi: siteConfig.nameHindi,
    tagline: siteConfig.tagline,
    taglineEn: siteConfig.taglineEn,
    description: siteConfig.description,
    contact: { ...siteConfig.contact },
    location: siteConfig.about.location,
    socials: { ...siteConfig.socials },
    cta: {
      primary: { ...siteConfig.cta.primary },
      secondary: { ...siteConfig.cta.secondary },
      whatsappLabel: siteConfig.cta.whatsappLabel,
    },
    hero: {
      kicker: siteConfig.hero.kicker,
      background: siteConfig.hero.background,
      poster: siteConfig.hero.poster,
      posterPath: null,
      deckSize: siteConfig.hero.deckSize,
    },
    logo: { url: null, path: null, darkUrl: null, darkPath: null },
    podcast: { ...siteConfig.podcast },
    listenOn: { ...siteConfig.listenOn },
    tickerEnabled: true,
    adsEnabled: true,
    archiveNotice: siteConfig.archiveNotice,
    updatedAt: null,
  };
}

const pick = <T>(value: T | null | undefined, fallback: T): T => (value == null ? fallback : value);

/** Row over siteConfig: any null column keeps the config value. */
export function mergeSettings(row: SiteSettingsRow | null | undefined): SiteSettings {
  const d = defaultSettings();
  if (!row) return d;
  return {
    name: pick(row.site_name, d.name),
    nameHindi: pick(row.site_name_hindi, d.nameHindi),
    tagline: pick(row.tagline, d.tagline),
    taglineEn: pick(row.tagline_en, d.taglineEn),
    description: pick(row.description, d.description),
    contact: {
      name: pick(row.contact_name, d.contact.name),
      role: pick(row.contact_role, d.contact.role),
      email: pick(row.contact_email, d.contact.email),
      phone: pick(row.contact_phone, d.contact.phone),
    },
    location: pick(row.location, d.location),
    socials: {
      whatsapp: pick(row.whatsapp_url, d.socials.whatsapp),
      instagram: pick(row.instagram_url, d.socials.instagram),
      youtube: pick(row.youtube_url, d.socials.youtube),
      x: pick(row.x_url, d.socials.x),
      facebook: pick(row.facebook_url, d.socials.facebook),
    },
    cta: {
      primary: {
        label: pick(row.cta_primary_label, d.cta.primary.label),
        href: pick(row.cta_primary_href, d.cta.primary.href),
      },
      secondary: {
        label: pick(row.cta_secondary_label, d.cta.secondary.label),
        href: pick(row.cta_secondary_href, d.cta.secondary.href),
      },
      whatsappLabel: pick(row.whatsapp_cta_label, d.cta.whatsappLabel),
    },
    hero: {
      kicker: pick(row.hero_kicker, d.hero.kicker),
      background: pick(row.hero_background, d.hero.background),
      poster: pick(row.hero_poster_url, d.hero.poster),
      posterPath: row.hero_poster_path ?? null,
      deckSize: d.hero.deckSize,
    },
    logo: {
      url: row.logo_url ?? null,
      path: row.logo_path ?? null,
      darkUrl: row.logo_dark_url ?? null,
      darkPath: row.logo_dark_path ?? null,
    },
    podcast: {
      showName: pick(row.podcast_name, d.podcast.showName),
      showNameHindi: pick(row.podcast_name_hindi, d.podcast.showNameHindi),
      blurb: pick(row.podcast_blurb, d.podcast.blurb),
    },
    listenOn: {
      spotify: pick(row.listen_spotify, d.listenOn.spotify),
      apple: pick(row.listen_apple, d.listenOn.apple),
      youtube: pick(row.listen_youtube, d.listenOn.youtube),
    },
    tickerEnabled: row.ticker_enabled ?? d.tickerEnabled,
    adsEnabled: row.ads_enabled ?? d.adsEnabled,
    archiveNotice: pick(row.archive_notice, d.archiveNotice),
    updatedAt: row.updated_at ?? null,
  };
}
