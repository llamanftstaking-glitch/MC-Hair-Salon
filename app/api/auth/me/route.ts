import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getCustomerById } from "@/lib/customers";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const customer = await getCustomerById(session.id);
  if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

  const { passwordHash: _, ...safe } = customer;
  return NextResponse.json(safe);
}
