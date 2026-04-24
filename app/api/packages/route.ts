import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getCustomerById, updateCustomer } from "@/lib/customers";
import type { CustomerPackage } from "@/lib/customers";
import { PACKAGES } from "@/lib/data";

// GET — return customer's purchased packages (requires auth)
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const customer = getCustomerById(session.id);
    if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    return NextResponse.json(customer.packages);
  } catch {
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 });
  }
}

// POST — assign a purchased package to a customer (called from Stripe webhook)
export async function POST(req: NextRequest) {
  try {
    const { customerId, packageId, stripeSessionId } = await req.json();

    const pkg = PACKAGES.find(p => p.id === packageId);
    if (!pkg) return NextResponse.json({ error: "Package not found" }, { status: 404 });

    const customer = getCustomerById(customerId);
    if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + pkg.validityDays);

    const newPkg: CustomerPackage = {
      id: `cpkg_${Date.now()}`,
      packageId: pkg.id,
      name: pkg.name,
      tagline: pkg.tagline,
      services: pkg.services,
      price: pkg.price,
      sessionsTotal: pkg.sessions,
      sessionsUsed: 0,
      purchasedAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      stripeSessionId,
    };

    const updated = updateCustomer(customerId, {
      packages: [...customer.packages, newPkg],
      points: customer.points + Math.floor(pkg.price),
      totalSpent: customer.totalSpent + pkg.price,
    });

    return NextResponse.json(updated, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to assign package" }, { status: 500 });
  }
}

// PATCH — use a session from a package (admin action)
export async function PATCH(req: NextRequest) {
  try {
    const { customerId, customerPackageId } = await req.json();
    const customer = getCustomerById(customerId);
    if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

    const pkgs = customer.packages.map(p =>
      p.id === customerPackageId && p.sessionsUsed < p.sessionsTotal
        ? { ...p, sessionsUsed: p.sessionsUsed + 1 }
        : p
    );

    const updated = updateCustomer(customerId, { packages: pkgs });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update package" }, { status: 500 });
  }
}
