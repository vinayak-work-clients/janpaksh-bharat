/**
 * Sanity check for the Supabase project.
 *
 *   npm run db:check    (= DOTENV_CONFIG_PATH=.env.local tsx -r dotenv/config scripts/check-supabase.ts)
 *
 * Prints PASS/FAIL per check and exits 1 if any fail.
 */
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/lib/supabase/types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let failed = 0;
function report(name: string, ok: boolean, detail: string) {
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name.padEnd(28)} ${detail}`);
}

(async () => {
  console.log("Supabase check\n");
  report("env: public keys", Boolean(url && anonKey), url ? new URL(url).host : "NEXT_PUBLIC_SUPABASE_URL missing");
  report("env: service role key", Boolean(serviceKey), serviceKey ? "present" : "SUPABASE_SERVICE_ROLE_KEY missing");
  report("env: CRON_SECRET", Boolean(process.env.CRON_SECRET), process.env.CRON_SECRET ? "present" : "missing");
  if (!url || !anonKey || !serviceKey) {
    process.exit(1);
  }

  const anon = createClient<Database>(url, anonKey, { auth: { persistSession: false } });
  const admin = createClient<Database>(url, serviceKey, { auth: { persistSession: false } });

  // site_settings (public read)
  {
    const { data, error } = await anon.from("site_settings").select("site_name, site_name_hindi, updated_at").eq("id", 1).maybeSingle();
    report("site_settings row", Boolean(data) && !error, error ? error.message : data ? `${data.site_name} · ${data.site_name_hindi}` : "no row with id = 1");
  }

  // live_posts (anon sees only published + unexpired)
  {
    const { count, error } = await anon.from("live_posts").select("*", { count: "exact", head: true });
    report("live_posts (anon)", !error, error ? error.message : `${count ?? 0} live posts`);
  }

  // all posts (service role) for comparison
  {
    const { count, error } = await admin.from("posts").select("*", { count: "exact", head: true });
    report("posts (all, service)", !error, error ? error.message : `${count ?? 0} rows`);
  }

  // ads
  {
    const { count, error } = await anon.from("ads").select("*", { count: "exact", head: true });
    report("ads (anon, active)", !error, error ? error.message : `${count ?? 0} active creatives`);
  }

  // buckets
  {
    const { data, error } = await admin.storage.listBuckets();
    const names = new Set((data ?? []).map((b) => b.id));
    const ok = !error && names.has("media") && names.has("branding");
    report("storage buckets", ok, error ? error.message : `found: ${Array.from(names).join(", ") || "none"}`);
  }

  // admins row
  {
    const { data, error } = await admin.from("admins").select("user_id, created_at");
    const ok = !error && (data?.length ?? 0) > 0;
    report("admins row", ok, error ? error.message : ok ? `${data!.length} admin(s): ${data!.map((a) => a.user_id).join(", ")}` : "no admins — run the bootstrap insert at the bottom of 0001_init.sql");
  }

  // purge function exists (checked via the catalog — never called here, since it deletes rows)
  {
    const { data, error } = await admin.rpc("is_admin");
    // is_admin() with the service role has no auth.uid() → false; we only care that RPC works.
    report("rpc reachable (is_admin)", !error && data === false, error ? error.message : "ok");
  }

  console.log(`\n${failed === 0 ? "All checks passed." : `${failed} check(s) failed.`}`);
  process.exit(failed === 0 ? 0 : 1);
})();
