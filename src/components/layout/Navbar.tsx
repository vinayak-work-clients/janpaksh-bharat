"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, Search, X } from "lucide-react";
import { socialLinks } from "@/components/icons/SocialIcons";
import { siteConfig } from "@/config/site";
import { cn, formatDate } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";

const SCROLL_THRESHOLD = 40;
const EXPO_OUT = [0.16, 1, 0.3, 1] as const;

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const reduceMotion = useReducedMotion();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  // Stable date string for the kicker (computed once on the client).
  const [today] = useState(() => formatDate(new Date(), "EEE d MMM yyyy"));

  /* Scroll listener → solid header past 40px */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close menu on route change */
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  /* Scroll lock + Escape + focus management for mobile menu */
  useEffect(() => {
    if (!menuOpen) return;
    const trigger = menuBtnRef.current;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      trigger?.focus();
    };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const transparent = isHome && !scrolled && !menuOpen;
  const tone: "paper" | "ink" = transparent ? "paper" : "ink";

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    // Article pages live under /news but belong to the Blogs section.
    if (href === "/blogs" && pathname.startsWith("/news")) return true;
    return pathname.startsWith(href);
  };

  const indicatorTarget =
    hovered ?? siteConfig.nav.find((n) => isActive(n.href))?.href ?? null;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 h-[var(--header-height)] border-b transition-[background-color,border-color,color] duration-300 ease-out",
          transparent
            ? "border-transparent bg-transparent text-paper"
            : "border-rule bg-paper text-ink",
        )}
      >
        <div className="container-editorial flex h-full items-center justify-between gap-6">
          {/* Left: logo */}
          <Logo tone={tone} />

          {/* Center: desktop nav */}
          <nav
            aria-label="Primary"
            className="hidden lg:block"
            onMouseLeave={() => setHovered(null)}
          >
            <ul className="flex items-center gap-1">
              {siteConfig.nav.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href} className="relative">
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onMouseEnter={() => setHovered(item.href)}
                      onFocus={() => setHovered(item.href)}
                      onBlur={() => setHovered(null)}
                      className={cn(
                        "relative block px-2.5 py-2 font-sans text-[0.85rem] font-medium tracking-wide transition-opacity duration-200 xl:px-3",
                        active ? "opacity-100" : "opacity-70 hover:opacity-100",
                      )}
                    >
                      {item.label}
                      {indicatorTarget === item.href && (
                        <motion.span
                          layoutId="nav-indicator"
                          aria-hidden="true"
                          className="absolute inset-x-2.5 -bottom-0.5 h-[2px] bg-saffron xl:inset-x-3"
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 40,
                            mass: 0.6,
                          }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right: date, search, CTA, hamburger */}
          <div className="flex items-center gap-3 sm:gap-4">
            <time
              dateTime={new Date().toISOString().slice(0, 10)}
              suppressHydrationWarning
              className={cn(
                "hidden xl:block whitespace-nowrap font-sans text-kicker uppercase",
                transparent ? "text-paper/70" : "text-muted",
              )}
            >
              {today}
            </time>

            <button
              type="button"
              aria-label="Search (coming soon)"
              className={cn("inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors", transparent ? "hover:bg-paper/10" : "hover:bg-ink/5")}
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
            </button>

            <Button
              href={siteConfig.cta.secondary.href}
              size="sm"
              variant="secondary"
              className={cn(
                "hidden sm:inline-flex lg:hidden xl:inline-flex",
                transparent &&
                  "bg-paper text-ink border-paper hover:bg-transparent hover:text-paper",
              )}
            >
              {siteConfig.cta.secondary.label}
            </Button>

            <button
              ref={menuBtnRef}
              type="button"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
              className={cn("inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors lg:hidden", transparent ? "hover:bg-paper/10" : "hover:bg-ink/5")}
            >
              <Menu className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            className="fixed inset-0 z-[70] flex flex-col bg-ink text-paper lg:hidden"
          >
            <div className="container-editorial flex h-[var(--header-height)] shrink-0 items-center justify-between">
              <Logo tone="paper" />
              <button
                ref={closeBtnRef}
                type="button"
                aria-label="Close menu"
                onClick={closeMenu}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-paper/10"
              >
                <X className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>

            <nav
              aria-label="Mobile"
              className="container-editorial flex flex-1 flex-col justify-center overflow-y-auto py-8"
            >
              <ul className="flex flex-col">
                {siteConfig.nav.map((item, i) => {
                  const active = isActive(item.href);
                  return (
                    <motion.li
                      key={item.href}
                      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: reduceMotion ? 0.2 : 0.6,
                        delay: reduceMotion ? 0 : 0.08 + i * 0.05,
                        ease: EXPO_OUT,
                      }}
                      className="border-b border-paper/10"
                    >
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group flex items-baseline gap-4 py-3.5 font-serif text-[clamp(2rem,7vw,3.25rem)] font-semibold leading-none tracking-[-0.02em] transition-colors",
                          active ? "text-saffron" : "text-paper hover:text-saffron-light",
                        )}
                      >
                        <span className="font-sans text-kicker text-paper/40 group-hover:text-saffron/70">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {item.label}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reduceMotion ? 0 : 0.5, duration: 0.5 }}
              className="container-editorial flex shrink-0 flex-wrap items-center justify-between gap-4 border-t border-paper/10 py-6"
            >
              <p className="hindi text-saffron">{siteConfig.tagline}</p>
              <ul className="flex items-center gap-2">
                {socialLinks.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      aria-label={label}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper/15 text-paper/80 transition-colors hover:border-saffron hover:text-saffron"
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
