/**
 * In-memory rate limiting for public endpoints.
 *
 * Good enough for a single instance, which is what a Vercel or Railway
 * deployment starts as. It does NOT hold across instances — move the counter
 * to Redis (Upstash) before scaling horizontally, or each instance will
 * enforce its own separate allowance.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Stop the map growing forever on a long-lived server.
setInterval(() => {
  const now = Date.now();
  for (const [key, b] of buckets) if (b.resetAt < now) buckets.delete(key);
}, 60_000).unref?.();

export function rateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {}
) {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }

  existing.count += 1;

  if (existing.count > limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfter: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  return { ok: true, remaining: limit - existing.count, retryAfter: 0 };
}

/** Best-effort client IP behind Vercel, Cloudflare or a plain proxy. */
/**
 * Client IP inside a server action, where there's no Request object.
 *
 * next/headers is dynamic, so this is async and must be awaited. The earlier
 * helper took an optional Request and silently returned "unknown" when it
 * wasn't passed — which meant every caller shared one bucket and nothing was
 * actually limited.
 */
export async function actionIp() {
  const { headers } = await import("next/headers");
  const h = await headers();
  return (
    h.get("x-forwarded-for")?.split(",")[0].trim() ??
    h.get("x-real-ip") ??
    h.get("cf-connecting-ip") ??
    "unknown"
  );
}

export function clientIp(req: Request) {
  const h = req.headers;
  return (
    h.get("x-forwarded-for")?.split(",")[0].trim() ??
    h.get("x-real-ip") ??
    h.get("cf-connecting-ip") ??
    "unknown"
  );
}
