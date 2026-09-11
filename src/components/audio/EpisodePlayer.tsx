"use client";

import type { Post } from "@/types/content";
import { cn, formatDuration } from "@/lib/utils";
import { usePlayer } from "@/components/audio/PlayerProvider";
import { PlayButton } from "@/components/ui/PlayButton";

interface EpisodePlayerProps {
  post: Post;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

/** Play/pause control bound to the global MiniPlayer. */
export function EpisodePlayer({ post, size = "lg", showLabel = true, className }: EpisodePlayerProps) {
  const { current, playing, toggle } = usePlayer();
  const isCurrent = current?.id === post.id;
  const isPlaying = isCurrent && playing;

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <PlayButton
        as="button"
        size={size}
        tone="saffron"
        playing={isPlaying}
        waveform={size !== "sm"}
        label={isPlaying ? `Pause ${post.title}` : `Play ${post.title}`}
        onClick={() => toggle(post)}
      />
      {showLabel && (
        <div className="font-sans">
          <p className="text-[0.95rem] font-medium text-ink">
            {isPlaying ? "Now playing" : isCurrent ? "Paused" : "Play episode"}
          </p>
          {post.durationSec && (
            <p className="text-[0.8rem] tabular-nums text-muted">{formatDuration(post.durationSec)}</p>
          )}
        </div>
      )}
    </div>
  );
}
