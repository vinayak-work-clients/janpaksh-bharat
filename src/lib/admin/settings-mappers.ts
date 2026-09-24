/**
 * site_settings row ↔ settings form. The form always shows the effective
 * value (row over siteConfig); "#" placeholders in the seed become empty
 * fields, and empty optional fields save as null so the config fallback applies.
 */
import type { SiteSettingsRow } from "@/lib/supabase/types";
import { mergeSettings } from "@/lib/site-settings";
import type { SettingsFormValues, SettingsPatch } from "@/lib/admin/schemas";

const link = (v: string) => (v === "#" ? "" : v);

export function rowToSettingsForm(row: SiteSettingsRow | null): SettingsFormValues {
  const s = mergeSettings(row);
  return {
    siteName: s.name,
    siteNameHindi: s.nameHindi,
    tagline: s.tagline,
    taglineEn: s.taglineEn,
    description: s.description,
    logoUrl: s.logo.url,
    logoPath: s.logo.path,
    logoDarkUrl: s.logo.darkUrl,
    logoDarkPath: s.logo.darkPath,
    heroPosterUrl: row?.hero_poster_url ?? null,
    heroPosterPath: s.hero.posterPath,
    heroBackground: s.hero.background,
    heroKicker: s.hero.kicker,
    contactName: s.contact.name,
    contactRole: s.contact.role,
    contactEmail: s.contact.email,
    contactPhone: s.contact.phone,
    location: s.location,
    whatsappUrl: link(s.socials.whatsapp),
    instagramUrl: link(s.socials.instagram),
    youtubeUrl: link(s.socials.youtube),
    xUrl: link(s.socials.x),
    facebookUrl: link(s.socials.facebook),
    ctaPrimaryLabel: s.cta.primary.label,
    ctaPrimaryHref: s.cta.primary.href,
    ctaSecondaryLabel: s.cta.secondary.label,
    ctaSecondaryHref: s.cta.secondary.href,
    whatsappCtaLabel: s.cta.whatsappLabel,
    podcastName: s.podcast.showName,
    podcastNameHindi: s.podcast.showNameHindi,
    podcastBlurb: s.podcast.blurb,
    listenSpotify: link(s.listenOn.spotify),
    listenApple: link(s.listenOn.apple),
    listenYoutube: link(s.listenOn.youtube),
    tickerEnabled: s.tickerEnabled,
    adsEnabled: s.adsEnabled,
    archiveNotice: s.archiveNotice,
  };
}

type TextKey = Exclude<keyof SettingsPatch, "tickerEnabled" | "adsEnabled" | "heroBackground">;

const COLUMN: Record<TextKey, keyof SiteSettingsRow> = {
  siteName: "site_name",
  siteNameHindi: "site_name_hindi",
  tagline: "tagline",
  taglineEn: "tagline_en",
  description: "description",
  logoUrl: "logo_url",
  logoPath: "logo_path",
  logoDarkUrl: "logo_dark_url",
  logoDarkPath: "logo_dark_path",
  heroPosterUrl: "hero_poster_url",
  heroPosterPath: "hero_poster_path",
  heroKicker: "hero_kicker",
  contactName: "contact_name",
  contactRole: "contact_role",
  contactEmail: "contact_email",
  contactPhone: "contact_phone",
  location: "location",
  whatsappUrl: "whatsapp_url",
  instagramUrl: "instagram_url",
  youtubeUrl: "youtube_url",
  xUrl: "x_url",
  facebookUrl: "facebook_url",
  ctaPrimaryLabel: "cta_primary_label",
  ctaPrimaryHref: "cta_primary_href",
  ctaSecondaryLabel: "cta_secondary_label",
  ctaSecondaryHref: "cta_secondary_href",
  whatsappCtaLabel: "whatsapp_cta_label",
  podcastName: "podcast_name",
  podcastNameHindi: "podcast_name_hindi",
  podcastBlurb: "podcast_blurb",
  listenSpotify: "listen_spotify",
  listenApple: "listen_apple",
  listenYoutube: "listen_youtube",
  archiveNotice: "archive_notice",
};

/** Only the keys present in the patch are written; "" becomes null (config fallback). */
export function settingsPatchToRow(patch: SettingsPatch): Partial<SiteSettingsRow> {
  const out: Partial<SiteSettingsRow> = {};
  for (const [key, value] of Object.entries(patch) as Array<[keyof SettingsPatch, unknown]>) {
    if (value === undefined) continue;
    if (key === "tickerEnabled") out.ticker_enabled = Boolean(value);
    else if (key === "adsEnabled") out.ads_enabled = Boolean(value);
    else if (key === "heroBackground") out.hero_background = value as "wash" | "solid";
    else {
      const col = COLUMN[key as TextKey];
      const text = typeof value === "string" ? value.trim() : null;
      (out as Record<string, unknown>)[col] = text ? text : null;
    }
  }
  return out;
}
