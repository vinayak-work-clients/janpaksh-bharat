/** Shared JSX pieces for the OG images (satori subset of CSS: flex only). */
import { INK, MUTED, PAPER, SAFFRON, SAFFRON_LIGHT } from "@/lib/og/fonts";

export function Backdrop({ children, image }: { children: React.ReactNode; image?: string | null }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: INK, color: PAPER, overflow: "hidden" }}>
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" width={1200} height={630} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.55 }} />
      )}
      {image && <div style={{ position: "absolute", inset: 0, display: "flex", background: "linear-gradient(to top, rgba(11,11,15,0.96) 0%, rgba(11,11,15,0.55) 55%, rgba(11,11,15,0.25) 100%)" }} />}
      <div style={{ position: "absolute", left: 700, top: -140, width: 900, height: 900, display: "flex", borderRadius: 900, background: "radial-gradient(circle, rgba(232,134,42,0.22) 0%, rgba(232,134,42,0.08) 35%, rgba(232,134,42,0) 65%)" }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: 64 }}>{children}</div>
    </div>
  );
}

/** Hindi big / English small, with the saffron mark. */
export function Lockup({ name, nameHindi, size = "lg" }: { name: string; nameHindi: string; size?: "lg" | "sm" }) {
  const big = size === "lg";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: big ? 22 : 14 }}>
      <div style={{ width: big ? 26 : 16, height: big ? 26 : 16, background: SAFFRON, display: "flex" }} />
      <div style={{ display: "flex", flexDirection: "column", gap: big ? 6 : 2 }}>
        <div lang="hi" style={{ fontFamily: "Noto Serif Devanagari", fontSize: big ? 84 : 36, lineHeight: 1.15, color: PAPER, display: "flex" }}>{nameHindi}</div>
        <div style={{ fontFamily: "Fraunces", fontSize: big ? 24 : 13, letterSpacing: big ? 6 : 3, textTransform: "uppercase", color: big ? SAFFRON : PAPER, display: "flex" }}>{name}</div>
      </div>
    </div>
  );
}

export function Footer({ host, right }: { host: string; right?: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "Inter", fontSize: 22, color: MUTED, letterSpacing: 2, textTransform: "uppercase" }}>
      <div style={{ display: "flex" }}>{host}</div>
      {right && <div style={{ display: "flex", color: SAFFRON_LIGHT }}>{right}</div>}
    </div>
  );
}

export function Badge({ children, tone = "paper" }: { children: string; tone?: "paper" | "breaking" }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 16px",
        borderRadius: 999,
        background: tone === "breaking" ? PAPER : "rgba(11,11,15,0.7)",
        color: tone === "breaking" ? "#C8102E" : PAPER,
        fontFamily: "Inter",
        fontSize: 20,
        letterSpacing: 3,
        textTransform: "uppercase",
      }}
    >
      {tone === "breaking" && <div style={{ width: 10, height: 10, borderRadius: 10, background: "#C8102E", display: "flex" }} />}
      {children}
    </div>
  );
}
