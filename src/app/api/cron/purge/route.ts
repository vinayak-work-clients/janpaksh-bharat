import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePosts } from "@/lib/data/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MEDIA_BUCKET = "media";
const CHUNK = 100;
const ORPHAN_AGE_DAYS = 31;

interface PurgeResult {
  deletedPosts: number;
  deletedFiles: number;
  orphansRemoved: number;
  errors: string[];
  ranAt: string;
}

function authorised(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization") ?? "";
  return header === `Bearer ${secret}`;
}

/** Recursively list every object path in a bucket (Supabase lists one folder at a time). */
async function listAllFiles(
  storage: ReturnType<ReturnType<typeof createAdminClient>["storage"]["from"]>,
  prefix = "",
  errors: string[] = [],
): Promise<Array<{ path: string; createdAt: string | null }>> {
  const out: Array<{ path: string; createdAt: string | null }> = [];
  let offset = 0;
  const limit = 1000;
  for (;;) {
    const { data, error } = await storage.list(prefix, { limit, offset, sortBy: { column: "name", order: "asc" } });
    if (error) {
      errors.push(`list ${prefix || "/"}: ${error.message}`);
      break;
    }
    if (!data || data.length === 0) break;
    for (const entry of data) {
      const full = prefix ? `${prefix}/${entry.name}` : entry.name;
      // Folders come back without an id.
      if (!entry.id) {
        out.push(...(await listAllFiles(storage, full, errors)));
      } else {
        out.push({ path: full, createdAt: entry.created_at ?? null });
      }
    }
    if (data.length < limit) break;
    offset += limit;
  }
  return out;
}

async function removeInChunks(
  storage: ReturnType<ReturnType<typeof createAdminClient>["storage"]["from"]>,
  paths: string[],
  errors: string[],
): Promise<number> {
  let removed = 0;
  for (let i = 0; i < paths.length; i += CHUNK) {
    const chunk = paths.slice(i, i + CHUNK);
    const { data, error } = await storage.remove(chunk);
    if (error) errors.push(`remove ${chunk.length} files: ${error.message}`);
    else removed += data?.length ?? chunk.length;
  }
  return removed;
}

async function purge(): Promise<PurgeResult> {
  const ranAt = new Date().toISOString();
  const errors: string[] = [];
  let deletedPosts = 0;
  let deletedFiles = 0;
  let orphansRemoved = 0;

  const supabase = createAdminClient();
  const storage = supabase.storage.from(MEDIA_BUCKET);

  // 1. Delete expired rows; the function returns their storage paths.
  const { data: purged, error: rpcError } = await supabase.rpc("purge_expired_posts");
  if (rpcError) {
    errors.push(`purge_expired_posts: ${rpcError.message}`);
  } else {
    deletedPosts = purged?.length ?? 0;
    const paths = (purged ?? [])
      .flatMap((row) => [row.cover_image_path, row.media_path])
      .filter((p): p is string => Boolean(p));
    if (paths.length) deletedFiles = await removeInChunks(storage, paths, errors);
  }

  // 2. Orphan sweep: files older than 31 days that no remaining post references.
  try {
    const { data: rows, error: refError } = await supabase
      .from("posts")
      .select("cover_image_path, media_path");
    if (refError) {
      errors.push(`posts refs: ${refError.message}`);
    } else {
      const referenced = new Set<string>();
      for (const r of rows ?? []) {
        if (r.cover_image_path) referenced.add(r.cover_image_path);
        if (r.media_path) referenced.add(r.media_path);
      }
      const cutoff = Date.now() - ORPHAN_AGE_DAYS * 24 * 60 * 60 * 1000;
      const files = await listAllFiles(storage, "", errors);
      const orphans = files
        .filter((f) => !referenced.has(f.path))
        .filter((f) => f.createdAt && new Date(f.createdAt).getTime() < cutoff)
        .map((f) => f.path);
      if (orphans.length) orphansRemoved = await removeInChunks(storage, orphans, errors);
    }
  } catch (e) {
    errors.push(`orphan sweep: ${e instanceof Error ? e.message : String(e)}`);
  }

  if (deletedPosts > 0) revalidatePosts();

  return { deletedPosts, deletedFiles, orphansRemoved, errors, ranAt };
}

async function handle(req: Request) {
  if (!authorised(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await purge();
    return NextResponse.json({ ok: result.errors.length === 0, ...result });
  } catch (e) {
    // Only configuration errors reach here (missing service key); storage
    // errors are collected in the result instead.
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e), ranAt: new Date().toISOString() },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  return handle(req);
}

export async function POST(req: Request) {
  return handle(req);
}
