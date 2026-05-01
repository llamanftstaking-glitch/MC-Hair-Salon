import "server-only";
import { eq, gte } from "drizzle-orm";
import { db } from "./db";
import { analyticsDays } from "./schema";
import { sql } from "drizzle-orm";

// In-memory active sessions: sessionId -> lastSeen ms
// Keep process-local — no need to persist
const activeSessions = new Map<string, number>();

setInterval(() => {
  const cutoff = Date.now() - 2 * 60 * 1000;
  for (const [id, ts] of activeSessions) {
    if (ts < cutoff) activeSessions.delete(id);
  }
}, 60_000);

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function hashIp(ip: string): string {
  let h = 5381;
  for (let i = 0; i < ip.length; i++) h = ((h << 5) + h) ^ ip.charCodeAt(i);
  return (h >>> 0).toString(36);
}

export async function recordView(ipHash: string, sessionId: string): Promise<void> {
  const date = todayStr();

  // Upsert: increment views, add unique IP to array if not present
  await db
    .insert(analyticsDays)
    .values({ date, views: 1, uniqueIps: [ipHash] })
    .onConflictDoUpdate({
      target: analyticsDays.date,
      set: {
        views: sql`${analyticsDays.views} + 1`,
        uniqueIps: sql`
          CASE
            WHEN ${analyticsDays.uniqueIps}::jsonb @> ${JSON.stringify([ipHash])}::jsonb
            THEN ${analyticsDays.uniqueIps}
            ELSE ${analyticsDays.uniqueIps}::jsonb || ${JSON.stringify([ipHash])}::jsonb
          END
        `,
      },
    });

  activeSessions.set(sessionId, Date.now());
}

export function heartbeat(sessionId: string): void {
  activeSessions.set(sessionId, Date.now());
}

export function getActiveNow(): number {
  const cutoff = Date.now() - 2 * 60 * 1000;
  let n = 0;
  for (const ts of activeSessions.values()) if (ts >= cutoff) n++;
  return n;
}

export async function getAnalytics() {
  const now = new Date();
  const today   = todayStr();
  const weekAgo  = new Date(now.getTime() -  7 * 86400_000).toISOString().slice(0, 10);
  const monthAgo = new Date(now.getTime() - 30 * 86400_000).toISOString().slice(0, 10);

  const rows = await db
    .select()
    .from(analyticsDays)
    .where(gte(analyticsDays.date, monthAgo));

  const todayBucket  = rows.find(d => d.date === today);
  const weekBuckets  = rows.filter(d => d.date >= weekAgo);
  const monthBuckets = rows;

  return {
    activeNow: getActiveNow(),
    today: {
      views:    todayBucket?.views              ?? 0,
      visitors: (todayBucket?.uniqueIps as string[] | null)?.length ?? 0,
    },
    week: {
      views:    weekBuckets.reduce((s, d) => s + d.views, 0),
      visitors: new Set(weekBuckets.flatMap(d => (d.uniqueIps as string[]) ?? [])).size,
    },
    month: {
      views:    monthBuckets.reduce((s, d) => s + d.views, 0),
      visitors: new Set(monthBuckets.flatMap(d => (d.uniqueIps as string[]) ?? [])).size,
    },
    chart: rows
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(d => ({
        date:     d.date,
        views:    d.views,
        visitors: (d.uniqueIps as string[] | null)?.length ?? 0,
      })),
  };
}
