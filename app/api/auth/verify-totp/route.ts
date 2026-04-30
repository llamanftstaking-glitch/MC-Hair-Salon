import { NextRequest, NextResponse } from "next/server";
import { verifyPartialToken, signToken } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admins";
import { verifyTOTP } from "@/lib/totp";
import { getTOTPRecord } from "@/lib/admin-totp";
import { getCustomerByEmail } from "@/lib/customers";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { limited, headers } = checkRateLimit("totp-verify", ip, 10, 15 * 60_000);
  if (limited) {
    return NextResponse.json({ error: "Too many attempts." }, { status: 429, headers });
  }

  const { tempToken, code } = await req.json();
  if (!tempToken || !code) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const email = await verifyPartialToken(tempToken);
  if (!email) {
    return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
  }

  const record = getTOTPRecord();
  if (!record?.enabled || !record.secret) {
    return NextResponse.json({ error: "2FA not configured" }, { status: 400 });
  }

  if (!verifyTOTP(record.secret, String(code))) {
    return NextResponse.json({ error: "Invalid authentication code" }, { status: 401 });
  }

  const customer = getCustomerByEmail(email);
  if (!customer) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  const isAdmin = isAdminEmail(email);
  const token = await signToken({ id: customer.id, email: customer.email, name: customer.name, isAdmin });
  const res = NextResponse.json({
    success: true,
    customer: { id: customer.id, name: customer.name, email: customer.email, isAdmin },
  });
  res.cookies.set("mc-session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
