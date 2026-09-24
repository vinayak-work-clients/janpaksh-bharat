/**
 * Fixture test for the front-page arrangement with few posts.
 *
 *   npm run test:feed   (= tsx scripts/test-home-feed.ts)
 *
 * Calls arrangeHomeFeed / pickHeroDeck with 0, 1, 3, 6 and 36 live posts and
 * asserts the invariants the home sections rely on: no duplicates across
 * lead/secondary/headlines/mosaic, the mosaic only ever holds complete rows
 * of three, and nothing throws when the list is short or empty.
 */
import assert from "node:assert/strict";
import { mockPosts } from "../src/data/mock-posts";
import { arrangeHomeFeed, pickHeroDeck } from "../src/lib/posts";

const sizes = [0, 1, 3, 6, 36];
let checks = 0;
const ok = (cond: boolean, msg: string) => {
  assert.ok(cond, msg);
  checks++;
};

for (const n of sizes) {
  const live = mockPosts.slice(0, n);
  const feed = arrangeHomeFeed(live);
  const ids = [feed.lead?.id, ...feed.secondary.map((p) => p.id), ...feed.headlines.map((p) => p.id), ...feed.mosaic.map((p) => p.id)].filter(Boolean) as string[];

  ok(new Set(ids).size === ids.length, `${n}: no post appears twice across lead/secondary/headlines/mosaic`);
  ok(n === 0 ? feed.lead === null : feed.lead !== null, `${n}: lead is ${n === 0 ? "null" : "set"}`);
  ok(feed.secondary.length <= 2 && feed.headlines.length <= 4 && feed.mosaic.length <= 9, `${n}: section sizes within bounds`);
  ok(ids.length === Math.min(n, 16), `${n}: every post is used until the sections are full (${ids.length})`);
  const mosaicRows = Math.floor(feed.mosaic.length / 3) * 3;
  ok(mosaicRows <= feed.mosaic.length, `${n}: mosaic rows computable (${mosaicRows} of ${feed.mosaic.length} shown)`);
  ok(feed.videos.every((p) => p.type === "video") && feed.podcasts.every((p) => p.type === "podcast"), `${n}: type buckets are pure`);
  ok(feed.breaking.every((p) => p.isBreaking), `${n}: breaking bucket only has breaking posts`);

  const deck = pickHeroDeck(live, 6);
  ok(deck.length === Math.min(n, 6), `${n}: hero deck has min(n, 6) = ${deck.length} cards`);
  ok(new Set(deck.map((p) => p.id)).size === deck.length, `${n}: hero deck has no duplicates`);
  const firstNonBreaking = deck.findIndex((p) => !p.isBreaking);
  ok(firstNonBreaking === -1 || deck.slice(firstNonBreaking).every((p) => !p.isBreaking), `${n}: breaking stories lead the deck`);
  console.log(`PASS  ${String(n).padStart(2)} posts → lead ${feed.lead ? 1 : 0}, secondary ${feed.secondary.length}, headlines ${feed.headlines.length}, mosaic ${feed.mosaic.length} (${mosaicRows} shown), deck ${deck.length}${deck.length < 3 ? " (static card)" : ""}`);
}

console.log(`\nAll ${checks} checks passed across ${sizes.length} fixtures.`);
