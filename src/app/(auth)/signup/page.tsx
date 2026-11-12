import Link from "next/link";
import { Suspense } from "react";
import { signup } from "../login/actions";

// Shows `?error=` / `?message=` set by the signup action.
// Own component + <Suspense>: searchParams is dynamic (cacheComponents).
async function Feedback({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;

  if (error) {
    return (
      <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
        {error}
      </p>
    );
  }
  if (message) {
    return (
      <p role="status" className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
        {message}
      </p>
    );
  }
  return null;
}

export default function SignupPage({ searchParams }: PageProps<"/signup">) {
  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <form action={signup} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Create account</h1>

        <Suspense>
          <Feedback
            searchParams={searchParams as Promise<{ error?: string; message?: string }>}
          />
        </Suspense>

        <label className="block space-y-1 text-sm">
          <span>Email</span>
          <input
            name="email"
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
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          Sign up
        </button>

        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium underline">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
