import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Password-recovery landing: Supabase redirects here with ?code=…; exchange
 * it for a session cookie, then continue to `next` (the account page).
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const nextParam = request.nextUrl.searchParams.get("next") ?? "/admin/account?reset=1";
  const next = nextParam.startsWith("/admin") && !nextParam.startsWith("//") ? nextParam : "/admin";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, request.url), { status: 303 });
  }
  return NextResponse.redirect(new URL("/admin/login?error=expired", request.url), { status: 303 });
}
