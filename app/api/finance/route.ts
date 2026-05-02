import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { financeBills } from "@/lib/schema";
import { eq } from "drizzle-orm";

type BillCategory = "rent" | "utilities" | "supplies" | "subscriptions" | "general";

interface Bill {
  id: string;
  name: string;
  category: BillCategory;
  amount: number;
  dueDay: number;
  isPaid: boolean;
  autoPay: boolean;
  notes?: string;
  createdAt: string;
}

function rowToBill(r: typeof financeBills.$inferSelect): Bill {
  return {
    id: r.id,
    name: r.name,
    category: (r.category as BillCategory) ?? "general",
    amount: parseFloat(String(r.amount ?? 0)),
    dueDay: r.dueDay ?? 1,
    isPaid: r.isPaid ?? false,
    autoPay: r.autoPay ?? false,
    notes: r.notes ?? undefined,
    createdAt: r.createdAt,
  };
}

export async function GET() {
  const err = await requireAdmin();
  if (err) return err;
  const rows = await db.select().from(financeBills);
  const bills = rows.map(rowToBill).sort((a, b) => a.dueDay - b.dueDay);
  return NextResponse.json(bills);
}

export async function POST(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  try {
    const body = await req.json();
    const now = new Date().toISOString();
    const id = `bill-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    await db.insert(financeBills).values({
      id,
      name: body.name,
      category: body.category ?? "general",
      amount: String(body.amount ?? 0),
      dueDay: body.dueDay ?? 1,
      isPaid: body.isPaid ?? false,
      autoPay: body.autoPay ?? false,
      notes: body.notes ?? null,
      createdAt: now,
    });
    const rows = await db.select().from(financeBills).where(eq(financeBills.id, id));
    return NextResponse.json(rowToBill(rows[0]), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create bill" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const set: Partial<typeof financeBills.$inferInsert> = {};
    if (updates.name      !== undefined) set.name     = updates.name;
    if (updates.category  !== undefined) set.category = updates.category;
    if (updates.amount    !== undefined) set.amount   = String(updates.amount);
    if (updates.dueDay    !== undefined) set.dueDay   = updates.dueDay;
    if (updates.isPaid    !== undefined) set.isPaid   = updates.isPaid;
    if (updates.autoPay   !== undefined) set.autoPay  = updates.autoPay;
    if (updates.notes     !== undefined) set.notes    = updates.notes ?? null;
    await db.update(financeBills).set(set).where(eq(financeBills.id, id));
    const rows = await db.select().from(financeBills).where(eq(financeBills.id, id));
    return rows.length
      ? NextResponse.json(rowToBill(rows[0]))
      : NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Failed to update bill" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await db.delete(financeBills).where(eq(financeBills.id, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete bill" }, { status: 500 });
  }
}
