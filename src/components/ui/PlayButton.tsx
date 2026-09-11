import { Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayButtonProps {
  size?: "sm" | "md" | "lg";
  tone?: "paper" | "saffron" | "ink";
  playing?: boolean;
  /** Decorative (inside a link) vs. an actual interactive button. */
  as?: "span" | "button";
  label?: string;
  onClick?: () => void;
  className?: string;
  /** Animated waveform bars beside the icon. */
  waveform?: boolean;
}

const sizes = {
  sm: "h-11 w-11 [&_svg]:h-3.5 [&_svg]:w-3.5",
  md: "h-12 w-12 [&_svg]:h-4 [&_svg]:w-4",
  lg: "h-16 w-16 sm:h-20 sm:w-20 [&_svg]:h-6 [&_svg]:w-6",
};

const tones = {
  paper: "bg-paper/90 text-ink group-hover:bg-paper",
  saffron: "bg-saffron text-ink hover:bg-saffron-dark hover:text-paper",
  ink: "bg-ink text-paper hover:bg-saffron hover:text-ink",
};

export function PlayButton({
  size = "md",
  tone = "paper",
  playing = false,
  as = "span",
  label = "Play",
  onClick,
  className,
  waveform = false,
}: PlayButtonProps) {
  const Tag = as;
  const Icon = playing ? Pause : Play;

  return (
    <Tag
      {...(as === "button" ? { type: "button", onClick, "aria-label": label, "aria-pressed": playing } : { "aria-hidden": true })}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full transition-all duration-300 ease-expo-out",
        sizes[size],
        tones[tone],
        as === "button" && "hover:scale-105 active:scale-95",
        className,
      )}
    >
      {/* Pulse ring when playing */}
      {playing && (
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-pulse-ring rounded-full border border-current"
        />
      )}
      {waveform && playing ? <Waveform /> : <Icon className={cn(!playing && "ml-0.5")} fill="currentColor" strokeWidth={0} aria-hidden="true" />}
    </Tag>
  );
}

/** Five bars animating heights — decorative only. */
export function Waveform({ className, bars = 5 }: { className?: string; bars?: number }) {
  return (
    <span aria-hidden="true" className={cn("flex h-4 items-center gap-[2px]", className)}>
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="block h-full w-[2px] origin-center animate-wave rounded-full bg-current"
          style={{ animationDelay: `${(i % 3) * 0.15 + (i > 2 ? 0.08 : 0)}s`, animationDuration: `${0.9 + (i % 2) * 0.25}s` }}
        />
      ))}
    </span>
  );
}
