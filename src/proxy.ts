import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Protects the whole `/admin` tree (Next 16's `proxy`, formerly middleware).
 *
 * Two jobs:
 *   1. Refresh the Supabase auth cookies on every admin request.
 *   2. Require a session whose email matches ADMIN_EMAIL — otherwise redirect
 *      to the login screen (carrying a `next` path back).
 *
 * This is the first of three checks; Server Actions re-verify, and RLS is the
 * final gate. Proxy is not a substitute for either.
 */
export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Unconfigured (e.g. a fresh clone): let the pages render their own
  // "not configured" state instead of throwing here.
  if (!supabaseUrl || !supabaseKey) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const expected = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const isAdmin = Boolean(expected) && user?.email?.trim().toLowerCase() === expected;
  const { pathname, search } = request.nextUrl;
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    // Already signed in? Skip the form.
    if (isAdmin) return NextResponse.redirect(new URL("/admin", request.url));
    return response;
  }

  if (!isAdmin) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
