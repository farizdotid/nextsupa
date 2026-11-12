import Link from "next/link";

// Short list of what the starter kit ships with.
const features = [
  {
    title: "Supabase SSR auth",
    description:
      "Browser, server and proxy clients built on @supabase/ssr. Sessions refresh automatically.",
  },
  {
    title: "Protected routes",
    description:
      "/dashboard redirects guests to /login. Logged-in users skip the login page.",
  },
  {
    title: "Server Actions",
    description:
      "Login, signup and logout as plain Server Actions. No API routes to wire up.",
  },
  {
    title: "Typed database",
    description:
      "Generic Database type ready for supabase gen types. Autocomplete on every query.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4">
        <span className="font-semibold">NextSupa</span>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/login" className="hover:underline">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-md bg-foreground px-3 py-1.5 font-medium text-background hover:opacity-90"
          >
            Sign up
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 py-24 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Next.js + Supabase, ready to build
          </h1>
          <p className="max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
            A clean starter kit with auth, protected routes and typed data.
            Clone it, add your keys, ship your idea.
          </p>
          <div className="flex gap-3">
            <Link
              href="/signup"
              className="rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90"
            >
              Get started
            </Link>
            <Link
              href="/dashboard"
              className="rounded-md border border-zinc-300 px-5 py-2.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
            >
              Open dashboard
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto w-full max-w-5xl px-4 pb-24">
          <ul className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <li
                key={feature.title}
                className="rounded-lg border border-zinc-200 p-5 dark:border-zinc-800"
              >
                <h2 className="font-semibold">{feature.title}</h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-zinc-200 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800">
        Built with Next.js, Supabase and Tailwind CSS.
      </footer>
    </div>
  );
}
