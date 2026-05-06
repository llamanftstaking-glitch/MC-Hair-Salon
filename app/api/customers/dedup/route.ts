import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { customers } from "@/lib/schema";
import { like, eq, asc } from "drizzle-orm";

// Removes duplicate no-email customers by phone number.
// Keeps the oldest record per phone, deletes the rest.
export async function POST() {
  const err = await requireAdmin();
  if (err) return err;

  const noEmailClients = await db.select()
    .from(customers)
    .where(like(customers.email, "%@mc-placeholder.invalid"))
    .orderBy(asc(customers.createdAt));

  const seenPhones = new Set<string>();
  const toDelete: string[] = [];

  for (const c of noEmailClients) {
    const phone = c.phone?.trim() || "";
    if (!phone) continue;
    if (seenPhones.has(phone)) {
      toDelete.push(c.id);
    } else {
      seenPhones.add(phone);
    }
  }

  for (const id of toDelete) {
    await db.delete(customers).where(eq(customers.id, id));
  }

  return NextResponse.json({ ok: true, deleted: toDelete.length });
}
