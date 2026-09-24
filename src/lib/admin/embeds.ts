/**
 * Turn a pasted share link into an embeddable iframe URL. Returns null when
 * the link isn't recognised so the editor can show a friendly message.
 */

export type EmbedProvider = "youtube" | "instagram" | "facebook" | "spotify";

export interface EmbedInfo {
  provider: EmbedProvider;
  embedUrl: string;
  /** Aspect ratio hint for the preview frame. */
  aspect: "video" | "square" | "tall" | "wide";
}

const YT_ID = /^[A-Za-z0-9_-]{6,}$/;

export function normaliseEmbed(input: string): EmbedInfo | null {
  const raw = input.trim();
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\.|^m\.|^open\./, "");

  // YouTube: watch?v=, youtu.be/ID, /shorts/ID, /embed/ID, /live/ID
  if (host === "youtube.com" || host === "youtu.be" || host === "youtube-nocookie.com") {
    let id: string | null = null;
    if (host === "youtu.be") id = url.pathname.slice(1).split("/")[0];
    else if (url.searchParams.get("v")) id = url.searchParams.get("v");
    else {
      const m = url.pathname.match(/\/(?:shorts|embed|live|v)\/([^/?]+)/);
      if (m) id = m[1];
    }
    if (id && YT_ID.test(id)) {
      return { provider: "youtube", embedUrl: `https://www.youtube.com/embed/${id}`, aspect: "video" };
    }
    return null;
  }

  // Instagram: /p/ID, /reel/ID, /reels/ID, /tv/ID
  if (host === "instagram.com") {
    const m = url.pathname.match(/\/(p|reel|reels|tv)\/([A-Za-z0-9_-]+)/);
    if (m) {
      const kind = m[1] === "reels" ? "reel" : m[1];
      return { provider: "instagram", embedUrl: `https://www.instagram.com/${kind}/${m[2]}/embed`, aspect: "tall" };
    }
    return null;
  }

  // Facebook: any video/post URL → plugins endpoint
  if (host === "facebook.com" || host === "fb.watch" || host === "fb.com") {
    const isVideo = /\/videos?\/|\/watch|\/reel\//.test(url.pathname + url.search) || host === "fb.watch";
    const plugin = isVideo ? "video.php" : "post.php";
    return {
      provider: "facebook",
      embedUrl: `https://www.facebook.com/plugins/${plugin}?href=${encodeURIComponent(url.toString())}&show_text=false`,
      aspect: isVideo ? "video" : "tall",
    };
  }

  // Spotify: /episode/ID, /show/ID, /track/ID (already-embedded links pass through)
  if (host === "spotify.com") {
    const m = url.pathname.match(/\/(?:embed\/)?(episode|show|track|playlist)\/([A-Za-z0-9]+)/);
    if (m) {
      return { provider: "spotify", embedUrl: `https://open.spotify.com/embed/${m[1]}/${m[2]}`, aspect: "wide" };
    }
    return null;
  }

  return null;
}

export function embedProviderLabel(p: EmbedProvider): string {
  return { youtube: "YouTube", instagram: "Instagram", facebook: "Facebook", spotify: "Spotify" }[p];
}

/** Providers accepted per post type (what the hint text lists). */
export const EMBED_HINT: Record<"video" | "podcast", string> = {
  video: "YouTube, Instagram or Facebook link",
  podcast: "Spotify or YouTube link",
};
