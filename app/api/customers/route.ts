import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { customers, bookings, customerPackages, customerRewards } from "@/lib/schema";
import { eq, or, ilike } from "drizzle-orm";
import { randomUUID } from "crypto";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const q     = searchParams.get("q");

  if (email) {
    const [customer] = await db.select().from(customers).where(eq(customers.email, email));
    if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const [cBookings, cPackages, cRewards] = await Promise.all([
      db.select().from(bookings).where(eq(bookings.email, email)),
      db.select().from(customerPackages).where(eq(customerPackages.customerId, customer.id)),
      db.select().from(customerRewards).where(eq(customerRewards.customerId, customer.id)),
    ]);

    return NextResponse.json({ customer, bookings: cBookings, packages: cPackages, rewards: cRewards });
  }

  const list = q
    ? await db.select().from(customers).where(
        or(ilike(customers.name, `%${q}%`), ilike(customers.email, `%${q}%`))
      )
    : await db.select().from(customers);

  return NextResponse.json({ customers: list });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { email, ...fields } = body;
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });

  const allowed = ["name","phone","birthday","preferredStylist","allergies","adminNotes","tier","points"];
  const update: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in fields) update[key] = fields[key];
  }

  if (Object.keys(update).length === 0)
    return NextResponse.json({ error: "No valid fields" }, { status: 400 });

  await db.update(customers).set(update).where(eq(customers.email, email));
  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest) {
  const { name, email, phone, birthday, preferredStylist, allergies, adminNotes } = await req.json();
  if (!name || !email) return NextResponse.json({ error: "name and email required" }, { status: 400 });

  const existing = await db.select().from(customers).where(eq(customers.email, email));
  if (existing.length > 0) return NextResponse.json({ error: "Email already registered" }, { status: 409 });

  const newCustomer = {
    id:        randomUUID(),
    name:      name.trim(),
    email:     email.trim().toLowerCase(),
    phone:     phone?.trim() ?? "",
    createdAt: new Date().toISOString(),
    birthday:  birthday || null,
    preferredStylist: preferredStylist || null,
    allergies: allergies || null,
    adminNotes: adminNotes || null,
  };

  await db.insert(customers).values(newCustomer);
  return NextResponse.json({ ok: true, customer: newCustomer });
}
