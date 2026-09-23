import { cookies } from "next/headers";
import { createClient as createBareClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/types";
import { supabaseEnv } from "@/lib/supabase/env";

/**
 * Server client bound to the request's auth cookies (Server Components,
 * Route Handlers, Server Actions). Use for anything that depends on who is
 * signed in — the admin dashboard, for instance.
 */
export function createClient() {
  const { url, anonKey } = supabaseEnv();
  const cookieStore = cookies();
  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component: cookies are read-only there. The
          // middleware refreshes sessions, so this is safe to ignore.
        }
      },
    },
  });
}

/**
 * Anonymous, cookie-less client for public reads. It carries no session so it
 * can run inside `unstable_cache` (which forbids `cookies()`), and RLS limits
 * it to published, unexpired content exactly like a visitor.
 */
export function createPublicClient() {
  const { url, anonKey } = supabaseEnv();
  return createBareClient<Database>(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
