import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { DEMO_COOKIE, isDemoMode } from "@/lib/demo";

export type CurrentUser = { email: string };

/**
 * One place to ask "who is logged in?".
 * Demo mode reads the fake cookie; otherwise it asks Supabase.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (isDemoMode()) {
    const cookieStore = await cookies();
    const email = cookieStore.get(DEMO_COOKIE)?.value;
    return email ? { email } : null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user?.email ? { email: user.email } : null;
}
