import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getCustomerByEmail, createCustomer } from "@/lib/customers";
import { signToken } from "@/lib/auth";
import { addSubscriber } from "@/lib/newsletter";

export async function POST(req: NextRequest) {
  const { name, email, password, phone, subscribeToNewsletter } = await req.json();

  if (!name || !email || !password)
    return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });

  if (password.length < 8)
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });

  const existing = await getCustomerByEmail(email);
  if (existing)
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 10);
  const customer = await createCustomer({ name, email, phone: phone || "", passwordHash });

  if (subscribeToNewsletter) {
    addSubscriber(email, name).catch(() => {});
  }

  const token = await signToken({
    id: customer.id,
    email: customer.email,
    name: customer.name,
    isAdmin: false,
  });

  const res = NextResponse.json({
    success: true,
    customer: { id: customer.id, name: customer.name, email: customer.email },
  });
  res.cookies.set("mc-session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return res;
}
