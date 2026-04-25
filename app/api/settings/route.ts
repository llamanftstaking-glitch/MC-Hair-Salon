import { NextRequest, NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/settings";
import { requireAdmin } from "@/lib/auth";

// GET — public (site settings like hours are read by the frontend)
export async function GET() {
  try {
    return NextResponse.json(getSettings());
  } catch {
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

// POST — admin only
export async function POST(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  try {
    const body    = await req.json();
    const updated = updateSettings(body);
    return NextResponse.json(updated);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to save settings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
