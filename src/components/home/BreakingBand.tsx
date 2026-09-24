import Link from "next/link";
import type { Post } from "@/types/content";
import { Kicker } from "@/components/ui/Kicker";

export function BreakingBand({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <section aria-label="Breaking developments" className="border-t-[3px] border-breaking bg-paper-2">
      <div className="container-editorial flex flex-col gap-3 py-5 md:flex-row md:items-baseline md:gap-8">
        <Kicker tone="breaking" className="shrink-0 gap-2.5">
          <span className="relative flex h-2 w-2">
            <span aria-hidden="true" className="absolute inline-flex h-full w-full animate-ping rounded-full bg-breaking opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-breaking" />
          </span>
          Breaking
        </Kicker>
        <p className="font-serif text-[1.05rem] leading-relaxed text-ink md:text-[1.15rem]">
          {posts.map((post, i) => (
            <span key={post.id}>
              {i > 0 && <span aria-hidden="true" className="mx-3 text-rule">/</span>}
              <Link href={`/news/${post.slug}`} className="transition-colors hover:text-breaking">
                {post.title}
              </Link>
            </span>
          ))}
          <Link href="/breaking" className="ml-3 whitespace-nowrap font-sans text-sm font-medium text-ink/75 hover:text-ink">
            All updates →
          </Link>
        </p>
      </div>
    </section>
  );
}
