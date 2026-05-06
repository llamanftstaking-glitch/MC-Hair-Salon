import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { customers } from "@/lib/schema";
import { eq, or } from "drizzle-orm";
import { randomUUID } from "crypto";

interface ImportClient {
  name: string;
  email?: string;
  phone?: string;
}

export async function POST(req: Request) {
  const err = await requireAdmin();
  if (err) return err;

  const body = await req.json() as { clients: ImportClient[] };
  if (!Array.isArray(body.clients)) {
    return NextResponse.json({ error: "clients array required" }, { status: 400 });
  }

  let inserted = 0, skipped = 0, errors = 0;

  for (const c of body.clients) {
    if (!c.name?.trim()) { errors++; continue; }

    const email = c.email?.trim().toLowerCase() || "";
    const phone = c.phone?.trim() || "";

    try {
      // Dedup by email (if present) OR phone (if present) to avoid re-inserting no-email clients
      const conditions = [];
      if (email) conditions.push(eq(customers.email, email));
      if (phone) conditions.push(eq(customers.phone, phone));

      if (conditions.length > 0) {
        const existing = await db.select({ id: customers.id })
          .from(customers)
          .where(conditions.length === 1 ? conditions[0] : or(...conditions))
          .limit(1);
        if (existing.length > 0) { skipped++; continue; }
      }

      const resolvedEmail = email || `noemail+${randomUUID()}@mc-placeholder.invalid`;

      await db.insert(customers).values({
        id: randomUUID(),
        name: c.name.trim(),
        email: resolvedEmail,
        phone,
        createdAt: new Date().toISOString(),
        points: 0,
        visits: 0,
        totalSpent: 0,
        tier: "Bronze",
        visitStreak: 0,
        blowoutsEarned: 0,
      });
      inserted++;
    } catch {
      errors++;
    }
  }

  return NextResponse.json({ ok: true, inserted, skipped, errors });
}
