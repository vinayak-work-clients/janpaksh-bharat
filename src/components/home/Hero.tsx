"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { Post } from "@/types/content";
import { usePreloader } from "@/components/PreloaderProvider";
import { Button } from "@/components/ui/Button";
import { Kicker } from "@/components/ui/Kicker";
import { NewsDeck } from "@/components/home/NewsDeck";

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

interface HeroProps {
  /** Stories for the floating news deck: breaking first, then latest (≤6). */
  deck: Post[];
}

/* ------------------------------------------------------------------ */
/*  Backdrop: ink, optional blurred colour wash, saffron glow, grain    */
/* ------------------------------------------------------------------ */

function HeroBackdrop() {
  const { hero } = siteConfig;
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-ink">
      {hero.background === "wash" && (
        <Image
          src={hero.poster}
          alt=""
          fill
          sizes="100vw"
          quality={35}
          className="scale-[1.15] object-cover opacity-[0.16] blur-[28px]"
        />
      )}
      {/* Saffron glow, centred behind the deck's centre card */}
      <div
        className="absolute left-1/2 top-[64%] h-[900px] w-[900px] max-w-[160vw] -translate-x-1/2 -translate-y-1/2 lg:left-[71%] lg:top-1/2"
        style={{
          background:
            "radial-gradient(closest-side, rgba(232,134,42,0.18) 0%, rgba(232,134,42,0.08) 30%, rgba(232,134,42,0) 60%)",
        }}
      />
      {/* Top gradient so the transparent navbar reads cleanly */}
      <div className="absolute inset-x-0 top-0 h-40 bg-[linear-gradient(to_bottom,rgba(11,11,15,0.6),rgba(11,11,15,0))]" />
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
      className="hindi mt-5 max-w-[18ch] font-hindi-serif text-display font-bold text-paper lg:text-[clamp(2.75rem,4.15vw,4.25rem)]"
    >
      {words.map((word, i) => (
        // The word space lives between the inline-blocks; a trailing space
        // inside an inline-block collapses and the words would run together.
        // py keeps Devanagari matras (above/below the baseline) inside the clip box.
        <span key={`${word}-${i}`}>
          {i > 0 && " "}
          <span className="inline-block overflow-hidden py-[0.15em] align-bottom">
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
          </span>
        </span>
      ))}
    </h1>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

export function Hero({ deck }: HeroProps) {
  const { done } = usePreloader();
  const reduceMotion = useReducedMotion();

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
      aria-labelledby="hero-title"
      // overflow-x: clip (not hidden) lets the deck float past the right edge
      // without a horizontal scrollbar while card shadows still show vertically.
      className="relative -mt-[var(--header-height)] flex min-h-[100svh] flex-col overflow-x-clip bg-ink text-paper"
    >
      <HeroBackdrop />

      <div className="container-editorial relative flex flex-1 flex-col justify-center pb-16 pt-[calc(var(--header-height)+2.5rem)] lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-8 lg:pb-20 lg:pt-[calc(var(--header-height)+3rem)]">
        {/* Tagline stack */}
        <div className="relative z-10 lg:col-span-5">
          <motion.div {...fade(0)}>
            <Kicker tone="paper" dot className="text-[0.68rem] text-paper/70 sm:text-kicker">
              {siteConfig.hero.kicker}
            </Kicker>
          </motion.div>

          <SplitHeadline text={siteConfig.tagline} play={done} />

          <motion.p
            {...fade(0.55)}
            className="mt-4 max-w-xl font-serif text-h3 font-normal italic text-paper/75"
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

        {/* News deck — allowed to float past the container's right edge by 8%. */}
        <div className="relative mt-8 lg:col-span-7 lg:col-start-6 lg:-mr-[8%] lg:mt-0">
          <NewsDeck posts={deck} play={done} />
        </div>
      </div>
    </section>
  );
}
