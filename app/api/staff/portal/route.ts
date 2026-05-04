import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getBookings } from "@/lib/bookings";
import { db } from "@/lib/db";
import { staff as staffTable } from "@/lib/schema";

const STAFF_DOMAIN = "@mchairsalon.com";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!session.email.endsWith(STAFF_DOMAIN)) {
    return NextResponse.json({ error: "Not a staff account" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get("start") ?? new Date().toISOString().split("T")[0];
  const endDate   = searchParams.get("end")   ?? startDate;

  // Derive staff name from email prefix (e.g. maria@... → "Maria")
  const emailPrefix = session.email.split("@")[0];
  const staffName   = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);

  try {
    const allBookings = await getBookings();

    // Filter bookings by stylist name and date range
    const myBookings = allBookings.filter(b => {
      if (!b.stylist || !b.stylist.toLowerCase().includes(emailPrefix.toLowerCase())) return false;
      return b.date >= startDate && b.date <= endDate;
    });

    // Sales totals
    const totalRevenue = myBookings
      .filter(b => b.status === "confirmed")
      .reduce((sum, b) => sum + (b.servicePrice ?? 0), 0);

    const confirmedCount = myBookings.filter(b => b.status === "confirmed").length;
    const pendingCount   = myBookings.filter(b => b.status === "pending").length;

    // Fetch staff row for display info
    const staffRows = await db.select().from(staffTable);
    const staffRow  = staffRows.find(s =>
      s.name.toLowerCase().includes(emailPrefix.toLowerCase())
    );

    return NextResponse.json({
      staffName: staffRow?.name ?? staffName,
      role:      staffRow?.role ?? "Stylist",
      bookings:  myBookings,
      stats: {
        totalRevenue,
        confirmedCount,
        pendingCount,
        totalCount: myBookings.length,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to load portal data" }, { status: 500 });
  }
}
