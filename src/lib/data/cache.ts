import { revalidateTag, unstable_cache } from "next/cache";

export const CACHE_TAGS = {
  posts: "posts",
  settings: "settings",
  ads: "ads",
} as const;

export const CACHE_REVALIDATE_SECONDS = 60;

/** Wrap a Supabase read: cached 60s, invalidated by tag. */
export function cached<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  key: string[],
  tag: keyof typeof CACHE_TAGS,
) {
  return unstable_cache(fn, key, { tags: [CACHE_TAGS[tag]], revalidate: CACHE_REVALIDATE_SECONDS });
}

export function revalidatePosts() {
  revalidateTag(CACHE_TAGS.posts);
}

export function revalidateSettings() {
  revalidateTag(CACHE_TAGS.settings);
}

export function revalidateAds() {
  revalidateTag(CACHE_TAGS.ads);
}
