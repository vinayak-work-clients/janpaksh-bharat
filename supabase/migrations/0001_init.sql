-- =============================================================================
--  JANPAKSH BHARAT — Phase 4: initial schema
--  Paste into the Supabase SQL Editor and run. Safe to re-run (idempotent).
-- =============================================================================

-- ---------------------------------------------------------------- extensions
create extension if not exists pgcrypto;

-- --------------------------------------------------------------------- enums
do $$ begin
  create type public.post_type as enum ('image', 'blog', 'video', 'podcast', 'breaking');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.post_status as enum ('draft', 'published');
exception when duplicate_object then null; end $$;

-- ------------------------------------------------------------------- helpers
-- Generic updated_at maintenance.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- -------------------------------------------------------------------- admins
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- True when the calling user is listed in public.admins.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated, service_role;

-- --------------------------------------------------------------------- posts
create table if not exists public.posts (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  type             public.post_type not null,
  status           public.post_status not null default 'published',

  section          text not null default 'national',   -- slug from src/config/sections.ts
  category         text not null,                      -- finer topical label ("Environment")
  tags             text[] not null default '{}',

  title            text not null,
  title_hindi      text,
  standfirst       text,
  excerpt          text not null,
  body             jsonb not null default '[]'::jsonb, -- Block[] (src/types/content.ts)

  cover_image_url  text not null,
  cover_image_path text,                               -- path in 'media' bucket; null for external URLs
  media_url        text,
  media_path       text,
  embed_url        text,
  duration_sec     int,

  author_name      text not null default 'Janpaksh Bharat',
  author_avatar_url text,

  featured         boolean not null default false,
  is_breaking      boolean not null default false,
  read_time_min    int,

  published_at     timestamptz not null default now(),
  created_at       timestamptz not null default now(), -- upload time
  -- THE 30-DAY RULE: a post is live for 30 days from upload, then hidden and purged.
  -- (UTC arithmetic: timestamptz + interval is only STABLE, but timestamp +
  --  interval is IMMUTABLE, which a generated column requires.)
  expires_at       timestamptz generated always as
                     (((created_at at time zone 'utc') + interval '30 days') at time zone 'utc') stored,
  updated_at       timestamptz default now(),
  created_by       uuid references auth.users (id)
);

create index if not exists posts_status_expires_idx on public.posts (status, expires_at);
create index if not exists posts_section_idx        on public.posts (section);
create index if not exists posts_type_idx           on public.posts (type);
create index if not exists posts_published_at_idx   on public.posts (published_at desc);
create index if not exists posts_breaking_idx       on public.posts (is_breaking) where is_breaking;
create index if not exists posts_tags_idx           on public.posts using gin (tags);

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------- site_settings
-- Single row (id = 1). Null columns fall back to src/config/site.ts in the app.
create table if not exists public.site_settings (
  id                   int primary key default 1 check (id = 1),

  site_name            text,
  site_name_hindi      text,
  tagline              text,
  tagline_en           text,
  description          text,

  contact_name         text,
  contact_role         text,
  contact_email        text,
  contact_phone        text,
  location             text,

  whatsapp_url         text,
  instagram_url        text,
  youtube_url          text,
  x_url                text,
  facebook_url         text,

  cta_primary_label    text,
  cta_primary_href     text,
  cta_secondary_label  text,
  cta_secondary_href   text,
  whatsapp_cta_label   text,

  hero_kicker          text,
  hero_background      text check (hero_background in ('wash', 'solid')) default 'wash',
  hero_poster_url      text,
  hero_poster_path     text,

  logo_url             text,
  logo_path            text,
  logo_dark_url        text,
  logo_dark_path       text,

  podcast_name         text,
  podcast_name_hindi   text,
  podcast_blurb        text,
  listen_spotify       text,
  listen_apple         text,
  listen_youtube       text,

  ticker_enabled       boolean not null default true,
  ads_enabled          boolean not null default true,
  archive_notice       text default 'Content auto-archives after 30 days',

  updated_at           timestamptz default now()
);

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- Seed from the current src/config/site.ts literals.
insert into public.site_settings (
  id, site_name, site_name_hindi, tagline, tagline_en, description,
  contact_name, contact_role, contact_email, contact_phone, location,
  whatsapp_url, instagram_url, youtube_url, x_url, facebook_url,
  cta_primary_label, cta_primary_href, cta_secondary_label, cta_secondary_href, whatsapp_cta_label,
  hero_kicker, hero_background, hero_poster_url,
  podcast_name, podcast_name_hindi, podcast_blurb, listen_spotify, listen_apple, listen_youtube,
  ticker_enabled, ads_enabled, archive_notice
) values (
  1,
  'Janpaksh Bharat',
  'जनपक्ष भारत',
  'सुर्खियों से आगे, सच के भीतर',
  'Beyond the headlines, inside the truth.',
  'Janpaksh Bharat is an independent Indian newsroom covering current affairs, politics and society through fearless ground reporting, blogs, video and podcasts.',
  'Gaurav Sharma', 'CEO, Janpaksh Bharat', 'gauravji0440@gmail.com', '+91 94120 13624', 'Uttarakhand, India',
  '#', '#', '#', '#', '#',
  'Know More', '/about', 'Get Connected', '#whatsapp', 'Join the Conversation',
  'Independent · Current Affairs · Bharat', 'wash',
  'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=2400&q=80',
  'Janpaksh Sunvai', 'जनपक्ष सुनवाई',
  'Long conversations with the people inside the story — ministers, farmers, founders and the reporters who cover them. New episodes every week.',
  '#', '#', '#',
  true, true, 'Content auto-archives after 30 days'
)
on conflict (id) do nothing;

-- ----------------------------------------------------------------------- ads
-- One row per creative. A slot may hold several rows; the app rotates by weight.
create table if not exists public.ads (
  id           uuid primary key default gen_random_uuid(),
  slot_key     text not null,          -- key in src/config/ads.ts (not enforced in SQL)
  sponsor_name text not null,
  image_url    text not null,
  image_path   text,                   -- path in 'branding' bucket under ads/; null for static files
  href         text not null,
  alt          text,
  enabled      boolean not null default true,
  starts_at    timestamptz,
  ends_at      timestamptz,
  weight       int not null default 1 check (weight > 0),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz default now(),
  -- One creative per sponsor per slot; lets the seed script upsert safely.
  unique (slot_key, sponsor_name)
);

create index if not exists ads_slot_enabled_idx on public.ads (slot_key, enabled);

drop trigger if exists ads_set_updated_at on public.ads;
create trigger ads_set_updated_at
  before update on public.ads
  for each row execute function public.set_updated_at();

-- Seed: the dummy creatives from src/config/ads.ts (desktop size per slot).
insert into public.ads (slot_key, sponsor_name, image_url, href, alt) values
  ('home.belowHero',         'Himalaya Organics',  '/ads/billboard-a.svg',   'https://example.com/himalaya-organics',  'Himalaya Organics — Seasonal Harvest (advertisement)'),
  ('home.midMosaic',         'Ganga Tours',        '/ads/leaderboard-b.svg', 'https://example.com/ganga-tours',        'Ganga Tours — Char Dham 2026 (advertisement)'),
  ('home.beforeListen',      'Himalaya Organics',  '/ads/leaderboard-a.svg', 'https://example.com/himalaya-organics',  'Himalaya Organics — Seasonal Harvest (advertisement)'),
  ('section.topLeaderboard', 'Ganga Tours',        '/ads/leaderboard-b.svg', 'https://example.com/ganga-tours',        'Ganga Tours — Char Dham 2026 (advertisement)'),
  ('section.rail',           'Doon Valley Realty', '/ads/halfPage-a.svg',    'https://example.com/doon-valley-realty', 'Doon Valley Realty — Homes above the haze (advertisement)'),
  ('section.inFeed',         'Himalaya Organics',  '/ads/leaderboard-a.svg', 'https://example.com/himalaya-organics',  'Himalaya Organics — Seasonal Harvest (advertisement)'),
  ('article.rail',           'Bharat Fintech',     '/ads/halfPage-b.svg',    'https://example.com/bharat-fintech',     'Bharat Fintech — UPI for everyone (advertisement)'),
  ('article.inBody',         'Himalaya Organics',  '/ads/leaderboard-a.svg', 'https://example.com/himalaya-organics',  'Himalaya Organics — Seasonal Harvest (advertisement)'),
  ('article.belowBody',      'Ganga Tours',        '/ads/leaderboard-b.svg', 'https://example.com/ganga-tours',        'Ganga Tours — Char Dham 2026 (advertisement)'),
  ('listing.top',            'Himalaya Organics',  '/ads/leaderboard-a.svg', 'https://example.com/himalaya-organics',  'Himalaya Organics — Seasonal Harvest (advertisement)'),
  ('listing.inFeed',         'Ganga Tours',        '/ads/leaderboard-b.svg', 'https://example.com/ganga-tours',        'Ganga Tours — Char Dham 2026 (advertisement)'),
  ('podcast.rail',           'Doon Valley Realty', '/ads/mpu-a.svg',         'https://example.com/doon-valley-realty', 'Doon Valley Realty — Homes above the haze (advertisement)')
on conflict (slot_key, sponsor_name) do nothing;

-- ------------------------------------------------------------ contact_messages
create table if not exists public.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  phone      text,
  topic      text not null,
  message    text not null,
  created_at timestamptz not null default now(),
  read       boolean not null default false,
  archived   boolean not null default false
);

create index if not exists contact_messages_created_idx on public.contact_messages (created_at desc);

-- =============================================================================
--  Row-level security
-- =============================================================================
alter table public.admins           enable row level security;
alter table public.posts            enable row level security;
alter table public.site_settings    enable row level security;
alter table public.ads              enable row level security;
alter table public.contact_messages enable row level security;

-- admins: a signed-in user can see their own row (lets the client know it is admin).
drop policy if exists "admins: select own row" on public.admins;
create policy "admins: select own row" on public.admins
  for select to authenticated
  using (user_id = auth.uid());

-- posts: the public sees published, unexpired posts; admins see and manage everything.
drop policy if exists "posts: public read live" on public.posts;
create policy "posts: public read live" on public.posts
  for select to anon, authenticated
  using (status = 'published' and expires_at > now());

drop policy if exists "posts: admin read all" on public.posts;
create policy "posts: admin read all" on public.posts
  for select to authenticated
  using (public.is_admin());

drop policy if exists "posts: admin insert" on public.posts;
create policy "posts: admin insert" on public.posts
  for insert to authenticated
  with check (public.is_admin());

drop policy if exists "posts: admin update" on public.posts;
create policy "posts: admin update" on public.posts
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "posts: admin delete" on public.posts;
create policy "posts: admin delete" on public.posts
  for delete to authenticated
  using (public.is_admin());

-- site_settings: readable by everyone; only admins update; no insert/delete via the API.
drop policy if exists "site_settings: public read" on public.site_settings;
create policy "site_settings: public read" on public.site_settings
  for select to anon, authenticated
  using (true);

drop policy if exists "site_settings: admin update" on public.site_settings;
create policy "site_settings: admin update" on public.site_settings
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ads: the public sees enabled creatives inside their date window; admins manage all.
drop policy if exists "ads: public read active" on public.ads;
create policy "ads: public read active" on public.ads
  for select to anon, authenticated
  using (
    enabled
    and (starts_at is null or starts_at <= now())
    and (ends_at   is null or ends_at   >  now())
  );

drop policy if exists "ads: admin all" on public.ads;
create policy "ads: admin all" on public.ads
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- contact_messages: no anon access (the API route writes with the service role).
drop policy if exists "contact_messages: admin select" on public.contact_messages;
create policy "contact_messages: admin select" on public.contact_messages
  for select to authenticated
  using (public.is_admin());

drop policy if exists "contact_messages: admin update" on public.contact_messages;
create policy "contact_messages: admin update" on public.contact_messages
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "contact_messages: admin delete" on public.contact_messages;
create policy "contact_messages: admin delete" on public.contact_messages
  for delete to authenticated
  using (public.is_admin());

-- =============================================================================
--  Storage
-- =============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 52428800,
  array[
    'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif',
    'video/mp4', 'video/webm', 'video/quicktime',
    'audio/mpeg', 'audio/mp4', 'audio/aac', 'audio/wav', 'audio/ogg'
  ]
)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'branding', 'branding', true, 10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/svg+xml']
)
on conflict (id) do nothing;

drop policy if exists "storage: public read media"     on storage.objects;
create policy "storage: public read media" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'media');

drop policy if exists "storage: public read branding"  on storage.objects;
create policy "storage: public read branding" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'branding');

drop policy if exists "storage: admin insert media"    on storage.objects;
create policy "storage: admin insert media" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('media', 'branding') and public.is_admin());

drop policy if exists "storage: admin update media"    on storage.objects;
create policy "storage: admin update media" on storage.objects
  for update to authenticated
  using (bucket_id in ('media', 'branding') and public.is_admin())
  with check (bucket_id in ('media', 'branding') and public.is_admin());

drop policy if exists "storage: admin delete media"    on storage.objects;
create policy "storage: admin delete media" on storage.objects
  for delete to authenticated
  using (bucket_id in ('media', 'branding') and public.is_admin());

-- =============================================================================
--  Views & functions
-- =============================================================================
-- Public feed. security_invoker keeps the posts RLS in force for the caller.
create or replace view public.live_posts
with (security_invoker = true)
as
  select *
  from public.posts
  where status = 'published' and expires_at > now();

grant select on public.live_posts to anon, authenticated, service_role;

-- Deletes expired posts and returns their storage paths so the app can remove
-- the files (done in the app, not SQL, to avoid orphaned blobs on failure).
create or replace function public.purge_expired_posts()
returns table (id uuid, cover_image_path text, media_path text)
language sql
security definer
set search_path = public
as $$
  delete from public.posts p
  where p.expires_at <= now()
  returning p.id, p.cover_image_path, p.media_path;
$$;

revoke all on function public.purge_expired_posts() from public, anon, authenticated;
grant execute on function public.purge_expired_posts() to service_role;

-- =============================================================================
--  Admin bootstrap
-- =============================================================================
-- Make the existing Auth user the admin (edit the email if different):
insert into public.admins (user_id)
select id from auth.users where email = 'admin@gmail.com'
on conflict do nothing;
