import fs from "fs";
import path from "path";

interface RateLimitEntry {
  count: number;
  resetAt: number; // epoch ms
}

const PERSIST_FILE = path.join(process.cwd(), "data", "rate-limits.json");

function loadStore(): Map<string, RateLimitEntry> {
  try {
    if (fs.existsSync(PERSIST_FILE)) {
      const raw = JSON.parse(fs.readFileSync(PERSIST_FILE, "utf8")) as Record<string, RateLimitEntry>;
      const now = Date.now();
      const map = new Map<string, RateLimitEntry>();
      for (const [k, v] of Object.entries(raw)) {
        if (v.resetAt > now) map.set(k, v);
      }
      return map;
    }
  } catch {}
  return new Map();
}

function saveStore() {
  try {
    fs.mkdirSync(path.dirname(PERSIST_FILE), { recursive: true });
    const obj: Record<string, RateLimitEntry> = {};
    const now = Date.now();
    for (const [k, v] of store.entries()) {
      if (v.resetAt > now) obj[k] = v;
    }
    fs.writeFileSync(PERSIST_FILE, JSON.stringify(obj));
  } catch {}
}

// Global store — loaded from disk so rate limit state survives server restarts
const store = loadStore();

// Sweep expired entries + persist every 60 s
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) store.delete(key);
  }
  saveStore();
}, 60_000);

export interface RateLimitResult {
  limited: boolean;
  headers: Record<string, string>;
}

/**
 * Check rate limit for a given limiter ID + IP.
 * @param id      Unique identifier for this limit (e.g. "login", "contact")
 * @param ip      Client IP address
 * @param max     Maximum requests allowed in the window
 * @param windowMs Window duration in milliseconds
 */
export function checkRateLimit(
  id: string,
  ip: string,
  max: number,
  windowMs: number,
): RateLimitResult {
  const key = `${id}:${ip}`;
  const now = Date.now();

  let entry = store.get(key);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 1, resetAt: now + windowMs };
    store.set(key, entry);
  } else {
    entry.count += 1;
  }

  const remaining = Math.max(0, max - entry.count);
  const retryAfter = Math.ceil((entry.resetAt - now) / 1000);

  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(max),
    "X-RateLimit-Remaining": String(remaining),
    "X-RateLimit-Reset": String(Math.ceil(entry.resetAt / 1000)),
  };

  if (entry.count > max) {
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
