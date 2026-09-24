import type { DayCount } from "@/lib/admin/queries";
import { cn } from "@/lib/utils";

/** Seven-column bar strip, pure CSS. Today is the last column. */
export function PostsPerDay({ days }: { days: DayCount[] }) {
  const max = Math.max(1, ...days.map((d) => d.count));
  const total = days.reduce((s, d) => s + d.count, 0);
  return (
    <div>
      <ol className="grid grid-cols-7 gap-2" aria-label="Posts per day, last 7 days">
        {days.map((d, i) => {
          const today = i === days.length - 1;
          const pct = Math.round((d.count / max) * 100);
          return (
            <li key={d.day} className="flex flex-col items-center gap-1.5">
              <span className="font-sans text-[0.8rem] font-semibold tabular-nums text-ink">{d.count}</span>
              <span className="flex h-24 w-full items-end bg-paper-2" title={`${d.count} on ${d.day}`}>
                <span
                  className={cn("block w-full transition-[height]", today ? "bg-saffron" : "bg-ink/70", d.count === 0 && "bg-transparent")}
                  style={{ height: `${d.count === 0 ? 0 : Math.max(6, pct)}%` }}
                  aria-hidden="true"
                />
              </span>
              <span className={cn("font-sans text-[0.68rem] uppercase tracking-[0.12em]", today ? "font-semibold text-ink" : "text-muted")}>{today ? "Today" : d.label}</span>
            </li>
          );
        })}
      </ol>
      <p className="mt-3 font-sans text-[0.78rem] text-muted">{total} post{total === 1 ? "" : "s"} uploaded in the last 7 days.</p>
    </div>
  );
}
