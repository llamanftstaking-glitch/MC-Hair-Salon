import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { admins, bookings } from "@/lib/schema";
import { inArray, eq } from "drizzle-orm";

const KEEP_ADMINS = ["hello@mchairsalon.com"];
const REMOVE_ADMINS = [
  "sally@mchairsalon.com",
  "nathaly@mchairsalon.com",
  "admin@mchairsalonspa.com",
];
const REMOVE_BOOKINGS = ["MC-1778003032772"];

export async function POST(req: NextRequest) {
  const EXPECTED = process.env.BOOTSTRAP_TOKEN;
  if (!EXPECTED) {
    return NextResponse.json(
      { error: "BOOTSTRAP_TOKEN secret is not set on the server" },
      { status: 503 }
    );
  }

  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

  if (token !== EXPECTED) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const removedAdmins = await db
      .delete(admins)
      .where(inArray(admins.email, REMOVE_ADMINS))
      .returning({ email: admins.email });

    const deletedBookings: { id: string }[] = [];
    for (const id of REMOVE_BOOKINGS) {
      const r = await db
        .delete(bookings)
        .where(eq(bookings.id, id))
        .returning({ id: bookings.id });
      deletedBookings.push(...r);
    }

    const finalAdmins = await db.select().from(admins);
    const remainingBookings = await db.select({ id: bookings.id }).from(bookings);

    return NextResponse.json({
      success: true,
      removedAdmins: removedAdmins.map((a) => a.email),
      deletedBookings: deletedBookings.map((b) => b.id),
      finalAdmins: finalAdmins.map((a) => a.email),
      bookingsRemaining: remainingBookings.length,
      kept: KEEP_ADMINS,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Cleanup failed" },
      { status: 500 }
    );
  }
}
