/**
 * Storage helpers shared by the browser uploader and the server actions.
 * Files go straight from the browser to Supabase Storage (never through a
 * Next route, which Vercel caps at 4.5 MB). Paths are stored WITHOUT the
 * bucket prefix so `storage.from(bucket).remove(paths)` works everywhere.
 */

export const MEDIA_BUCKET = "media";
export const BRANDING_BUCKET = "branding";

export const IMAGE_MAX_BYTES = 10 * 1024 * 1024;
export const AV_MAX_BYTES = 50 * 1024 * 1024;
/** Originals smaller than this are uploaded as-is; larger ones are re-encoded to webp. */
export const IMAGE_KEEP_ORIGINAL_BYTES = 400 * 1024;
export const IMAGE_MAX_EDGE = 2400;

export type UploadKind = "image" | "video" | "audio";

export const ACCEPT: Record<UploadKind, string[]> = {
  image: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"],
  video: ["video/mp4", "video/webm", "video/quicktime"],
  audio: ["audio/mpeg", "audio/mp4", "audio/aac", "audio/wav", "audio/ogg", "audio/x-m4a"],
};

export const ACCEPT_ATTR: Record<UploadKind, string> = {
  image: "image/jpeg,image/png,image/webp,image/avif,image/gif",
  video: "video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov",
  audio: "audio/mpeg,audio/mp4,audio/aac,audio/wav,audio/ogg,.mp3,.m4a,.aac,.wav,.ogg",
};

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
  "audio/x-m4a": "m4a",
  "audio/aac": "aac",
  "audio/wav": "wav",
  "audio/ogg": "ogg",
};

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Friendly validation message, or null when the file is acceptable. */
export function validateFile(file: File, kind: UploadKind): string | null {
  const mime = normaliseMime(file);
  if (!ACCEPT[kind].includes(mime)) {
    const wanted = kind === "image" ? "a JPG, PNG, WebP, AVIF or GIF image" : kind === "video" ? "an MP4, WebM or MOV video" : "an MP3, M4A, AAC, WAV or OGG audio file";
    return `That file type isn't supported. Please choose ${wanted}.`;
  }
  const max = kind === "image" ? IMAGE_MAX_BYTES : AV_MAX_BYTES;
  if (file.size > max) {
    return `This file is ${formatBytes(file.size)}. The limit for ${kind} files is ${formatBytes(max)}.`;
  }
  return null;
}

/** Some browsers report .m4a/.mov with odd or empty types; infer from the name. */
export function normaliseMime(file: File): string {
  if (file.type && file.type !== "application/octet-stream") return file.type === "audio/x-m4a" ? "audio/mp4" : file.type;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const byExt: Record<string, string> = {
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif", gif: "image/gif",
    mp4: "video/mp4", webm: "video/webm", mov: "video/quicktime",
    mp3: "audio/mpeg", m4a: "audio/mp4", aac: "audio/aac", wav: "audio/wav", ogg: "audio/ogg",
  };
  return byExt[ext] ?? file.type;
}

export function extensionFor(mime: string, fallbackName = ""): string {
  return EXT_BY_MIME[mime] ?? fallbackName.split(".").pop()?.toLowerCase() ?? "bin";
}

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** `{yyyy}/{mm}/{postSlugOrTemp}/{uuid}.{ext}` inside the media bucket. */
export function buildMediaPath(slugOrTemp: string, ext: string, now: Date = new Date()): string {
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  const folder = (slugOrTemp || "temp").replace(/[^a-z0-9-]/g, "").slice(0, 80) || "temp";
  return `${yyyy}/${mm}/${folder}/${uuid()}.${ext}`;
}

/** Public URL for an object in a public bucket (works on server and client). */
export function publicUrl(bucket: string, path: string): string {
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${bucket}/${path.split("/").map(encodeURIComponent).join("/")}`;
}

/** Inverse of publicUrl: the object path when `url` points into `bucket`, else null. */
export function pathFromPublicUrl(url: string | null | undefined, bucket = MEDIA_BUCKET): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const i = url.indexOf(marker);
  if (i === -1) return null;
  return decodeURIComponent(url.slice(i + marker.length).split("?")[0]);
}

export interface UploadProgress {
  loaded: number;
  total: number;
  /** 0–100 */
  percent: number;
}

interface UploadArgs {
  bucket: string;
  path: string;
  file: Blob;
  contentType: string;
  accessToken: string;
  onProgress?: (p: UploadProgress) => void;
  signal?: AbortSignal;
}

/**
 * Browser-direct upload with real progress and cancel. Uses the Storage REST
 * endpoint with the admin's session token so `storage.objects` RLS applies.
 */
export function uploadWithProgress({ bucket, path, file, contentType, accessToken, onProgress, signal }: UploadArgs): Promise<void> {
  const base = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/$/, "");
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const url = `${base}/storage/v1/object/${bucket}/${path.split("/").map(encodeURIComponent).join("/")}`;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
    xhr.setRequestHeader("apikey", anonKey);
    xhr.setRequestHeader("x-upsert", "false");
    xhr.setRequestHeader("cache-control", "max-age=3600");
    xhr.setRequestHeader("Content-Type", contentType);

    xhr.upload.onprogress = (e) => {
      if (!onProgress) return;
      const total = e.lengthComputable ? e.total : file.size;
      const loaded = Math.min(e.loaded, total);
      onProgress({ loaded, total, percent: total ? Math.round((loaded / total) * 100) : 0 });
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.({ loaded: file.size, total: file.size, percent: 100 });
        resolve();
        return;
      }
      let message = `Upload failed (${xhr.status})`;
      try {
        const body = JSON.parse(xhr.responseText) as { message?: string; error?: string };
        message = body.message ?? body.error ?? message;
      } catch {
        /* keep default */
      }
      if (xhr.status === 403) message = "Upload was refused: your account isn't allowed to upload. Sign in again and retry.";
      if (xhr.status === 413) message = "The file is too large for the storage bucket.";
      reject(new Error(message));
    };
    xhr.onerror = () => reject(new Error("Network error during upload. Check your connection and try again."));
    xhr.onabort = () => reject(new DOMException("Upload cancelled", "AbortError"));
    signal?.addEventListener("abort", () => xhr.abort(), { once: true });
    xhr.send(file);
  });
}
