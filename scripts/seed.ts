/**
 * Seeds Supabase with the mock content.
 *
 *   npm run seed        (= DOTENV_CONFIG_PATH=.env.local tsx -r dotenv/config scripts/seed.ts)
 *
 * - Upserts all mock posts by slug. External URLs are kept, storage paths are
 *   null, and created_at is set so that expires_at (created_at + 30 days)
 *   matches the mock publishedAt + 30 days.
 * - Upserts the placeholder ad creatives by (slot_key, sponsor_name).
 * Re-runnable: nothing is duplicated.
 *
 *   npm run seed -- --wipe
 *
 * Deletes every post (and its uploaded files in the media bucket) and every
 * ad creative first, so the client can start from an empty site before
 * launch. Site settings and contact messages are left alone.
 */
import { createClient } from "@supabase/supabase-js";
import type { Database, AdInsert } from "../src/lib/supabase/types";
import { mockPosts } from "../src/data/mock-posts";
import { adSlots, type AdSlotKey } from "../src/config/ads";
import { postToInsert } from "../src/lib/data/mappers";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient<Database>(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const WIPE = process.argv.includes("--wipe");
const WIPE_ONLY = process.argv.includes("--wipe-only");

async function wipe() {
  const { data: rows, error: readError } = await supabase.from("posts").select("id, cover_image_path, media_path, body");
  if (readError) throw new Error(`posts read: ${readError.message}`);
  const paths = new Set<string>();
  for (const r of rows ?? []) {
    if (r.cover_image_path) paths.add(r.cover_image_path);
    if (r.media_path) paths.add(r.media_path);
    for (const b of Array.isArray(r.body) ? r.body : []) {
      if (b.type === "image" && b.path) paths.add(b.path);
    }
  }
  const { error: postsError } = await supabase.from("posts").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (postsError) throw new Error(`posts delete: ${postsError.message}`);
  console.log(`wipe: deleted ${rows?.length ?? 0} posts`);

  const list = Array.from(paths);
  for (let i = 0; i < list.length; i += 100) {
    const { error } = await supabase.storage.from("media").remove(list.slice(i, i + 100));
    if (error) console.warn(`wipe: could not remove some media files: ${error.message}`);
  }
  if (list.length) console.log(`wipe: removed ${list.length} media files`);

  const { data: ads, error: adsRead } = await supabase.from("ads").select("id, image_path");
  if (adsRead) throw new Error(`ads read: ${adsRead.message}`);
  const adPaths = (ads ?? []).map((a) => a.image_path).filter((p): p is string => Boolean(p));
  const { error: adsError } = await supabase.from("ads").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (adsError) throw new Error(`ads delete: ${adsError.message}`);
  if (adPaths.length) {
    const { error } = await supabase.storage.from("branding").remove(adPaths);
    if (error) console.warn(`wipe: could not remove some creative files: ${error.message}`);
  }
  console.log(`wipe: deleted ${ads?.length ?? 0} ad creatives`);
}

async function seedPosts() {
  // created_at = publishedAt so the 30-day window mirrors the mock dates.
  const rows = mockPosts.map((post) => postToInsert(post, { createdAt: post.publishedAt }));

  const { data, error } = await supabase
    .from("posts")
    .upsert(rows, { onConflict: "slug" })
    .select("slug, section, expires_at")
    .order("expires_at", { ascending: true });

  if (error) throw new Error(`posts upsert: ${error.message}`);

  console.log(`\nposts: upserted ${data?.length ?? 0}\n`);
  const pad = (s: string, n: number) => s.padEnd(n);
  console.log(`${pad("slug", 58)} ${pad("section", 15)} expires_at`);
  console.log("-".repeat(100));
  for (const r of data ?? []) {
    console.log(`${pad(r.slug, 58)} ${pad(r.section, 15)} ${r.expires_at}`);
  }
}

async function seedAds() {
  const rows: AdInsert[] = (Object.keys(adSlots) as AdSlotKey[]).map((key) => {
    const slot = adSlots[key];
    return {
      slot_key: key,
      sponsor_name: slot.creative.sponsorName,
      image_url: slot.creative.src,
      image_path: null,
      href: slot.creative.href,
      alt: slot.creative.alt,
      enabled: slot.enabled,
    };
  });

  const { data, error } = await supabase
    .from("ads")
    .upsert(rows, { onConflict: "slot_key,sponsor_name" })
    .select("slot_key, sponsor_name");
  if (error) throw new Error(`ads upsert: ${error.message}`);
  console.log(`\nads: upserted ${data?.length ?? 0}`);
  for (const r of data ?? []) console.log(`  ${r.slot_key.padEnd(24)} ${r.sponsor_name}`);
}

(async () => {
  try {
    if (WIPE || WIPE_ONLY) await wipe();
    if (WIPE_ONLY) {
      console.log("\nWipe complete (nothing seeded).");
      return;
    }
    await seedPosts();
    await seedAds();
    console.log("\nSeed complete.");
  } catch (e) {
    console.error("\nSeed failed:", e instanceof Error ? e.message : e);
    process.exit(1);
  }
})();
