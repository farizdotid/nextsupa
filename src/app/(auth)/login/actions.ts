"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DEMO_USER, isDemoMode } from "@/lib/demo";
import { clearDemoSession, setDemoSession } from "@/lib/demo-session";

/** Sign in with email + password, then go to the dashboard. */
export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (isDemoMode()) {
    // Demo: only the dummy account works.
    if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
      redirect(`/login?error=${encodeURIComponent("Invalid login credentials")}`);
    }
    await setDemoSession(email);
  } else {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // Simple error handling: send the message back via query string.
      redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }
  }

  // Refresh cached layouts so they see the new session.
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

/** Create an account with email + password. */
export async function signup(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (isDemoMode()) {
    // Demo: any email works, nothing is stored.
    await setDemoSession(email);
    revalidatePath("/", "layout");
    redirect("/dashboard");
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Where the confirmation email link sends the user (see auth/callback).
      // Add this URL to Supabase Dashboard > Authentication > URL Configuration.
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  // Email confirmation OFF: a session exists right away -> go to dashboard.
  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/dashboard");
  }

  // Email confirmation ON: user must click the link in their inbox first.
  redirect("/signup?message=Check your email to confirm your account");
}

/** Sign out, clear the session cookies, then go back to /login. */
export async function logout() {
  if (isDemoMode()) {
    await clearDemoSession();
  } else {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  revalidatePath("/", "layout");
  redirect("/login");
}
