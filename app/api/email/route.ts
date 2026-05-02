import { NextRequest, NextResponse } from "next/server";
import { sendBookingConfirmedEmail, sendBookingCancelledEmail, sendContactReply } from "@/lib/email";
import { getBookings } from "@/lib/bookings";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === "confirm_booking") {
      const bookings = await getBookings();
      const booking = bookings.find(b => b.id === body.bookingId);
      if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
      await sendBookingConfirmedEmail(booking);
      return NextResponse.json({ success: true, message: `Confirmation sent to ${booking.email}` });
    }

    if (body.action === "cancel_booking") {
      const bookings = await getBookings();
      const booking = bookings.find(b => b.id === body.bookingId);
      if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
      await sendBookingCancelledEmail(booking);
      return NextResponse.json({ success: true, message: `Cancellation sent to ${booking.email}` });
    }

    if (body.action === "contact_reply") {
      const { to, name, message } = body;
      if (!to || !name || !message) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
      await sendContactReply(to, name, message);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Email failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
