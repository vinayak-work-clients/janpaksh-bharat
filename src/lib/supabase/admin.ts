import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

/**
 * Service-role client. Bypasses RLS — server only, never in a Client
 * Component or anything that ends up in the browser bundle.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) {
    throw new Error("Supabase admin client: NEXT_PUBLIC_SUPABASE_URL is not set");
  }
  if (!serviceKey) {
    throw new Error(
      "Supabase admin client: SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local (server only — never expose it to the browser).",
    );
  }
  return createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
