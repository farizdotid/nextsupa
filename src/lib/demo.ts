/**
 * Demo mode: try the app with dummy data, no Supabase project needed.
 * Turn on with NEXT_PUBLIC_DEMO_MODE=true in .env.local.
 *
 * SECURITY: the demo session is an unsigned cookie, anyone can forge it.
 * That is why demo mode is forced off in production builds.
 */
export const DEMO_COOKIE = "demo_session";

// Dummy account shown on the login page.
export const DEMO_USER = {
  email: "demo@nextsupa.dev",
  password: "password123",
} as const;

export function isDemoMode(): boolean {
  return (
    process.env.NEXT_PUBLIC_DEMO_MODE === "true" &&
    process.env.NODE_ENV !== "production"
  );
}
