import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { customers } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
  const err = await requireAdmin();
  if (err) return err;

  const filePath = join(process.cwd(), "public", "mc_clients.json");
  const clients: { name: string; email: string; phone: string }[] =
    JSON.parse(readFileSync(filePath, "utf8"));

  let inserted = 0, skipped = 0, errors = 0;

  for (const c of clients) {
    if (!c.name?.trim()) { errors++; continue; }

    const email = c.email?.trim().toLowerCase() ||
      `noemail+${randomUUID()}@mc-placeholder.invalid`;

    try {
      const existing = await db.select({ id: customers.id })
        .from(customers)
        .where(eq(customers.email, email))
        .limit(1);

      if (existing.length > 0) { skipped++; continue; }

      await db.insert(customers).values({
        id: randomUUID(),
        name: c.name.trim(),
        email,
        phone: c.phone?.trim() || "",
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

  return NextResponse.json({ ok: true, inserted, skipped, errors, total: clients.length });
}
