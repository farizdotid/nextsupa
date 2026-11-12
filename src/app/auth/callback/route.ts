import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Email confirmation landing route.
 * Supabase appends `?code=...`; we swap it for a session cookie.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}/dashboard`);
  }

  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent("Confirmation link is invalid or expired")}`,
  );
}
