"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Post } from "@/types/content";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VideoCard } from "@/components/cards/VideoCard";

export function WatchStrip({ videos }: { videos: Post[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const ratio = max > 0 ? el.scrollLeft / max : 0;
    setProgress(ratio);
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    update();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  if (videos.length === 0) return null;

  const btn =
    "inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper/30 text-paper transition-colors hover:border-paper hover:bg-paper hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-paper";

  return (
    <section aria-labelledby="watch-heading" className="bg-ink py-16 text-paper md:py-24">
      <div className="container-editorial">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            id="watch-heading"
            inverted
            kicker="Watch"
            title="Stories in motion"
            viewAllHref="/blogs?type=video"
            viewAllLabel="All videos"
            className="flex-1"
          />
          <div className="flex items-center gap-2 pb-1">
            <button type="button" onClick={() => scrollBy(-1)} disabled={!canPrev} aria-label="Previous videos" className={btn}>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => scrollBy(1)} disabled={!canNext} aria-label="Next videos" className={btn}>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Track bleeds to the right edge; left aligns with the container. */}
      <div
        ref={trackRef}
        className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-[clamp(1rem,4vw,3rem)] pb-2 [scroll-padding-inline:clamp(1rem,4vw,3rem)] lg:px-[max(clamp(1rem,4vw,3rem),calc((100vw-1320px)/2+clamp(1rem,4vw,3rem)))]"
      >
        {videos.map((post) => (
          <div key={post.id} data-card className="min-w-[300px] snap-start sm:min-w-[320px] md:min-w-[440px]">
            <VideoCard post={post} tone="dark" sizes="(min-width: 768px) 440px, 320px" />
          </div>
        ))}
        <div aria-hidden="true" className="min-w-[1px] shrink-0" />
      </div>

      <div className="container-editorial mt-8">
        <div className="relative h-px w-full bg-paper/15" aria-hidden="true">
          <div
            className={cn("absolute inset-y-0 left-0 bg-saffron transition-[width] duration-150 ease-out")}
            style={{ width: `${Math.max(8, progress * 100)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
