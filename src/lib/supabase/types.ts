/**
 * Hand-written Database type mirroring supabase/migrations/0001_init.sql.
 * Keep in sync when the schema changes (or replace with `supabase gen types`).
 * Row shapes are `type` aliases, not interfaces: supabase-js needs the
 * implicit index signature to resolve table types.
 */
import type { Block } from "@/types/content";

export type PostTypeEnum = "image" | "blog" | "video" | "podcast" | "breaking";
export type PostStatusEnum = "draft" | "published";

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type PostRow = {
  id: string;
  slug: string;
  type: PostTypeEnum;
  status: PostStatusEnum;
  section: string;
  category: string;
  tags: string[];
  title: string;
  title_hindi: string | null;
  standfirst: string | null;
  excerpt: string;
  body: Block[];
  cover_image_url: string;
  cover_image_path: string | null;
  media_url: string | null;
  media_path: string | null;
  embed_url: string | null;
  duration_sec: number | null;
  author_name: string;
  author_avatar_url: string | null;
  featured: boolean;
  is_breaking: boolean;
  read_time_min: number | null;
  published_at: string;
  created_at: string;
  expires_at: string;
  updated_at: string | null;
  created_by: string | null;
};

/** expires_at is generated; id/timestamps have defaults. */
export type PostInsert = Omit<
  Partial<PostRow>,
  "expires_at" | "slug" | "type" | "category" | "title" | "excerpt" | "cover_image_url"
> & {
  slug: string;
  type: PostTypeEnum;
  category: string;
  title: string;
  excerpt: string;
  cover_image_url: string;
};

export type PostUpdate = Partial<Omit<PostRow, "expires_at">>;

export type SiteSettingsRow = {
  id: number;
  site_name: string | null;
  site_name_hindi: string | null;
  tagline: string | null;
  tagline_en: string | null;
  description: string | null;
  contact_name: string | null;
  contact_role: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  location: string | null;
  whatsapp_url: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  x_url: string | null;
  facebook_url: string | null;
  cta_primary_label: string | null;
  cta_primary_href: string | null;
  cta_secondary_label: string | null;
  cta_secondary_href: string | null;
  whatsapp_cta_label: string | null;
  hero_kicker: string | null;
  hero_background: "wash" | "solid" | null;
  hero_poster_url: string | null;
  hero_poster_path: string | null;
  logo_url: string | null;
  logo_path: string | null;
  logo_dark_url: string | null;
  logo_dark_path: string | null;
  podcast_name: string | null;
  podcast_name_hindi: string | null;
  podcast_blurb: string | null;
  listen_spotify: string | null;
  listen_apple: string | null;
  listen_youtube: string | null;
  ticker_enabled: boolean;
  ads_enabled: boolean;
  archive_notice: string | null;
  updated_at: string | null;
};

export type AdRow = {
  id: string;
  slot_key: string;
  sponsor_name: string;
  image_url: string;
  image_path: string | null;
  href: string;
  alt: string | null;
  enabled: boolean;
  starts_at: string | null;
  ends_at: string | null;
  weight: number;
  created_at: string;
  updated_at: string | null;
};

export type AdInsert = Omit<Partial<AdRow>, "slot_key" | "sponsor_name" | "image_url" | "href"> & {
  slot_key: string;
  sponsor_name: string;
  image_url: string;
  href: string;
};

export type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  topic: string;
  message: string;
  created_at: string;
  read: boolean;
  archived: boolean;
};

export type ContactMessageInsert = Omit<Partial<ContactMessageRow>, "name" | "email" | "topic" | "message"> & {
  name: string;
  email: string;
  topic: string;
  message: string;
};

export type AdminRow = {
  user_id: string;
  created_at: string;
};

export type PurgedPostRow = {
  id: string;
  cover_image_path: string | null;
  media_path: string | null;
};

export type Database = {
  public: {
    Tables: {
      posts: { Row: PostRow; Insert: PostInsert; Update: PostUpdate; Relationships: [] };
      site_settings: {
        Row: SiteSettingsRow;
        Insert: Partial<SiteSettingsRow>;
        Update: Partial<SiteSettingsRow>;
        Relationships: [];
      };
      ads: { Row: AdRow; Insert: AdInsert; Update: Partial<AdRow>; Relationships: [] };
      contact_messages: {
        Row: ContactMessageRow;
        Insert: ContactMessageInsert;
        Update: Partial<ContactMessageRow>;
        Relationships: [];
      };
      admins: { Row: AdminRow; Insert: { user_id: string; created_at?: string }; Update: Partial<AdminRow>; Relationships: [] };
    };
    Views: {
      live_posts: { Row: PostRow; Relationships: [] };
    };
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      purge_expired_posts: { Args: Record<string, never>; Returns: PurgedPostRow[] };
    };
    Enums: {
      post_type: PostTypeEnum;
      post_status: PostStatusEnum;
    };
    CompositeTypes: Record<string, never>;
  };
};

export type { Json };
