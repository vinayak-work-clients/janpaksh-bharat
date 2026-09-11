import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface KickerProps {
  children: ReactNode;
  className?: string;
  /** Prepend a small saffron dot. */
  dot?: boolean;
  /** Use "breaking" for red text. */
  tone?: "ink" | "muted" | "paper" | "saffron" | "breaking";
  as?: ElementType;
}

const tones = {
  ink: "text-ink",
  muted: "text-muted",
  paper: "text-paper",
  saffron: "text-saffron",
  breaking: "text-breaking",
};

export function Kicker({
  children,
  className,
  dot = false,
  tone = "muted",
  as: Tag = "span",
}: KickerProps) {
  return (
    <Tag
      className={cn(
        "inline-flex items-center gap-2 font-sans text-kicker uppercase",
        tones[tone],
        className,
      )}
    >
      {dot && (
        <span
          aria-hidden="true"
          className="inline-block h-1.5 w-1.5 rounded-full bg-saffron"
        />
      )}
      {children}
    </Tag>
  );
}
