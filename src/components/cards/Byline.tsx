import type { Post } from "@/types/content";
import { cn, timeAgo } from "@/lib/utils";

interface BylineProps {
  post: Post;
  className?: string;
  tone?: "light" | "dark";
  showAvatar?: boolean;
}

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

/** author · time ago · read time  (server-only: relative time is computed once). */
export function Byline({ post, className, tone = "light", showAvatar = false }: BylineProps) {
  const muted = tone === "light" ? "text-muted" : "text-paper/60";
  const strong = tone === "light" ? "text-ink" : "text-paper";

  return (
    <div className={cn("flex items-center gap-2 font-sans text-[0.78rem]", muted, className)}>
      {showAvatar && (
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex h-7 w-7 items-center justify-center rounded-full font-sans text-[0.6rem] font-semibold tracking-wide",
            tone === "light" ? "bg-ink text-paper" : "bg-paper text-ink",
          )}
        >
          {initials(post.author.name)}
        </span>
      )}
      <span className={cn("font-medium", strong)}>{post.author.name}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={post.publishedAt}>{timeAgo(post.publishedAt)}</time>
      {post.readTimeMin && post.type !== "video" && post.type !== "podcast" && (
        <>
          <span aria-hidden="true">·</span>
          <span>{post.readTimeMin} min</span>
        </>
      )}
    </div>
  );
}
