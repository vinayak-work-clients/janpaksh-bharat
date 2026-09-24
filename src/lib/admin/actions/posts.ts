"use server";

import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Block } from "@/types/content";
import type { Database, PostInsert, PostRow, PostUpdate } from "@/lib/supabase/types";
import { requireAdmin } from "@/lib/admin/auth";
import { postSchema, type PostFormValues } from "@/lib/admin/schemas";
import { formToInsert, formToUpdate, storagePathsOf } from "@/lib/admin/mappers";
import { getAdminPostRow } from "@/lib/admin/queries";
import { MEDIA_BUCKET, publicUrl } from "@/lib/admin/storage";
import { revalidatePosts } from "@/lib/data/cache";

type Client = SupabaseClient<Database>;

export type PostActionResult =
  | { ok: true; id: string; slug: string; warning?: string }
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof PostFormValues, string>> };

const ALT_MISSING_WARNING = "Saved, but the alt text was not stored: run supabase/migrations/0002_cover_alt.sql once.";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function fieldErrorsFrom(issues: { path: PropertyKey[]; message: string }[]) {
  const out: Partial<Record<keyof PostFormValues, string>> = {};
  for (const issue of issues) {
    const key = issue.path[0] as keyof PostFormValues | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

async function slugTaken(supabase: Client, slug: string, exceptId?: string): Promise<boolean> {
  let q = supabase.from("posts").select("id").eq("slug", slug).limit(1);
  if (exceptId) q = q.neq("id", exceptId);
  const { data } = await q;
  return Boolean(data && data.length);
}

/** Public paths that show this post somewhere. */
function revalidateForPost(row: Pick<PostRow, "id" | "slug" | "section">, previous?: Pick<PostRow, "slug" | "section"> | null) {
  revalidatePosts();
  const paths = new Set<string>([
    "/",
    "/breaking",
    "/blogs",
    "/podcasts",
    `/news/${row.slug}`,
    `/section/${row.section}`,
    "/admin",
    "/admin/posts",
    `/admin/posts/${row.id}`,
    `/admin/preview/${row.id}`,
  ]);
  if (previous) {
    paths.add(`/news/${previous.slug}`);
    paths.add(`/section/${previous.section}`);
  }
  paths.forEach((p) => revalidatePath(p));
  // Ticker, hero deck and section rails live in the (site) layout tree.
  revalidatePath("/", "layout");
}

async function removeStorage(supabase: Client, paths: string[]): Promise<string | undefined> {
  if (!paths.length) return undefined;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove(paths);
  return error ? `Some files could not be removed from storage (${error.message}).` : undefined;
}

const isMissingAltColumn = (error: { code?: string; message?: string } | null) =>
  Boolean(error && (error.code === "PGRST204" || /cover_alt/.test(error.message ?? "")));

/** Insert, retrying without `cover_alt` when the 0002 migration has not been applied yet. */
async function insertRow(supabase: Client, payload: PostInsert, coverAlt: string | null) {
  const withAlt = coverAlt ? { ...payload, cover_alt: coverAlt } : payload;
  const first = await supabase.from("posts").insert(withAlt).select("*").single();
  if (!first.error || !coverAlt || !isMissingAltColumn(first.error)) return { ...first, warning: undefined };
  const retry = await supabase.from("posts").insert(payload).select("*").single();
  return { ...retry, warning: retry.error ? undefined : ALT_MISSING_WARNING };
}

async function updateRow(supabase: Client, id: string, payload: PostUpdate, coverAlt: string | null) {
  const withAlt = { ...payload, cover_alt: coverAlt };
  const first = await supabase.from("posts").update(withAlt).eq("id", id).select("*").single();
  if (!first.error || !isMissingAltColumn(first.error)) return { ...first, warning: undefined };
  const retry = await supabase.from("posts").update(payload).eq("id", id).select("*").single();
  return { ...retry, warning: retry.error ? undefined : coverAlt ? ALT_MISSING_WARNING : undefined };
}

function friendlyDbError(message: string): string {
  if (/posts_slug_key|duplicate key/.test(message)) return "That slug is already in use. Pick another.";
  if (/row-level security/.test(message)) return "Supabase refused the write (row-level security). Sign in again and retry.";
  if (/slug/.test(message) && /check/.test(message)) return "Use lowercase letters, numbers and single hyphens in the slug.";
  return message;
}

/* ------------------------------------------------------------------ */
/*  Actions                                                            */
/* ------------------------------------------------------------------ */

export async function createPost(values: PostFormValues): Promise<PostActionResult> {
  const { supabase, user } = await requireAdmin();
  const parsed = postSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }
  const v = parsed.data;
  if (await slugTaken(supabase, v.slug)) {
    return { ok: false, error: "That slug is already in use.", fieldErrors: { slug: "Another post already uses this slug. Change it to something unique." } };
  }

  const { data, error, warning } = await insertRow(supabase, formToInsert(v, user.id), v.coverAlt || null);
  if (error || !data) return { ok: false, error: friendlyDbError(error?.message ?? "Could not save the post") };

  revalidateForPost(data);
  return { ok: true, id: data.id, slug: data.slug, warning };
}

export async function updatePost(id: string, values: PostFormValues): Promise<PostActionResult> {
  const { supabase } = await requireAdmin();
  const previous = await getAdminPostRow(supabase, id);
  if (!previous) return { ok: false, error: "This post no longer exists. It may have been deleted or auto-purged." };

  const parsed = postSchema.safeParse({ ...values, type: previous.type });
  if (!parsed.success) {
    return { ok: false, error: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error.issues) };
  }
  const v = parsed.data;
  if (v.slug !== previous.slug && (await slugTaken(supabase, v.slug, id))) {
    return { ok: false, error: "That slug is already in use.", fieldErrors: { slug: "Another post already uses this slug. Change it to something unique." } };
  }

  const { data, error, warning } = await updateRow(supabase, id, formToUpdate(v), v.coverAlt || null);
  if (error || !data) return { ok: false, error: friendlyDbError(error?.message ?? "Could not save the post") };

  // Files the post no longer references are deleted from the bucket.
  const keep = new Set(storagePathsOf(data));
  const stale = storagePathsOf(previous).filter((p) => !keep.has(p));
  const storageWarning = await removeStorage(supabase, stale);

  revalidateForPost(data, previous);
  return { ok: true, id: data.id, slug: data.slug, warning: warning ?? storageWarning };
}

export async function deletePost(id: string): Promise<PostActionResult> {
  const { supabase } = await requireAdmin();
  const row = await getAdminPostRow(supabase, id);
  if (!row) return { ok: false, error: "This post no longer exists." };

  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) return { ok: false, error: friendlyDbError(error.message) };

  const storageWarning = await removeStorage(supabase, storagePathsOf(row));
  revalidateForPost(row);
  return { ok: true, id: row.id, slug: row.slug, warning: storageWarning };
}

export async function toggleBreaking(id: string): Promise<PostActionResult & { isBreaking?: boolean }> {
  const { supabase } = await requireAdmin();
  const row = await getAdminPostRow(supabase, id);
  if (!row) return { ok: false, error: "This post no longer exists." };

  const next = !row.is_breaking;
  const { error } = await supabase.from("posts").update({ is_breaking: next }).eq("id", id);
  if (error) return { ok: false, error: friendlyDbError(error.message) };

  revalidateForPost(row);
  return { ok: true, id: row.id, slug: row.slug, isBreaking: next };
}

async function uniqueCopySlug(supabase: Client, slug: string): Promise<string> {
  const base = `${slug}-copy`.slice(0, 110);
  const { data } = await supabase.from("posts").select("slug").like("slug", `${base}%`);
  const taken = new Set((data ?? []).map((r) => r.slug));
  if (!taken.has(base)) return base;
  for (let i = 2; i < 100; i++) {
    const candidate = `${base}-${i}`;
    if (!taken.has(candidate)) return candidate;
  }
  return `${base}-${Date.now().toString(36)}`;
}

/** Copy a storage object next to the new slug; falls back to sharing the URL. */
async function copyObject(supabase: Client, from: string | null, newSlug: string): Promise<{ path: string | null; url: string | null }> {
  if (!from) return { path: null, url: null };
  const file = from.split("/").pop() ?? from;
  const parts = from.split("/");
  const to = parts.length >= 4 ? `${parts[0]}/${parts[1]}/${newSlug}/${file}` : `${newSlug}/${file}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).copy(from, to);
  if (error) return { path: null, url: null };
  return { path: to, url: publicUrl(MEDIA_BUCKET, to) };
}

export async function duplicatePost(id: string): Promise<PostActionResult> {
  const { supabase, user } = await requireAdmin();
  const row = await getAdminPostRow(supabase, id);
  if (!row) return { ok: false, error: "This post no longer exists." };

  const slug = await uniqueCopySlug(supabase, row.slug);
  const cover = await copyObject(supabase, row.cover_image_path, slug);
  const media = await copyObject(supabase, row.media_path, slug);

  // Body images: copy too, so deleting the original never breaks the copy.
  const body: Block[] = [];
  for (const b of (Array.isArray(row.body) ? row.body : []) as Block[]) {
    if (b.type === "image" && b.path) {
      const copied = await copyObject(supabase, b.path, slug);
      body.push(copied.path ? { ...b, path: copied.path, src: copied.url ?? b.src } : { ...b, path: undefined });
    } else body.push(b);
  }

  const payload: PostInsert = {
    slug,
    type: row.type,
    status: "draft",
    section: row.section,
    category: row.category,
    tags: row.tags,
    title: `Copy of ${row.title}`.slice(0, 200),
    title_hindi: row.title_hindi,
    standfirst: row.standfirst,
    excerpt: row.excerpt,
    body,
    cover_image_url: cover.url ?? row.cover_image_url,
    cover_image_path: cover.path,
    media_url: media.url ?? row.media_url,
    media_path: media.path,
    embed_url: row.embed_url,
    duration_sec: row.duration_sec,
    author_name: row.author_name,
    author_avatar_url: row.author_avatar_url,
    featured: false,
    is_breaking: row.is_breaking,
    read_time_min: row.read_time_min,
    published_at: new Date().toISOString(),
    created_by: user.id,
  };

  const { data, error } = await insertRow(supabase, payload, row.cover_alt ?? null);
  if (error || !data) {
    // Roll back copied files so nothing is orphaned.
    await removeStorage(supabase, [cover.path, media.path, ...body.map((b) => (b.type === "image" ? b.path : null))].filter((p): p is string => Boolean(p)));
    return { ok: false, error: friendlyDbError(error?.message ?? "Could not duplicate the post") };
  }

  revalidateForPost(data);
  return { ok: true, id: data.id, slug: data.slug };
}
