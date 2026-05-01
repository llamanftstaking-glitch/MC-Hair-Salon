import "server-only";
import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  const { customerId } = await params;

  if (!customerId) {
    return NextResponse.json({ error: "Missing customerId" }, { status: 400 });
  }

  const url    = `${BASE}/scan/${customerId}`;
  const buffer = await QRCode.toBuffer(url, {
    type:   "png",
    width:  400,
    margin: 2,
    color:  { dark: "#000000", light: "#ffffff" },
  });

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type":  "image/png",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
