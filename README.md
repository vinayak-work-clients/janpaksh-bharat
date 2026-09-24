# Janpaksh Bharat

Independent Indian newsroom site: a public Next.js 14 front end driven by a
Supabase database, plus a dashboard at `/admin` where the client publishes
posts, manages ad creatives, reads contact messages and edits site settings.
Every post is live for 30 days from upload and is then archived and purged.

## Run it locally

```bash
npm install
cp .env.example .env.local   # fill in the Supabase keys (see below)
npm run dev                  # http://localhost:3000
```

`DATA_SOURCE` defaults to `supabase`. Set `DATA_SOURCE=mock` in `.env.local`
to run the public site from the bundled sample posts (`src/data/*`) with no
database at all; the dashboard always needs Supabase.

The database schema, storage buckets, seed and E2E checks are documented in
[`supabase/README.md`](supabase/README.md).

## Environment variables

| Variable | Required | Where it is used |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL (browser and server) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Public anon key; RLS limits it to published content |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | Server only: contact form insert, purge cron, storage totals, seed |
| `NEXT_PUBLIC_SITE_URL` | yes | Public origin for sitemap, robots, OG URLs and the contact email link |
| `CRON_SECRET` | yes | Bearer token that protects `/api/cron/purge` (Vercel sends it automatically) |
| `DATA_SOURCE` | no | `supabase` (default) or `mock` |
| `RESEND_API_KEY` | no | Emails the desk on every contact-form message; skipped when unset |
| `CONTACT_FROM_EMAIL` | no | Sender for that email, e.g. `Janpaksh Bharat <noreply@yourdomain>` (domain verified in Resend) |
| `CONTACT_NOTIFY_EMAIL` | no | Recipient; defaults to the contact email set in the dashboard |
| `ADMIN_E2E_EMAIL` / `ADMIN_E2E_PASSWORD` | dev only | Credentials for the Playwright E2E scripts |
| `E2E_BASE_URL` | dev only | Where the E2E scripts find the app (default `http://localhost:3100`) |

Production (Vercel) needs the five required variables plus, if email
notifications are wanted, the three `RESEND_*`/`CONTACT_*` ones.

## How the public site gets its data

- **Posts** come from the `live_posts` view (published and not yet expired)
  through `src/lib/data/posts.ts`. Reads are cached for 60 seconds under the
  `posts` tag; the dashboard calls `revalidatePosts()` and revalidates the
  root layout on every publish, edit and delete, so changes show at once.
- **Settings** come from the single `site_settings` row through
  `src/lib/data/settings.ts`, merged over `src/config/site.ts` so any null
  column falls back to the code default. Server components call
  `getSiteSettings()`; client components read `useSiteSettings()` from the
  provider mounted in `src/app/(site)/layout.tsx`.
- **Ads** come from the `ads` table. `AdSlot` renders nothing when the
  global "Ads enabled" switch is off or the slot has no active creative.
- Pages revalidate every 60 seconds (`/breaking` every 30). Article and
  section routes are pre-rendered at build time and render new slugs on
  first request.

### Not editable from the dashboard

These stay in code for this version: the navigation and legal link lists
(`src/config/site.ts`), the About page mission, story, values and stats
(`src/config/site.ts`), the team (`src/data/team.ts`), services
(`src/data/services.ts`), FAQ (`src/data/faq.ts`) and the privacy/terms
text (`src/data/legal.ts`). The news sections list is `src/config/sections.ts`
and the ad slot definitions are `src/config/ads.ts`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js |
| `npm run lint` | ESLint |
| `npm run db:check` | PASS/FAIL for the tables, buckets and admin row |
| `npm run seed` | Upserts the 36 sample posts and 12 placeholder creatives (never duplicates) |
| `npm run seed -- --wipe` | Deletes **every** post, its media files and every ad creative first, then seeds |
| `npm run seed -- --wipe-only` | Same wipe, seeds nothing: the clean slate for launch |
| `npm run test:feed` | Front-page arrangement with 0, 1, 3, 6 and 36 posts |
| `npm run e2e:admin` | Playwright: posts editor round trip (Phase 5A) |
| `npm run e2e:admin-b` | Playwright: ads, messages and settings (Phase 5B) |
| `npm run e2e:live` | Playwright: dashboard changes appear on the public site (Phase 6) |

The E2E scripts need the app running at `E2E_BASE_URL` and an Auth user that
is listed in `public.admins`.
