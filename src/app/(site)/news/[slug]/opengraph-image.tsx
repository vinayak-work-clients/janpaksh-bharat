import { ImageResponse } from "next/og";
import { getSection } from "@/config/sections";
import { getLivePostBySlug } from "@/lib/data/posts";
import { getSiteSettings } from "@/lib/data/settings";
import { OG_SIZE, PAPER, SAFFRON, ogFonts, siteHost } from "@/lib/og/fonts";
import { Backdrop, Badge, Footer, Lockup } from "@/lib/og/elements";

export const runtime = "nodejs";
export const revalidate = 3600;
export const alt = "Story";
export const size = OG_SIZE;
export const contentType = "image/png";

const TYPE_LABEL: Record<string, string> = { image: "Photo", blog: "Blog", video: "Video", podcast: "Podcast", breaking: "Breaking" };

/** Fetch the cover as a data URL so satori never depends on a remote host at render time; null on failure. */
async function coverDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { cache: "force-cache" });
    if (!res.ok) return null;
    const type = res.headers.get("content-type") ?? "image/jpeg";
    if (!/^image\/(jpeg|png|webp|gif)/.test(type)) return null;
    const buf = await res.arrayBuffer();
    if (buf.byteLength > 4_000_000) return null;
    let binary = "";
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + 0x8000)));
    return `data:${type.split(";")[0]};base64,${btoa(binary)}`;
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: { slug: string } }) {
  const [s, fonts, post] = await Promise.all([getSiteSettings(), ogFonts(), getLivePostBySlug(params.slug)]);
  const host = siteHost();

  if (!post) {
    return new ImageResponse(
      (
        <Backdrop>
          <Lockup name={s.name} nameHindi={s.nameHindi} />
          <div style={{ flex: 1, display: "flex", alignItems: "center", fontFamily: "Noto Serif Devanagari", fontSize: 64, color: PAPER }}>{s.tagline}</div>
          <Footer host={host} />
        </Backdrop>
      ),
      { ...OG_SIZE, fonts },
    );
  }

  const cover = await coverDataUrl(post.coverImage);
  const section = getSection(post.section);
  const breaking = post.isBreaking || post.type === "breaking";
  const headline = post.title.length > 110 ? `${post.title.slice(0, 108).trimEnd()}…` : post.title;
  const fontSize = headline.length > 80 ? 48 : headline.length > 50 ? 56 : 64;

  return new ImageResponse(
    (
      <Backdrop image={cover}>
        <div style={{ display: "flex", gap: 12 }}>
          <Badge tone={breaking ? "breaking" : "paper"}>{breaking ? "Breaking" : TYPE_LABEL[post.type] ?? post.type}</Badge>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 16, paddingBottom: 28 }}>
          <div style={{ fontFamily: "Inter", fontSize: 22, letterSpacing: 3, textTransform: "uppercase", color: SAFFRON, display: "flex" }}>
            {section ? `${section.name} · ${post.category}` : post.category}
          </div>
          <div style={{ fontFamily: "Fraunces", fontSize, lineHeight: 1.12, color: PAPER, maxWidth: 1040, display: "flex", textWrap: "balance" }}>{headline}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <Lockup name={s.name} nameHindi={s.nameHindi} size="sm" />
          <Footer host={host} />
        </div>
      </Backdrop>
    ),
    { ...OG_SIZE, fonts },
  );
}
