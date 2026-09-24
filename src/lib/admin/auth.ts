import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export const LOGIN_PATH = "/admin/login";

export interface AdminSession {
  supabase: ReturnType<typeof createClient>;
  user: User;
}

/**
 * Current admin, or null. Signed-in users who are not in `admins` are not
 * admins; the caller decides what to do with them.
 */
export const getAdminSession = cache(async (): Promise<AdminSession | { supabase: ReturnType<typeof createClient>; user: null; forbidden: boolean }> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, forbidden: false };

  const { data: row } = await supabase.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!row) return { supabase, user: null, forbidden: true };
  return { supabase, user };
});

/**
 * Guard for every admin page and server action. Returns the user-session
 * client (RLS applies to every write) and the user. Anonymous visitors go to
 * the login page; signed-in non-admins are signed out via /admin/logout so
 * the middleware cannot bounce them straight back to /admin.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (session.user) return session as AdminSession;
  if (session.forbidden) redirect("/admin/logout?reason=forbidden");
  redirect(LOGIN_PATH);
}
