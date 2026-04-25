import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { getAllCustomers, updateCustomer, calcTier } from "@/lib/customers";

export async function GET() {
  try {
    const customers = getAllCustomers().map(({ passwordHash: _pw, ...rest }) => rest);
    return NextResponse.json(customers);
  } catch {
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { customerId, delta, reason } = await req.json();

    if (!customerId || typeof delta !== "number") {
      return NextResponse.json({ error: "customerId and numeric delta required" }, { status: 400 });
    }

    const customers = getAllCustomers();
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

    const newPoints = Math.max(0, customer.points + delta);
    const newTier   = calcTier(newPoints);

    const updated = updateCustomer(customerId, {
      points: newPoints,
      tier:   newTier,
    });

    return NextResponse.json({ success: true, points: newPoints, tier: newTier, reason });
  } catch {
    return NextResponse.json({ error: "Failed to adjust points" }, { status: 500 });
  }
}
