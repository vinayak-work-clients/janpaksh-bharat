import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "muted" | "ink" | "saffron" | "breaking" | "success" | "outline";

const tones: Record<BadgeTone, string> = {
  muted: "bg-paper-2 text-muted",
  ink: "bg-ink text-paper",
  saffron: "bg-saffron/20 text-saffron-dark",
  breaking: "bg-breaking/10 text-breaking",
  success: "bg-emerald-600/10 text-emerald-700",
  outline: "border border-rule text-ink",
};

export function Badge({ children, tone = "muted", className, dot }: { children: ReactNode; tone?: BadgeTone; className?: string; dot?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 font-sans text-[0.68rem] font-semibold uppercase tracking-[0.12em]",
        tones[tone],
        className,
      )}
    >
      {dot && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
