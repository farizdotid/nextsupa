import Link from "next/link";
import { Suspense } from "react";
import { DEMO_USER, isDemoMode } from "@/lib/demo";
import { login } from "./actions";

// Reads `?error=` set by the login action.
// Isolated in its own component + <Suspense> because reading searchParams
// is dynamic; this keeps the rest of the page static (cacheComponents).
async function ErrorMessage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  if (!error) return null;

  return (
    <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
      {error}
    </p>
  );
}

export default function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <form action={login} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Login</h1>

        {isDemoMode() && (
          <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            Demo mode. Use <code>{DEMO_USER.email}</code> / <code>{DEMO_USER.password}</code>
          </p>
        )}

        <Suspense>
          <ErrorMessage searchParams={searchParams as Promise<{ error?: string }>} />
        </Suspense>

        <label className="block space-y-1 text-sm">
          <span>Email</span>
          <input
            name="email"
            defaultValue={isDemoMode() ? DEMO_USER.email : undefined}
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"
          />
        </label>

        <label className="block space-y-1 text-sm">
          <span>Password</span>
          <input
            name="password"
            defaultValue={isDemoMode() ? DEMO_USER.password : undefined}
            type="password"
            required
            autoComplete="current-password"
            className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          Sign in
        </button>

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          No account yet?{" "}
          <Link href="/signup" className="font-medium underline">
            Sign up
          </Link>
        </p>
      </form>
    </main>
  );
}
