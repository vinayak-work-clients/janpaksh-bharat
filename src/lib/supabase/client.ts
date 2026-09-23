"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/types";
import { supabaseEnv } from "@/lib/supabase/env";

/** Browser client (anon key). Safe to ship; RLS limits what it can see. */
export function createClient() {
  const { url, anonKey } = supabaseEnv();
  return createBrowserClient<Database>(url, anonKey);
}
