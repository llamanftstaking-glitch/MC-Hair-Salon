import "server-only";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { bookings as bookingsTable } from "./schema";

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  stylist: string;
  date: string;
  time: string;
  notes?: string;
  status: "pending" | "confirmed" | "cancelled" | "no_show";
  createdAt: string;
  servicePrice?: number;
  stripeCustomerId?: string;
  stripePaymentMethodId?: string;
  cardLast4?: string;
  cardBrand?: string;
  noshowChargeId?: string;
  cancellationChargeId?: string;
}

function rowToBooking(row: typeof bookingsTable.$inferSelect): Booking {
  return {
    id:                    row.id,
    name:                  row.name,
    email:                 row.email,
    phone:                 row.phone,
    service:               row.service,
    stylist:               row.stylist,
    date:                  row.date,
    time:                  row.time,
    notes:                 row.notes ?? undefined,
    status:                row.status as Booking["status"],
    createdAt:             row.createdAt,
    servicePrice:          row.servicePrice ?? undefined,
    stripeCustomerId:      row.stripeCustomerId ?? undefined,
    stripePaymentMethodId: row.stripePaymentMethodId ?? undefined,
    cardLast4:             row.cardLast4 ?? undefined,
    cardBrand:             row.cardBrand ?? undefined,
    noshowChargeId:        row.noshowChargeId ?? undefined,
    cancellationChargeId:  row.cancellationChargeId ?? undefined,
  };
}

export async function getBookings(): Promise<Booking[]> {
  const rows = await db.select().from(bookingsTable);
  return rows.map(rowToBooking);
}

export async function addBooking(
  booking: Omit<Booking, "id" | "status" | "createdAt">
): Promise<Booking> {
  const newBooking: Booking = {
    ...booking,
    id:        `MC-${Date.now()}`,
    status:    "pending",
    createdAt: new Date().toISOString(),
  };
  await db.insert(bookingsTable).values({
    id:                    newBooking.id,
    name:                  newBooking.name,
    email:                 newBooking.email,
    phone:                 newBooking.phone,
    service:               newBooking.service,
    stylist:               newBooking.stylist,
    date:                  newBooking.date,
    time:                  newBooking.time,
    notes:                 newBooking.notes ?? null,
    status:                newBooking.status,
    createdAt:             newBooking.createdAt,
    servicePrice:          newBooking.servicePrice ?? null,
    stripeCustomerId:      newBooking.stripeCustomerId ?? null,
    stripePaymentMethodId: newBooking.stripePaymentMethodId ?? null,
    cardLast4:             newBooking.cardLast4 ?? null,
    cardBrand:             newBooking.cardBrand ?? null,
    noshowChargeId:        newBooking.noshowChargeId ?? null,
    cancellationChargeId:  newBooking.cancellationChargeId ?? null,
  });
  return newBooking;
}

export async function updateBooking(
  id: string,
  updates: Partial<Omit<Booking, "id" | "createdAt">>
): Promise<Booking | null> {
  const dbUpdates: Partial<typeof bookingsTable.$inferInsert> = {};
  if (updates.name !== undefined)                  dbUpdates.name = updates.name;
  if (updates.email !== undefined)                 dbUpdates.email = updates.email;
  if (updates.phone !== undefined)                 dbUpdates.phone = updates.phone;
  if (updates.service !== undefined)               dbUpdates.service = updates.service;
  if (updates.stylist !== undefined)               dbUpdates.stylist = updates.stylist;
  if (updates.date !== undefined)                  dbUpdates.date = updates.date;
  if (updates.time !== undefined)                  dbUpdates.time = updates.time;
  if ("notes" in updates)                          dbUpdates.notes = updates.notes ?? null;
  if (updates.status !== undefined)                dbUpdates.status = updates.status;
  if ("servicePrice" in updates)                   dbUpdates.servicePrice = updates.servicePrice ?? null;
  if ("stripeCustomerId" in updates)               dbUpdates.stripeCustomerId = updates.stripeCustomerId ?? null;
  if ("stripePaymentMethodId" in updates)          dbUpdates.stripePaymentMethodId = updates.stripePaymentMethodId ?? null;
  if ("cardLast4" in updates)                      dbUpdates.cardLast4 = updates.cardLast4 ?? null;
  if ("cardBrand" in updates)                      dbUpdates.cardBrand = updates.cardBrand ?? null;
  if ("noshowChargeId" in updates)                 dbUpdates.noshowChargeId = updates.noshowChargeId ?? null;
  if ("cancellationChargeId" in updates)           dbUpdates.cancellationChargeId = updates.cancellationChargeId ?? null;

  if (Object.keys(dbUpdates).length === 0) {
    const rows = await db.select().from(bookingsTable).where(eq(bookingsTable.id, id));
    return rows.length ? rowToBooking(rows[0]) : null;
  }

  await db.update(bookingsTable).set(dbUpdates).where(eq(bookingsTable.id, id));
  const rows = await db.select().from(bookingsTable).where(eq(bookingsTable.id, id));
  return rows.length ? rowToBooking(rows[0]) : null;
}

export async function updateBookingStatus(
  id: string,
  status: Booking["status"]
): Promise<boolean> {
  const result = await updateBooking(id, { status });
  return result !== null;
}

export async function deleteBooking(id: string): Promise<boolean> {
  const result = await db
    .delete(bookingsTable)
    .where(eq(bookingsTable.id, id))
    .returning({ id: bookingsTable.id });
  return result.length > 0;
}
