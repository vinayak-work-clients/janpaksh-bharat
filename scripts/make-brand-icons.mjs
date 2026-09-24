/**
 * Generates the placeholder brand mark and every icon size from it.
 *
 *   node scripts/make-brand-icons.mjs
 *
 * Mark: saffron rounded square with "ज" (Noto Serif Devanagari 700, ink),
 * the glyph converted to a path so the SVG renders identically everywhere.
 * Outputs: public/brand/logo-mark.svg, src/app/icon.svg, src/app/icon.png
 * (512), src/app/apple-icon.png (180). Drop a real public/brand/logo.svg or
 * logo.png in place and re-run to use that instead of the placeholder.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import opentype from "opentype.js";
import { chromium } from "playwright";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SAFFRON = "#E8862A";
const INK = "#0B0B0F";

function placeholderSvg() {
  const font = opentype.parse(readFileSync(join(ROOT, "public/fonts/NotoSerifDevanagari-700.ttf")).buffer);
  const size = 512;
  const fontSize = 330;
  const glyphPath = font.getPath("ज", 0, 0, fontSize);
  const bb = glyphPath.getBoundingBox();
  const w = bb.x2 - bb.x1;
  const h = bb.y2 - bb.y1;
  // Centre the ink bounding box in the square, nudged up a touch for optical balance.
  const dx = (size - w) / 2 - bb.x1;
  const dy = (size - h) / 2 - bb.y1 - size * 0.02;
  const path = font.getPath("ज", dx, dy, fontSize).toPathData(2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="Janpaksh Bharat">
<rect width="${size}" height="${size}" rx="96" fill="${SAFFRON}"/>
<path d="${path}" fill="${INK}"/>
</svg>
`;
}

mkdirSync(join(ROOT, "public/brand"), { recursive: true });
const custom = ["public/brand/logo.svg", "public/brand/logo.png"].map((p) => join(ROOT, p)).find(existsSync);
let svg;
if (custom && custom.endsWith(".svg")) {
  svg = readFileSync(custom, "utf8");
  console.log(`using ${custom}`);
} else if (custom) {
  const b64 = readFileSync(custom).toString("base64");
  svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><image href="data:image/png;base64,${b64}" width="512" height="512"/></svg>`;
  console.log(`using ${custom}`);
} else {
  svg = placeholderSvg();
  console.log("no public/brand/logo.(svg|png): generated the placeholder mark");
}
writeFileSync(join(ROOT, "public/brand/logo-mark.svg"), svg);
writeFileSync(join(ROOT, "src/app/icon.svg"), svg);

const browser = await chromium.launch();
for (const [file, px] of [["src/app/icon.png", 512], ["src/app/apple-icon.png", 180]]) {
  const page = await browser.newPage({ viewport: { width: px, height: px }, deviceScaleFactor: 1 });
  await page.setContent(`<html><body style="margin:0;background:transparent">${svg.replace(/width="\d+" height="\d+"/, `width="${px}" height="${px}"`)}</body></html>`);
  await page.screenshot({ path: join(ROOT, file), omitBackground: true, type: "png" });
  await page.close();
  console.log(`wrote ${file} (${px}px)`);
}
await browser.close();

writeFileSync(
  join(ROOT, "public/site.webmanifest"),
  JSON.stringify(
    {
      name: "Janpaksh Bharat",
      short_name: "Janpaksh",
      description: "Independent Indian newsroom: current affairs, politics and society through ground reporting, blogs, video and podcasts.",
      start_url: "/",
      display: "standalone",
      background_color: "#F6F3EE",
      theme_color: "#E8862A",
      lang: "en",
      icons: [
        { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
        { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
        { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    null,
    2,
  ) + "\n",
);
console.log("wrote public/site.webmanifest");
