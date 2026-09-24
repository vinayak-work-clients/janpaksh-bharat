"use client";

import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/types/content";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { cn, formatDuration } from "@/lib/utils";
import { usePlayer } from "@/components/audio/PlayerProvider";
import { Button } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Kicker";
import { PlayButton } from "@/components/ui/PlayButton";
import { Reveal } from "@/components/motion/Reveal";

export function ListenBand({ podcasts }: { podcasts: Post[] }) {
  const { current, playing, toggle } = usePlayer();
  const { podcast } = useSiteSettings();
  if (podcasts.length === 0) return null;

  return (
    <section aria-labelledby="listen-heading" className="bg-paper-2 py-16 md:py-24">
      <div className="container-editorial grid gap-12 lg:grid-cols-3 lg:gap-16">
        <Reveal className="lg:col-span-1">
          <Kicker dot>Podcast</Kicker>
          <h2 id="listen-heading" className="mt-3 font-serif text-h2 text-ink">
            {podcast.showName}
            <span className="hindi mt-1 block text-[0.6em] font-normal text-saffron-dark">
              {podcast.showNameHindi}
            </span>
          </h2>
          <p className="mt-5 max-w-sm font-sans leading-relaxed text-muted">{podcast.blurb}</p>
          <div className="mt-8">
            <Button href="/podcasts" variant="secondary">
              All episodes
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-2">
          <ol className="hairline divide-y divide-rule">
            {podcasts.map((post, i) => {
              const isCurrent = current?.id === post.id;
              const isPlaying = isCurrent && playing;
              const epNo = String(podcasts.length - i).padStart(2, "0");
              return (
                <li key={post.id} className={cn("group flex items-center gap-4 py-5 sm:gap-6", isCurrent && "bg-paper-2")}>
                  <span aria-hidden="true" className="hidden w-10 shrink-0 font-serif text-[1.5rem] font-light italic leading-none text-saffron sm:block">
                    {epNo}
                  </span>
                  <Link href={`/news/${post.slug}`} className="relative h-16 w-16 shrink-0 overflow-hidden bg-paper sm:h-20 sm:w-20">
                    <Image src={post.coverImage} alt="" fill sizes="80px" className="object-cover transition-transform duration-[600ms] ease-expo-out group-hover:scale-[1.05]" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Kicker className="sm:hidden">Ep. {epNo}</Kicker>
                    <h3 className="font-serif text-[1.05rem] font-semibold leading-snug text-ink sm:text-[1.2rem]">
                      <Link href={`/news/${post.slug}`} className="headline-link">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-1.5 font-sans text-[0.8rem] text-muted">
                      {post.author.name}
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
                    size="md"
                    tone="saffron"
                    playing={isPlaying}
                    waveform
                    label={isPlaying ? `Pause ${post.title}` : `Play ${post.title}`}
                    onClick={() => toggle(post)}
                  />
                </li>
              );
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
