"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { formatDuration } from "@/lib/utils";
import { usePlayer } from "@/components/audio/PlayerProvider";
import { PlayButton } from "@/components/ui/PlayButton";
import { Kicker } from "@/components/ui/Kicker";

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

export function MiniPlayer() {
  const { current, playing, setPlaying, close } = usePlayer();
  const reduceMotion = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const hasAudio = Boolean(current?.mediaUrl && /\.(mp3|m4a|aac|ogg|wav)(\?|$)/i.test(current.mediaUrl));

  // Keep the <audio> element in sync with context state.
  useEffect(() => {
    const a = audioRef.current;
    if (!a || !hasAudio) return;
    if (playing) a.play().catch(() => setPlaying(false));
    else a.pause();
  }, [playing, hasAudio, current?.id, setPlaying]);

  // Reset when the track changes.
  useEffect(() => {
    setTime(0);
    setDuration(0);
  }, [current?.id]);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    a.currentTime = ratio * duration;
  };

  const progress = duration ? (time / duration) * 100 : 0;

  return (
    <AnimatePresence>
      {current && (
        <motion.aside
          key={current.id}
          role="region"
          aria-label="Now playing"
          initial={reduceMotion ? { opacity: 0 } : { y: 96, opacity: 0 }}
          animate={reduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { y: 96, opacity: 0 }}
          transition={{ duration: 0.5, ease: EXPO_OUT }}
          className="fixed inset-x-0 bottom-0 z-[60] border-t border-paper/10 bg-ink text-paper shadow-[0_-12px_40px_rgba(11,11,15,0.35)]"
        >
          <div className="container-editorial flex items-center gap-4 py-3">
            <Link href={`/news/${current.slug}`} aria-hidden="true" tabIndex={-1} className="relative hidden h-12 w-12 shrink-0 overflow-hidden bg-ink-soft sm:block">
              <Image src={current.coverImage} alt="" fill sizes="48px" className="object-cover" />
            </Link>

            {hasAudio ? (
              <>
                <PlayButton
                  as="button"
                  size="sm"
                  tone="saffron"
                  playing={playing}
                  label={playing ? "Pause" : "Play"}
                  onClick={() => setPlaying(!playing)}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-4">
                    <Link href={`/news/${current.slug}`} className="min-w-0 hover:text-saffron-light">
                      <p className="truncate font-serif text-[0.95rem] font-semibold leading-tight">{current.title}</p>
                    </Link>
                    <span className="hidden shrink-0 font-sans text-[0.72rem] tabular-nums text-paper/60 sm:block">
                      {formatDuration(Math.floor(time))} / {formatDuration(Math.floor(duration || current.durationSec || 0))}
                    </span>
                  </div>
                  <div
                    role="slider"
                    aria-label="Seek"
                    aria-valuemin={0}
                    aria-valuemax={Math.floor(duration)}
                    aria-valuenow={Math.floor(time)}
                    tabIndex={0}
                    onClick={seek}
                    onKeyDown={(e) => {
                      const a = audioRef.current;
                      if (!a) return;
                      if (e.key === "ArrowRight") a.currentTime = Math.min(duration, a.currentTime + 10);
                      if (e.key === "ArrowLeft") a.currentTime = Math.max(0, a.currentTime - 10);
                    }}
                    className="group mt-2 h-4 cursor-pointer py-[7px]"
                  >
                    <div className="relative h-[2px] w-full bg-paper/20">
                      <div className="absolute inset-y-0 left-0 bg-saffron" style={{ width: `${progress}%` }} />
                      <span
                        aria-hidden="true"
                        className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-saffron opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                        style={{ left: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
                <audio
                  ref={audioRef}
                  src={current.mediaUrl}
                  preload="metadata"
                  onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
                  onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                  onEnded={() => setPlaying(false)}
                  onError={() => setPlaying(false)}
                />
              </>
            ) : current.embedUrl ? (
              <div className="min-w-0 flex-1">
                <Kicker tone="paper" className="mb-1 text-paper/50">
                  Now playing
                </Kicker>
                <iframe
                  title={current.title}
                  src={current.embedUrl}
                  height={80}
                  loading="lazy"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  className="w-full rounded-md border-0"
                />
              </div>
            ) : (
              <p className="flex-1 truncate font-serif text-[0.95rem]">{current.title}</p>
            )}

            <button
              type="button"
              onClick={close}
              aria-label="Close player"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-paper/70 transition-colors hover:bg-paper/10 hover:text-paper"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
