import { NextRequest, NextResponse } from "next/server";
import { getAllStaff, createStaff, updateStaff, deleteStaff } from "@/lib/staff-data";

export async function GET() {
  try {
    return NextResponse.json(getAllStaff());
  } catch {
    return NextResponse.json({ error: "Failed to load staff" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body    = await req.json();
    const created = createStaff(body);
    return NextResponse.json(created, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create staff member";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const updated = updateStaff(id, updates);
    return NextResponse.json(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update staff member";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    deleteStaff(id);
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete staff member";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
