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
    await seedPosts();
    await seedAds();
    console.log("\nSeed complete.");
  } catch (e) {
    console.error("\nSeed failed:", e instanceof Error ? e.message : e);
    process.exit(1);
  }
})();
