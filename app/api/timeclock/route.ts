import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import {
  getTimeEntries, addTimeEntry, updateTimeEntry, deleteTimeEntry,
} from "@/lib/timeclock";

export async function GET(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  const from = req.nextUrl.searchParams.get("from") ?? undefined;
  const to   = req.nextUrl.searchParams.get("to")   ?? undefined;
  return NextResponse.json(await getTimeEntries(from, to));
}

export async function POST(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "clock_in") {
      const { staffId, staffName } = body;
      if (!staffId || !staffName) return NextResponse.json({ error: "Missing staff info" }, { status: 400 });
      const now = new Date();
      const entry = await addTimeEntry({
        staffId, staffName,
        clockIn: now.toISOString(),
        date:    now.toISOString().split("T")[0],
      });
      return NextResponse.json(entry, { status: 201 });
    }

    if (action === "clock_out") {
      const { entryId } = body;
      if (!entryId) return NextResponse.json({ error: "Missing entryId" }, { status: 400 });
      const updated = await updateTimeEntry(entryId, { clockOut: new Date().toISOString() });
      return updated ? NextResponse.json(updated) : NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    if (action === "manual") {
      const { staffId, staffName, clockIn, clockOut, date, notes } = body;
      if (!staffId || !staffName || !clockIn || !date) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }
      const entry = await addTimeEntry({ staffId, staffName, clockIn, clockOut, date, notes });
      return NextResponse.json(entry, { status: 201 });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  try {
    const { id, ...updates } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const updated = await updateTimeEntry(id, updates);
    return updated ? NextResponse.json(updated) : NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  try {
    const { id } = await req.json();
    const ok = await deleteTimeEntry(id);
    return ok ? NextResponse.json({ success: true }) : NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
