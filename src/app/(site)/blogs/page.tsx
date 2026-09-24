import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import type { Post, PostType } from "@/types/content";
import { getLivePosts } from "@/lib/data/posts";
import { AdSlot } from "@/components/ads/AdSlot";
import { PageHero } from "@/components/PageHero";
import { FilterTabs } from "@/components/FilterTabs";
import { PostCard } from "@/components/cards/PostCard";
import { StoryRow } from "@/components/cards/StoryRow";
import { LoadMore } from "@/components/LoadMore";
import { Reveal } from "@/components/motion/Reveal";
import { Kicker } from "@/components/ui/Kicker";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Stories",
  description: "Every live story from Janpaksh Bharat — photo reports, blogs, videos and podcasts, in one place.",
};

const TYPES: PostType[] = ["image", "blog", "video", "podcast", "breaking"];
const IN_FEED_EVERY = 6;

/** StoryRows with an in-feed ad after every six rows (spanning both columns at xl). */
function withInFeedAds(posts: Post[]): ReactNode[] {
  const out: ReactNode[] = [];
  posts.forEach((post, i) => {
    out.push(<StoryRow key={post.id} post={post} />);
    if ((i + 1) % IN_FEED_EVERY === 0 && i + 1 < posts.length) {
      out.push(<AdSlot key={`ad-${i}`} slot="listing.inFeed" className="py-8 xl:col-span-2" />);
    }
  });
  return out;
}

interface Props {
  searchParams: { type?: string; tag?: string };
}

export default async function BlogsPage({ searchParams }: Props) {
  const type = TYPES.includes(searchParams.type as PostType) ? (searchParams.type as PostType) : null;
  const tag = searchParams.tag?.trim() || null;

  let posts: Post[] = await getLivePosts();
  if (type) posts = posts.filter((p) => p.type === type);
  if (tag) posts = posts.filter((p) => p.tags.includes(tag));

  const filtered = Boolean(type || tag);
  // Lead with a picture story; breaking alerts read better lower down.
  const leadIdx = filtered ? -1 : posts.findIndex((p) => p.type === "image" || p.type === "video");
  const lead = filtered ? undefined : posts[leadIdx === -1 ? 0 : leadIdx];
  const rest = filtered ? [] : posts.filter((p) => p.id !== lead?.id);
  const secondary = rest.slice(0, 2);
  const list = filtered ? posts : rest.slice(2);

  return (
    <>
      <PageHero
        variant="light"
        eyebrow="Stories"
        title="Every story, one place"
        titleHindi="हर कहानी, एक जगह"
        description="Photo reports, essays, films and episodes — everything live on Janpaksh Bharat right now. Stories archive 30 days after publication."
      >
        <Suspense fallback={<div className="h-9" aria-hidden="true" />}>
          <FilterTabs />
        </Suspense>
        {tag && (
          <p className="mt-4 font-sans text-sm text-muted">
            Filtered by tag <span className="font-medium text-ink">#{tag}</span> ·{" "}
            <Link href="/blogs" className="underline underline-offset-4 hover:text-ink">clear</Link>
          </p>
        )}
      </PageHero>

      <div className="container-editorial pt-8">
        <AdSlot slot="listing.top" priority />
      </div>

      <section className="container-editorial py-12 md:py-16" aria-live="polite">
        {posts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-serif text-h2 text-ink">Nothing here yet.</p>
            <p className="mt-3 font-sans text-muted">
              No live stories match this filter.{" "}
              <Link href="/blogs" className="text-ink underline underline-offset-4 hover:text-saffron-dark">See all stories</Link>
            </p>
          </div>
        ) : filtered ? (
          <LoadMore pageSize={12} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
            {posts.map((post, i) => (
              <Reveal key={post.id} delay={(i % 3) * 0.05}>
                <PostCard post={post} span={4} className="h-full" />
              </Reveal>
            ))}
          </LoadMore>
        ) : (
          <>
            {lead && (
              <div className="grid gap-8 lg:grid-cols-12">
                <Reveal className="lg:col-span-7">
                  <PostCard post={lead} span={6} className="h-full" />
                </Reveal>
                <Reveal delay={0.08} className="flex flex-col gap-8 lg:col-span-5">
                  {secondary.map((p) => (
                    <PostCard key={p.id} post={p} span={4} />
                  ))}
                </Reveal>
              </div>
            )}

            {list.length > 0 && (
              <div className="mt-16 md:mt-24">
                <div className="hairline pt-4">
                  <Kicker dot>All stories</Kicker>
                </div>
                <LoadMore pageSize={IN_FEED_EVERY * 2 + 2} className="grid gap-x-12 xl:grid-cols-2">
                  {withInFeedAds(list)}
                </LoadMore>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
