import { NextRequest, NextResponse } from "next/server";
import { getAllStaff, createStaff, updateStaff, deleteStaff } from "@/lib/staff-data";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET — public (staff profiles shown on /team page)
export async function GET() {
  try {
    return NextResponse.json(await getAllStaff());
  } catch {
    return NextResponse.json({ error: "Failed to load staff" }, { status: 500 });
  }
}

// POST — admin only
export async function POST(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  try {
    const body    = await req.json();
    const created = await createStaff(body);
    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to create staff member";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH — admin only
export async function PATCH(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const updated = await updateStaff(id, updates);
    return NextResponse.json(updated);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to update staff member";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE — admin only
export async function DELETE(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await deleteStaff(id);
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to delete staff member";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
