"use client";

/**
 * Browser-direct upload/delete against the media bucket using the admin's
 * own session (storage.objects RLS checks is_admin()). Shared by the
 * MediaUploader and the editor's "use frame as cover" action.
 */
import { createClient } from "@/lib/supabase/client";
import { MEDIA_BUCKET, buildMediaPath, publicUrl, uploadWithProgress, type UploadProgress, type UploadTarget } from "@/lib/admin/storage";

export interface UploadedObject {
  url: string;
  path: string;
}

interface UploadBlobArgs {
  blob: Blob;
  contentType: string;
  ext: string;
  /** Post slug, or "temp" for a post that has no slug yet. */
  folder: string;
  /** Other bucket / path layout (ad creatives, brand assets). */
  target?: UploadTarget;
  onProgress?: (p: UploadProgress) => void;
  signal?: AbortSignal;
}

async function accessToken(): Promise<string> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("Your session has expired. Reload the page and sign in again.");
  return session.access_token;
}

export async function uploadBlob({ blob, contentType, ext, folder, target, onProgress, signal }: UploadBlobArgs): Promise<UploadedObject> {
  const token = await accessToken();
  const bucket = target?.bucket ?? MEDIA_BUCKET;
  const path = target ? target.path(ext) : buildMediaPath(folder, ext);
  await uploadWithProgress({ bucket, path, file: blob, contentType, accessToken: token, onProgress, signal });
  return { url: publicUrl(bucket, path), path };
}

/** Best-effort delete of temp uploads the user replaced before saving. */
export async function removeUploaded(paths: string[], bucket: string = MEDIA_BUCKET): Promise<void> {
  const clean = paths.filter(Boolean);
  if (!clean.length) return;
  try {
    const supabase = createClient();
    await supabase.storage.from(bucket).remove(clean);
  } catch {
    /* the nightly orphan sweep will catch it */
  }
}
