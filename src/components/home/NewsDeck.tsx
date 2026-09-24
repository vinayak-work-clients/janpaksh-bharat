"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
  type TargetAndTransition,
  type Transition,
} from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Post } from "@/types/content";
import { cn, timeAgo } from "@/lib/utils";

/** Card sizes for next/image; the centre card's preload link is derived from it. */
const DECK_SIZES = "(min-width:1024px) 34vw, 90vw";
import { TypeBadge } from "@/components/ui/TypeBadge";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;
const AUTO_ADVANCE_MS = 4500;
const SWIPE_PX = 60;
const ENTRANCE_DELAY_MS = 300; // after the headline begins rising
const ENTRANCE_STAGGER_S = 0.08;

const SPRING: Transition = { type: "spring", stiffness: 120, damping: 22, mass: 0.9 };
const FADE: Transition = { duration: 0.8, ease: EXPO_OUT };
const QUICK: Transition = { duration: 0.2, ease: "easeOut" };

type Pose = TargetAndTransition & {
  x: string;
  z: number;
  scale: number;
  rotateY: number;
  filter: string;
  opacity: number;
};

/** Pose for a card by its signed distance from the active card. */
function poseFor(offset: number, wide: boolean, reduceMotion: boolean): Pose {
  const abs = Math.abs(offset);
  const sign = Math.sign(offset);
  const blur = (px: number, brightness = 1) =>
    reduceMotion ? "blur(0px) brightness(1)" : `blur(${px}px) brightness(${brightness})`;

  if (abs === 0) {
    return { x: "0%", z: 0, scale: 1, rotateY: 0, filter: blur(0), opacity: 1 };
  }

  if (!wide) {
    // Tablet / mobile: flatter 2.5D fan, no Y rotation.
    if (abs === 1) {
      return { x: `${sign * 70}%`, z: -80, scale: 0.9, rotateY: 0, filter: blur(2, 0.9), opacity: 0.8 };
    }
    return { x: `${sign * 120}%`, z: -160, scale: 0.8, rotateY: 0, filter: blur(0), opacity: 0 };
  }

  if (abs === 1) {
    return {
      x: `${sign * 46}%`,
      z: -160,
      scale: 0.86,
      rotateY: -sign * 16,
      filter: blur(3, 0.85),
      opacity: 0.72,
    };
  }
  if (abs === 2) {
    return {
      x: `${sign * 80}%`,
      z: -320,
      scale: 0.74,
      rotateY: -sign * 22,
      filter: blur(6, 0.85),
      opacity: 0.38,
    };
  }
  return { x: `${sign * 100}%`, z: -320, scale: 0.6, rotateY: 0, filter: blur(0), opacity: 0 };
}

const HIDDEN_POSE: Pose = {
  x: "0%",
  z: 0,
  scale: 0.9,
  rotateY: 0,
  filter: "blur(0px) brightness(1)",
  opacity: 0,
};

const Z_INDEX = [30, 20, 10] as const;

/** Below this many stories the 3D fan has nothing to fan: show one card. */
const MIN_DECK = 3;



/* ------------------------------------------------------------------ */
/*  Hooks                                                              */
/* ------------------------------------------------------------------ */

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

function useDocumentVisible(): boolean {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return visible;
}

/* ------------------------------------------------------------------ */
/*  Single-card fallback (fewer than 3 live stories)                    */
/* ------------------------------------------------------------------ */

function StaticCard({ post, play, className }: { post: Post; play: boolean; className?: string }) {
  const reduceMotion = useReducedMotion() ?? false;
  const isBreaking = post.isBreaking || post.type === "breaking";
  return (
    <div className={cn("news-deck relative w-full [--card-w:86vw] lg:[--card-w:clamp(360px,34vw,560px)]", className)}>
      <motion.div
        className="mx-auto w-[var(--card-w)] max-w-full"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
        animate={play ? { opacity: 1, y: 0 } : reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: reduceMotion ? 0.3 : 0.9, delay: play ? ENTRANCE_DELAY_MS / 1000 : 0, ease: EXPO_OUT }}
      >
        <Link
          href={`/news/${post.slug}`}
          className="group relative block aspect-[7/4] w-full overflow-hidden rounded-2xl border border-paper/10 bg-ink-soft shadow-[0_30px_60px_-20px_rgb(0_0_0/0.6)]"
        >
          <Image src={post.coverImage} alt="" fill priority sizes="(min-width:1024px) 34vw, 90vw" className="object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,11,15,0.9)_0%,rgba(11,11,15,0)_55%)]" />
          <TypeBadge type={isBreaking ? "breaking" : post.type} variant="onDark" className="absolute left-4 top-4" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <span className="font-sans text-kicker uppercase text-saffron">{post.category}</span>
            <h2 className="clamp-2 mt-2 font-serif text-h3 text-paper">{post.title}</h2>
            <time dateTime={post.publishedAt} suppressHydrationWarning className="mt-2 block font-sans text-[0.75rem] text-paper/60">
              {timeAgo(post.publishedAt)}
            </time>
          </div>
        </Link>
        <p className="clamp-2 mt-4 max-w-[48ch] font-sans text-[0.95rem] leading-relaxed text-paper/80">{post.standfirst ?? post.excerpt}</p>
        <Link href={`/news/${post.slug}`} className="group mt-3 inline-flex items-center gap-2 font-sans text-[0.85rem] font-medium text-paper">
          <span className="headline-link headline-link--paper">Read full story</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-expo-out group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Deck                                                               */
/* ------------------------------------------------------------------ */

interface NewsDeckProps {
  posts: Post[];
  /** Starts the entrance; wired to PreloaderProvider.done by the Hero. */
  play: boolean;
  className?: string;
}

type Phase = "hidden" | "entering" | "live";

export function NewsDeck({ posts, play, className }: NewsDeckProps) {
  const n = posts.length;
  const reduceMotion = useReducedMotion() ?? false;
  const wide = useMediaQuery("(min-width: 1024px)");
  const docVisible = useDocumentVisible();

  const [active, setActive] = useState(0);
  // Server HTML shows the deck in its resting pose so the centre card's image
  // is painted (and counted) at first paint under the intro overlay; the
  // first client effect hides it again before the staged entrance.
  const [phase, setPhase] = useState<Phase>("live");
  const primed = useRef(false);
  useEffect(() => {
    if (primed.current) return;
    primed.current = true;
    setPhase("hidden");
  }, []);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  // Bumped on every manual interaction so the auto-advance timer restarts.
  const [interaction, setInteraction] = useState(0);
  const dragging = useRef(false);

  /* Entrance: 0.3s after the headline starts, then live once the springs settle. */
  useEffect(() => {
    if (!play) return;
    const t1 = window.setTimeout(() => setPhase("entering"), ENTRANCE_DELAY_MS);
    const t2 = window.setTimeout(
      () => setPhase("live"),
      ENTRANCE_DELAY_MS + 5 * ENTRANCE_STAGGER_S * 1000 + 900,
    );
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [play]);

  const go = useCallback(
    (index: number) => {
      if (n === 0) return;
      setActive(((index % n) + n) % n);
      setInteraction((i) => i + 1);
    },
    [n],
  );
  const next = useCallback(() => go(active + 1), [go, active]);
  const prev = useCallback(() => go(active - 1), [go, active]);

  /* Auto-advance. */
  const autoplay = phase === "live" && !reduceMotion && !hovered && !focused && docVisible && n > 1;
  useEffect(() => {
    if (!autoplay) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % n), AUTO_ADVANCE_MS);
    return () => window.clearTimeout(t);
  }, [autoplay, active, interaction, n]);

  /* Keyboard. */
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  /* Swipe. */
  const onDragStart = () => {
    dragging.current = true;
  };
  const onDragEnd = (_: unknown, info: PanInfo) => {
    // Let the click that follows a mouse drag see `dragging` before clearing it.
    window.setTimeout(() => {
      dragging.current = false;
    }, 0);
    if (info.offset.x < -SWIPE_PX) next();
    else if (info.offset.x > SWIPE_PX) prev();
  };

  const onCardClick = (e: MouseEvent<HTMLAnchorElement>, index: number) => {
    if (dragging.current) {
      e.preventDefault();
      return;
    }
    if (index !== active) {
      e.preventDefault();
      go(index);
    }
  };

  if (n === 0) return null;
  if (n < MIN_DECK) return <StaticCard post={posts[0]} play={play} className={className} />;
  const current = posts[active];
  const currentIsBreaking = current.isBreaking || current.type === "breaking";

  return (
    <div
      className={cn(
        "news-deck relative w-full [--card-w:86vw] lg:[--card-w:clamp(360px,34vw,560px)]",
        className,
      )}
      style={{ "--card-h": "calc(var(--card-w) * 4 / 7)" } as CSSProperties}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
      onKeyDown={onKeyDown}
    >
      {/* Stage: cards fill the top --card-h; the 120px band below holds the controls. */}
      <motion.div
        role="region"
        aria-roledescription="carousel"
        aria-label="Latest stories"
        className="relative mx-auto w-full [perspective:1600px] [transform-style:preserve-3d]"
        style={{ height: "calc(var(--card-h) + 120px)" }}
        drag={n > 1 ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        dragMomentum={false}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        {posts.map((post, i) => {
          const raw = (i - active + n) % n;
          const offset = raw > Math.floor(n / 2) ? raw - n : raw;
          const abs = Math.abs(offset);
          const visible = abs <= 2;
          const isCenter = offset === 0;
          // Stagger order: centre, +1, -1, +2, -2.
          const slot = abs === 0 ? 0 : abs * 2 - (offset > 0 ? 1 : 0);
          const pose = phase === "hidden" ? HIDDEN_POSE : poseFor(offset, wide, reduceMotion);
          const delay = phase === "entering" ? slot * ENTRANCE_STAGGER_S : 0;
          const snap = phase === "hidden" && !primed.current;
          const isBreaking = post.isBreaking || post.type === "breaking";

          return (
            <motion.div
              key={post.id}
              aria-hidden={!isCenter}
              className="absolute inset-x-0 top-0 mx-auto h-[var(--card-h)] w-[var(--card-w)] max-w-full"
              style={{
                zIndex: visible ? Z_INDEX[abs] : 0,
                pointerEvents: visible ? "auto" : "none",
                willChange: visible ? "transform, filter" : "auto",
                transformStyle: "preserve-3d",
              }}
              initial={false}
              animate={pose}
              transition={
                snap
                  ? { duration: 0 }
                  : reduceMotion
                  ? { ...QUICK, delay }
                  : {
                      x: { ...SPRING, delay },
                      z: { ...SPRING, delay },
                      scale: { ...SPRING, delay },
                      rotateY: { ...SPRING, delay },
                      filter: { ...FADE, delay },
                      opacity: { ...FADE, delay },
                    }
              }
            >
              {/* Inner wrapper carries the idle float so it never fights the position spring. */}
              <motion.div
                className="h-full w-full"
                animate={
                  isCenter && phase === "live" && !reduceMotion ? { y: [0, -8, 0] } : { y: 0 }
                }
                transition={
                  isCenter && phase === "live" && !reduceMotion
                    ? { duration: 6, ease: "easeInOut", repeat: Infinity }
                    : { duration: 0.4 }
                }
              >
                <Link
                  href={`/news/${post.slug}`}
                  tabIndex={isCenter ? 0 : -1}
                  draggable={false}
                  onClick={(e) => onCardClick(e, i)}
                  className={cn(
                    "group relative block h-full w-full overflow-hidden rounded-2xl border border-paper/10 bg-ink-soft",
                    "shadow-[0_30px_60px_-20px_rgb(0_0_0/0.6)]",
                    !isCenter && "cursor-pointer",
                  )}
                >
                  {visible && (
                    <Image
                      src={post.coverImage}
                      alt=""
                      fill
                      // The centre card is the hero's largest paint on phones:
                      // next/image turns this into <link rel="preload" as="image"
                      // fetchpriority="high">. Neighbours stay lazy (in view on
                      // desktop, so they still load at once, without a preload).
                      fetchPriority={abs === 0 ? "high" : undefined}
                      loading={abs === 0 ? "eager" : "lazy"}
                      draggable={false}
                      sizes={DECK_SIZES}
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,11,15,0.9)_0%,rgba(11,11,15,0)_55%)]" />

                  <TypeBadge
                    type={isBreaking ? "breaking" : post.type}
                    variant="onDark"
                    className="absolute left-4 top-4"
                  />

                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <span className="font-sans text-kicker uppercase text-saffron">
                      {post.category}
                    </span>
                    <h2 className="clamp-2 mt-2 font-serif text-h3 text-paper">{post.title}</h2>
                    <time
                      dateTime={post.publishedAt}
                      suppressHydrationWarning
                      className="mt-2 block font-sans text-[0.75rem] text-paper/60"
                    >
                      {timeAgo(post.publishedAt)}
                    </time>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Dots */}
        <div className="absolute bottom-[47px] left-0 z-40 flex items-center gap-1.5" role="tablist" aria-label="Choose story">
          {posts.map((post, i) => {
            const isActive = i === active;
            return (
              <button
                key={post.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Story ${i + 1} of ${n}: ${post.title}`}
                onClick={() => go(i)}
                className="relative flex h-11 min-w-[24px] items-center justify-center px-1"
              >
                {isActive ? (
                  <motion.span
                    layoutId="news-deck-active-dot"
                    className="block h-1.5 w-6 rounded-full bg-saffron"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                ) : (
                  <span className="block h-1.5 w-1.5 rounded-full bg-paper/40 transition-colors group-hover:bg-paper/70" />
                )}
              </button>
            );
          })}
        </div>

        {/* Prev / next */}
        <div className="absolute bottom-[38px] right-0 z-40 flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous story"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/40 text-paper transition-colors duration-200 hover:border-paper hover:bg-paper/10"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next story"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/40 text-paper transition-colors duration-200 hover:border-paper hover:bg-paper/10"
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </motion.div>

      {/* Live announcement for screen readers */}
      <p aria-live="polite" className="sr-only">
        {current.title}
      </p>

      {/* Caption — aligned to the centre card's left edge */}
      <div className="mx-auto w-[var(--card-w)] max-w-full">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
            animate={{ opacity: phase === "hidden" ? 0 : 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -6 }}
            transition={{ duration: 0.35, ease: EXPO_OUT }}
          >
            <span
              className={cn(
                "inline-flex items-center gap-2 font-sans text-kicker uppercase",
                currentIsBreaking ? "text-breaking" : "text-paper/70",
              )}
            >
              {currentIsBreaking && (
                <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-breaking" />
              )}
              Now showing · {current.category}
            </span>
            <p className="clamp-2 mt-2 max-w-[48ch] font-sans text-[0.95rem] leading-relaxed text-paper/80">
              {current.standfirst ?? current.excerpt}
            </p>
            <Link
              href={`/news/${current.slug}`}
              className="group mt-3 inline-flex items-center gap-2 font-sans text-[0.85rem] font-medium text-paper"
            >
              <span className="headline-link headline-link--paper">Read full story</span>
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 ease-expo-out group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
