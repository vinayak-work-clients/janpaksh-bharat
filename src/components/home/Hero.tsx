"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { Post } from "@/types/content";
import { cn, formatDate } from "@/lib/utils";
import { usePreloader } from "@/components/PreloaderProvider";
import { Button } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Kicker";

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

interface HeroProps {
  /** Three most recent stories for the bottom strip. */
  latest: Post[];
}

/* ------------------------------------------------------------------ */
/*  Background media                                                   */
/* ------------------------------------------------------------------ */

function HeroMedia() {
  const { hero } = siteConfig;
  const reduceMotion = useReducedMotion();
  const [wide, setWide] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const useVideo =
    hero.mediaType === "video" &&
    Boolean(hero.videoSrc) &&
    wide &&
    !reduceMotion &&
    !videoFailed;

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-ink">
      {useVideo ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={hero.poster}
          onError={() => setVideoFailed(true)}
        >
          <source src={hero.videoSrc} type="video/mp4" />
        </video>
      ) : (
        <div
          className={cn(
            "absolute inset-0 origin-center will-change-transform",
            !reduceMotion && "animate-kenburns",
          )}
        >
          <Image
            src={hero.imageSrc}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      {/* Bottom → top ink gradient for legibility of the headline */}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,11,15,0.95)_0%,rgba(11,11,15,0.75)_30%,rgba(11,11,15,0)_55%)]" />
      {/* Top gradient so the transparent navbar reads cleanly */}
      <div className="absolute inset-x-0 top-0 h-48 bg-[linear-gradient(to_bottom,rgba(11,11,15,0.7),rgba(11,11,15,0))]" />
      {/* Filmic grain */}
      <div className="grain absolute inset-0 opacity-[0.05]" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Word-by-word headline                                              */
/* ------------------------------------------------------------------ */

function SplitHeadline({ text, play }: { text: string; play: boolean }) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");

  return (
    <h1
      id="hero-title"
      lang="hi"
      className="hindi mt-5 max-w-[16ch] font-hindi-serif text-display font-bold text-paper"
    >
      {words.map((word, i) => (
        // py keeps Devanagari matras (above/below the baseline) inside the clip box.
        <span key={`${word}-${i}`} className="inline-block overflow-hidden py-[0.15em] align-bottom">
          <motion.span
            className="inline-block will-change-transform"
            initial={reduceMotion ? { opacity: 0 } : { y: "110%" }}
            animate={
              play
                ? reduceMotion
                  ? { opacity: 1 }
                  : { y: "0%" }
                : reduceMotion
                  ? { opacity: 0 }
                  : { y: "110%" }
            }
            transition={{
              duration: reduceMotion ? 0.4 : 0.9,
              delay: play ? i * 0.06 : 0,
              ease: EXPO_OUT,
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </h1>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

export function Hero({ latest }: HeroProps) {
  const { done } = usePreloader();
  const reduceMotion = useReducedMotion();
  const [today] = useState(() => formatDate(new Date(), "EEEE, d MMMM yyyy"));
  const rootRef = useRef<HTMLElement>(null);

  const fade = (delay: number) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 },
    animate: done
      ? { opacity: 1, y: 0 }
      : reduceMotion
        ? { opacity: 0 }
        : { opacity: 0, y: 16 },
    transition: { duration: 0.8, delay: done ? delay : 0, ease: EXPO_OUT },
  });

  return (
    <section
      ref={rootRef}
      aria-labelledby="hero-title"
      className="relative -mt-[var(--header-height)] flex min-h-[100svh] flex-col justify-end bg-ink text-paper"
    >
      <HeroMedia />

      <div className="container-editorial relative flex flex-1 flex-col justify-end pt-[calc(var(--header-height)+4rem)]">
        {/* Main copy */}
        <div className="pb-10 sm:pb-14 lg:pb-16">
          <motion.div {...fade(0)}>
            <Kicker tone="saffron" dot>
              {siteConfig.hero.kicker}
            </Kicker>
          </motion.div>

          <SplitHeadline text={siteConfig.tagline} play={done} />

          <motion.p
            {...fade(0.55)}
            className="mt-4 max-w-xl font-serif text-h3 font-normal italic text-paper/80"
          >
            {siteConfig.taglineEn}
          </motion.p>

          <motion.div {...fade(0.7)} className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10">
            <Button href={siteConfig.cta.primary.href} variant="primary" size="lg">
              {siteConfig.cta.primary.label}
            </Button>
            <Button
              href={siteConfig.socials.whatsapp}
              external
              variant="ghost"
              size="lg"
              className="group border-paper/40 text-paper hover:border-paper hover:bg-paper/5"
            >
              {siteConfig.cta.secondary.label}
              <ArrowRight
                className="h-4 w-4 transition-transform duration-300 ease-expo-out group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Button>
          </motion.div>
        </div>

        {/* Bottom strip */}
        <motion.div
          {...fade(0.85)}
          className="flex items-center justify-between gap-6 border-t border-paper/20 py-5"
        >
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <time
              dateTime={new Date().toISOString().slice(0, 10)}
              suppressHydrationWarning
              className="font-sans text-kicker uppercase text-paper/60"
            >
              {today}
            </time>
            <span aria-hidden="true" className="hidden h-1 w-1 rounded-full bg-saffron sm:block" />
            <Kicker tone="paper" className="hidden sm:inline-flex">
              Latest
            </Kicker>
          </div>

          {/* Desktop: three latest headlines */}
          <ul className="hidden items-stretch divide-x divide-paper/15 lg:flex" aria-label="Latest stories">
            {latest.slice(0, 3).map((post) => (
              <li key={post.id} className="max-w-[17rem] px-5 first:pl-0 last:pr-0">
                <Link
                  href={`/news/${post.slug}`}
                  className="group block font-serif text-[0.95rem] leading-snug text-paper/85 transition-colors hover:text-paper"
                >
                  <span className="headline-link headline-link--paper clamp-2">{post.title}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile: scroll indicator */}
          <div className="flex items-center gap-3 lg:hidden" aria-hidden="true">
            <span className="font-sans text-kicker uppercase text-paper/50">Scroll</span>
            <span className="relative block h-10 w-px overflow-hidden bg-paper/20">
              <span className="absolute inset-x-0 top-0 h-full w-full animate-scroll-line bg-saffron" />
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
