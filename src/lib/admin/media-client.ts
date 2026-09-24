/**
 * Browser-only media helpers: image downscale/webp, duration probing and
 * video frame capture. Never import from server code.
 */
import { IMAGE_KEEP_ORIGINAL_BYTES, IMAGE_MAX_EDGE, extensionFor, normaliseMime } from "@/lib/admin/storage";

export interface PreparedImage {
  blob: Blob;
  contentType: string;
  ext: string;
  width: number;
  height: number;
  /** True when the original was uploaded untouched. */
  original: boolean;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("This image couldn't be read. Try a different file."));
    img.src = src;
  });
}

async function decode(file: File): Promise<{ width: number; height: number; source: CanvasImageSource; release: () => void }> {
  if ("createImageBitmap" in window) {
    try {
      const bmp = await createImageBitmap(file);
      return { width: bmp.width, height: bmp.height, source: bmp, release: () => bmp.close() };
    } catch {
      /* fall through to <img> */
    }
  }
  const url = URL.createObjectURL(file);
  const img = await loadImage(url);
  return { width: img.naturalWidth, height: img.naturalHeight, source: img, release: () => URL.revokeObjectURL(url) };
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Couldn't encode the image."))), type, quality);
  });
}

/**
 * Downscale to IMAGE_MAX_EDGE on the long side and re-encode as webp.
 * Small originals (< 400 KB) that already fit are uploaded untouched; GIFs
 * are never re-encoded (it would drop the animation).
 */
export async function prepareImage(file: File, opts: { keepOriginal?: boolean } = {}): Promise<PreparedImage> {
  const mime = normaliseMime(file);
  const { width, height, source, release } = await decode(file);
  try {
    const fits = Math.max(width, height) <= IMAGE_MAX_EDGE;
    if (opts.keepOriginal || mime === "image/gif" || mime === "image/svg+xml" || (fits && file.size <= IMAGE_KEEP_ORIGINAL_BYTES)) {
      return { blob: file, contentType: mime, ext: extensionFor(mime, file.name), width, height, original: true };
    }
    const scale = fits ? 1 : IMAGE_MAX_EDGE / Math.max(width, height);
    const w = Math.round(width * scale);
    const h = Math.round(height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas isn't available in this browser.");
    ctx.drawImage(source, 0, 0, w, h);
    let blob = await canvasToBlob(canvas, "image/webp", 0.86);
    let contentType = "image/webp";
    // Safari < 16 returns PNG when webp is unsupported.
    if (blob.type !== "image/webp") {
      blob = await canvasToBlob(canvas, "image/jpeg", 0.88);
      contentType = "image/jpeg";
    }
    return { blob, contentType, ext: extensionFor(contentType), width: w, height: h, original: false };
  } finally {
    release();
  }
}

/** Duration in whole seconds from the file's metadata, or null when unreadable. */
export function readDuration(file: File | string, kind: "video" | "audio"): Promise<number | null> {
  return new Promise((resolve) => {
    const el = document.createElement(kind);
    const url = typeof file === "string" ? file : URL.createObjectURL(file);
    const done = (v: number | null) => {
      if (typeof file !== "string") URL.revokeObjectURL(url);
      el.removeAttribute("src");
      resolve(v);
    };
    el.preload = "metadata";
    el.onloadedmetadata = () => done(Number.isFinite(el.duration) ? Math.round(el.duration) : null);
    el.onerror = () => done(null);
    if (typeof file === "string") el.crossOrigin = "anonymous";
    el.src = url;
  });
}

/** JPEG frame from a video at `atSec` (falls back to the first frame on short clips). */
export function captureVideoFrame(file: File | string, atSec = 1): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const url = typeof file === "string" ? file : URL.createObjectURL(file);
    const cleanup = () => {
      if (typeof file !== "string") URL.revokeObjectURL(url);
      video.removeAttribute("src");
    };
    const fail = (msg: string) => {
      cleanup();
      reject(new Error(msg));
    };
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    if (typeof file === "string") video.crossOrigin = "anonymous";
    video.onerror = () => fail("Couldn't read the video to capture a frame.");
    video.onloadedmetadata = () => {
      const t = Number.isFinite(video.duration) && video.duration > atSec ? atSec : 0;
      const grab = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          if (!ctx) return fail("Canvas isn't available in this browser.");
          ctx.drawImage(video, 0, 0);
          canvas.toBlob(
            (b) => {
              cleanup();
              if (b) resolve(b);
              else reject(new Error("Couldn't encode the frame."));
            },
            "image/jpeg",
            0.88,
          );
        } catch {
          fail("The video is protected and can't be captured. Upload a cover image instead.");
        }
      };
      video.onseeked = grab;
      if (t === 0 && video.currentTime === 0) {
        // Some browsers never fire seeked for currentTime = 0; wait for a frame.
        video.onloadeddata = grab;
      }
      video.currentTime = t;
    };
    video.src = url;
  });
}
