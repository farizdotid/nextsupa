# NextSupa

English | [Bahasa Indonesia](README.id.md)

A **Next.js (App Router) + Supabase** starter kit. Includes SSR auth, route protection, Server Actions, and database types.

## Features

- Next.js 16 (App Router) + strict TypeScript + Tailwind CSS 4
- Supabase SSR auth with `@supabase/ssr` and `@supabase/supabase-js`
- Pages: landing (`/`), login, signup, dashboard
- Proxy (middleware) that refreshes the token and protects `/dashboard`
- Placeholder `Database` types

## Try it without Supabase (demo mode)

Want to see the app before you have a Supabase project? Use demo mode. Login and dashboard work with dummy data.

```bash
npm install
npm run dev
```

The default `.env.local` already contains `NEXT_PUBLIC_DEMO_MODE=true`. Open [http://localhost:3000/login](http://localhost:3000/login). The form is pre-filled with a dummy account:

| Email | Password |
| --- | --- |
| `demo@nextsupa.dev` | `password123` |

In demo mode:

- Login only accepts the dummy account above.
- `/signup` accepts any email, nothing is stored.
- The dashboard shows dummy stats, activity, and todos from `src/lib/demo-data.ts`.
- No requests go to Supabase.

**Turn demo mode off** once your real Supabase project is ready: set `NEXT_PUBLIC_DEMO_MODE=false` (or delete the line) in `.env.local`, then restart `npm run dev`. Env vars are read at server start, so a restart is required.

> **Security:** the demo session is a plain unsigned cookie, anyone can forge it. Because of that, demo mode is automatically disabled in production builds (`NODE_ENV=production`), whatever the value of `NEXT_PUBLIC_DEMO_MODE`. Do not use demo mode as a replacement for real auth.

## Quick start (with Supabase)

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

Create a project at [supabase.com/dashboard](https://supabase.com/dashboard), then copy the **Project URL** and **anon key** from Project Settings, API.

### 3. Set environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon (public) key. Safe in the browser because RLS protects your data |
| `NEXT_PUBLIC_SITE_URL` | URL of this site, used for email confirmation links. Local: `http://localhost:3000` |
| `NEXT_PUBLIC_DEMO_MODE` | Set to `false` to use real Supabase. See the demo mode section above |

Important: set `NEXT_PUBLIC_DEMO_MODE` to `false`, otherwise login keeps using the dummy account.

### 4. Set the redirect URL in Supabase

Go to Authentication, URL Configuration, and add to **Redirect URLs**:

```
http://localhost:3000/auth/callback
```

When you deploy, also add `https://your-domain.com/auth/callback`. Without it, email confirmation links cannot reach the app.

Optional for development: turn off **Confirm email** under Authentication, Providers, Email so signup logs in right away.

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up at `/signup`, then open `/dashboard`.

## Folder structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   ├── actions.ts     # Server Actions: login, signup, logout
│   │   │   └── page.tsx       # /login page
│   │   └── signup/page.tsx    # /signup page
│   ├── auth/callback/route.ts # Exchanges the ?code= from email for a session
│   ├── dashboard/page.tsx     # Protected page
│   ├── layout.tsx
│   └── page.tsx               # Landing page
├── lib/
│   ├── auth.ts                # getCurrentUser(): one place to check the user (demo or Supabase)
│   ├── demo.ts                # Demo mode flag + dummy account
│   ├── demo-data.ts           # Dummy dashboard data
│   ├── demo-session.ts        # Fake session cookie for demo mode
│   └── supabase/
│       ├── client.ts          # Client for Client Components
│       ├── server.ts          # Client for Server Components and Actions
│       └── middleware.ts      # updateSession: refresh token + route protection
├── proxy.ts                   # Next.js proxy entry, calls updateSession
└── types/database.types.ts    # Database types (placeholder)
```

## How auth works

1. The **proxy** (`src/proxy.ts`) runs on every request. It calls `updateSession`, which refreshes the token and rewrites the cookies.
2. Guests opening `/dashboard` are redirected to `/login`. Logged-in users opening `/login` or `/signup` are redirected to `/dashboard`.
3. The login, signup, and logout forms call **Server Actions** in `login/actions.ts`. No API routes.
4. Protected pages still check the user themselves with `getCurrentUser()` (`src/lib/auth.ts`), which calls `supabase.auth.getUser()`. The proxy is the first layer, not the only safeguard.

> Always use `getUser()` to check auth on the server, not `getSession()`. `getUser()` validates the token with Supabase, `getSession()` only reads the cookie.

## Using Supabase in your code

**Server Component, Server Action, Route Handler:**

```ts
import { createClient } from "@/lib/supabase/server";

const supabase = await createClient(); // async, because cookies() is async
const { data } = await supabase.from("todos").select("*");
```

**Client Component:**

```tsx
"use client";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
```

The `@/` alias points to the `src/` folder.

## Generate database types

`src/types/database.types.ts` is an empty placeholder. After you create tables, generate the real types:

```bash
npx supabase login
npx supabase gen types typescript --project-id <project-ref> > src/types/database.types.ts
```

`<project-ref>` is in your project URL: `https://<project-ref>.supabase.co`. After that, every query is autocompleted.

## Add protected routes

Only paths starting with `/dashboard` are protected for now. For other routes, change the condition in `src/lib/supabase/middleware.ts`:

```ts
if (!isLoggedIn && pathname.startsWith("/dashboard")) {
```

Switch to a list of prefixes if you need more than one, for example `["/dashboard", "/settings"].some((p) => pathname.startsWith(p))`.

## Next.js 16 notes

- `middleware.ts` was renamed to **`proxy.ts`** with a `proxy` function. Same behavior.
- `cacheComponents` is enabled in `next.config.ts`. Parts of a page that read cookies or `searchParams` must be wrapped in `<Suspense>`, as in the login and dashboard pages. Otherwise the build fails.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Run the build |
| `npm run lint` | ESLint |

## Deploy

Set the Supabase variables and `NEXT_PUBLIC_SITE_URL` on your hosting platform (for example Vercel). Set `NEXT_PUBLIC_SITE_URL` to your production domain, and register `<domain>/auth/callback` in the Supabase Redirect URLs. Demo mode is always off in production builds.

## License

[MIT](LICENSE). Free to use for personal, client, and commercial projects.
