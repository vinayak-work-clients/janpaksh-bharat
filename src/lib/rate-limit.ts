/**
 * Tiny in-memory sliding-window rate limiter. Per serverless instance only,
 * which is enough to blunt casual form spam; swap for Upstash/KV if needed.
 */
const buckets = new Map<string, number[]>();
const SWEEP_EVERY = 500;
let calls = 0;

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();
  if (++calls % SWEEP_EVERY === 0) {
    buckets.forEach((times, k) => {
      if (times.every((t) => now - t > windowMs)) buckets.delete(k);
    });
  }
  const times = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (times.length >= limit) {
    buckets.set(key, times);
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((windowMs - (now - times[0])) / 1000)) };
  }
  times.push(now);
  buckets.set(key, times);
  return { ok: true, retryAfterSec: 0 };
}

/** Best-effort client IP behind Vercel / proxies. */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
