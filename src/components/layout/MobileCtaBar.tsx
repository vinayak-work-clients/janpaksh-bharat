"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { usePlayer } from "@/components/audio/PlayerProvider";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

/** Fixed bottom CTA on small screens; appears after the first viewport is scrolled. */
export function MobileCtaBar() {
  const { socials, cta } = useSiteSettings();
  const { current } = usePlayer();
  const reduceMotion = useReducedMotion();
  const [past, setPast] = useState(false);

  useEffect(() => {
    let raf = 0;
    const check = () => setPast(window.scrollY > window.innerHeight * 0.8);
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const show = past && !current;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="mobile-cta"
          initial={reduceMotion ? { opacity: 0 } : { y: "100%" }}
          animate={reduceMotion ? { opacity: 1 } : { y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { y: "100%" }}
          transition={{ duration: 0.45, ease: EXPO_OUT }}
          className="hairline fixed inset-x-0 bottom-0 z-[55] bg-paper px-4 pt-3 md:hidden"
          style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
        >
          <Button href={socials.whatsapp} external variant="primary" size="lg" className="w-full">
            <WhatsAppIcon className="h-[18px] w-[18px]" />
            {cta.whatsappLabel}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
