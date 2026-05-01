import "server-only";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { stripeEvents } from "./schema";

const TTL_MS = 48 * 60 * 60 * 1000; // 48 hours

export async function hasProcessedEvent(eventId: string): Promise<boolean> {
  const rows = await db
    .select()
    .from(stripeEvents)
    .where(eq(stripeEvents.eventId, eventId));
  if (!rows.length) return false;
  const processedAt = new Date(rows[0].processedAt).getTime();
  return Date.now() - processedAt < TTL_MS;
}

export async function markEventProcessed(eventId: string): Promise<void> {
  const now = new Date().toISOString();
  await db
    .insert(stripeEvents)
    .values({ eventId, processedAt: now })
    .onConflictDoUpdate({
      target: stripeEvents.eventId,
      set: { processedAt: now },
    });
}
