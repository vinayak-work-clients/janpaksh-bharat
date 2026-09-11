import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

interface LogoProps {
  className?: string;
  /** Tone of the wordmark text. The mark itself is always saffron. */
  tone?: "ink" | "paper";
  /** Renders without a link wrapper (e.g. inside another link). */
  asSpan?: boolean;
  /** Size of the wordmark. */
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "text-[0.95rem] gap-2",
  md: "text-[1.15rem] sm:text-[1.3rem] gap-2.5",
  lg: "text-[1.6rem] gap-3",
};

const markSizes = {
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
};

/**
 * Single source of truth for the brand mark.
 * Swap the saffron square for the real logo asset here and it updates everywhere.
 */
export function Logo({
  className,
  tone = "ink",
  asSpan = false,
  size = "md",
}: LogoProps) {
  const content = (
    <>
      <span
        aria-hidden="true"
        className={cn(
          "inline-block shrink-0 bg-saffron",
          markSizes[size],
        )}
      />
      <span
        className={cn(
          "font-serif font-bold uppercase leading-none tracking-[-0.02em] whitespace-nowrap",
          tone === "paper" ? "text-paper" : "text-ink",
        )}
      >
        {siteConfig.name}
      </span>
    </>
  );

  const base = cn(
    "inline-flex items-center py-3 transition-colors duration-300",
    sizes[size],
    className,
  );

  if (asSpan) {
    return <span className={base}>{content}</span>;
  }

  return (
    <Link href="/" aria-label={`${siteConfig.name} — home`} className={base}>
      {content}
    </Link>
  );
}
