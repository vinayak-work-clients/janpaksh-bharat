import type { Post } from "@/types/content";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PostCard, type Span } from "@/components/cards/PostCard";
import { Reveal } from "@/components/motion/Reveal";

/** Explicit, repeating magazine pattern: A [5|4|3]  B [3|6|3]  C [4|4|4] */
const PATTERN: Span[] = [5, 4, 3, 3, 6, 3, 4, 4, 4];

const spanClass: Record<Span, string> = {
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  5: "lg:col-span-5",
  6: "lg:col-span-6",
};

export function Mosaic({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section aria-labelledby="latest-heading" className="py-16 md:py-24">
      <div className="container-editorial">
        <SectionHeading id="latest-heading" kicker="The Latest" title="Across Bharat, this week" viewAllHref="/blogs" viewAllLabel="All stories" />

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-6 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-14">
          {posts.slice(0, 9).map((post, i) => {
            const span = PATTERN[i % PATTERN.length];
            return (
              <Reveal
                key={post.id}
                delay={(i % 3) * 0.05}
                className={cn("md:col-span-3", spanClass[span])}
              >
                <PostCard post={post} span={span} className="h-full" />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
