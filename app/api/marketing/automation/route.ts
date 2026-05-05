import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getKey, upsertKey } from "@/lib/settings";

export const dynamic = "force-dynamic";

const SETTINGS_KEY = "marketing-automation";

interface AutomationSettings {
  appointmentReminder: boolean;
  reEngagement: boolean;
  birthdayOffer: boolean;
}

const DEFAULTS: AutomationSettings = {
  appointmentReminder: false,
  reEngagement: false,
  birthdayOffer: false,
};

async function readSettings(): Promise<AutomationSettings> {
  try {
    const stored = await getKey(SETTINGS_KEY);
    if (!stored) return { ...DEFAULTS };
    return { ...DEFAULTS, ...(stored as Partial<AutomationSettings>) };
  } catch {
    return { ...DEFAULTS };
  }
}

export async function GET() {
  const err = await requireAdmin();
  if (err) return err;
  try {
    return NextResponse.json(await readSettings());
  } catch {
    return NextResponse.json({ error: "Failed to load automation settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  try {
    const body = await req.json();
    const current = await readSettings();
    const updated: AutomationSettings = {
      appointmentReminder: typeof body.appointmentReminder === "boolean" ? body.appointmentReminder : current.appointmentReminder,
      reEngagement:        typeof body.reEngagement        === "boolean" ? body.reEngagement        : current.reEngagement,
      birthdayOffer:       typeof body.birthdayOffer       === "boolean" ? body.birthdayOffer       : current.birthdayOffer,
    };
    await upsertKey(SETTINGS_KEY, updated);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to save automation settings" }, { status: 500 });
  }
}
