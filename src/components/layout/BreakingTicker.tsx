import Link from "next/link";
import { getBreakingPosts } from "@/data/mock-posts";

export function BreakingTicker() {
  const posts = getBreakingPosts();
  if (posts.length === 0) return null;

  // Duplicate the list so the marquee loops seamlessly at -50%.
  const items = [...posts, ...posts];

  return (
    <aside
      aria-label="Breaking news"
      className="relative z-[60] flex h-9 items-stretch overflow-hidden bg-breaking text-white"
    >
      <div className="relative z-10 flex shrink-0 items-center bg-breaking pl-[clamp(1rem,4vw,3rem)] pr-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-2.5 py-1 font-sans text-[0.65rem] font-bold uppercase tracking-[0.18em] text-breaking">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-breaking"
          />
          Breaking
        </span>
      </div>

      <div className="marquee-pause relative flex flex-1 items-center overflow-hidden">
        <div
          className="marquee-track flex w-max items-center whitespace-nowrap"
          style={{ animationDuration: `${Math.max(24, posts.length * 14)}s` }}
        >
          {items.map((post, i) => (
            <Link
              key={`${post.id}-${i}`}
              href={`/news/${post.slug}`}
              aria-hidden={i >= posts.length ? true : undefined}
              tabIndex={i >= posts.length ? -1 : undefined}
              className="inline-flex items-center gap-4 pr-10 font-sans text-[0.8rem] font-medium text-white/95 transition-colors hover:text-white hover:underline underline-offset-4"
            >
              <span
                aria-hidden="true"
                className="h-1 w-1 rounded-full bg-white/70"
              />
              {post.title}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
