import "server-only";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { subscribers as subscribersTable } from "./schema";

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: string;
  active: boolean;
}

function rowToSubscriber(row: typeof subscribersTable.$inferSelect): Subscriber {
  return {
    id:           row.id,
    email:        row.email,
    name:         row.name ?? undefined,
    subscribedAt: row.subscribedAt,
    active:       row.active,
  };
}

export async function getSubscribers(): Promise<Subscriber[]> {
  const rows = await db
    .select()
    .from(subscribersTable)
    .where(eq(subscribersTable.active, true));
  return rows.map(rowToSubscriber);
}

export async function getAllSubscribers(): Promise<Subscriber[]> {
  const rows = await db.select().from(subscribersTable);
  return rows.map(rowToSubscriber);
}

export async function addSubscriber(
  email: string,
  name?: string
): Promise<{ ok: boolean; message: string }> {
  const lower = email.toLowerCase();
  const existing = await db
    .select()
    .from(subscribersTable)
    .where(eq(subscribersTable.email, lower));

  if (existing.length > 0) {
    if (existing[0].active) return { ok: false, message: "Already subscribed." };
    await db
      .update(subscribersTable)
      .set({ active: true })
      .where(eq(subscribersTable.email, lower));
    return { ok: true, message: "Resubscribed successfully." };
  }

  await db.insert(subscribersTable).values({
    id:           `SUB-${Date.now()}`,
    email:        lower,
    name:         name ?? null,
    subscribedAt: new Date().toISOString(),
    active:       true,
  });
  return { ok: true, message: "Subscribed successfully." };
}

export async function unsubscribe(email: string): Promise<boolean> {
  const result = await db
    .update(subscribersTable)
    .set({ active: false })
    .where(eq(subscribersTable.email, email.toLowerCase()))
    .returning({ id: subscribersTable.id });
  return result.length > 0;
}

export async function removeSubscriber(id: string): Promise<boolean> {
  const result = await db
    .delete(subscribersTable)
    .where(eq(subscribersTable.id, id))
    .returning({ id: subscribersTable.id });
  return result.length > 0;
}
