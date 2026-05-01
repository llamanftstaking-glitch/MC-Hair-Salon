import "server-only";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { stripeEvents } from "./schema";

/**
 * Atomically claim a Stripe event for processing.
 *
 * Returns true if THIS caller is the first to see the event and should
 * proceed to run the side-effects. Returns false if any other concurrent
 * delivery has already claimed (or fully processed) the event — in which
 * case this caller must skip the side-effects entirely.
 *
 * The claim is implemented with INSERT ... ON CONFLICT DO NOTHING RETURNING,
 * which is atomic in Postgres: only one of N concurrent inserts for the same
 * event_id will get a returned row. Stripe's at-least-once delivery means
 * we MUST treat duplicate events as no-ops, including in-flight duplicates
 * from near-simultaneous retries — a simple "SELECT then INSERT" pattern is
 * not safe because two workers can both pass the SELECT before either INSERT.
 */
export async function claimEvent(eventId: string): Promise<boolean> {
  const now = new Date().toISOString();
  const inserted = await db
    .insert(stripeEvents)
    .values({ eventId, processedAt: now })
    .onConflictDoNothing({ target: stripeEvents.eventId })
    .returning({ eventId: stripeEvents.eventId });
  return inserted.length > 0;
}

/**
 * Release a claim that failed to process so Stripe's automatic retry can
 * try again. Only safe to call inside the same request that successfully
 * claimed the event with claimEvent() and then encountered an error.
 */
export async function releaseEvent(eventId: string): Promise<void> {
  await db.delete(stripeEvents).where(eq(stripeEvents.eventId, eventId));
}
