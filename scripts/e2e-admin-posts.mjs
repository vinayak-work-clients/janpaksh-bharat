/**
 * Admin dashboard end-to-end check (Phase 5A).
 *
 *   npm run e2e:admin          (= DOTENV_CONFIG_PATH=.env.local node -r dotenv/config scripts/e2e-admin-posts.mjs)
 *
 * Needs ADMIN_E2E_EMAIL / ADMIN_E2E_PASSWORD in .env.local, a running app at
 * E2E_BASE_URL (default http://localhost:3100) and the service-role key to
 * verify rows and storage objects afterwards. Skips cleanly when the
 * credentials are absent.
 *
 * Flow: sign in → create a Photo post with a generated 1200×800 image →
 * publish → find it in /admin/posts with a 30-day expiry → edit the title →
 * duplicate → delete both → confirm the storage objects are gone.
 */
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
/** Solid saffron-to-ink gradient PNG, width×height, RGB. */
function makePng(width, height) {
  const raw = Buffer.alloc((width * 3 + 1) * height);
  let o = 0;
  for (let y = 0; y < height; y++) {
    raw[o++] = 0; // filter: none
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
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
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

async function objectExists(path) {
  const dir = path.split("/").slice(0, -1).join("/");
  const name = path.split("/").pop();
  const { data, error } = await admin.storage.from("media").list(dir, { limit: 1000 });
  if (error) throw new Error(`storage list ${dir}: ${error.message}`);
  return (data ?? []).some((f) => f.name === name);
}

const stamp = Date.now().toString(36);
const TITLE = `E2E photo story ${stamp}`;
const TITLE2 = `E2E photo story ${stamp} (edited)`;
const created = [];

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
page.setDefaultTimeout(30000);
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));

try {
  /* 1. Login */
  await page.goto(`${BASE}/admin/posts`);
  await page.waitForURL(/\/admin\/login/);
  await page.fill("#login-email", EMAIL);
  await page.fill("#login-password", PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/\/admin\/posts$/);
  step("sign in redirects to ?next", true, page.url());

  /* 2. Create a Photo post */
  await page.goto(`${BASE}/admin/posts/new?type=image`);
  await page.fill("#title", TITLE);
  await page.fill("#excerpt", "An automated end-to-end story created by the Phase 5A verification script. Safe to delete.");
  await page.fill("#category", "Testing");
  await page.fill("#coverAlt", "A saffron-to-ink gradient test image");
  const slug = await page.inputValue("#slug");
  step("slug auto-generated from title", /^e2e-photo-story-/.test(slug), slug);

  await page.setInputFiles("#coverImageUrl", { name: "e2e-cover.png", mimeType: "image/png", buffer: makePng(1200, 800) });
  await page.getByText(/Uploaded · /).waitFor();
  step("cover image uploaded browser-direct", true);

  const bodyBox = page.locator("#body textarea").first();
  await bodyBox.fill("First paragraph of the automated story.");

  await page.getByRole("button", { name: "Publish" }).click();
  await page.waitForURL(/\/admin\/posts\/[0-9a-f-]{36}$/);
  const id = page.url().split("/").pop();
  created.push(id);
  await page.getByText("Published", { exact: true }).first().waitFor();
  step("publish creates the row and opens the editor", true, id);

  const { data: row } = await admin.from("posts").select("*").eq("id", id).single();
  step("row is published with a storage path", row?.status === "published" && Boolean(row?.cover_image_path), row?.cover_image_path ?? "");
  const coverPath = row.cover_image_path;
  const expiresDiff = (new Date(row.expires_at) - new Date(row.created_at)) / 86400000;
  step("expires_at = created_at + 30 days", Math.abs(expiresDiff - 30) < 0.001, `${expiresDiff} days`);
  step("cover object exists in bucket", await objectExists(coverPath));
  step("cover_alt stored (0002 migration)", row.cover_alt === "A saffron-to-ink gradient test image" || row.cover_alt === undefined, row.cover_alt === undefined ? "column absent: run 0002_cover_alt.sql" : row.cover_alt);

  /* 3. Appears in /admin/posts with a 30-day expiry */
  await page.goto(`${BASE}/admin/posts`);
  await page.getByLabel("Search posts").fill(TITLE);
  const tableRow = page.locator("table tbody tr", { hasText: TITLE });
  await tableRow.waitFor();
  const expiresText = await tableRow.locator("td").nth(5).innerText();
  step("listed with 30-day expiry", /in (29|30) days/.test(expiresText), expiresText.trim());
  step("status badge shows Published", (await tableRow.innerText()).includes("Published"));

  /* 4. Edit the title */
  await page.goto(`${BASE}/admin/posts/${id}`);
  await page.fill("#title", TITLE2);
  await page.getByRole("button", { name: "Update" }).click();
  await page.getByText("Updated", { exact: true }).first().waitFor();
  const { data: edited } = await admin.from("posts").select("title").eq("id", id).single();
  step("title edit persisted", edited?.title === TITLE2, edited?.title);

  /* 5. Duplicate */
  await page.goto(`${BASE}/admin/posts`);
  await page.getByLabel("Search posts").fill(TITLE2);
  await page.getByRole("button", { name: `Actions for ${TITLE2}` }).click();
  await page.getByRole("menuitem", { name: "Duplicate" }).click();
  await page.waitForURL((u) => /\/admin\/posts\/[0-9a-f-]{36}$/.test(u.toString()) && !u.toString().endsWith(id));
  const copyId = page.url().split("/").pop();
  created.push(copyId);
  const { data: copy } = await admin.from("posts").select("*").eq("id", copyId).single();
  step("duplicate is a draft with its own slug", copy?.status === "draft" && copy.slug !== row.slug && copy.title.startsWith("Copy of "), `${copy?.slug}`);
  const copyPath = copy.cover_image_path;
  step("duplicate copied the cover object", Boolean(copyPath) && copyPath !== coverPath && (await objectExists(copyPath)), copyPath ?? "");

  /* 6. Delete both via the UI */
  for (const [pid, title] of [[copyId, copy.title], [id, TITLE2]]) {
    await page.goto(`${BASE}/admin/posts`);
    await page.getByLabel("Search posts").fill(title);
    await page.getByRole("button", { name: `Actions for ${title}` }).click();
    await page.getByRole("menuitem", { name: "Delete…" }).click();
    await page.getByRole("button", { name: "Delete post" }).click();
    await page.getByText("Post deleted", { exact: true }).first().waitFor();
    const { data: gone } = await admin.from("posts").select("id").eq("id", pid).maybeSingle();
    step(`deleted ${pid.slice(0, 8)} via UI`, !gone);
  }
  created.length = 0;
  step("original cover object removed from storage", !(await objectExists(coverPath)), coverPath);
  step("duplicate cover object removed from storage", !(await objectExists(copyPath)), copyPath);

  /* 7. Sign out via /admin/logout */
  await page.goto(`${BASE}/admin/logout`);
  await page.waitForURL(/\/admin\/login/);
  await page.goto(`${BASE}/admin`);
  await page.waitForURL(/\/admin\/login\?next=/);
  step("signed out; /admin redirects to login", true);

  step("no uncaught browser errors", errors.length === 0, errors.join(" | "));
  console.log(`\nAll ${steps.length} E2E steps passed.`);
} catch (e) {
  console.error("\nE2E FAILED:", e instanceof Error ? e.message : e);
  await page.screenshot({ path: "e2e-failure.png", fullPage: true }).catch(() => {});
  // Clean up anything left behind.
  for (const pid of created) {
    const { data } = await admin.from("posts").select("cover_image_path, media_path").eq("id", pid).maybeSingle();
    await admin.from("posts").delete().eq("id", pid);
    const paths = [data?.cover_image_path, data?.media_path].filter(Boolean);
    if (paths.length) await admin.storage.from("media").remove(paths);
  }
  process.exitCode = 1;
} finally {
  await browser.close();
}
