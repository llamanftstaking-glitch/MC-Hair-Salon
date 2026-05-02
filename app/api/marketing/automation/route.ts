import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import * as fs from "fs";
import * as path from "path";

export const dynamic = "force-dynamic";

const DATA_PATH = path.join(process.cwd(), "data", "marketing-automation.json");

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

function readSettings(): AutomationSettings {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf8");
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

function writeSettings(settings: AutomationSettings): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(settings, null, 2), "utf8");
}

export async function GET() {
  const err = await requireAdmin();
  if (err) return err;
  try {
    return NextResponse.json(readSettings());
  } catch {
    return NextResponse.json({ error: "Failed to load automation settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  try {
    const body = await req.json();
    const current = readSettings();
    const updated: AutomationSettings = {
      appointmentReminder: typeof body.appointmentReminder === "boolean" ? body.appointmentReminder : current.appointmentReminder,
      reEngagement: typeof body.reEngagement === "boolean" ? body.reEngagement : current.reEngagement,
      birthdayOffer: typeof body.birthdayOffer === "boolean" ? body.birthdayOffer : current.birthdayOffer,
    };
    writeSettings(updated);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to save automation settings" }, { status: 500 });
  }
}
