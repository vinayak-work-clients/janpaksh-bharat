/**
 * Post form schema, shared by the editor (react-hook-form + zodResolver) and
 * the server actions. Field names are camelCase form values; mapping to the
 * database row lives in src/lib/admin/mappers.ts.
 */
import { z } from "zod";
import { sectionSlugs } from "@/config/sections";
import { adSlots, type AdSlotKey } from "@/config/ads";

export const POST_TYPES = ["image", "blog", "video", "podcast", "breaking"] as const;
export const POST_STATUSES = ["draft", "published"] as const;

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const blockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("p"), text: z.string() }),
  z.object({ type: z.literal("h2"), text: z.string() }),
  z.object({ type: z.literal("quote"), text: z.string(), cite: z.string().optional() }),
  z.object({
    type: z.literal("image"),
    src: z.string(),
    caption: z.string().optional(),
    alt: z.string().optional(),
    /** Storage path when the image was uploaded through the dashboard. */
    path: z.string().optional(),
  }),
  z.object({ type: z.literal("list"), items: z.array(z.string()) }),
]);

const optionalText = (max: number) => z.string().trim().max(max, `Keep this under ${max} characters`);

export const postSchema = z
  .object({
    type: z.enum(POST_TYPES),
    title: z.string().trim().min(3, "Give the story a title").max(200, "Keep the title under 200 characters"),
    titleHindi: optionalText(200),
    slug: z
      .string()
      .trim()
      .min(3, "The slug needs at least 3 characters")
      .max(120, "Keep the slug under 120 characters")
      .regex(SLUG_RE, "Use lowercase letters, numbers and single hyphens only"),
    standfirst: optionalText(300),
    excerpt: z
      .string()
      .trim()
      .min(20, "Write a short summary (at least 20 characters)")
      .max(400, "Keep the summary under 400 characters"),
    body: z.array(blockSchema),
    section: z.enum(sectionSlugs as [string, ...string[]], { message: "Pick a section" }),
    category: z.string().trim().min(2, "Add a category, e.g. Environment").max(60),
    tags: z.array(z.string().trim().min(1).max(40)).max(12, "Up to 12 tags"),
    status: z.enum(POST_STATUSES),
    featured: z.boolean(),
    isBreaking: z.boolean(),
    publishedAt: z.string().refine((v) => !Number.isNaN(Date.parse(v)), "Enter a valid date and time"),
    authorName: z.string().trim().min(2, "Add an author name").max(80),
    readTimeMin: z.number().int().min(1).max(180).nullable(),
    coverImageUrl: z.string().trim().url("Upload a cover image before saving"),
    coverImagePath: z.string().nullable(),
    coverAlt: optionalText(200),
    mediaUrl: z.string().trim().url("That link doesn't look right").nullable(),
    mediaPath: z.string().nullable(),
    embedUrl: z.string().trim().url("That link doesn't look right").nullable(),
    durationSec: z.number().int().min(0).nullable(),
  })
  .superRefine((v, ctx) => {
    const hasBody = v.body.some((b) => {
      if (b.type === "list") return b.items.some((i) => i.trim());
      if (b.type === "image") return Boolean(b.src);
      return b.text.trim().length > 0;
    });
    if (v.status === "published" && v.type === "blog" && !hasBody) {
      ctx.addIssue({ code: "custom", path: ["body"], message: "A blog needs some body text before it can be published" });
    }
    if (v.status === "published" && (v.type === "video" || v.type === "podcast") && !v.mediaUrl && !v.embedUrl) {
      ctx.addIssue({
        code: "custom",
        path: ["mediaUrl"],
        message: v.type === "video" ? "Upload a video or paste an embed link before publishing" : "Upload audio or paste an embed link before publishing",
      });
    }
  });

export type PostFormValues = z.infer<typeof postSchema>;
export type BlockValue = z.infer<typeof blockSchema>;

/** Words per minute used for the auto read time. */
export const WPM = 200;

export function bodyWordCount(body: BlockValue[]): number {
  let words = 0;
  for (const b of body) {
    const text = b.type === "list" ? b.items.join(" ") : b.type === "image" ? b.caption ?? "" : b.text;
    words += text.split(/\s+/).filter(Boolean).length;
  }
  return words;
}

export function estimateReadTime(body: BlockValue[]): number {
  return Math.max(1, Math.ceil(bodyWordCount(body) / WPM));
}

/* ------------------------------------------------------------------ */
/*  Ads (Phase 5B)                                                     */
/* ------------------------------------------------------------------ */

export const AD_SLOT_KEYS = Object.keys(adSlots) as [AdSlotKey, ...AdSlotKey[]];

const isoOrNull = z
  .string()
  .nullable()
  .refine((v) => v == null || !Number.isNaN(Date.parse(v)), "Enter a valid date and time");

/** http(s) link, or a site-relative path (the seeded placeholder creatives live in /public/ads). */
const imageSrc = z
  .string()
  .trim()
  .min(1, "Upload a creative before saving")
  .refine((v) => /^https?:\/\//i.test(v) || v.startsWith("/"), "Upload a creative before saving");

export const httpUrl = z
  .string()
  .trim()
  .min(1, "Add the link the ad should open")
  .max(1000, "Keep the link under 1000 characters")
  .refine((v) => /^https?:\/\/[^\s]+$/i.test(v), "Enter a full link starting with http:// or https://");

export const adSchema = z
  .object({
    slotKey: z.enum(AD_SLOT_KEYS, { message: "Pick a slot" }),
    sponsorName: z.string().trim().min(2, "Add the sponsor's name").max(80, "Keep the name under 80 characters"),
    imageUrl: imageSrc,
    imagePath: z.string().nullable(),
    href: httpUrl,
    alt: optionalText(200),
    enabled: z.boolean(),
    startsAt: isoOrNull,
    endsAt: isoOrNull,
    weight: z.number().int().min(1, "Weight is 1–10").max(10, "Weight is 1–10"),
  })
  .superRefine((v, ctx) => {
    if (v.startsAt && v.endsAt && Date.parse(v.endsAt) <= Date.parse(v.startsAt)) {
      ctx.addIssue({ code: "custom", path: ["endsAt"], message: "The end must come after the start" });
    }
  });

export type AdFormValues = z.infer<typeof adSchema>;

/* ------------------------------------------------------------------ */
/*  Site settings (Phase 5B)                                           */
/* ------------------------------------------------------------------ */

const optionalUrl = (label = "link") =>
  z
    .string()
    .trim()
    .max(500, "Keep this under 500 characters")
    .refine((v) => !v || /^https?:\/\/[^\s]+$/i.test(v), `Enter a full ${label} starting with https://`);

const whatsappUrl = z
  .string()
  .trim()
  .max(500)
  .refine(
    (v) => !v || /^https:\/\/(wa\.me|chat\.whatsapp\.com|api\.whatsapp\.com)\/[^\s]*$/i.test(v),
    "Use a wa.me or chat.whatsapp.com link",
  );

/** CTA links may be a page on the site (/about), an anchor (#whatsapp) or a full URL. */
const ctaHref = z
  .string()
  .trim()
  .min(1, "Add a link")
  .max(500)
  .refine((v) => /^(https?:\/\/[^\s]+|\/[^\s]*|#[^\s]*)$/i.test(v), "Use /page, #anchor or a full https:// link");

const shortText = (max: number, message: string) => z.string().trim().min(1, message).max(max, `Keep this under ${max} characters`);

export const settingsSchema = z.object({
  // Brand
  siteName: shortText(80, "Add the site name"),
  siteNameHindi: shortText(80, "Add the Hindi site name"),
  tagline: shortText(160, "Add the Hindi tagline"),
  taglineEn: optionalText(160),
  description: optionalText(300),
  logoUrl: z.string().nullable(),
  logoPath: z.string().nullable(),
  logoDarkUrl: z.string().nullable(),
  logoDarkPath: z.string().nullable(),
  heroPosterUrl: z.string().nullable(),
  heroPosterPath: z.string().nullable(),
  heroBackground: z.enum(["wash", "solid"]),
  heroKicker: optionalText(80),
  // Contact
  contactName: optionalText(80),
  contactRole: optionalText(80),
  contactEmail: z.string().trim().max(120).refine((v) => !v || z.string().email().safeParse(v).success, "That email doesn't look right"),
  contactPhone: z.string().trim().max(30).refine((v) => !v || /^[+\d\s()-]{7,30}$/.test(v), "Enter a valid phone number"),
  location: optionalText(120),
  // Social & CTAs
  whatsappUrl,
  instagramUrl: optionalUrl("Instagram link"),
  youtubeUrl: optionalUrl("YouTube link"),
  xUrl: optionalUrl("X link"),
  facebookUrl: optionalUrl("Facebook link"),
  ctaPrimaryLabel: shortText(40, "Add a label"),
  ctaPrimaryHref: ctaHref,
  ctaSecondaryLabel: shortText(40, "Add a label"),
  ctaSecondaryHref: ctaHref,
  whatsappCtaLabel: shortText(40, "Add a label"),
  // Podcast
  podcastName: shortText(80, "Add the show name"),
  podcastNameHindi: optionalText(80),
  podcastBlurb: optionalText(400),
  listenSpotify: optionalUrl("Spotify link"),
  listenApple: optionalUrl("Apple Podcasts link"),
  listenYoutube: optionalUrl("YouTube link"),
  // Site
  tickerEnabled: z.boolean(),
  adsEnabled: z.boolean(),
  archiveNotice: optionalText(120),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;

/** A tab saves only its own fields. */
export const settingsPatchSchema = settingsSchema.partial();
export type SettingsPatch = z.infer<typeof settingsPatchSchema>;

export const SETTINGS_TABS = ["brand", "contact", "social", "podcast", "site"] as const;
export type SettingsTab = (typeof SETTINGS_TABS)[number];

/** Which form fields belong to which tab (drives the changed-fields dot and the partial save). */
export const SETTINGS_TAB_FIELDS: Record<SettingsTab, Array<keyof SettingsFormValues>> = {
  brand: ["siteName", "siteNameHindi", "tagline", "taglineEn", "description", "logoUrl", "logoPath", "logoDarkUrl", "logoDarkPath", "heroPosterUrl", "heroPosterPath", "heroBackground", "heroKicker"],
  contact: ["contactName", "contactRole", "contactEmail", "contactPhone", "location"],
  social: ["whatsappUrl", "instagramUrl", "youtubeUrl", "xUrl", "facebookUrl", "ctaPrimaryLabel", "ctaPrimaryHref", "ctaSecondaryLabel", "ctaSecondaryHref", "whatsappCtaLabel"],
  podcast: ["podcastName", "podcastNameHindi", "podcastBlurb", "listenSpotify", "listenApple", "listenYoutube"],
  site: ["tickerEnabled", "adsEnabled", "archiveNotice"],
};
