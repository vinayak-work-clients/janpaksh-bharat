/** The purge cron runs daily at 03:00 IST (21:30 UTC the previous calendar day). Client-safe. */

export const CLEANUP_UTC_HOUR = 21;
export const CLEANUP_UTC_MINUTE = 30;

export function nextCleanup(now: Date = new Date()): Date {
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), CLEANUP_UTC_HOUR, CLEANUP_UTC_MINUTE, 0, 0));
  if (next.getTime() <= now.getTime()) next.setUTCDate(next.getUTCDate() + 1);
  return next;
}

const IST = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false });

/** "Thu 25 Sep, 03:00 IST · in 5 h 12 min" */
export function describeNextCleanup(now: Date = new Date()): string {
  const next = nextCleanup(now);
  const mins = Math.max(0, Math.round((next.getTime() - now.getTime()) / 60000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const rel = h > 0 ? `in ${h} h${m ? ` ${m} min` : ""}` : `in ${m} min`;
  return `${IST.format(next)} IST · ${rel}`;
}
