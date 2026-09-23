import type { Block, Post } from "@/types/content";
import type { PostInsert, PostRow } from "@/lib/supabase/types";

/** Database row → the Post shape the components already consume. */
export function rowToPost(row: PostRow): Post {
  return {
    id: row.id,
    slug: row.slug,
    type: row.type,
    title: row.title,
    titleHindi: row.title_hindi ?? undefined,
    standfirst: row.standfirst ?? undefined,
    excerpt: row.excerpt,
    body: Array.isArray(row.body) ? (row.body as Block[]) : [],
    section: row.section,
    category: row.category,
    tags: row.tags ?? [],
    coverImage: row.cover_image_url,
    mediaUrl: row.media_url ?? undefined,
    embedUrl: row.embed_url ?? undefined,
    durationSec: row.duration_sec ?? undefined,
    author: { name: row.author_name, avatar: row.author_avatar_url ?? undefined },
    publishedAt: row.published_at,
    // From the generated column (created_at + 30 days).
    expiresAt: row.expires_at,
    featured: row.featured,
    isBreaking: row.is_breaking,
    readTimeMin: row.read_time_min ?? undefined,
  };
}

interface InsertOptions {
  /** Upload time. Service role may set it; defaults to now() in SQL. */
  createdAt?: string;
  status?: "draft" | "published";
  coverImagePath?: string | null;
  mediaPath?: string | null;
}

/** Post → insert/upsert payload. External URLs by default; storage paths null. */
export function postToInsert(post: Post, opts: InsertOptions = {}): PostInsert {
  return {
    slug: post.slug,
    type: post.type,
    status: opts.status ?? "published",
    section: post.section,
    category: post.category,
    tags: post.tags,
    title: post.title,
    title_hindi: post.titleHindi ?? null,
    standfirst: post.standfirst ?? null,
    excerpt: post.excerpt,
    body: post.body ?? [],
    cover_image_url: post.coverImage,
    cover_image_path: opts.coverImagePath ?? null,
    media_url: post.mediaUrl ?? null,
    media_path: opts.mediaPath ?? null,
    embed_url: post.embedUrl ?? null,
    duration_sec: post.durationSec ?? null,
    author_name: post.author.name,
    author_avatar_url: post.author.avatar ?? null,
    featured: post.featured ?? false,
    is_breaking: post.isBreaking ?? false,
    read_time_min: post.readTimeMin ?? null,
    published_at: post.publishedAt,
    ...(opts.createdAt ? { created_at: opts.createdAt } : {}),
  };
}
