/** 30-day-rule helpers shared by the list, editor and overview. Client-safe. */

export type ExpiryTone = "muted" | "saffron" | "breaking" | "expired";

const DAY = 24 * 60 * 60 * 1000;

/** Whole days until `expiresAt` (ceil); 0 or negative once expired. */
export function daysLeft(expiresAt: string, now: Date = new Date()): number {
  return Math.ceil((new Date(expiresAt).getTime() - now.getTime()) / DAY);
}

export function isExpired(expiresAt: string, now: Date = new Date()): boolean {
  return new Date(expiresAt).getTime() <= now.getTime();
}

/** ≥8 days muted · 3–7 saffron · ≤2 red · expired. */
export function expiryTone(expiresAt: string, now: Date = new Date()): ExpiryTone {
  if (isExpired(expiresAt, now)) return "expired";
  const d = daysLeft(expiresAt, now);
  if (d <= 2) return "breaking";
  if (d <= 7) return "saffron";
  return "muted";
}

export function expiryLabel(expiresAt: string, now: Date = new Date()): string {
  if (isExpired(expiresAt, now)) return "Expired";
  const d = daysLeft(expiresAt, now);
  if (d <= 0) return "Expires today";
  if (d === 1) return "in 1 day";
  return `in ${d} days`;
}

export type AdminStatus = "published" | "draft" | "expired";

export function adminStatus(status: "draft" | "published", expiresAt: string, now: Date = new Date()): AdminStatus {
  if (isExpired(expiresAt, now)) return "expired";
  return status;
}
