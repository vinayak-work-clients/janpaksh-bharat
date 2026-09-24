/**
 * Admin-side mappings: database row ↔ editor form values ↔ AdminPost (the
 * public Post shape plus the admin-only columns the dashboard needs).
 */
import type { Block, Post } from "@/types/content";
import type { PostInsert, PostRow, PostUpdate } from "@/lib/supabase/types";
import { rowToPost } from "@/lib/data/mappers";
import { estimateReadTime, type PostFormValues } from "@/lib/admin/schemas";

export interface AdminPost extends Post {
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string | null;
  coverImagePath: string | null;
  mediaPath: string | null;
  coverAlt: string | null;
}

export function rowToAdminPost(row: PostRow): AdminPost {
  return {
    ...rowToPost(row),
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    coverImagePath: row.cover_image_path,
    mediaPath: row.media_path,
    coverAlt: row.cover_alt ?? null,
  };
}

/** Editor defaults for a brand-new post of `type`. */
export function emptyForm(type: PostFormValues["type"], authorName = "Janpaksh Bharat"): PostFormValues {
  return {
    type,
    title: "",
    titleHindi: "",
    slug: "",
    standfirst: "",
    excerpt: "",
    body: type === "video" || type === "podcast" ? [] : [{ type: "p", text: "" }],
    section: type === "breaking" ? "national" : "national",
    category: "",
    tags: [],
    status: "draft",
    featured: false,
    isBreaking: type === "breaking",
    publishedAt: new Date().toISOString(),
    authorName,
    readTimeMin: null,
    coverImageUrl: "",
    coverImagePath: null,
    coverAlt: "",
    mediaUrl: null,
    mediaPath: null,
    embedUrl: null,
    durationSec: null,
  };
}

export function rowToForm(row: PostRow): PostFormValues {
  return {
    type: row.type,
    title: row.title,
    titleHindi: row.title_hindi ?? "",
    slug: row.slug,
    standfirst: row.standfirst ?? "",
    excerpt: row.excerpt,
    body: Array.isArray(row.body) ? (row.body as Block[]) : [],
    section: row.section,
    category: row.category,
    tags: row.tags ?? [],
    status: row.status,
    featured: row.featured,
    isBreaking: row.is_breaking,
    publishedAt: row.published_at,
    authorName: row.author_name,
    readTimeMin: row.read_time_min,
    coverImageUrl: row.cover_image_url,
    coverImagePath: row.cover_image_path,
    coverAlt: row.cover_alt ?? "",
    mediaUrl: row.media_url,
    mediaPath: row.media_path,
    embedUrl: row.embed_url,
    durationSec: row.duration_sec,
  };
}

const nul = (s: string | null | undefined) => (s && s.trim() ? s.trim() : null);

/** Form → insert payload. `cover_alt` is added by the action only when set (see actions/posts.ts). */
export function formToInsert(v: PostFormValues, createdBy: string | null): PostInsert {
  const textual = v.type !== "video" && v.type !== "podcast";
  return {
    slug: v.slug,
    type: v.type,
    status: v.status,
    section: v.section,
    category: v.category.trim(),
    tags: v.tags.map((t) => t.trim()).filter(Boolean),
    title: v.title.trim(),
    title_hindi: nul(v.titleHindi),
    standfirst: nul(v.standfirst),
    excerpt: v.excerpt.trim(),
    body: cleanBody(v.body),
    cover_image_url: v.coverImageUrl,
    cover_image_path: v.coverImagePath,
    media_url: v.mediaUrl,
    media_path: v.mediaPath,
    embed_url: v.embedUrl,
    duration_sec: v.durationSec,
    author_name: v.authorName.trim(),
    featured: v.featured,
    is_breaking: v.isBreaking || v.type === "breaking",
    read_time_min: textual ? v.readTimeMin ?? estimateReadTime(v.body) : v.readTimeMin,
    published_at: new Date(v.publishedAt).toISOString(),
    created_by: createdBy,
  };
}

export function formToUpdate(v: PostFormValues): PostUpdate {
  const { created_by: _createdBy, ...rest } = formToInsert(v, null);
  void _createdBy;
  return rest;
}

/** Drop empty paragraphs/headings and blank list items so the site never renders holes. */
export function cleanBody(body: PostFormValues["body"]): Block[] {
  const out: Block[] = [];
  for (const b of body) {
    switch (b.type) {
      case "p":
      case "h2":
        if (b.text.trim()) out.push({ type: b.type, text: b.text.trim() });
        break;
      case "quote":
        if (b.text.trim()) out.push({ type: "quote", text: b.text.trim(), ...(b.cite?.trim() ? { cite: b.cite.trim() } : {}) });
        break;
      case "image":
        if (b.src) {
          out.push({
            type: "image",
            src: b.src,
            ...(b.caption?.trim() ? { caption: b.caption.trim() } : {}),
            ...(b.alt?.trim() ? { alt: b.alt.trim() } : {}),
            ...(b.path ? { path: b.path } : {}),
          });
        }
        break;
      case "list": {
        const items = b.items.map((i) => i.trim()).filter(Boolean);
        if (items.length) out.push({ type: "list", items });
        break;
      }
    }
  }
  return out;
}

/** Every storage path a post references (cover, media, body images). */
export function storagePathsOf(row: Pick<PostRow, "cover_image_path" | "media_path" | "body">): string[] {
  const paths = new Set<string>();
  if (row.cover_image_path) paths.add(row.cover_image_path);
  if (row.media_path) paths.add(row.media_path);
  if (Array.isArray(row.body)) {
    for (const b of row.body as Block[]) {
      if (b.type === "image" && b.path) paths.add(b.path);
    }
  }
  return Array.from(paths);
}
