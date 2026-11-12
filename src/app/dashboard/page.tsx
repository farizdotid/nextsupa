import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { isDemoMode } from "@/lib/demo";
import { demoActivity, demoStats, demoTodos } from "@/lib/demo-data";
import { logout } from "../(auth)/login/actions";

// Reads cookies (dynamic), so it lives inside <Suspense> in the page below.
async function UserInfo() {
  const user = await getCurrentUser();

  // Second line of defense: the proxy already redirects guests.
  if (!user) redirect("/login");

  return (
    <p className="text-sm text-zinc-600 dark:text-zinc-400">
      Signed in as <span className="font-medium">{user.email}</span>
    </p>
  );
}

// Dummy widgets, only rendered in demo mode.
function DemoContent() {
  return (
    <>
      <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950 dark:text-amber-300">
        Demo mode: all data below is dummy.
      </p>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {demoStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
          >
            <p className="text-xs text-zinc-500">{stat.label}</p>
            <p className="mt-1 text-xl font-semibold">{stat.value}</p>
            <p className="text-xs text-zinc-500">{stat.change}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-6 sm:grid-cols-2">
        <section>
          <h2 className="mb-2 font-semibold">Recent activity</h2>
          <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {demoActivity.map((item) => (
              <li key={item.id} className="flex justify-between gap-2 px-4 py-3 text-sm">
                <span>
                  <span className="font-medium">{item.user}</span>{" "}
                  <span className="text-zinc-600 dark:text-zinc-400">{item.action}</span>
                </span>
                <span className="shrink-0 text-xs text-zinc-500">{item.time}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">Todo</h2>
          <ul className="divide-y divide-zinc-200 rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {demoTodos.map((todo) => (
              <li key={todo.id} className="flex items-center gap-2 px-4 py-3 text-sm">
                <input type="checkbox" checked={todo.done} readOnly aria-label={todo.title} />
                <span className={todo.done ? "line-through text-zinc-500" : ""}>
                  {todo.title}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}

export default function DashboardPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-16">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <Suspense fallback={<p className="text-sm text-zinc-500">Loading...</p>}>
        <UserInfo />
      </Suspense>

      {isDemoMode() && <DemoContent />}

      <form action={logout}>
        <button
          type="submit"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          Sign out
        </button>
      </form>
    </main>
  );
}
