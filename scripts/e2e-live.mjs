/**
 * Public-site round trip (Phase 6): what the client does in the dashboard
 * shows up on the website.
 *
 *   npm run e2e:live      (= DOTENV_CONFIG_PATH=.env.local node -r dotenv/config scripts/e2e-live.mjs)
 *
 * Needs the app running at E2E_BASE_URL (default http://localhost:3100) with
 * DATA_SOURCE=supabase, ADMIN_E2E_EMAIL / ADMIN_E2E_PASSWORD, and the service
 * role key. Flow: screenshots of the public pages at 1440 and 390 (ticker,
 * ads and DB names checked) → sign in → change the tagline → reload / →
 * hero and preloader show it → upload a logo → navbar/footer show it →
 * toggle ads off → no ad slots → publish a Photo post → on home and its
 * section → delete it → gone. Settings are restored at the end.
 */
import { mkdirSync } from "node:fs";
import { deflateSync } from "node:zlib";
import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";

const EMAIL = process.env.ADMIN_E2E_EMAIL;
const PASSWORD = process.env.ADMIN_E2E_PASSWORD;
const BASE = (process.env.E2E_BASE_URL ?? "http://localhost:3100").replace(/\/$/, "");
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!EMAIL || !PASSWORD) {
  console.log("SKIP  ADMIN_E2E_EMAIL / ADMIN_E2E_PASSWORD not set in .env.local");
  process.exit(0);
}
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("FAIL  Supabase env missing");
  process.exit(1);
}

/* ---------------------------------------------------------------- PNG */
function crc32(buf) {
  let c;
  const table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
}
/** Gradient PNG; `mark` = saffron square on ink (a stand-in logo). */
function makePng(width, height, mark = false) {
  const raw = Buffer.alloc((width * 3 + 1) * height);
  let o = 0;
  for (let y = 0; y < height; y++) {
    raw[o++] = 0;
    for (let x = 0; x < width; x++) {
      const t = x / width;
      const inMark = mark && x > width * 0.1 && x < width * 0.35 && y > height * 0.2 && y < height * 0.8;
      raw[o++] = inMark ? 0xe8 : mark ? 0x0b : Math.round(0xe8 * (1 - t) + 0x0b * t);
      raw[o++] = inMark ? 0x86 : mark ? 0x0b : Math.round(0x86 * (1 - t) + 0x0b * t);
      raw[o++] = inMark ? 0x2a : mark ? 0x0f : Math.round(0x2a * (1 - t) + 0x0f * t);
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}

/* ------------------------------------------------------------- helpers */
const steps = [];
const step = (name, ok, detail = "") => {
  steps.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  ${detail}` : ""}`);
  if (!ok) throw new Error(`${name}: ${detail}`);
};
const toast = (page, text) => page.locator("[data-sonner-toast]", { hasText: text }).first().waitFor();
const toastGone = (page, text) => page.locator("[data-sonner-toast]", { hasText: text }).first().waitFor({ state: "detached" });

const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

async function signInWithMagicLink(context) {
  const { data, error } = await admin.auth.admin.generateLink({ type: "magiclink", email: EMAIL });
  if (error) throw new Error(`generateLink: ${error.message}`);
  const anon = createClient(SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  const v = await anon.auth.verifyOtp({ token_hash: data.properties.hashed_token, type: "magiclink" });
  if (v.error || !v.data.session) throw new Error(`verifyOtp: ${v.error?.message ?? "no session"}`);
  const ref = new URL(SUPABASE_URL).hostname.split(".")[0];
  const value = `base64-${Buffer.from(JSON.stringify(v.data.session), "utf8").toString("base64url")}`;
  await context.addCookies([{ name: `sb-${ref}-auth-token`, value, url: BASE, httpOnly: false, sameSite: "Lax" }]);
}

/** Public page as a fresh visitor (no preloader wait: it is aria-hidden and fades on its own). */
async function visit(page, path) {
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
}

const stamp = Date.now().toString(36);
mkdirSync("qa", { recursive: true });

const { data: settingsBefore } = await admin.from("site_settings").select("tagline, logo_url, logo_path, logo_dark_url, logo_dark_path, ads_enabled").eq("id", 1).single();
const restore = { ...settingsBefore };
let postId = null;
let logoPath = null;

const browser = await chromium.launch();
const visitor = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await visitor.newPage();
page.setDefaultTimeout(45000);
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));

try {
  /* 1. Public pages: screenshots + live-data checks */
  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const mp = await mobile.newPage();
  mp.setDefaultTimeout(45000);
  const { data: firstArticle } = await admin.from("live_posts").select("slug").order("published_at", { ascending: false }).limit(1).single();
  const pages = [
    ["home", "/"],
    ["breaking", "/breaking"],
    ["section-uttarakhand", "/section/uttarakhand"],
    ["article", `/news/${firstArticle.slug}`],
    ["podcasts", "/podcasts"],
    ["contact", "/contact"],
  ];
  for (const [name, path] of pages) {
    await visit(page, path);
    await page.waitForTimeout(2800); // preloader
    await page.screenshot({ path: `qa/p6-${name}-1440.png`, fullPage: true });
    await visit(mp, path);
    await mp.waitForTimeout(2800);
    await mp.screenshot({ path: `qa/p6-${name}-390.png`, fullPage: true });
  }
  await mobile.close();
  step("public pages screenshotted at 1440 and 390", true, pages.map((p) => p[0]).join(", "));

  await visit(page, "/");
  const { data: breakingRows } = await admin.from("live_posts").select("title").eq("is_breaking", true);
  const tickerText = await page.locator("aside[aria-label='Breaking news']").textContent();
  step("ticker shows the seeded breaking posts", breakingRows.length > 0 && breakingRows.every((r) => tickerText.includes(r.title)), `${breakingRows.length} titles`);
  const adSlots = await page.locator("[data-ad-slot]").count();
  const adImg = await page.locator("[data-ad-slot='home.belowHero'] img").first().getAttribute("src");
  step("ad slots render the seeded creatives", adSlots >= 3 && /ads\/(billboard|leaderboard)/.test(adImg ?? ""), `${adSlots} slots · ${adImg}`);
  const { data: s0 } = await admin.from("site_settings").select("site_name, site_name_hindi").eq("id", 1).single();
  const navText = await page.locator("header").first().textContent();
  step("navbar shows the DB site names", navText.includes(s0.site_name) && navText.includes(s0.site_name_hindi));
  const preText = await page.evaluate(() => document.body.innerText);
  step("preloader/hero show the DB names", preText.includes(s0.site_name_hindi));

  /* 2. Sign in */
  const adminCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const ap = await adminCtx.newPage();
  ap.setDefaultTimeout(45000);
  await ap.goto(`${BASE}/admin/settings`);
  await ap.waitForURL(/\/admin\/login/);
  await ap.fill("#login-email", EMAIL);
  await ap.fill("#login-password", PASSWORD);
  await ap.getByRole("button", { name: "Sign in" }).click();
  const outcome = await Promise.race([ap.waitForURL(/\/admin\/settings$/).then(() => "ok"), ap.getByText("Wrong email or password").waitFor().then(() => "wrong")]);
  if (outcome !== "ok") {
    await signInWithMagicLink(adminCtx);
    await ap.goto(`${BASE}/admin/settings`);
    await ap.waitForURL(/\/admin\/settings$/);
  }
  step(`signed in (${outcome === "ok" ? "password" : "magic-link fallback"})`, true);

  /* 3. Tagline → hero + preloader */
  await ap.waitForFunction(() => Boolean(document.querySelector("#tagline")?.value));
  const originalTagline = await ap.inputValue("#tagline");
  const newTagline = `${originalTagline} · लाइव ${stamp}`;
  await ap.fill("#tagline", newTagline);
  await ap.getByRole("button", { name: "Save brand" }).click();
  await toast(ap, "Brand saved");
  await toastGone(ap, "Brand saved");
  await visit(page, "/");
  const heroText = await page.locator("#hero-title").textContent();
  step("new tagline visible in the hero", heroText.replace(/\s+/g, " ").includes(newTagline), heroText.replace(/\s+/g, " ").slice(0, 80));
  const preloaderHtml = await page.evaluate(() => document.body.innerHTML);
  step("new tagline visible in the preloader", preloaderHtml.includes(`लाइव ${stamp}`));

  /* 4. Logo upload → navbar + footer */
  await ap.locator("#logoUrl").setInputFiles({ name: "e2e-logo.png", mimeType: "image/png", buffer: makePng(320, 96, true) });
  await ap.getByText(/Uploaded · /).first().waitFor();
  await ap.getByRole("button", { name: "Save brand" }).click();
  await toast(ap, "Brand saved");
  await toastGone(ap, "Brand saved");
  const { data: s1 } = await admin.from("site_settings").select("logo_url, logo_path").eq("id", 1).single();
  logoPath = s1.logo_path;
  step("logo stored in branding/logo/", Boolean(s1.logo_path?.startsWith("logo/")), s1.logo_path ?? "");
  await visit(page, "/");
  const navImg = await page.locator("header img").first().getAttribute("src");
  const footImg = await page.locator("footer img").first().getAttribute("src");
  step("logo image in the navbar", (navImg ?? "").includes(s1.logo_path), navImg ?? "");
  step("logo image in the footer", (footImg ?? "").includes(s1.logo_path), footImg ?? "");

  /* 5. Ads off → no slots */
  await ap.goto(`${BASE}/admin/ads`);
  await ap.getByRole("switch").first().click();
  await toast(ap, "Ads switched off");
  await visit(page, "/");
  step("no ad slots when ads are switched off", (await page.locator("[data-ad-slot]").count()) === 0);
  await ap.getByRole("switch").first().click();
  await toast(ap, "Ads switched on");
  await visit(page, "/");
  step("ad slots return when ads are switched on", (await page.locator("[data-ad-slot]").count()) > 0);

  /* 6. Publish a Photo post → home + section; delete → gone */
  const TITLE = `Live round trip ${stamp}`;
  await ap.goto(`${BASE}/admin/posts/new?type=image`);
  await ap.fill("#title", TITLE);
  await ap.fill("#excerpt", "An automated Phase 6 check: this story should appear on the front page and in Uttarakhand, then vanish.");
  await ap.fill("#category", "Testing");
  await ap.locator("#coverImageUrl").setInputFiles({ name: "e2e-cover.png", mimeType: "image/png", buffer: makePng(1200, 800) });
  await ap.getByText(/Uploaded · /).first().waitFor();
  // Section: pick Uttarakhand.
  await ap.locator("#section").click();
  await ap.getByRole("option", { name: /Uttarakhand/ }).click();
  await ap.locator("#body textarea").first().fill("First paragraph of the live round-trip story.");
  await ap.getByRole("button", { name: "Publish" }).click();
  await ap.waitForURL(/\/admin\/posts\/[0-9a-f-]{36}$/);
  postId = ap.url().split("/").pop();
  const { data: row } = await admin.from("posts").select("slug, section, status").eq("id", postId).single();
  step("post published into uttarakhand", row?.status === "published" && row.section === "uttarakhand", row?.slug);

  await visit(page, "/");
  step("new post on the front page", (await page.evaluate(() => document.body.innerText)).includes(TITLE));
  await visit(page, "/section/uttarakhand");
  step("new post on its section page", (await page.evaluate(() => document.body.innerText)).includes(TITLE));
  await visit(page, `/news/${row.slug}`);
  step("article page renders", (await page.locator("h1").last().textContent()).includes(TITLE));

  await ap.goto(`${BASE}/admin/posts`);
  await ap.getByLabel("Search posts").fill(TITLE);
  await ap.getByRole("button", { name: `Actions for ${TITLE}` }).click();
  await ap.getByRole("menuitem", { name: "Delete…" }).click();
  await ap.getByRole("button", { name: "Delete post" }).click();
  await toast(ap, "Post deleted");
  postId = null;
  await visit(page, "/");
  step("deleted post gone from the front page", !(await page.evaluate(() => document.body.innerText)).includes(TITLE));
  const res = await page.goto(`${BASE}/news/${row.slug}`);
  step("deleted article 404s", res.status() === 404, String(res.status()));

  /* 7. Restore settings */
  await ap.goto(`${BASE}/admin/settings`);
  await ap.waitForFunction(() => Boolean(document.querySelector("#tagline")?.value));
  await ap.fill("#tagline", originalTagline);
  await ap.getByRole("button", { name: "Save brand" }).click();
  await toast(ap, "Brand saved");
  await admin.from("site_settings").update({ tagline: restore.tagline, logo_url: restore.logo_url, logo_path: restore.logo_path }).eq("id", 1);
  if (logoPath) await admin.storage.from("branding").remove([logoPath]);
  logoPath = null;
  const { data: after } = await admin.from("site_settings").select("tagline, logo_url, ads_enabled").eq("id", 1).single();
  step("settings restored", after.tagline === restore.tagline && after.logo_url === restore.logo_url && after.ads_enabled === restore.ads_enabled);
  await visit(page, "/");
  step("front page back to the original tagline", (await page.locator("#hero-title").textContent()).replace(/\s+/g, " ").includes(originalTagline.trim()));

  step("no uncaught browser errors on the public site", errors.length === 0, errors.join(" | "));
  console.log(`\nAll ${steps.length} live E2E steps passed.`);
} catch (e) {
  console.error("\nE2E FAILED:", e instanceof Error ? e.message : e);
  await page.screenshot({ path: "e2e-failure.png", fullPage: true }).catch(() => {});
  if (postId) {
    const { data } = await admin.from("posts").select("cover_image_path").eq("id", postId).maybeSingle();
    await admin.from("posts").delete().eq("id", postId);
    if (data?.cover_image_path) await admin.storage.from("media").remove([data.cover_image_path]);
  }
  await admin.from("site_settings").update({ tagline: restore.tagline, logo_url: restore.logo_url, logo_path: restore.logo_path, logo_dark_url: restore.logo_dark_url, logo_dark_path: restore.logo_dark_path, ads_enabled: restore.ads_enabled }).eq("id", 1);
  if (logoPath) await admin.storage.from("branding").remove([logoPath]);
  process.exitCode = 1;
} finally {
  await browser.close();
}
