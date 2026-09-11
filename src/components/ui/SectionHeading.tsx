import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Kicker } from "@/components/ui/Kicker";

interface SectionHeadingProps {
  kicker?: string;
  title: string;
  titleHindi?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
  /** Use on dark backgrounds. */
  inverted?: boolean;
  as?: "h1" | "h2" | "h3";
  /** id for the heading element (pair with aria-labelledby on the section). */
  id?: string;
}

export function SectionHeading({
  kicker,
  title,
  titleHindi,
  viewAllHref,
  viewAllLabel = "View all",
  className,
  inverted = false,
  as: Tag = "h2",
  id,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "hairline flex flex-wrap items-end justify-between gap-x-8 gap-y-3 pt-4",
        inverted && "border-ink-soft",
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        {kicker && (
          <Kicker dot tone={inverted ? "paper" : "muted"}>
            {kicker}
          </Kicker>
        )}
        <Tag
          id={id}
          className={cn(
            "font-serif text-h2 font-semibold",
            inverted ? "text-paper" : "text-ink",
          )}
        >
          {title}
          {titleHindi && (
            <span
              className={cn(
                "hindi ml-3 align-baseline text-[0.55em] font-normal",
                inverted ? "text-paper/70" : "text-muted",
              )}
            >
              {titleHindi}
            </span>
          )}
        </Tag>
      </div>

      {viewAllHref && (
        <Link
          href={viewAllHref}
          className={cn(
            "group inline-flex items-center gap-1.5 pb-1 font-sans text-sm font-medium",
            inverted ? "text-paper/80 hover:text-saffron" : "text-ink hover:text-saffron-dark",
          )}
        >
          {viewAllLabel}
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 ease-expo-out group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      )}
    </div>
  );
}
