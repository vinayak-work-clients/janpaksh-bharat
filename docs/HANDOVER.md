# Janpaksh Bharat — Developer Handover

## Architecture

- **Next.js 14 (App Router), TypeScript, Tailwind.** Public site under
  `src/app/(site)`, dashboard under `src/app/admin`, API routes under
  `src/app/api`. Deployed on Vercel.
- **Supabase**: Postgres (posts, ads, site_settings, contact_messages,
  admins), Auth (one admin user), Storage (`media` for post files,
  `branding` for logos, hero poster and ad creatives).
- **Data layer** (`src/lib/data/*`): public reads go through
  `unstable_cache` with tags `posts`, `settings`, `ads` (60 s TTL). The
  dashboard's server actions call `revalidatePosts()` / `revalidateSettings()`
  / `revalidateAds()` plus `revalidatePath("/", "layout")`, so edits reach the
  site immediately. `DATA_SOURCE=mock` swaps in `src/data/mock-posts.ts`.
- **Settings**: `site_settings` row → `mergeSettings()` over
  `src/config/site.ts` (nulls fall back to code). Server components call
  `getSiteSettings()`; client components use `useSiteSettings()` from the
  provider mounted in the (site) layout.
- **Admin**: `requireAdmin()` (`src/lib/admin/auth.ts`) guards every page and
  server action; the middleware refreshes the Supabase session cookie and
  gates `/admin`. Writes use the user's session client so RLS applies.
  Uploads go browser-direct to Storage (`MediaUploader` → `upload-client.ts`).
- **Rendering**: public pages `revalidate = 60` (`/breaking` 30). `/news/[slug]`
  and `/section/[slug]` are prerendered at build with `dynamicParams` for new
  slugs. OG images are `ImageResponse` routes on the Node runtime that read
  `public/fonts/*.ttf` from disk (traced into the bundle via
  `outputFileTracingIncludes`); the edge runtime cannot fetch bundled files
  under `next start`, so it could never be verified locally.
- **Brand icons**: `scripts/make-brand-icons.mjs` builds `src/app/icon.svg`,
  `icon.png`, `apple-icon.png` and `public/site.webmanifest` from
  `public/brand/logo.(svg|png)`, or the placeholder saffron "ज" mark when
  no logo file exists.

## Environment variables

See `README.md` for the table. Production needs: `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
`NEXT_PUBLIC_SITE_URL`, `CRON_SECRET`; optional `RESEND_API_KEY`,
`CONTACT_FROM_EMAIL`, `CONTACT_NOTIFY_EMAIL`.

## Supabase

Schema and policies: `supabase/migrations/0001_init.sql` (idempotent) and
`0002_cover_alt.sql` (adds `posts.cover_alt`; the dashboard works without it
but warns). Run them in the SQL Editor; details in `supabase/README.md`.

| Table | Public (anon) | Admin |
| --- | --- | --- |
| `posts` | select via `live_posts` view: `status = 'published' and expires_at > now()` | all |
| `site_settings` | select | update (id = 1 only) |
| `ads` | select where enabled and inside the date window | all |
| `contact_messages` | none (API route inserts with the service role) | select, update, delete |
| `admins` | none | own row |

`public.is_admin()` is the single check every write policy uses. Storage
policies: public read on both buckets; insert/update/delete require
`is_admin()`.

Auth: one user in `public.admins`. Configure in the Supabase dashboard:
**Authentication → URL Configuration → Site URL** = production origin,
**Redirect URLs** must include `https://<domain>/admin/auth/callback`
(password reset lands there).

## The purge job

`posts.expires_at` is generated (`created_at + 30 days`). RLS and the view
hide expired rows instantly. `/api/cron/purge` (GET or POST with
`Authorization: Bearer $CRON_SECRET`) calls `purge_expired_posts()`, deletes
the returned storage paths, then sweeps `media` for orphans older than 31
days. `vercel.json` schedules it at 21:30 UTC (03:00 IST). The dashboard's
"Run cleanup now" button posts to the same route server-side.

## Running the checks

```
npm run lint && npm run build
npm run test:feed                 # front-page arrangement fixtures
npm run build && npm run start -- -p 3100   # production server for the E2E
npm run e2e:admin                 # posts editor round trip
npm run e2e:admin-b               # ads, messages, settings
npm run e2e:live                  # dashboard → public site round trip
node scripts/make-brand-icons.mjs # regenerate icons from public/brand/logo.(svg|png)
```

E2E needs `ADMIN_E2E_EMAIL` / `ADMIN_E2E_PASSWORD` for an Auth user listed in
`public.admins`. If the password is wrong the scripts fall back to a
service-role magic link and say so.

## Adding a section

Append to `sections` in `src/config/sections.ts` (slug, name, nameHindi,
kind, description). The section bar, footer, mobile menu, section page,
sitemap, editor dropdown and the `posts.section` validation all read that
list. To show it on the front page's "Closer to home" block, add the slug to
`REGION_COLUMNS` in `src/app/(site)/page.tsx`.

## Adding an ad slot

1. Add the key to `AdSlotKey` and an entry in `adSlots` in
   `src/config/ads.ts` (label, size, optional tablet/mobile sizes, `where`).
2. Render `<AdSlot slot="…" />` where it should appear (server component).
3. The dashboard picks it up automatically (grouped by the key prefix:
   home, section, article, listing, podcast). Add a placeholder to
   `scripts/make-ad-placeholders.mjs` and `scripts/seed.ts` if wanted.

## Security notes

- Headers (HSTS, nosniff, referrer policy, permissions policy, frame
  options, CSP **report-only**) are in `next.config.mjs`. Tighten the CSP to
  enforcing once production reports are clean.
- Login: 5 attempts / 10 min per IP (in-memory). Contact form: 5 / min per
  IP, honeypot, 16 KB cap. Both limiters are per serverless instance; use
  Upstash/KV for a global limit if abuse appears.
- The service-role key is only used in `server-only` modules.

## Performance notes

Lighthouse (mobile, simulated 3G): articles and sections score in the high
80s for Performance; the front page sits around 70 because its largest paint
is the hero deck's centre-card image on a 1.6 Mbps link that is shared with
~250 KB of JS and the fonts. All pages score 100 for Accessibility, Best
Practices and SEO.

Fonts (`src/app/layout.tsx`): Inter (one variable file, preloaded), Fraunces
static 400/700 upright + 400 italic (`.font-serif.italic` maps to the italic
family in `globals.css`; not preloaded, italic is `font-display: optional` so
a late swap never shifts the hero deck), Noto Serif Devanagari 400 (Hindi
copy, not preloaded) and 700 (headline + lockup, preloaded,
`font-display: optional`; its size-adjusted fallback measured identical, so
a slow first visit shows the fallback instead of swapping late). The "₹"
glyph pulls each family's latin-ext chunk on demand; that is expected.

Remaining front-page levers: fewer JS bytes above the fold (framer-motion in
the hero and deck) or a lighter hero image treatment.

## Known limitations

- Team, services, FAQ, legal text, nav/legal links and the About copy are in
  code (`src/data/*`, `src/config/site.ts`), not dashboard-editable.
- One admin account; no roles or audit log.
- No search (the header button is a placeholder).
- Rate limiters are per instance; the purge sweep only covers the `media`
  bucket (dashboard actions remove `branding` files themselves).
- Realtime is not used; the site updates via ISR + tag revalidation.
