import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const LOGIN_PATH = "/admin/login";

/**
 * Refreshes the Supabase session cookie on every matched request and gates
 * /admin: unauthenticated visitors go to /admin/login (with ?next=), and a
 * signed-in user hitting /admin/login is sent to /admin.
 */
export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const { pathname, search } = request.nextUrl;
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
  const isLogin = pathname === LOGIN_PATH;

  // Without Supabase configured there is nothing to refresh; keep /admin closed.
  if (!url || !anonKey) {
    if (isAdminRoute && !isLogin) {
      return NextResponse.redirect(new URL(`${LOGIN_PATH}?next=${encodeURIComponent(pathname + search)}`, request.url));
    }
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // getUser() validates the JWT against Supabase (unlike getSession) and
  // refreshes the cookie when needed.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAdminRoute && !isLogin && !user) {
    const redirect = NextResponse.redirect(
      new URL(`${LOGIN_PATH}?next=${encodeURIComponent(pathname + search)}`, request.url),
    );
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  }

  if (isLogin && user) {
    const next = request.nextUrl.searchParams.get("next");
    const target = next && next.startsWith("/admin") && next !== LOGIN_PATH ? next : "/admin";
    const redirect = NextResponse.redirect(new URL(target, request.url));
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  }

  return response;
}

export const config = {
  matcher: [
    // Everything except Next internals, static assets and the ad creatives.
    "/((?!_next/static|_next/image|favicon.ico|ads/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|mp3)$).*)",
  ],
};
