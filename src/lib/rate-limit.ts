type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/**
 * Best-effort in-memory rate limit (per server instance).
 * Good enough to blunt casual spam; not a substitute for edge/WAF limits.
 */
export function checkRateLimit(
  key: string,
  { max, windowMs }: { max: number; windowMs: number },
): boolean {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (current.count >= max) return false;
  current.count += 1;
  return true;
}
