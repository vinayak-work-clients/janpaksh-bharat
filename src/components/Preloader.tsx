"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { usePreloader } from "@/components/PreloaderProvider";

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

// Timeline (seconds)
const T_OUT_START = 1.7; // lockup starts blurring out
const T_OVERLAY_OUT = 2.3; // overlay begins fading, unmounted after exit
const START_DELAY_MS = 120; // settle after fonts are ready
const FONT_WAIT_MAX_MS = 400; // never wait longer than this for fonts

// Entrance offsets, measured from `started`.
const D_HINDI = 0;
const D_ENGLISH = 0.2; // slides in beneath the Hindi line
const D_RULE = 0.55;
const D_TAGLINE = 0.7;

export function Preloader() {
  // Rendered on the server too, so the overlay covers the page from the very
  // first paint instead of popping in after hydration.
  const [visible, setVisible] = useState(true);
  const [started, setStarted] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const reduceMotion = useReducedMotion();
  const decided = useRef(false);
  const { markDone } = usePreloader();
  const { name, nameHindi, tagline } = useSiteSettings();

  // Hold the lockup until the web fonts are in (max 400ms) plus a short
  // settle so it never flashes in a fallback face. The ref guard keeps React
  // StrictMode's double-invoked effects from scheduling the start twice.
  useEffect(() => {
    if (decided.current) return;
    decided.current = true;
    const fontsReady =
      typeof document !== "undefined" && "fonts" in document
        ? document.fonts.ready.then(() => undefined)
        : Promise.resolve();
    const cap = new Promise<void>((r) => window.setTimeout(r, FONT_WAIT_MAX_MS));
    Promise.race([fontsReady, cap]).then(() => {
      window.setTimeout(() => setStarted(true), START_DELAY_MS);
    });
  }, []);

  // Scroll lock while visible.
  useEffect(() => {
    if (!visible) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [visible]);

  // Timeline, measured from the moment the lockup starts.
  useEffect(() => {
    if (!started) return;

    const outStart = reduceMotion ? 0.35 : T_OUT_START;
    const overlayOut = reduceMotion ? 0.7 : T_OVERLAY_OUT;

    const t1 = window.setTimeout(() => setLeaving(true), outStart * 1000);
    // The hero's entrance is keyed off this moment so the overlay fade and
    // the headline slide-up read as one continuous beat.
    const t2 = window.setTimeout(() => {
      setVisible(false);
      markDone();
    }, overlayOut * 1000);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [started, reduceMotion, markDone]);

  const rise = (delay: number) => ({
    initial: reduceMotion ? { opacity: 0 } : { y: 40, opacity: 0, filter: "blur(12px)" },
    animate: !started
      ? undefined
      : reduceMotion
        ? { opacity: 1 }
        : { y: 0, opacity: 1, filter: "blur(0px)" },
    transition: {
      duration: reduceMotion ? 0.3 : 1.0,
      delay: reduceMotion ? 0 : delay,
      ease: EXPO_OUT,
    },
  });

  return (
    <AnimatePresence>
      {visible && (
        // The whole overlay is aria-hidden: the <h1> inside is purely visual so
        // every page keeps exactly one accessible h1.
        <motion.div
          key="preloader"
          aria-hidden="true"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: reduceMotion ? 0.3 : 0.5, ease: "easeInOut" },
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-ink"
          style={{ willChange: "opacity" }}
        >
          {/* Lockup group — animates out as one unit */}
          <motion.div
            className="flex flex-col items-start px-6"
            animate={
              leaving
                ? { opacity: 0, filter: "blur(24px)", scale: 1.06 }
                : { opacity: 1, filter: "blur(0px)", scale: 1 }
            }
            transition={{
              duration: reduceMotion ? 0.3 : 0.7,
              ease: EASE_IN_OUT,
            }}
            style={{ willChange: "filter, transform, opacity" }}
          >
            {/* Line 1 — Hindi name at H1 scale. Padding keeps matras inside the box. */}
            <motion.h1
              lang="hi"
              className="hindi-display -mx-[0.06em] px-[0.06em] py-[0.06em] text-paper"
              style={{ fontSize: "clamp(3rem, 11vw, 9.5rem)", willChange: "filter, transform, opacity" }}
              {...rise(D_HINDI)}
            >
              {nameHindi}
            </motion.h1>

            {/* Line 2 — English name, tracked, saffron */}
            <motion.p
              className="-mt-[0.6em] font-serif font-bold uppercase tracking-[0.22em] text-saffron"
              style={{ fontSize: "clamp(0.9rem, 2.4vw, 1.6rem)", willChange: "filter, transform, opacity" }}
              {...rise(D_ENGLISH)}
            >
              {name}
            </motion.p>

            {/* Saffron hairline drawing left → right */}
            <motion.span
              className="mt-5 block h-px w-full bg-saffron origin-left"
              initial={{ scaleX: 0, opacity: 1 }}
              animate={
                !started ? undefined : leaving ? { scaleX: 1, opacity: 0 } : { scaleX: 1, opacity: 1 }
              }
              transition={
                leaving
                  ? { duration: 0.4, ease: "easeInOut" }
                  : {
                      scaleX: {
                        duration: reduceMotion ? 0.3 : 0.7,
                        delay: reduceMotion ? 0 : D_RULE,
                        ease: EXPO_OUT,
                      },
                    }
              }
              style={{ willChange: "transform, opacity" }}
            />

            {/* Hindi tagline, quieter than the lockup */}
            <motion.p
              lang="hi"
              className="hindi mt-4 text-paper/70 tracking-[0.06em] text-[clamp(0.85rem,1.3vw,1.1rem)]"
              initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
              animate={!started ? undefined : { opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion ? 0.3 : 0.8,
                delay: reduceMotion ? 0 : D_TAGLINE,
                ease: EXPO_OUT,
              }}
            >
              {tagline}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
