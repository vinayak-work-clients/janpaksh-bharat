"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/types/content";
import { cn, formatDuration } from "@/lib/utils";
import { Kicker } from "@/components/ui/Kicker";
import { PlayButton } from "@/components/ui/PlayButton";
import { TypeBadge } from "@/components/ui/TypeBadge";

interface VideoCardProps {
  post: Post;
  className?: string;
  /** On dark sections the text goes paper. */
  tone?: "light" | "dark";
  sizes?: string;
  headingLevel?: "h3" | "h4";
  /** Hide the text block (poster only). */
  posterOnly?: boolean;
}

export function VideoCard({
  post,
  className,
  tone = "light",
  sizes = "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
  headingLevel: Heading = "h3",
  posterOnly = false,
}: VideoCardProps) {
  const [hovering, setHovering] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [failed, setFailed] = useState(false);
  const timer = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const canHover =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (min-width: 768px)").matches;

  useEffect(() => {
    if (hovering && canHover && post.mediaUrl && !failed) {
      timer.current = window.setTimeout(() => setShowVideo(true), 300);
    } else {
      if (timer.current) window.clearTimeout(timer.current);
      setShowVideo(false);
    }
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [hovering, canHover, post.mediaUrl, failed]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (showVideo) {
      v.currentTime = 0;
      v.play().catch(() => setFailed(true));
    }
  }, [showVideo]);

  const paper = tone === "dark";

  return (
    <article
      className={cn("group relative", className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <Link href={`/news/${post.slug}`} className="block focus-visible:outline-none">
        <div className="relative aspect-video w-full overflow-hidden bg-ink-soft">
          <Image
            src={post.coverImage}
            alt=""
            fill
            sizes={sizes}
            className={cn(
              "object-cover transition-transform duration-[600ms] ease-expo-out group-hover:scale-[1.03]",
              showVideo && "opacity-0",
            )}
          />
          {showVideo && post.mediaUrl && (
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              muted
              loop
              playsInline
              preload="none"
              poster={post.coverImage}
              onError={() => setFailed(true)}
            >
              <source src={post.mediaUrl} type="video/mp4" />
            </video>
          )}

          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,11,15,0.55),rgba(11,11,15,0)_50%)]" />

          <TypeBadge type="video" variant="onDark" className="absolute left-3 top-3" />

          <div className="absolute inset-0 flex items-center justify-center">
            <PlayButton size="md" tone="paper" className={cn("shadow-lg transition-opacity", showVideo && "opacity-0")} />
          </div>

          {post.durationSec && (
            <span className="absolute bottom-3 right-3 rounded-full bg-ink/80 px-2 py-0.5 font-sans text-[0.7rem] font-medium tabular-nums text-paper">
              {formatDuration(post.durationSec)}
            </span>
          )}
        </div>

        {!posterOnly && (
          <div className="pt-4">
            <Kicker tone={paper ? "paper" : "muted"} className={paper ? "text-paper/60" : undefined}>
              {post.category}
            </Kicker>
            <Heading
              className={cn(
                "mt-2 font-serif text-[1.15rem] font-semibold leading-snug",
                paper ? "text-paper" : "text-ink",
              )}
            >
              <span className={cn("headline-link", paper && "headline-link--paper")}>{post.title}</span>
            </Heading>
            <p className={cn("clamp-2 mt-2 font-sans text-[0.9rem] leading-relaxed", paper ? "text-paper/65" : "text-muted")}>
              {post.excerpt}
            </p>
          </div>
        )}
      </Link>
    </article>
  );
}
