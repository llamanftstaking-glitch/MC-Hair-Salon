import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { staffBlocks } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const err = await requireAdmin();
  if (err) return err;
  const rows = await db.select().from(staffBlocks).orderBy(staffBlocks.startDate);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  const { staffName, startDate, endDate, reason } = await req.json();
  if (!staffName || !startDate || !endDate) {
    return NextResponse.json({ error: "staffName, startDate, endDate required" }, { status: 400 });
  }
  const [row] = await db.insert(staffBlocks).values({
    staffName,
    startDate,
    endDate,
    reason: reason || null,
    createdAt: new Date().toISOString(),
  }).returning();
  return NextResponse.json(row);
}

export async function DELETE(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  const { id } = await req.json();
  await db.delete(staffBlocks).where(eq(staffBlocks.id, id));
  return NextResponse.json({ ok: true });
}
