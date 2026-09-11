import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import { format, formatDistanceToNowStrict, parseISO } from "date-fns";

// Teach tailwind-merge about the editorial type scale so `text-h1` is not
// mistaken for a text-colour class and dropped when `text-ink` follows it.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": ["text-display", "text-h1", "text-h2", "text-h3", "text-kicker"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format an ISO date string (or Date) for editorial display.
 * Defaults to "11 Sep 2026"; pass a date-fns pattern to override.
 */
export function formatDate(
  input: string | Date,
  pattern: string = "d MMM yyyy",
): string {
  const date = typeof input === "string" ? parseISO(input) : input;
  return format(date, pattern);
}

/** "3 hours ago", "2 days ago" — for cards and tickers. */
export function timeAgo(input: string | Date): string {
  const date = typeof input === "string" ? parseISO(input) : input;
  return `${formatDistanceToNowStrict(date)} ago`;
}

export function formatDuration(seconds?: number): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
