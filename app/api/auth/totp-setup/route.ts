import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { requireAdmin, getSession } from "@/lib/auth";
import { generateSecret, verifyTOTP, getTOTPUri } from "@/lib/totp";
import { getTOTPRecord, saveTOTPRecord } from "@/lib/admin-totp";

export async function GET() {
  const err = await requireAdmin();
  if (err) return err;
  const record = getTOTPRecord();
  return NextResponse.json({
    enabled: record?.enabled ?? false,
    hasSecret: !!record?.secret,
    createdAt: record?.createdAt ?? null,
  });
}

export async function POST(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;

  const session = await getSession();
  const { action, code } = await req.json();

  if (action === "generate") {
    const secret = generateSecret();
    const uri = getTOTPUri(secret, session?.email ?? "admin");
    saveTOTPRecord({ secret, enabled: false, createdAt: new Date().toISOString() });
    const qrDataUrl = await QRCode.toDataURL(uri, { width: 200, margin: 2 });
    return NextResponse.json({ secret, uri, qrDataUrl });
  }

  if (action === "enable") {
    const record = getTOTPRecord();
    if (!record?.secret) return NextResponse.json({ error: "Generate a secret first" }, { status: 400 });
    if (!verifyTOTP(record.secret, String(code))) {
      return NextResponse.json({ error: "Invalid code — try again" }, { status: 401 });
    }
    saveTOTPRecord({ ...record, enabled: true });
    return NextResponse.json({ success: true });
  }

  if (action === "disable") {
    const record = getTOTPRecord();
    if (!record?.enabled) return NextResponse.json({ error: "2FA is not enabled" }, { status: 400 });
    if (!verifyTOTP(record.secret, String(code))) {
      return NextResponse.json({ error: "Invalid code — cannot disable" }, { status: 401 });
    }
    saveTOTPRecord({ ...record, enabled: false });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
