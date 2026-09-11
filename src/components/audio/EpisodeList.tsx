"use client";

import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/types/content";
import { cn, formatDate, formatDuration } from "@/lib/utils";
import { usePlayer } from "@/components/audio/PlayerProvider";
import { PlayButton } from "@/components/ui/PlayButton";
import { Kicker } from "@/components/ui/Kicker";

export function EpisodeList({ episodes }: { episodes: Post[] }) {
  const { current, playing, toggle } = usePlayer();
  const total = episodes.length;

  return (
    <ol className="hairline divide-y divide-rule">
      {episodes.map((post, i) => {
        const isPlaying = current?.id === post.id && playing;
        const no = String(total - i).padStart(2, "0");
        return (
          <li key={post.id} className={cn("group flex items-center gap-4 py-5 sm:gap-6", isPlaying && "bg-paper-2/60")}>
            <span aria-hidden="true" className="hidden w-10 shrink-0 font-serif text-[1.5rem] font-light italic leading-none text-saffron sm:block">
              {no}
            </span>
            <Link href={`/news/${post.slug}`} className="relative h-16 w-16 shrink-0 overflow-hidden bg-paper-2 sm:h-20 sm:w-20">
              <Image src={post.coverImage} alt="" fill sizes="80px" className="object-cover transition-transform duration-[600ms] ease-expo-out group-hover:scale-[1.05]" />
            </Link>
            <div className="min-w-0 flex-1">
              <Kicker className="sm:hidden">Ep. {no}</Kicker>
              <h3 className="font-serif text-[1.05rem] font-semibold leading-snug text-ink sm:text-[1.2rem]">
                <Link href={`/news/${post.slug}`} className="headline-link">{post.title}</Link>
              </h3>
              <p className="mt-1.5 font-sans text-[0.8rem] text-muted">
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, "d MMM yyyy")}</time>
                {post.durationSec && (
                  <>
                    <span aria-hidden="true"> · </span>
                    <span className="tabular-nums">{formatDuration(post.durationSec)}</span>
                  </>
                )}
                {isPlaying && <span className="ml-2 text-saffron-dark">Now playing</span>}
              </p>
            </div>
            <PlayButton
              as="button"
              size="sm"
              tone="saffron"
              playing={isPlaying}
              label={isPlaying ? `Pause ${post.title}` : `Play ${post.title}`}
              onClick={() => toggle(post)}
            />
          </li>
        );
      })}
    </ol>
  );
}
