import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { admins } from "@/lib/schema";
import { notInArray } from "drizzle-orm";

// Keeps ONLY the env-var admin email; removes all other rows (Sally, Nathaly, orphans)
export async function GET() {
  const err = await requireAdmin();
  if (err) return err;

  const keepEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "hello@mchairsalon.com";

  const before = await db.select().from(admins);
  await db.delete(admins).where(notInArray(admins.email, [keepEmail]));
  const after = await db.select().from(admins);

  return NextResponse.json({
    ok: true,
    removed: before.length - after.length,
    kept: after.map(r => r.email),
    removedEmails: before.filter(r => r.email !== keepEmail).map(r => r.email),
  });
}
