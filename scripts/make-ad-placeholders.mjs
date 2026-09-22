#!/usr/bin/env node
/**
 * Generates the dummy advertisement creatives in public/ads/.
 *
 *   node scripts/make-ad-placeholders.mjs
 *
 * One SVG per size × two variants (a, b) so pages don't repeat the same
 * creative. Styled like the site (paper, hairline frame, saffron block,
 * kicker-style size label, serif sponsor line) rather than "lorem ipsum".
 * Files are hand-sized and tiny (≈1–2 KB each).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "ads");

const PAPER = "#F6F3EE";
const PAPER2 = "#EDE8E0";
const INK = "#0B0B0F";
const SAFFRON = "#E8862A";
const SAFFRON_DARK = "#B8611A";
const RULE = "#D8D2C8";
const MUTED = "#6B6B75";

const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "Helvetica, Arial, sans-serif";

export const SIZES = {
  leaderboard: { w: 728, h: 90, label: "Leaderboard 728×90" },
  billboard: { w: 970, h: 250, label: "Billboard 970×250" },
  mpu: { w: 300, h: 250, label: "MPU 300×250" },
  halfPage: { w: 300, h: 600, label: "Half page 300×600" },
  mobileBanner: { w: 320, h: 100, label: "Mobile banner 320×100" },
  inFeed: { w: 600, h: 600, label: "In-feed 1:1" },
};

/**
 * Sponsor per variant. Banner-shaped sizes (leaderboard, billboard, mobile
 * banner, in-feed) share one sponsor per variant so a slot that swaps sizes
 * by breakpoint keeps the same advertiser; the rail boxes (MPU, half page)
 * carry the other two names. Mirrored in src/config/ads.ts.
 */
export const SPONSORS = {
  banner: {
    a: { name: "Himalaya Organics", line: "Seasonal Harvest", cta: "Shop the season" },
    b: { name: "Ganga Tours", line: "Char Dham 2026", cta: "Plan the yatra" },
  },
  box: {
    a: { name: "Doon Valley Realty", line: "Homes above the haze", cta: "View plots" },
    b: { name: "Bharat Fintech", line: "UPI for everyone", cta: "Get the app" },
  },
};
const family = (sizeKey) => (sizeKey === "mpu" || sizeKey === "halfPage" ? "box" : "banner");

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Layout: wide (banner) vs tall/square (box). */
function creative(sizeKey, variant, sponsor) {
  const { w, h, label } = SIZES[sizeKey];
  const wide = w / h >= 2.4;
  const compact = h <= 100;
  const pad = compact ? 12 : Math.round(Math.min(w, h) * 0.08);
  const frame = `<rect x="0.5" y="0.5" width="${w - 1}" height="${h - 1}" fill="none" stroke="${RULE}"/>`;

  // Variant b flips the saffron block to the other side and uses paper-2.
  const flip = variant === "b";
  const bg = flip ? PAPER2 : PAPER;
  const kicker = (x, y, text, anchor = "start") =>
    `<text x="${x}" y="${y}" font-family="${SANS}" font-size="${compact ? 8 : 10}" font-weight="700" letter-spacing="${compact ? 1.4 : 2}" fill="${MUTED}" text-anchor="${anchor}">${esc(text.toUpperCase())}</text>`;

  let body = "";
  if (wide) {
    // Saffron block at one end, copy in the remaining width. Type is sized
    // to fit the available width so no size ever overflows its frame.
    const blockW = Math.round(Math.min(w * 0.22, h * 2.2));
    const bx = flip ? w - blockW : 0;
    const tx = flip ? pad : blockW + pad;
    const availW = w - blockW - pad * 2;
    const word = sponsor.name.split(" ")[0];
    const wordSize = Math.floor(Math.min(h * 0.3, (blockW - 12) / (word.length * 0.52)));
    const nameSize = Math.floor(Math.min(h * 0.22, availW / (sponsor.name.length * 0.62)));
    const lineSize = Math.round(nameSize * 0.72);
    body += `<rect x="${bx}" y="0" width="${blockW}" height="${h}" fill="${SAFFRON}"/>`;
    body += `<text x="${bx + blockW / 2}" y="${h / 2 + wordSize * 0.35}" font-family="${SERIF}" font-style="italic" font-size="${wordSize}" fill="${INK}" text-anchor="middle">${esc(word)}</text>`;
    body += kicker(tx, pad + (compact ? 2 : 6), label);
    const nameY = compact ? h / 2 + 2 : h / 2 + nameSize * 0.1;
    body += `<text x="${tx}" y="${nameY}" font-family="${SERIF}" font-weight="700" font-size="${nameSize}" fill="${INK}">${esc(sponsor.name)}</text>`;
    body += `<text x="${tx}" y="${nameY + lineSize * 1.25}" font-family="${SERIF}" font-style="italic" font-size="${lineSize}" fill="${SAFFRON_DARK}">${esc(sponsor.line)}</text>`;
    if (!compact) {
      body += `<text x="${tx}" y="${h - pad}" font-family="${SANS}" font-size="${Math.round(h * 0.11)}" fill="${MUTED}">${esc(sponsor.cta)} →</text>`;
      body += kicker(w - pad - (flip ? blockW : 0), h - pad, "Sponsored", "end");
    } else {
      body += kicker(w - pad - (flip ? blockW : 0), h - 10, "Sponsored", "end");
    }
  } else {
    // Box: saffron band across the top (or bottom for b), copy stacked.
    const bandH = Math.round(h * (h > w ? 0.28 : 0.34));
    const by = flip ? h - bandH : 0;
    body += `<rect x="0" y="${by}" width="${w}" height="${bandH}" fill="${SAFFRON}"/>`;
    body += `<text x="${w / 2}" y="${by + bandH / 2 + Math.round(w * 0.05)}" font-family="${SERIF}" font-style="italic" font-size="${Math.round(w * 0.15)}" fill="${INK}" text-anchor="middle">${esc(sponsor.name.split(" ")[0])}</text>`;
    const top = flip ? pad : bandH + pad;
    const bottom = flip ? by - pad : h - pad;
    body += kicker(w / 2, top + 8, label, "middle");
    const nameSize = Math.round(w * 0.075);
    const midY = (top + bottom) / 2;
    body += `<text x="${w / 2}" y="${midY - nameSize * 0.2}" font-family="${SERIF}" font-weight="700" font-size="${nameSize}" fill="${INK}" text-anchor="middle">${esc(sponsor.name)}</text>`;
    body += `<text x="${w / 2}" y="${midY + nameSize * 0.9}" font-family="${SERIF}" font-style="italic" font-size="${Math.round(nameSize * 0.72)}" fill="${SAFFRON_DARK}" text-anchor="middle">${esc(sponsor.line)}</text>`;
    body += `<line x1="${pad}" y1="${bottom - 22}" x2="${w - pad}" y2="${bottom - 22}" stroke="${RULE}"/>`;
    body += `<text x="${pad}" y="${bottom - 6}" font-family="${SANS}" font-size="11" fill="${MUTED}">${esc(sponsor.cta)} →</text>`;
    body += kicker(w - pad, bottom - 6, "Sponsored", "end");
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(sponsor.name)} — ${esc(sponsor.line)} (placeholder advertisement)">
<rect width="${w}" height="${h}" fill="${bg}"/>
${body}
${frame}
</svg>
`;
}

mkdirSync(OUT, { recursive: true });
let n = 0;
Object.keys(SIZES).forEach((sizeKey) => {
  for (const variant of ["a", "b"]) {
    const sponsor = SPONSORS[family(sizeKey)][variant];
    const file = join(OUT, `${sizeKey}-${variant}.svg`);
    writeFileSync(file, creative(sizeKey, variant, sponsor));
    n++;
  }
});
console.log(`wrote ${n} placeholder creatives to ${OUT}`);
