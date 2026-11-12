import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database.types";
import { DEMO_COOKIE, isDemoMode } from "@/lib/demo";

/**
 * Runs on every matched request to:
 *  1. Refresh the Supabase auth token (and sync cookies).
 *  2. Redirect guests away from /dashboard to /login.
 *  3. Redirect logged-in users away from /login and /signup to /dashboard.
 *
 * In demo mode, step 1 is skipped and the fake cookie decides who is logged in.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  let isLoggedIn: boolean;

  if (isDemoMode()) {
    isLoggedIn = request.cookies.has(DEMO_COOKIE);
  } else {
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            // Update the request so later code sees the fresh cookies...
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            // ...and recreate the response so the browser receives them too.
            supabaseResponse = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // IMPORTANT: no code between createServerClient and getUser().
    // getUser() validates the token with Supabase (unlike getSession()).
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isLoggedIn = user !== null;
  }

  const { pathname } = request.nextUrl;

  // Guest visiting a protected route -> /login
  if (!isLoggedIn && pathname.startsWith("/dashboard")) {
    return redirectWithCookies(request, "/login", supabaseResponse);
  }

  // Logged-in user visiting /login or /signup -> /dashboard
  if (isLoggedIn && (pathname === "/login" || pathname === "/signup")) {
    return redirectWithCookies(request, "/dashboard", supabaseResponse);
  }

  return supabaseResponse;
}

/** Redirect while keeping any refreshed auth cookies on the response. */
function redirectWithCookies(
  request: NextRequest,
  path: string,
  source: NextResponse,
) {
  const url = request.nextUrl.clone();
  url.pathname = path;
  url.search = "";

  const redirect = NextResponse.redirect(url);
  source.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}
