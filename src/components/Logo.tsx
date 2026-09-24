import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

type LogoSize = "nav" | "menu" | "footer" | "display";

interface LogoProps {
  className?: string;
  /** Tone of the wordmark. The mark itself is always saffron. */
  tone?: "ink" | "paper";
  /** Renders without a link wrapper (e.g. inside another link). */
  asSpan?: boolean;
  /** Size of the lockup. */
  size?: LogoSize;
  /**
   * The uploaded logo (site_settings.logo_url). When set, the image replaces
   * the whole text lockup at the lockup's height; the wordmark stays in the
   * accessible name. Navbar/Footer/Preloader receive it from settings in Phase 6.
   */
  imageSrc?: string;
  /** Variant for ink surfaces (tone="paper"); falls back to `imageSrc`. */
  imageSrcDark?: string;
}

/**
 * Metrics for the two-line lockup. The English line sits at roughly 28–32%
 * of the Hindi line (nav is a touch larger so it survives at 64px headers).
 */
const metrics: Record<
  LogoSize,
  { hindi: string; english: string; gap: string; mark: string; markPx: number; rowGap: string; imagePx: number }
> = {
  nav: {
    hindi: "text-[1.35rem] leading-[1.15]",
    english: "text-[0.55rem] leading-none",
    gap: "gap-[2px]",
    mark: "h-2.5 w-2.5",
    markPx: 26,
    rowGap: "gap-2.5",
    imagePx: 36,
  },
  menu: {
    hindi: "text-[1.6rem] leading-[1.15]",
    english: "text-[0.6rem] leading-none",
    gap: "gap-[3px]",
    mark: "h-3 w-3",
    markPx: 30,
    rowGap: "gap-3",
    imagePx: 44,
  },
  footer: {
    hindi: "text-[2rem] leading-[1.15]",
    english: "text-[0.65rem] leading-none",
    gap: "gap-1",
    mark: "h-3 w-3",
    markPx: 36,
    rowGap: "gap-3.5",
    imagePx: 52,
  },
  display: {
    hindi: "text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.15]",
    english: "text-[0.3em] leading-none",
    gap: "gap-1.5",
    mark: "h-4 w-4",
    markPx: 56,
    rowGap: "gap-4",
    imagePx: 88,
  },
};

/**
 * Single source of truth for the brand lockup:
 *   line 1  जनपक्ष भारत   (Noto Serif Devanagari 700)
 *   line 2  JANPAKSH BHARAT (Fraunces 700, uppercase, tracked)
 * Pass `imageSrc` to swap the saffron square for the real logo asset.
 */
export function Logo({
  className,
  tone = "ink",
  asSpan = false,
  size = "nav",
  imageSrc,
  imageSrcDark,
}: LogoProps) {
  const m = metrics[size];
  const paper = tone === "paper";
  const image = paper ? imageSrcDark ?? imageSrc : imageSrc;

  const content = image ? (
    <>
      <Image
        src={image}
        alt=""
        aria-hidden="true"
        unoptimized
        width={0}
        height={0}
        sizes={`${m.imagePx * 4}px`}
        className="shrink-0 object-contain"
        style={{ height: m.imagePx, width: "auto" }}
      />
      <span className="sr-only">
        {siteConfig.nameHindi} · {siteConfig.name}
      </span>
    </>
  ) : (
    <>
      <span aria-hidden="true" className={cn("inline-block shrink-0 bg-saffron", m.mark)} />
      <span className={cn("flex flex-col items-start", m.gap)}>
        <span
          lang="hi"
          className={cn(
            "hindi-display block whitespace-nowrap",
            m.hindi,
            paper ? "text-paper" : "text-ink",
          )}
        >
          {siteConfig.nameHindi}
        </span>
        <span
          className={cn(
            "block whitespace-nowrap font-serif font-bold uppercase tracking-[0.16em]",
            m.english,
            paper ? "text-paper" : "text-saffron",
          )}
        >
          {siteConfig.name}
        </span>
      </span>
    </>
  );

  const base = cn(
    "inline-flex items-center transition-colors duration-300",
    m.rowGap,
    size === "nav" || size === "menu" ? "py-2" : "py-1",
    className,
  );

  if (asSpan) {
    return <span className={base}>{content}</span>;
  }

  return (
    <Link
      href="/"
      aria-label={`${siteConfig.nameHindi} · ${siteConfig.name} — home`}
      className={base}
    >
      {content}
    </Link>
  );
}
