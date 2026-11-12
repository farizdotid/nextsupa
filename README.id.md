# NextSupa

[English](README.md) | Bahasa Indonesia

Starter kit **Next.js (App Router) + Supabase**. Sudah termasuk auth SSR, proteksi route, Server Actions, dan tipe database.

## Isi

- Next.js 16 (App Router) + TypeScript strict + Tailwind CSS 4
- Auth Supabase SSR dengan `@supabase/ssr` dan `@supabase/supabase-js`
- Halaman: landing (`/`), login, signup, dashboard
- Proxy (middleware) yang me-refresh token dan memproteksi `/dashboard`
- Placeholder tipe `Database`

## Coba dulu tanpa Supabase (mode demo)

Mau lihat aplikasinya dulu sebelum punya project Supabase? Pakai mode demo. Login dan dashboard jalan dengan data dummy.

```bash
npm install
npm run dev
```

`.env.local` bawaan sudah berisi `NEXT_PUBLIC_DEMO_MODE=true`. Buka [http://localhost:3000/login](http://localhost:3000/login), form sudah terisi akun dummy:

| Email | Password |
| --- | --- |
| `demo@nextsupa.dev` | `password123` |

Yang berlaku di mode demo:

- Login hanya menerima akun dummy di atas.
- `/signup` menerima email apa saja, tidak ada yang disimpan.
- Dashboard menampilkan statistik, aktivitas, dan todo dummy dari `src/lib/demo-data.ts`.
- Tidak ada request ke Supabase.

**Matikan mode demo** saat Supabase asli sudah siap: ubah `NEXT_PUBLIC_DEMO_MODE=false` (atau hapus barisnya) di `.env.local`, lalu restart `npm run dev`. Env var dibaca saat server start, jadi restart wajib.

> **Keamanan:** sesi demo hanya cookie biasa yang tidak ditandatangani, siapa pun bisa memalsukannya. Karena itu mode demo otomatis mati di build produksi (`NODE_ENV=production`), apa pun nilai `NEXT_PUBLIC_DEMO_MODE`. Jangan jadikan mode demo pengganti auth asli.

## Mulai cepat (dengan Supabase)

### 1. Install dependency

```bash
npm install
```

### 2. Buat project Supabase

Buat project di [supabase.com/dashboard](https://supabase.com/dashboard), lalu salin **Project URL** dan **anon key** dari Project Settings, API.

### 3. Isi environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

| Variabel | Fungsi |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon (public) key. Aman di browser karena dilindungi RLS |
| `NEXT_PUBLIC_SITE_URL` | URL situs ini, dipakai untuk link konfirmasi email. Lokal: `http://localhost:3000` |
| `NEXT_PUBLIC_DEMO_MODE` | Set `false` agar memakai Supabase asli. Lihat bagian mode demo di atas |

Penting: ubah `NEXT_PUBLIC_DEMO_MODE` ke `false`, kalau tidak login tetap memakai akun dummy.

### 4. Atur Redirect URL di Supabase

Buka Authentication, URL Configuration, lalu tambahkan ke **Redirect URLs**:

```
http://localhost:3000/auth/callback
```

Saat deploy, tambahkan juga `https://domain-kamu.com/auth/callback`. Tanpa ini, link konfirmasi email tidak bisa masuk ke aplikasi.

Opsional untuk development: matikan **Confirm email** di Authentication, Providers, Email supaya signup langsung login.

### 5. Jalankan

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Coba daftar di `/signup`, lalu buka `/dashboard`.

## Struktur folder

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   ├── actions.ts     # Server Actions: login, signup, logout
│   │   │   └── page.tsx       # Halaman /login
│   │   └── signup/page.tsx    # Halaman /signup
│   ├── auth/callback/route.ts # Tukar ?code= dari email jadi session
│   ├── dashboard/page.tsx     # Halaman terproteksi
│   ├── layout.tsx
│   └── page.tsx               # Landing page
├── lib/
│   ├── auth.ts                # getCurrentUser(): satu pintu cek user (demo atau Supabase)
│   ├── demo.ts                # Flag mode demo + akun dummy
│   ├── demo-data.ts           # Data dummy dashboard
│   ├── demo-session.ts        # Cookie sesi palsu untuk mode demo
│   └── supabase/
│       ├── client.ts          # Client untuk Client Components
│       ├── server.ts          # Client untuk Server Components dan Actions
│       └── middleware.ts      # updateSession: refresh token + proteksi route
├── proxy.ts                   # Entry proxy Next.js, memanggil updateSession
└── types/database.types.ts    # Tipe Database (placeholder)
```

## Cara kerja auth

1. **Proxy** (`src/proxy.ts`) berjalan di setiap request. Ia memanggil `updateSession` yang me-refresh token dan menulis ulang cookie.
2. Guest yang membuka `/dashboard` diarahkan ke `/login`. User yang sudah login dan membuka `/login` atau `/signup` diarahkan ke `/dashboard`.
3. Form login, signup, dan logout memanggil **Server Actions** di `login/actions.ts`. Tidak ada API route.
4. Halaman terproteksi tetap mengecek user sendiri lewat `getCurrentUser()` (`src/lib/auth.ts`), yang memanggil `supabase.auth.getUser()`. Proxy hanya lapisan pertama, bukan satu-satunya pengaman.

> Selalu pakai `getUser()` untuk cek auth di server, bukan `getSession()`. `getUser()` memvalidasi token ke Supabase, `getSession()` hanya membaca cookie.

## Memakai Supabase di kode kamu

**Server Component, Server Action, Route Handler:**

```ts
import { createClient } from "@/lib/supabase/server";

const supabase = await createClient(); // async, karena cookies() async
const { data } = await supabase.from("todos").select("*");
```

**Client Component:**

```tsx
"use client";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
```

Alias `@/` menunjuk ke folder `src/`.

## Generate tipe database

`src/types/database.types.ts` masih placeholder kosong. Setelah membuat tabel, generate tipe asli:

```bash
npx supabase login
npx supabase gen types typescript --project-id <project-ref> > src/types/database.types.ts
```

`<project-ref>` ada di URL project: `https://<project-ref>.supabase.co`. Setelah itu semua query ter-autocomplete.

## Menambah route terproteksi

Proteksi saat ini hanya untuk path yang diawali `/dashboard`. Untuk route lain, ubah kondisi di `src/lib/supabase/middleware.ts`:

```ts
if (!isLoggedIn && pathname.startsWith("/dashboard")) {
```

Ganti jadi daftar prefix jika butuh lebih dari satu, misalnya `["/dashboard", "/settings"].some((p) => pathname.startsWith(p))`.

## Catatan Next.js 16

- `middleware.ts` diganti nama menjadi **`proxy.ts`** dengan fungsi `proxy`. Perilakunya sama.
- `cacheComponents` aktif di `next.config.ts`. Bagian halaman yang membaca cookie atau `searchParams` harus dibungkus `<Suspense>`, seperti di halaman login dan dashboard. Kalau tidak, build gagal.

## Script

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Build produksi |
| `npm run start` | Jalankan hasil build |
| `npm run lint` | ESLint |

## Deploy

Set variabel Supabase dan `NEXT_PUBLIC_SITE_URL` di platform hosting (misalnya Vercel). Isi `NEXT_PUBLIC_SITE_URL` dengan domain produksi, dan daftarkan `<domain>/auth/callback` di Redirect URLs Supabase. Mode demo selalu mati di build produksi.

## Lisensi

[MIT](LICENSE). Bebas dipakai untuk project pribadi, klien, maupun komersial.
