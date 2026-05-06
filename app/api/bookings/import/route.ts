import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { bookings, customers } from "@/lib/schema";
import { eq, or } from "drizzle-orm";
import { randomUUID } from "crypto";

interface ImportAppt {
  ticket:    string;
  date:      string; // YYYY-MM-DD
  timeStart: string; // "5:00 PM"
  timeEnd:   string;
  stylist:   string;
  client:    string;
  phone:     string;
  service:   string;
  price:     number;
}

export async function POST(req: Request) {
  const err = await requireAdmin();
  if (err) return err;

  const body = await req.json() as { appointments: ImportAppt[] };
  if (!Array.isArray(body.appointments)) {
    return NextResponse.json({ error: "appointments array required" }, { status: 400 });
  }

  const today = new Date().toISOString().split("T")[0];
  let inserted = 0, skipped = 0, errors = 0;

  for (const appt of body.appointments) {
    if (!appt.date || !appt.service || !appt.stylist) { errors++; continue; }

    // Dedup by ticket number stored in notes field
    const ticketTag = `daysmart:${appt.ticket}`;
    try {
      const existing = await db.select({ id: bookings.id })
        .from(bookings)
        .where(eq(bookings.notes, ticketTag))
        .limit(1);
      if (existing.length > 0) { skipped++; continue; }
    } catch { errors++; continue; }

    // Try to resolve email from customers table via phone
    let email = `noemail+ticket${appt.ticket}@mc-placeholder.invalid`;
    if (appt.phone) {
      try {
        const [cust] = await db.select({ email: customers.email })
          .from(customers)
          .where(eq(customers.phone, appt.phone))
          .limit(1);
        if (cust) email = cust.email;
      } catch { /* non-fatal */ }
    }

    const status = appt.date < today ? "confirmed" : "pending";

    try {
      await db.insert(bookings).values({
        id:           randomUUID(),
        name:         appt.client || "Walk In",
        email,
        phone:        appt.phone || "",
        service:      appt.service,
        stylist:      appt.stylist,
        date:         appt.date,
        time:         appt.timeStart,
        notes:        ticketTag,
        status,
        createdAt:    new Date().toISOString(),
        servicePrice: appt.price || 0,
        paymentStatus: "unpaid",
      });
      inserted++;
    } catch {
      errors++;
    }
  }

  return NextResponse.json({ ok: true, inserted, skipped, errors });
}
