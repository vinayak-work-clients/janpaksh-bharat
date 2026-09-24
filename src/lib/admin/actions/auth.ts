"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/site-url";
import { LOGIN_PATH, requireAdmin } from "@/lib/admin/auth";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

const credentials = z.object({
  email: z.string().trim().email("Enter your email address"),
  password: z.string().min(1, "Enter your password"),
  next: z.string().optional(),
});

function safeNext(next: string | undefined): string {
  if (!next) return "/admin";
  if (!next.startsWith("/admin") || next.startsWith("//") || next === LOGIN_PATH) return "/admin";
  return next;
}

export async function signIn(input: { email: string; password: string; next?: string }): Promise<ActionResult> {
  const parsed = credentials.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Check your details" };

  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error || !data.user) {
    return { ok: false, error: "Wrong email or password" };
  }

  // Only listed admins may enter; anyone else is signed straight back out.
  const { data: admin } = await supabase.from("admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!admin) {
    await supabase.auth.signOut();
    return { ok: false, error: "This account isn't an admin of Janpaksh Bharat." };
  }

  redirect(safeNext(parsed.data.next));
}

export async function signOut(): Promise<never> {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect(LOGIN_PATH);
}

export async function requestPasswordReset(email: string): Promise<ActionResult> {
  const parsed = z.string().trim().email().safeParse(email);
  if (!parsed.success) return { ok: false, error: "Enter your email address first" };
  const supabase = createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${SITE_URL}/admin/auth/callback?next=${encodeURIComponent("/admin/account?reset=1")}`,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

const passwordInput = z
  .object({
    password: z.string().min(8, "Use at least 8 characters"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "The two passwords don't match" });

export async function updatePassword(input: { password: string; confirm: string }): Promise<ActionResult> {
  const parsed = passwordInput.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Check the password" };
  const { supabase } = await requireAdmin();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
