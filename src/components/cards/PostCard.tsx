import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Post } from "@/types/content";
import { cn, formatDuration } from "@/lib/utils";
import { Kicker } from "@/components/ui/Kicker";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { PlayButton } from "@/components/ui/PlayButton";
import { Byline } from "@/components/cards/Byline";
import { VideoCard } from "@/components/cards/VideoCard";

export type Span = 3 | 4 | 5 | 6;

interface PostCardProps {
  post: Post;
  /** Column span in the 12-col mosaic; drives layout choices. */
  span?: Span;
  className?: string;
}

const spanSizes: Record<Span, string> = {
  3: "(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw",
  4: "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
  5: "(min-width: 1024px) 42vw, (min-width: 768px) 50vw, 100vw",
  6: "(min-width: 1024px) 50vw, (min-width: 768px) 50vw, 100vw",
};

/** Picks the card variant from the post type. */
export function PostCard({ post, span = 4, className }: PostCardProps) {
  switch (post.type) {
    case "image":
      return <PhotoCard post={post} span={span} className={className} />;
    case "blog":
      return <EssayCard post={post} className={className} />;
    case "video":
      return <VideoCard post={post} sizes={spanSizes[span]} className={className} />;
    case "podcast":
      return <AudioCard post={post} span={span} className={className} />;
    case "breaking":
      return <AlertCard post={post} className={className} />;
  }
}

/* ------------------------------------------------------------------ */
/*  PhotoCard                                                          */
/* ------------------------------------------------------------------ */

export function PhotoCard({ post, span = 4, className }: PostCardProps) {
  const overlay = span >= 5;

  if (overlay) {
    return (
      <article className={cn("group relative h-full", className)}>
        <Link href={`/news/${post.slug}`} className="block h-full">
          <div className="relative aspect-[16/10] h-full w-full overflow-hidden bg-paper-2">
            <Image
              src={post.coverImage}
              alt=""
              fill
              sizes={spanSizes[span]}
              className="object-cover transition-transform duration-[600ms] ease-expo-out group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,11,15,0.92)_0%,rgba(11,11,15,0.45)_45%,rgba(11,11,15,0)_70%)]" />
            <TypeBadge type="image" variant="onDark" className="absolute left-4 top-4" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <Kicker tone="saffron" className="text-saffron-light">
                {post.category}
              </Kicker>
              <h3 className="mt-2 max-w-[22ch] font-serif text-[1.45rem] font-semibold leading-[1.15] text-paper sm:text-[1.7rem]">
                <span className="headline-link headline-link--paper">{post.title}</span>
              </h3>
              <Byline post={post} tone="dark" className="mt-3" />
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className={cn("group", className)}>
      <Link href={`/news/${post.slug}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-paper-2">
          <Image
            src={post.coverImage}
            alt=""
            fill
            sizes={spanSizes[span]}
            className="object-cover transition-transform duration-[600ms] ease-expo-out group-hover:scale-[1.03]"
          />
          <TypeBadge type="image" variant="onDark" className="absolute left-3 top-3" />
        </div>
        <div className="pt-4">
          <Kicker>{post.category}</Kicker>
          <h3 className="mt-2 font-serif text-[1.15rem] font-semibold leading-snug text-ink">
            <span className="headline-link">{post.title}</span>
          </h3>
          <Byline post={post} className="mt-3" />
        </div>
      </Link>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  EssayCard — op-ed box, no image                                    */
/* ------------------------------------------------------------------ */

export function EssayCard({ post, className }: PostCardProps) {
  return (
    <article className={cn("group h-full", className)}>
      <Link
        href={`/news/${post.slug}`}
        className="relative flex h-full flex-col bg-paper-2 p-6 transition-colors duration-300 hover:bg-[#E7E1D7] sm:p-7"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-5 top-2 font-serif text-[6rem] font-light italic leading-none text-saffron/80"
        >
          &ldquo;
        </span>
        <Kicker dot>
          Blog <span aria-hidden="true" className="text-rule">·</span> {post.category}
        </Kicker>
        <h3 className="mt-4 max-w-[22ch] font-serif text-h3 font-semibold text-ink">
          <span className="headline-link">{post.title}</span>
        </h3>
        <p className="clamp-3 mt-3 font-sans text-[0.9rem] leading-relaxed text-muted">{post.excerpt}</p>
        <Byline post={post} showAvatar className="mt-auto pt-6" />
      </Link>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  AudioCard                                                          */
/* ------------------------------------------------------------------ */

export function AudioCard({ post, span = 4, className }: PostCardProps) {
  const wide = span >= 5;
  return (
    <article className={cn("group h-full", className)}>
      <Link
        href={`/news/${post.slug}`}
        className={cn(
          "flex h-full gap-5 border border-rule p-4 transition-colors duration-300 hover:border-ink sm:p-5",
          wide ? "flex-row items-stretch" : "flex-col",
        )}
      >
        <div
          className={cn(
            "relative shrink-0 overflow-hidden bg-paper-2",
            wide ? "aspect-square w-[42%] max-w-[240px]" : "aspect-square w-full",
          )}
        >
          <Image
            src={post.coverImage}
            alt=""
            fill
            sizes={wide ? "(min-width: 1024px) 18vw, 40vw" : spanSizes[span]}
            className="object-cover transition-transform duration-[600ms] ease-expo-out group-hover:scale-[1.03]"
          />
          <TypeBadge type="podcast" variant="onDark" className="absolute left-3 top-3" />
        </div>
        <div className="flex flex-1 flex-col">
          <Kicker dot>Episode</Kicker>
          <h3 className="mt-2 font-serif text-[1.15rem] font-semibold leading-snug text-ink">
            <span className="headline-link">{post.title}</span>
          </h3>
          <div className="mt-auto flex items-center gap-3 pt-4">
            <PlayButton size="sm" tone="ink" />
            <span aria-hidden="true" className="flex h-4 items-end gap-[2px] text-saffron">
              {Array.from({ length: 7 }).map((_, i) => (
                <span
                  key={i}
                  className="block w-[2px] origin-bottom animate-wave rounded-full bg-current"
                  style={{ height: `${[40, 75, 55, 100, 60, 85, 45][i]}%`, animationDelay: `${i * 0.12}s` }}
                />
              ))}
            </span>
            {post.durationSec && (
              <span className="font-sans text-[0.78rem] tabular-nums text-muted">{formatDuration(post.durationSec)}</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  AlertCard                                                          */
/* ------------------------------------------------------------------ */

export function AlertCard({ post, className }: PostCardProps) {
  return (
    <article className={cn("group h-full", className)}>
      <Link href={`/news/${post.slug}`} className="flex h-full flex-col bg-ink p-6 text-paper sm:p-7">
        <Kicker tone="breaking" className="gap-2">
          <span className="relative flex h-2 w-2">
            <span aria-hidden="true" className="absolute inline-flex h-full w-full animate-ping rounded-full bg-breaking opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-breaking" />
          </span>
          Breaking
        </Kicker>
        <h3 className="mt-4 font-serif text-h3 font-semibold text-paper">
          <span className="headline-link headline-link--paper">{post.title}</span>
        </h3>
        <p className="clamp-2 mt-3 font-sans text-[0.9rem] leading-relaxed text-paper/65">{post.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-6 font-sans text-sm font-medium text-saffron">
          Read update
          <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-expo-out group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </Link>
    </article>
  );
}
