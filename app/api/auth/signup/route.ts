import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getCustomerByEmail, createCustomer } from "@/lib/customers";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { name, email, phone, password } = await req.json();

  if (!name || !email || !password)
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

  if (getCustomerByEmail(email))
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 10);
  const customer = createCustomer({ name, email, phone: phone || "", passwordHash });

  const token = await signToken({ id: customer.id, email: customer.email, name: customer.name });

  const res = NextResponse.json({ success: true, customer: { id: customer.id, name: customer.name, email: customer.email } });
  res.cookies.set("mc-session", token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", maxAge: 60 * 60 * 24 * 30, path: "/",
  });
  return res;
}
