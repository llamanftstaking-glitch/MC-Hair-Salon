import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getCustomerById, updateCustomer } from "@/lib/customers";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const customer = await getCustomerById(session.id);
  if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

  const { passwordHash: _, ...safe } = customer;
  return NextResponse.json(safe);
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json();
  const updates: Record<string, string> = {};

  if (body.name?.trim())  updates.name  = body.name.trim().slice(0, 120);
  if (body.email?.trim()) updates.email = body.email.trim().toLowerCase().slice(0, 254);
  if (body.phone?.trim()) updates.phone = body.phone.trim().slice(0, 30);

  if (body.password) {
    if (body.password.length < 8)
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    updates.passwordHash = await bcrypt.hash(body.password, 10);
  }

  if (Object.keys(updates).length === 0)
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });

  const updated = await updateCustomer(session.id, updates as never);
  if (!updated) return NextResponse.json({ error: "Update failed" }, { status: 500 });

  const { passwordHash: _, ...safe } = updated;
  return NextResponse.json(safe);
}
