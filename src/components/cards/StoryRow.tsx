import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/types/content";
import { cn } from "@/lib/utils";
import { Kicker } from "@/components/ui/Kicker";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { Byline } from "@/components/cards/Byline";

interface StoryRowProps {
  post: Post;
  className?: string;
  headingLevel?: "h2" | "h3";
}

/** Horizontal list item for index pages: thumb left, text right, hairline below. */
export function StoryRow({ post, className, headingLevel: Heading = "h3" }: StoryRowProps) {
  return (
    <article className={cn("group hairline-b py-6", className)}>
      <Link href={`/news/${post.slug}`} className="flex gap-5 sm:gap-6">
        <div className="relative aspect-[3/2] w-[38%] max-w-[240px] shrink-0 overflow-hidden bg-paper-2">
          <Image
            src={post.coverImage}
            alt=""
            fill
            sizes="(min-width: 1280px) 240px, 38vw"
            className="object-cover transition-transform duration-[600ms] ease-expo-out group-hover:scale-[1.03]"
          />
          <TypeBadge type={post.type} variant="onDark" className="absolute left-2 top-2 scale-90" />
        </div>
        <div className="min-w-0 flex-1">
          <Kicker tone={post.isBreaking ? "breaking" : "muted"}>{post.isBreaking ? "Breaking" : post.category}</Kicker>
          <Heading className="mt-2 font-serif text-[1.15rem] font-semibold leading-snug text-ink sm:text-[1.3rem]">
            <span className="headline-link">{post.title}</span>
          </Heading>
          <p className="clamp-2 mt-2 hidden font-sans text-[0.9rem] leading-relaxed text-muted sm:block">{post.excerpt}</p>
          <Byline post={post} className="mt-3" />
        </div>
      </Link>
    </article>
  );
}
