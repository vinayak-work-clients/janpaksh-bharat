"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export const FILTERS = [
  { key: "all", label: "All" },
  { key: "image", label: "Photo" },
  { key: "blog", label: "Blog" },
  { key: "video", label: "Video" },
  { key: "podcast", label: "Podcast" },
] as const;

export type FilterKey = (typeof FILTERS)[number]["key"];

export function FilterTabs({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const active = (params.get("type") as FilterKey | null) ?? "all";

  const select = (key: FilterKey) => {
    const next = new URLSearchParams(params.toString());
    if (key === "all") next.delete("type");
    else next.set("type", key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <div
      role="tablist"
      aria-label="Filter stories by type"
      className={cn(
        "no-scrollbar -mx-[clamp(1rem,4vw,3rem)] flex snap-x snap-mandatory gap-2 overflow-x-auto px-[clamp(1rem,4vw,3rem)] sm:mx-0 sm:flex-wrap sm:px-0",
        className,
      )}
    >
      {FILTERS.map(({ key, label }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => select(key)}
            className={cn(
              "h-11 shrink-0 snap-start rounded-full border px-5 font-sans text-[0.8rem] font-medium tracking-wide transition-colors",
              isActive
                ? "border-ink bg-ink text-paper"
                : "border-rule bg-transparent text-ink hover:border-ink",
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
