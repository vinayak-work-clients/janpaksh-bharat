import { ImageResponse } from "next/og";
import { getSiteSettings } from "@/lib/data/settings";
import { OG_SIZE, PAPER, ogFonts, siteHost } from "@/lib/og/fonts";
import { Backdrop, Footer, Lockup } from "@/lib/og/elements";

export const runtime = "nodejs";
export const revalidate = 3600;
export const alt = "Janpaksh Bharat";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const [s, fonts] = await Promise.all([getSiteSettings(), ogFonts()]);
  return new ImageResponse(
    (
      <Backdrop>
        <Lockup name={s.name} nameHindi={s.nameHindi} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
          <div lang="hi" style={{ fontFamily: "Noto Serif Devanagari", fontSize: 64, lineHeight: 1.25, color: PAPER, maxWidth: 1000, display: "flex" }}>{s.tagline}</div>
          <div style={{ fontFamily: "Fraunces", fontSize: 30, color: "rgba(246,243,238,0.7)", display: "flex" }}>{s.taglineEn}</div>
        </div>
        <Footer host={siteHost()} />
      </Backdrop>
    ),
    { ...OG_SIZE, fonts },
  );
}
