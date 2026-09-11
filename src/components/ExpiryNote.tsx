import { Clock } from "lucide-react";
import type { Post } from "@/types/content";
import { cn, formatDate } from "@/lib/utils";

export function ExpiryNote({ post, className }: { post: Post; className?: string }) {
  return (
    <p className={cn("inline-flex items-center gap-2 font-sans text-[0.8rem] text-muted", className)}>
      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
      <span>
        Published <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, "d MMM yyyy")}</time>
        <span aria-hidden="true"> · </span>
        Auto-archives on <time dateTime={post.expiresAt}>{formatDate(post.expiresAt, "d MMM yyyy")}</time>
      </span>
    </p>
  );
}
