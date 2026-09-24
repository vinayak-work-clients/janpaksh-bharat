/**
 * Post form schema, shared by the editor (react-hook-form + zodResolver) and
 * the server actions. Field names are camelCase form values; mapping to the
 * database row lives in src/lib/admin/mappers.ts.
 */
import { z } from "zod";
import { sectionSlugs } from "@/config/sections";

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
