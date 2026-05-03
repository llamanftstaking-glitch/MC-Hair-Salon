import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { salonServices } from "@/lib/schema";
import { eq } from "drizzle-orm";

type ServiceCategory = "Hair" | "Color" | "Treatments" | "Makeup" | "Skin" | "Other";

interface SalonService {
  id: string;
  name: string;
  category: ServiceCategory;
  priceMin: number;
  priceMax: number | null;
  durationMins: number | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

function rowToService(r: typeof salonServices.$inferSelect): SalonService {
  return {
    id: r.id,
    name: r.name,
    category: (r.category as ServiceCategory) ?? "Other",
    priceMin: parseFloat(String(r.priceMin ?? 0)),
    priceMax: r.priceMax != null ? parseFloat(String(r.priceMax)) : null,
    durationMins: r.durationMins ?? null,
    isActive: r.isActive ?? true,
    sortOrder: r.sortOrder ?? 0,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
  };
}

export async function GET() {
  const err = await requireAdmin();
  if (err) return err;
  const rows = await db
    .select()
    .from(salonServices)
    .orderBy(salonServices.sortOrder, salonServices.name);
  return NextResponse.json(rows.map(rowToService));
}

export async function POST(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  try {
    const body = await req.json();
    const id = `svc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    await db.insert(salonServices).values({
      id,
      name: body.name,
      category: body.category ?? "Other",
      priceMin: String(body.priceMin ?? 0),
      priceMax: body.priceMax != null ? String(body.priceMax) : null,
      durationMins: body.durationMins ?? null,
      isActive: body.isActive ?? true,
      sortOrder: body.sortOrder ?? 0,
    });
    const rows = await db.select().from(salonServices).where(eq(salonServices.id, id));
    return NextResponse.json(rowToService(rows[0]), { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const set: Partial<typeof salonServices.$inferInsert> = {};
    if (updates.name         !== undefined) set.name         = updates.name;
    if (updates.category     !== undefined) set.category     = updates.category;
    if (updates.priceMin     !== undefined) set.priceMin     = String(updates.priceMin);
    if (updates.priceMax     !== undefined) set.priceMax     = updates.priceMax != null ? String(updates.priceMax) : null;
    if (updates.durationMins !== undefined) set.durationMins = updates.durationMins ?? null;
    if (updates.isActive     !== undefined) set.isActive     = updates.isActive;
    if (updates.sortOrder    !== undefined) set.sortOrder    = updates.sortOrder;
    await db.update(salonServices).set(set).where(eq(salonServices.id, id));
    const rows = await db.select().from(salonServices).where(eq(salonServices.id, id));
    return rows.length
      ? NextResponse.json(rowToService(rows[0]))
      : NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await db.delete(salonServices).where(eq(salonServices.id, id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
