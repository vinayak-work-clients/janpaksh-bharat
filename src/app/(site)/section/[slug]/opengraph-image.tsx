import { ImageResponse } from "next/og";
import { getSection } from "@/config/sections";
import { getSiteSettings } from "@/lib/data/settings";
import { OG_SIZE, PAPER, SAFFRON_LIGHT, ogFonts, siteHost } from "@/lib/og/fonts";
import { Backdrop, Footer, Lockup } from "@/lib/og/elements";

export const runtime = "nodejs";
export const revalidate = 3600;
export const alt = "Section";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const [s, fonts] = await Promise.all([getSiteSettings(), ogFonts()]);
  const section = getSection(params.slug);
  return new ImageResponse(
    (
      <Backdrop>
        <Lockup name={s.name} nameHindi={s.nameHindi} size="sm" />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
          <div style={{ fontFamily: "Inter", fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: SAFFRON_LIGHT, display: "flex" }}>
            {section ? (section.kind === "region" ? "Region" : "Topic") : "Section"}
          </div>
          <div style={{ fontFamily: "Fraunces", fontSize: 96, lineHeight: 1.05, color: PAPER, display: "flex" }}>{section?.name ?? "Stories"}</div>
          <div lang="hi" style={{ fontFamily: "Noto Serif Devanagari", fontSize: 48, color: SAFFRON_LIGHT, display: "flex" }}>{section?.nameHindi ?? s.tagline}</div>
          {section && <div style={{ fontFamily: "Inter", fontSize: 26, color: "rgba(246,243,238,0.7)", maxWidth: 960, marginTop: 12, display: "flex" }}>{section.description}</div>}
        </div>
        <Footer host={siteHost()} />
      </Backdrop>
    ),
    { ...OG_SIZE, fonts },
  );
}
