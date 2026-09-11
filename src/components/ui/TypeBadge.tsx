import { Camera, Headphones, PenLine, Play } from "lucide-react";
import type { PostType } from "@/types/content";
import { cn } from "@/lib/utils";

const meta: Record<PostType, { label: string; Icon: typeof Camera | null }> = {
  image: { label: "Photo", Icon: Camera },
  blog: { label: "Blog", Icon: PenLine },
  video: { label: "Video", Icon: Play },
  podcast: { label: "Podcast", Icon: Headphones },
  breaking: { label: "Breaking", Icon: null },
};

interface TypeBadgeProps {
  type: PostType;
  variant?: "onDark" | "onLight";
  className?: string;
}

export function TypeBadge({ type, variant = "onLight", className }: TypeBadgeProps) {
  const { label, Icon } = meta[type];
  const isBreaking = type === "breaking";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.16em]",
        variant === "onDark"
          ? "bg-ink/70 text-paper backdrop-blur-sm"
          : "bg-paper-2 text-ink",
        isBreaking && "text-breaking",
        isBreaking && variant === "onDark" && "bg-paper text-breaking",
        className,
      )}
    >
      {Icon ? (
        <Icon className="h-3 w-3" strokeWidth={2.25} aria-hidden="true" />
      ) : (
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-breaking"
        />
      )}
      {label}
    </span>
  );
}
