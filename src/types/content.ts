export type PostType = "image" | "blog" | "video" | "podcast" | "breaking";

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "image"; src: string; caption?: string; alt?: string }
  | { type: "list"; items: string[] };

export interface Post {
  id: string;
  slug: string;
  type: PostType;
  title: string;
  titleHindi?: string;
  /** 1–2 sentence sub-headline shown under the title. */
  standfirst?: string;
  excerpt: string;
  body?: Block[];
  category: string;
  tags: string[];
  coverImage: string;
  mediaUrl?: string;
  embedUrl?: string;
  durationSec?: number;
  author: { name: string; avatar?: string };
  publishedAt: string; // ISO
  expiresAt: string; // ISO, publishedAt + 30 days
  featured?: boolean;
  isBreaking?: boolean;
  readTimeMin?: number;
}

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
  email?: string;
  phone?: string;
  socials?: { x?: string; instagram?: string; linkedin?: string };
}

export interface Service {
  slug: string;
  title: string;
  summary: string;
  deliverables: string[];
  icon: "Newspaper" | "Clapperboard" | "Mic" | "Handshake" | "CalendarDays" | "Megaphone";
}

export interface Faq {
  q: string;
  a: string;
}
