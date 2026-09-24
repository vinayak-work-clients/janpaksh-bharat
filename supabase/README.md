# Supabase setup

The public site runs on mock data until `DATA_SOURCE=supabase` is set (Phase 6).
This folder holds the schema; the app talks to it through `src/lib/supabase/*`
and `src/lib/data/*`.

## 1. Environment

Copy `.env.example` to `.env.local` and fill in, from **Project Settings → API**:

| Key | Where |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` public key |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` key — server only, never shipped to the browser |
| `NEXT_PUBLIC_SITE_URL` | Public origin, e.g. `https://janpakshbharat.com` |
| `CRON_SECRET` | Any long random string; protects `/api/cron/purge` |
| `DATA_SOURCE` | `mock` (default) or `supabase` |

## 2. Run the migration

1. Create the admin user first under **Authentication → Users → Add user**
   (email + password). The migration's last statement looks it up by email.
2. Open **SQL Editor → New query**, paste the whole of
   `supabase/migrations/0001_init.sql`, and **Run**. It is idempotent, so
   re-running after an edit is safe.
3. Verify:
   - **Table Editor** shows `admins`, `posts`, `site_settings` (one row),
     `ads` (12 rows), `contact_messages`.
   - **Storage** shows two public buckets, `media` (50 MB limit) and
     `branding` (10 MB limit).
   - **Table Editor → admins** has one row whose `user_id` matches the
     Auth user. If it is empty, the email in the last statement did not match:
     edit it and run just that `insert` again.
4. From the repo: `npm run db:check` prints PASS/FAIL for each of those.
5. **Phase 5A:** run `supabase/migrations/0002_cover_alt.sql` the same way. It
   adds `posts.cover_alt` (cover image alt text from the dashboard). Until it
   is applied the dashboard still saves posts, but warns that alt text was
   not stored.

## 2b. Admin dashboard check (optional)

`npm run e2e:admin` drives the dashboard end to end with Playwright: sign in,
create a Photo post with a generated image, publish, edit, duplicate, delete
both and confirm the storage objects are gone. It needs `ADMIN_E2E_EMAIL` /
`ADMIN_E2E_PASSWORD` in `.env.local` pointing at a **confirmed Auth user that
is listed in `public.admins`**, and the app running (`E2E_BASE_URL`, default
`http://localhost:3100`). Without the credentials it skips.

## 3. Seed the mock content

```
npm run seed
```

Upserts the 36 mock posts by slug (created_at spread over the last 12 days,
so `expires_at` mirrors the mock dates) and the 12 placeholder ad creatives.
Re-run any time; it never duplicates.

## 4. The 30-day rule

- `posts.expires_at` is a generated column: `created_at + 30 days`.
- RLS and the `live_posts` view hide a post the moment it expires.
- `/api/cron/purge` deletes expired rows and their files from the `media`
  bucket, then sweeps orphaned files older than 31 days. `vercel.json`
  schedules it daily at 03:00 IST (21:30 UTC). Vercel sends
  `Authorization: Bearer $CRON_SECRET` automatically when the `CRON_SECRET`
  environment variable is set on the project. To run it by hand:

```
curl -H "Authorization: Bearer $CRON_SECRET" https://<site>/api/cron/purge
```

## 5. Security model

- Exactly one admin: the row in `public.admins`. `public.is_admin()` is the
  single check every write policy uses.
- The browser only ever holds the `anon` key; RLS limits it to published,
  unexpired posts, active ads and site settings.
- The service-role client (`src/lib/supabase/admin.ts`) is `server-only` and
  used by the contact API, the purge cron and the seed scripts.
