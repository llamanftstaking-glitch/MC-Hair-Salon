import { NextRequest, NextResponse } from "next/server";
import { getSettings, updateSettings, upsertKey, getKey } from "@/lib/settings";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET — public
export async function GET() {
  try {
    const settings = await getSettings();
    const vibe = await getKey("vibe").catch(() => null);
    return NextResponse.json({ ...settings, ...(vibe ? { vibe } : {}) });
  } catch {
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

// POST — admin only (full settings update)
export async function POST(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  try {
    const body    = await req.json();
    const updated = await updateSettings(body);
    return NextResponse.json(updated);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to save settings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PATCH — admin only (single key-value upsert)
export async function PATCH(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  try {
    const { key, value } = await req.json();
    if (!key) return NextResponse.json({ error: "Missing key" }, { status: 400 });
    await upsertKey(key, value);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save setting" }, { status: 500 });
  }
}
