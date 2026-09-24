/**
 * Fonts for the Open Graph images. next/og (satori) needs raw TTF data, and
 * a remote Google Fonts fetch is not reliable at build time, so the files
 * live in public/fonts/ and are read from disk. The OG routes run on the
 * Node runtime: the edge runtime's file-URL fetch is not available under
 * `next start`, so it could never be verified locally.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
export const OG_SIZE = { width: 1200, height: 630 } as const;

export const INK = "#0B0B0F";
export const PAPER = "#F6F3EE";
export const SAFFRON = "#E8862A";
export const SAFFRON_LIGHT = "#F5B56A";
export const MUTED = "#6B6B75";

const cache = new Map<string, Promise<ArrayBuffer>>();

function load(file: string): Promise<ArrayBuffer> {
  let hit = cache.get(file);
  if (!hit) {
    hit = readFile(path.join(process.cwd(), "public", "fonts", file)).then((b) => b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer);
    cache.set(file, hit);
  }
  return hit;
}

export async function ogFonts() {
  const [hindi, serif, sans] = await Promise.all([load("NotoSerifDevanagari-700.ttf"), load("Fraunces-700.ttf"), load("Inter-500.ttf")]);
  return [
    { name: "Noto Serif Devanagari", data: hindi, weight: 700 as const, style: "normal" as const },
    { name: "Fraunces", data: serif, weight: 700 as const, style: "normal" as const },
    { name: "Inter", data: sans, weight: 500 as const, style: "normal" as const },
  ];
}

/** Hostname shown bottom-right, from NEXT_PUBLIC_SITE_URL. */
export function siteHost(): string {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://janpakshbharat.com").host;
  } catch {
    return "janpakshbharat.com";
  }
}
