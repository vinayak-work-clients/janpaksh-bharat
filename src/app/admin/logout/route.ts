import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Signs the current session out and lands on the login page. requireAdmin()
 * sends signed-in non-admins here (a redirect straight to /admin/login would
 * be bounced back to /admin by the middleware).
 */
export async function GET(request: NextRequest) {
  const supabase = createClient();
  await supabase.auth.signOut();
  const reason = request.nextUrl.searchParams.get("reason");
  const url = new URL("/admin/login", request.url);
  if (reason) url.searchParams.set("error", reason);
  return NextResponse.redirect(url, { status: 303 });
}
