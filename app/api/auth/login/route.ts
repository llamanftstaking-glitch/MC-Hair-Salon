import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getCustomerByEmail } from "@/lib/customers";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password)
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });

  const customer = getCustomerByEmail(email);
  if (!customer)
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

  const valid = await bcrypt.compare(password, customer.passwordHash);
  if (!valid)
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });

  const token = await signToken({ id: customer.id, email: customer.email, name: customer.name });

  const res = NextResponse.json({ success: true, customer: { id: customer.id, name: customer.name, email: customer.email } });
  res.cookies.set("mc-session", token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", maxAge: 60 * 60 * 24 * 30, path: "/",
  });
  return res;
}
