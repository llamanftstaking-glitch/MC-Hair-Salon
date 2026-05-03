import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { promoCodes } from "@/lib/schema";
import { eq } from "drizzle-orm";

interface PromoCode {
  id: string;
  code: string;
  discountType: "percent" | "flat";
  discountValue: number;
  expiryDate?: string;
  maxUses?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
}

function rowToPromo(r: typeof promoCodes.$inferSelect): PromoCode {
  return {
    id:            r.id,
    code:          r.code,
    discountType:  r.discountType as "percent" | "flat",
    discountValue: parseFloat(String(r.discountValue ?? 0)),
    expiryDate:    r.expiryDate ?? undefined,
    maxUses:       r.maxUses ?? undefined,
    usedCount:     r.usedCount ?? 0,
    isActive:      r.isActive ?? true,
    createdAt:     r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
  };
}

export async function GET() {
  const err = await requireAdmin();
  if (err) return err;
  const rows = await db.select().from(promoCodes).orderBy(promoCodes.createdAt);
  return NextResponse.json(rows.map(rowToPromo));
}

export async function POST(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  try {
    const body = await req.json();
    const { code, discountType, discountValue, expiryDate, maxUses } = body;
    if (!code || !discountType || discountValue === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const inserted = await db
      .insert(promoCodes)
      .values({
        code:          String(code).toUpperCase().trim(),
        discountType:  discountType,
        discountValue: String(discountValue),
        expiryDate:    expiryDate || null,
        maxUses:       maxUses ? parseInt(maxUses, 10) : null,
        usedCount:     0,
        isActive:      true,
      })
      .returning();
    return NextResponse.json(rowToPromo(inserted[0]), { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Failed to create promo code";
    if (msg.includes("unique")) {
      return NextResponse.json({ error: "A promo code with that name already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const set: Partial<typeof promoCodes.$inferInsert> = {};
    if (updates.code          !== undefined) set.code          = String(updates.code).toUpperCase().trim();
    if (updates.discountType  !== undefined) set.discountType  = updates.discountType;
    if (updates.discountValue !== undefined) set.discountValue = String(updates.discountValue);
    if (updates.expiryDate    !== undefined) set.expiryDate    = updates.expiryDate || null;
    if (updates.maxUses       !== undefined) set.maxUses       = updates.maxUses ? parseInt(updates.maxUses, 10) : null;
    if (updates.usedCount     !== undefined) set.usedCount     = updates.usedCount;
    if (updates.isActive      !== undefined) set.isActive      = updates.isActive;

    await db.update(promoCodes).set(set).where(eq(promoCodes.id, id));
    const rows = await db.select().from(promoCodes).where(eq(promoCodes.id, id));
    return rows.length
      ? NextResponse.json(rowToPromo(rows[0]))
      : NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Failed to update promo code" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await db.delete(promoCodes).where(eq(promoCodes.id, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete promo code" }, { status: 500 });
  }
}
