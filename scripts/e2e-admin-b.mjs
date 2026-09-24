/**
 * Admin dashboard end-to-end check (Phase 5B: ads, messages, settings).
 *
 *   npm run e2e:admin-b       (= DOTENV_CONFIG_PATH=.env.local node -r dotenv/config scripts/e2e-admin-b.mjs)
 *
 * Needs ADMIN_E2E_EMAIL / ADMIN_E2E_PASSWORD in .env.local (a confirmed Auth
 * user listed in public.admins), a running app at E2E_BASE_URL (default
 * http://localhost:3100) and the service-role key to verify rows and storage.
 * Skips cleanly when the credentials are absent.
 *
 * Flow: sign in → add a 300×250 creative to podcast.rail → toggle → delete
 * (storage object gone) → submit the public contact form → open it in
 * /admin/messages → mark read → archive → delete → change the Brand tagline
 * → confirm the row changed → restore. Screenshots of /admin/ads,
 * /admin/messages and /admin/settings at 1440 and 390 land in ./qa/.
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
/** Saffron-to-ink gradient PNG, width×height, RGB. */
function makePng(width, height) {
  const raw = Buffer.alloc((width * 3 + 1) * height);
  let o = 0;
  for (let y = 0; y < height; y++) {
    raw[o++] = 0;
    for (let x = 0; x < width; x++) {
      const t = x / width;
      raw[o++] = Math.round(0xe8 * (1 - t) + 0x0b * t);
      raw[o++] = Math.round(0x86 * (1 - t) + 0x0b * t);
      raw[o++] = Math.round(0x2a * (1 - t) + 0x0f * t);
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* ------------------------------------------------------------- helpers */
const steps = [];
const step = (name, ok, detail = "") => {
  steps.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  ${detail}` : ""}`);
  if (!ok) throw new Error(`${name}: ${detail}`);
};

const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

async function objectExists(bucket, path) {
  const dir = path.split("/").slice(0, -1).join("/");
  const name = path.split("/").pop();
  const { data, error } = await admin.storage.from(bucket).list(dir, { limit: 1000 });
  if (error) throw new Error(`storage list ${bucket}/${dir}: ${error.message}`);
  return (data ?? []).some((f) => f.name === name);
}


/**
 * Password fallback: mint a magic-link token with the service role, exchange
 * it for a session with the anon client, and store it as the cookie
 * @supabase/ssr reads (`sb-<ref>-auth-token` = "base64-" + base64url(JSON)).
 * The Auth user's password is never touched.
 */
async function signInWithMagicLink(context) {
  const { data, error } = await admin.auth.admin.generateLink({ type: "magiclink", email: EMAIL });
  if (error) throw new Error(`generateLink: ${error.message}`);
  const anon = createClient(SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const v = await anon.auth.verifyOtp({ token_hash: data.properties.hashed_token, type: "magiclink" });
  if (v.error || !v.data.session) throw new Error(`verifyOtp: ${v.error?.message ?? "no session"}`);
  const ref = new URL(SUPABASE_URL).hostname.split(".")[0];
  const value = `base64-${Buffer.from(JSON.stringify(v.data.session), "utf8").toString("base64url")}`;
  if (value.length > 3180) throw new Error("session cookie needs chunking; not implemented in the E2E helper");
  await context.addCookies([{ name: `sb-${ref}-auth-token`, value, url: BASE, httpOnly: false, sameSite: "Lax" }]);
}

const stamp = Date.now().toString(36);
const SPONSOR = `E2E Sponsor ${stamp}`;
const SENDER = `E2E Reader ${stamp}`;
const MESSAGE = `Automated Phase 5B check ${stamp}.\nSecond line to prove the first line is what the inbox shows. Safe to delete.`;

/** Wait for a Sonner toast with this title (scoped so tab labels/badges never match). */
const toast = (page, text) => page.locator("[data-sonner-toast]", { hasText: text }).first().waitFor();

mkdirSync("qa", { recursive: true });
const shot = async (page, name) => {
  await page.screenshot({ path: `qa/p5b-${name}.png`, fullPage: true });
};

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
/** Same session at 390px; screenshots are taken while the E2E data still exists. */
let mobilePage = null;
const mobileShot = async (path) => {
  if (!mobilePage) {
    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, storageState: await context.storageState() });
    mobilePage = await mobile.newPage();
    mobilePage.setDefaultTimeout(30000);
  }
  await mobilePage.goto(`${BASE}/admin/${path}`);
  await mobilePage.waitForLoadState("networkidle");
  await mobilePage.screenshot({ path: `qa/p5b-${path}-390.png`, fullPage: true });
};
page.setDefaultTimeout(30000);
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));

const cleanup = { adId: null, adPath: null, messageId: null, tagline: undefined };

try {
  /* 1. Login (password; falls back to a service-role magic link when the password is wrong) */
  await page.goto(`${BASE}/admin/ads`);
  await page.waitForURL(/\/admin\/login/);
  await page.fill("#login-email", EMAIL);
  await page.fill("#login-password", PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  const outcome = await Promise.race([
    page.waitForURL(/\/admin\/ads$/).then(() => "ok"),
    page.getByText("Wrong email or password").waitFor().then(() => "wrong"),
  ]);
  if (outcome === "ok") {
    step("sign in with password redirects to /admin/ads", true);
  } else {
    await signInWithMagicLink(context);
    await page.goto(`${BASE}/admin/ads`);
    await page.waitForURL(/\/admin\/ads$/);
    step("sign in via magic-link fallback", true, "ADMIN_E2E_PASSWORD does not match the Auth user; fix it in .env.local");
  }

  /* 2. Ads: add a 300×250 creative to podcast.rail */
  const podcastCard = page.locator("#slot-podcast\\.rail");
  await podcastCard.getByRole("button", { name: "Add creative" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor();
  await dialog.locator("#ad-sponsor").fill(SPONSOR);
  await dialog.locator("#ad-image").setInputFiles({ name: "e2e-mpu.png", mimeType: "image/png", buffer: makePng(300, 250) });
  await dialog.getByText(/Uploaded · /).waitFor();
  await dialog.getByText(/matches the slot/).waitFor();
  step("300×250 upload matches the MPU slot", true);
  await dialog.locator("#ad-href").fill("https://example.com/e2e");
  await dialog.locator("#ad-alt").fill("E2E creative");
  await dialog.getByRole("button", { name: "Add creative" }).click();
  await toast(page, "Creative added");

  const { data: adRow } = await admin.from("ads").select("*").eq("slot_key", "podcast.rail").eq("sponsor_name", SPONSOR).maybeSingle();
  step("ad row created with a branding path", Boolean(adRow?.image_path?.startsWith("ads/podcast.rail/")), adRow?.image_path ?? "");
  cleanup.adId = adRow.id;
  cleanup.adPath = adRow.image_path;
  step("creative object exists in branding bucket", await objectExists("branding", adRow.image_path));

  const row = page.locator("li", { hasText: SPONSOR }).first();
  await row.waitFor();
  step("creative listed as Active", (await row.textContent()).includes("Active"));
  await shot(page, "ads-1440");
  await mobileShot("ads");

  /* toggle */
  await row.getByRole("button", { name: `Disable ${SPONSOR}` }).click();
  await toast(page, "Creative disabled");
  await page.locator("li", { hasText: SPONSOR }).getByText("Disabled", { exact: true }).waitFor();
  const { data: toggled } = await admin.from("ads").select("enabled").eq("id", adRow.id).single();
  step("toggle persisted enabled=false", toggled?.enabled === false);

  /* delete */
  await page.locator("li", { hasText: SPONSOR }).getByRole("button", { name: `Delete ${SPONSOR}` }).click();
  await page.getByRole("button", { name: "Delete creative" }).click();
  await toast(page, "Creative deleted");
  const { data: goneAd } = await admin.from("ads").select("id").eq("id", adRow.id).maybeSingle();
  step("ad row deleted", !goneAd);
  step("creative object removed from storage", !(await objectExists("branding", adRow.image_path)), adRow.image_path);
  cleanup.adId = null;
  cleanup.adPath = null;

  /* 3. Public contact form → inbox */
  await page.goto(`${BASE}/contact`);
  await page.fill("#contact-name", SENDER);
  await page.fill("#contact-email", `e2e-${stamp}@example.com`);
  await page.fill("#contact-phone", "+91 98765 43210");
  await page.selectOption("#contact-topic", "Press");
  await page.fill("#contact-message", MESSAGE);
  await page.getByRole("button", { name: "Send message" }).click();
  await page.getByText(/Thank you/).waitFor();
  const { data: msgRow } = await admin.from("contact_messages").select("*").eq("name", SENDER).maybeSingle();
  step("contact form stored the message (unread)", Boolean(msgRow) && msgRow.read === false, msgRow?.id ?? "");
  cleanup.messageId = msgRow.id;

  await page.goto(`${BASE}/admin/messages`);
  const badge = page.locator("nav[aria-label='Admin'] a", { hasText: "Messages" }).first();
  step("sidebar shows an unread badge", /\d/.test(await badge.textContent()), (await badge.textContent()).replace(/\s+/g, " "));
  const msgButton = page.getByRole("button", { name: new RegExp(SENDER) }).first();
  await msgButton.waitFor();
  const rowText = await msgButton.textContent();
  step("row shows the first line only", rowText.includes(`Automated Phase 5B check ${stamp}.`) && !rowText.includes("Second line"));
  await msgButton.click();
  await page.getByRole("heading", { name: SENDER }).waitFor();
  const detail = page.locator("section", { has: page.getByRole("heading", { name: SENDER }) });
  step("detail shows the full message", (await detail.textContent()).includes("Second line to prove"));
  const mailto = await detail.getByRole("link", { name: /Reply by email/ }).getAttribute("href");
  step("reply link is a mailto with the subject", /^mailto:e2e-.*subject=Re%3A%20your%20message%20to%20Janpaksh%20Bharat/.test(mailto ?? ""), mailto ?? "");
  const wa = await detail.getByRole("link", { name: /WhatsApp/ }).getAttribute("href");
  step("WhatsApp link built from the phone", wa === "https://wa.me/919876543210", wa ?? "");
  // markRead fires on open; give the action a moment, then verify the row.
  await page.waitForTimeout(1500);
  const { data: readRow } = await admin.from("contact_messages").select("read").eq("id", msgRow.id).single();
  step("opening the message marked it read", readRow?.read === true);
  await shot(page, "messages-1440");
  await mobileShot("messages");

  await detail.getByRole("button", { name: "Mark unread" }).click();
  await toast(page, "Marked as unread");
  const { data: unreadRow } = await admin.from("contact_messages").select("read").eq("id", msgRow.id).single();
  step("mark unread persisted", unreadRow?.read === false);

  await detail.getByRole("button", { name: "Archive" }).click();
  await toast(page, "Archived");
  const { data: archivedRow } = await admin.from("contact_messages").select("archived, read").eq("id", msgRow.id).single();
  step("archive persisted (and marked read)", archivedRow?.archived === true && archivedRow?.read === true);

  await page.getByRole("tab", { name: /Archived/ }).click();
  await page.getByRole("button", { name: new RegExp(SENDER) }).first().click();
  await page.getByRole("heading", { name: SENDER }).waitFor();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await page.getByRole("button", { name: "Delete message" }).click();
  await toast(page, "Message deleted");
  const { data: goneMsg } = await admin.from("contact_messages").select("id").eq("id", msgRow.id).maybeSingle();
  step("message deleted", !goneMsg);
  cleanup.messageId = null;

  /* 4. Settings: change the tagline, confirm, restore */
  const { data: before } = await admin.from("site_settings").select("tagline").eq("id", 1).single();
  cleanup.tagline = before.tagline;
  await page.goto(`${BASE}/admin/settings`);
  // react-hook-form fills uncontrolled inputs after hydration; wait for the value.
  await page.waitForFunction(() => Boolean(document.querySelector("#tagline")?.value));
  const original = await page.inputValue("#tagline");
  const changed = `${original} · E2E ${stamp}`;
  await page.fill("#tagline", changed);
  await page.getByRole("tab", { name: /Brand/ }).locator("[aria-label='Unsaved changes']").waitFor();
  step("Brand tab shows the unsaved-changes dot", true);
  await page.getByRole("button", { name: "Save brand" }).click();
  await toast(page, "Brand saved");
  const { data: after } = await admin.from("site_settings").select("tagline").eq("id", 1).single();
  step("site_settings.tagline changed", after?.tagline === changed, after?.tagline ?? "");
  await shot(page, "settings-1440");
  await mobileShot("settings");

  // Let the first toast clear so the next wait can't match it.
  await page.locator("[data-sonner-toast]", { hasText: "Brand saved" }).first().waitFor({ state: "detached" });
  await page.fill("#tagline", original);
  await page.getByRole("button", { name: "Save brand" }).click();
  await toast(page, "Brand saved");
  const { data: restored } = await admin.from("site_settings").select("tagline").eq("id", 1).single();
  step("tagline restored via the UI", restored?.tagline === original, restored?.tagline ?? "");
  if (before.tagline == null) {
    // The column was null (config fallback) before; put it back exactly.
    await admin.from("site_settings").update({ tagline: null }).eq("id", 1);
  }
  cleanup.tagline = undefined;

  step("screenshots written to qa/", true, "p5b-{ads,messages,settings}-{1440,390}.png");

  step("no uncaught browser errors", errors.length === 0, errors.join(" | "));
  console.log(`\nAll ${steps.length} E2E steps passed.`);
} catch (e) {
  console.error("\nE2E FAILED:", e instanceof Error ? e.message : e);
  await page.screenshot({ path: "e2e-failure.png", fullPage: true }).catch(() => {});
  if (cleanup.adId) {
    await admin.from("ads").delete().eq("id", cleanup.adId);
    if (cleanup.adPath) await admin.storage.from("branding").remove([cleanup.adPath]);
  }
  if (cleanup.messageId) await admin.from("contact_messages").delete().eq("id", cleanup.messageId);
  if (cleanup.tagline !== undefined) await admin.from("site_settings").update({ tagline: cleanup.tagline }).eq("id", 1);
  process.exitCode = 1;
} finally {
  await browser.close();
}
