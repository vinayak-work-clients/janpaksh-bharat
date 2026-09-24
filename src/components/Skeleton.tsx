import { cn } from "@/lib/utils";

/** Paper-toned placeholder block for loading states. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("animate-pulse bg-paper-2", className)} />;
}

/** Thumb + three lines, the StoryRow silhouette. */
export function SkeletonRow() {
  return (
    <div className="hairline-b flex gap-5 py-6 sm:gap-6">
      <Skeleton className="aspect-[3/2] w-[38%] max-w-[240px] shrink-0" />
      <div className="flex-1">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-3 h-6 w-4/5" />
        <Skeleton className="mt-2 h-6 w-3/5" />
        <Skeleton className="mt-4 h-3 w-40" />
      </div>
    </div>
  );
}

export function SkeletonCard({ tall = false }: { tall?: boolean }) {
  return (
    <div>
      <Skeleton className={tall ? "aspect-[4/3] w-full" : "aspect-video w-full"} />
      <Skeleton className="mt-4 h-3 w-24" />
      <Skeleton className="mt-3 h-6 w-5/6" />
      <Skeleton className="mt-2 h-6 w-2/3" />
    </div>
  );
}
