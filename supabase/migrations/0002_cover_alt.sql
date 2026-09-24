-- =============================================================================
--  JANPAKSH BHARAT — Phase 5A: cover image alt text
--  Paste into the Supabase SQL Editor and run. Safe to re-run.
-- =============================================================================
alter table public.posts add column if not exists cover_alt text;

-- live_posts is `select *`; recreate so the new column is exposed.
create or replace view public.live_posts
with (security_invoker = true)
as
  select *
  from public.posts
  where status = 'published' and expires_at > now();

grant select on public.live_posts to anon, authenticated, service_role;
