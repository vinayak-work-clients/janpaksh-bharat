/**
 * Post reads for public pages. Every function branches on DATA_SOURCE:
 *   "supabase" → live_posts view through the anon client (RLS hides expired)
 *   otherwise  → the existing mock helpers in src/lib/posts.ts
 * Pages keep importing from src/lib/posts.ts until Phase 6 switches them here.
 */
import type { Post, PostType } from "@/types/content";
import * as mock from "@/lib/posts";
import { arrangeHomeFeed, pickHeroDeck, type HomeFeed } from "@/lib/posts";
import { dataSource } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/server";
import { rowToPost } from "@/lib/data/mappers";
import { cached } from "@/lib/data/cache";

const SELECT = "*";

/* ------------------------------------------------------------------ */
/*  Supabase reads (cached, tagged "posts")                            */
/* ------------------------------------------------------------------ */

const fetchLivePosts = cached(
  async (): Promise<Post[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("live_posts")
      .select(SELECT)
      .order("published_at", { ascending: false });
    if (error) throw new Error(`live_posts: ${error.message}`);
    return (data ?? []).map(rowToPost);
  },
  ["live-posts"],
  "posts",
);

const fetchLivePostBySlug = cached(
  async (slug: string): Promise<Post | null> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("live_posts").select(SELECT).eq("slug", slug).maybeSingle();
    if (error) throw new Error(`live_posts by slug: ${error.message}`);
    return data ? rowToPost(data) : null;
  },
  ["live-post-by-slug"],
  "posts",
);

const fetchLivePostsByType = cached(
  async (type: PostType): Promise<Post[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("live_posts")
      .select(SELECT)
      .eq("type", type)
      .order("published_at", { ascending: false });
    if (error) throw new Error(`live_posts by type: ${error.message}`);
    return (data ?? []).map(rowToPost);
  },
  ["live-posts-by-type"],
  "posts",
);

const fetchLivePostsBySection = cached(
  async (section: string): Promise<Post[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("live_posts")
      .select(SELECT)
      .eq("section", section)
      .order("published_at", { ascending: false });
    if (error) throw new Error(`live_posts by section: ${error.message}`);
    return (data ?? []).map(rowToPost);
  },
  ["live-posts-by-section"],
  "posts",
);

const fetchBreakingPosts = cached(
  async (): Promise<Post[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("live_posts")
      .select(SELECT)
      .eq("is_breaking", true)
      .order("published_at", { ascending: false });
    if (error) throw new Error(`live_posts breaking: ${error.message}`);
    return (data ?? []).map(rowToPost);
  },
  ["live-posts-breaking"],
  "posts",
);

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export async function getLivePosts(): Promise<Post[]> {
  return dataSource() === "supabase" ? fetchLivePosts() : mock.getLivePosts();
}

export async function getLivePostBySlug(slug: string): Promise<Post | null> {
  return dataSource() === "supabase" ? fetchLivePostBySlug(slug) : (mock.getLivePostBySlug(slug) ?? null);
}

export async function getLivePostsByType(type: PostType): Promise<Post[]> {
  return dataSource() === "supabase" ? fetchLivePostsByType(type) : mock.getLivePostsByType(type);
}

export async function getLivePostsBySection(slug: string): Promise<Post[]> {
  return dataSource() === "supabase" ? fetchLivePostsBySection(slug) : mock.getPostsBySection(slug);
}

export async function getBreakingPosts(): Promise<Post[]> {
  return dataSource() === "supabase" ? fetchBreakingPosts() : mock.getLiveBreaking();
}

export async function getHomeFeed(): Promise<HomeFeed> {
  return arrangeHomeFeed(await getLivePosts());
}

export async function getHeroDeck(n = 6): Promise<Post[]> {
  return pickHeroDeck(await getLivePosts(), n);
}

/** Other live posts from the same section, newest first. */
export async function getMoreInSection(post: Post, n = 3): Promise<Post[]> {
  const posts = await getLivePostsBySection(post.section);
  return posts.filter((p) => p.id !== post.id).slice(0, n);
}

/** Other live posts, same category first, then newest. */
export async function getRelatedPosts(post: Post, n = 3): Promise<Post[]> {
  const others = (await getLivePosts()).filter((p) => p.id !== post.id);
  const same = others.filter((p) => p.category === post.category);
  const rest = others.filter((p) => p.category !== post.category);
  return [...same, ...rest].slice(0, n);
}
