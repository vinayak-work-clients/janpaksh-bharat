import type { Post, PostType } from "@/types/content";
import { getAllPosts } from "@/data/mock-posts";

/** A post is live until its 30-day archive date. */
export function isLive(post: Post, now: Date = new Date()): boolean {
  return new Date(post.expiresAt).getTime() > now.getTime();
}

/** All live posts, newest first. */
export function getLivePosts(): Post[] {
  const now = new Date();
  return getAllPosts().filter((p) => isLive(p, now));
}

export function getLivePostsByType(type: PostType): Post[] {
  return getLivePosts().filter((p) => p.type === type);
}

/** Live posts in a section (region or topic slug), newest first. */
export function getPostsBySection(slug: string): Post[] {
  return getLivePosts().filter((p) => p.section === slug);
}

/** Other live posts from the same section, newest first. */
export function getMoreInSection(post: Post, n = 3): Post[] {
  return getPostsBySection(post.section)
    .filter((p) => p.id !== post.id)
    .slice(0, n);
}

export interface HomeFeed {
  lead: Post | null;
  secondary: Post[];
  headlines: Post[];
  mosaic: Post[];
  videos: Post[];
  podcasts: Post[];
  breaking: Post[];
}

/**
 * Deterministic arrangement of the front page.
 * Sorting is by publishedAt so the same data always yields the same layout.
 */
export function getHomeFeed(): HomeFeed {
  const live = getLivePosts();
  const used = new Set<string>();
  const take = (candidates: Post[], n: number): Post[] => {
    const out: Post[] = [];
    for (const p of candidates) {
      if (out.length >= n) break;
      if (used.has(p.id)) continue;
      used.add(p.id);
      out.push(p);
    }
    return out;
  };

  const featured = live.filter((p) => p.featured);

  // Lead: prefer a featured, non-breaking, image/video story so the hero of
  // the news section carries a strong picture. Fall back gracefully.
  const leadPool = [
    ...featured.filter((p) => !p.isBreaking && (p.type === "image" || p.type === "video")),
    ...featured.filter((p) => !p.isBreaking),
    ...featured,
    ...live,
  ];
  const [lead = null] = take(leadPool, 1);

  const secondary = take([...featured, ...live], 2);
  const headlines = take(live, 4);

  // Mosaic: 9 posts, interleaving types so no two of the same type sit
  // next to each other where possible.
  const remaining = live.filter((p) => !used.has(p.id));
  const byType = new Map<PostType, Post[]>();
  for (const p of remaining) {
    const arr = byType.get(p.type) ?? [];
    arr.push(p);
    byType.set(p.type, arr);
  }
  const order: PostType[] = ["image", "blog", "video", "podcast", "breaking"];
  const mosaic: Post[] = [];
  let guard = 0;
  while (mosaic.length < 9 && guard++ < 50) {
    let added = false;
    for (const t of order) {
      const arr = byType.get(t);
      if (arr && arr.length) {
        const p = arr.shift()!;
        used.add(p.id);
        mosaic.push(p);
        added = true;
        if (mosaic.length >= 9) break;
      }
    }
    if (!added) break;
  }

  return {
    lead,
    secondary,
    headlines,
    mosaic,
    videos: live.filter((p) => p.type === "video"),
    podcasts: live.filter((p) => p.type === "podcast"),
    breaking: live.filter((p) => p.isBreaking),
  };
}

/**
 * Stories for the hero news deck: breaking first, then the latest, with no
 * duplicates. Returns fewer than `n` only when fewer live posts exist.
 */
export function getHeroDeck(n = 6): Post[] {
  const live = getLivePosts();
  const seen = new Set<string>();
  const out: Post[] = [];
  for (const p of [...live.filter((p) => p.isBreaking), ...live]) {
    if (out.length >= n) break;
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    out.push(p);
  }
  return out;
}

/** Live post by slug (archived posts 404). */
export function getLivePostBySlug(slug: string): Post | undefined {
  return getLivePosts().find((p) => p.slug === slug);
}

/** Other live posts, same category first, then newest. */
export function getRelatedPosts(post: Post, n = 3): Post[] {
  const others = getLivePosts().filter((p) => p.id !== post.id);
  const same = others.filter((p) => p.category === post.category);
  const rest = others.filter((p) => p.category !== post.category);
  return [...same, ...rest].slice(0, n);
}

export function getLiveBreaking(): Post[] {
  return getLivePosts().filter((p) => p.isBreaking);
}
