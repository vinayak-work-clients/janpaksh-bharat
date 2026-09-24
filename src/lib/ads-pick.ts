/** Weighted creative selection, client- and server-safe (no Supabase imports). */

/** Weighted random pick — deterministic-friendly: pass `random` for tests. */
export function pickByWeight<T extends { weight: number }>(items: T[], random: () => number = Math.random): T | null {
  if (items.length === 0) return null;
  const total = items.reduce((sum, i) => sum + Math.max(1, i.weight), 0);
  let r = random() * total;
  for (const item of items) {
    r -= Math.max(1, item.weight);
    if (r <= 0) return item;
  }
  return items[items.length - 1];
}

/** Small string hash → [0, 1). FNV-1a, enough to spread a seed. */
export function seededUnit(seed: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return (h >>> 0) / 0x100000000;
}

/**
 * Deterministic weighted pick: the same slot + same set of creatives always
 * yields the same one within a request (and across server/client), so the
 * choice can be cached and never causes a hydration mismatch. Pass a per-
 * request `salt` (e.g. a date bucket) to rotate.
 */
export function pickDeterministic<T extends { weight: number; id?: string; src?: string }>(items: T[], seed: string, salt = ""): T | null {
  const key = `${seed}|${salt}|${items.map((i) => i.id ?? i.src ?? "").join(",")}`;
  return pickByWeight(items, () => seededUnit(key));
}
