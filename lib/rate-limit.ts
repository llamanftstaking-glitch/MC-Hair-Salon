import "server-only";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { rateLimits } from "./schema";

export interface RateLimitResult {
  limited: boolean;
  headers: Record<string, string>;
}

/**
 * Check rate limit for a given limiter ID + IP using the DB as backing store.
 * @param id      Unique identifier for this limit (e.g. "login", "contact")
 * @param ip      Client IP address
 * @param max     Maximum requests allowed in the window
 * @param windowMs Window duration in milliseconds
 */
export async function checkRateLimit(
  id: string,
  ip: string,
  max: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const key = `${id}:${ip}`;
  const now = Date.now();
  const windowStart = now - windowMs;

  // Upsert: if no row or window has expired, reset; otherwise increment
  const existing = await db
    .select()
    .from(rateLimits)
    .where(eq(rateLimits.key, key));

  let count: number;
  let resetAt: number;

  if (!existing.length || existing[0].windowStart <= windowStart) {
    // New or expired window
    count   = 1;
    resetAt = now + windowMs;
    await db
      .insert(rateLimits)
      .values({ key, count: 1, windowStart: now })
      .onConflictDoUpdate({
        target: rateLimits.key,
        set: { count: 1, windowStart: now },
      });
  } else {
    count   = existing[0].count + 1;
    resetAt = existing[0].windowStart + windowMs;
    await db
      .update(rateLimits)
      .set({ count })
      .where(eq(rateLimits.key, key));
  }

  const remaining   = Math.max(0, max - count);
  const retryAfter  = Math.ceil((resetAt - now) / 1000);

  const headers: Record<string, string> = {
    "X-RateLimit-Limit":     String(max),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset":     String(Math.ceil(resetAt / 1000)),
  };

  if (count > max) {
    headers["Retry-After"] = String(retryAfter);
    return { limited: true, headers };
  }

  return { limited: false, headers };
}

/** Convenience: extract client IP from a Next.js request */
export function getClientIp(req: Request): string {
  const forwarded = (req.headers as Headers).get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
