import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { getAllCustomers, updateCustomer, calcTier } from "@/lib/customers";
import { requireAdmin } from "@/lib/auth";

// GET — admin only (returns all customer data)
export async function GET() {
  const err = await requireAdmin();
  if (err) return err;
  try {
    const customers = (await getAllCustomers()).map(({ passwordHash: _pw, ...rest }) => rest);
    return NextResponse.json(customers);
  } catch {
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

// POST — admin only (manual points adjustment)
export async function POST(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  try {
    const { customerId, delta, reason } = await req.json();

    if (!customerId || typeof delta !== "number") {
      return NextResponse.json({ error: "customerId and numeric delta required" }, { status: 400 });
    }

    const customers = await getAllCustomers();
    const customer  = customers.find((c) => c.id === customerId);
    if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

    const newPoints = Math.max(0, customer.points + delta);
    const newTier   = calcTier(newPoints);

    await updateCustomer(customerId, { points: newPoints, tier: newTier });

    return NextResponse.json({ success: true, points: newPoints, tier: newTier, reason });
  } catch {
    return NextResponse.json({ error: "Failed to adjust points" }, { status: 500 });
  }
}
