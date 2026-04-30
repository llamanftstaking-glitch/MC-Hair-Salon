import { NextRequest, NextResponse } from "next/server";
import {
  getBookings,
  addBooking,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
} from "@/lib/bookings";
import { getStripe } from "@/lib/stripe";
import { requireAdmin } from "@/lib/auth";
import { sendBookingConfirmation, sendNewBookingNotification } from "@/lib/email";

// GET — admin only
export async function GET() {
  const err = await requireAdmin();
  if (err) return err;
  try {
    return NextResponse.json(getBookings());
  } catch {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

// POST — public (guests booking appointments)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, email, phone, service, stylist, date, time, notes,
      servicePrice, stripeCustomerId, stripePaymentMethodId,
    } = body;

    if (!name || !email || !phone || !service || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Basic length guards
    if (name.length > 120 || email.length > 254 || phone.length > 30 || service.length > 200) {
      return NextResponse.json({ error: "Input too long" }, { status: 400 });
    }

    let cardLast4: string | undefined;
    let cardBrand: string | undefined;

    if (stripePaymentMethodId) {
      try {
        const stripe = getStripe();
        const pm = await stripe.paymentMethods.retrieve(stripePaymentMethodId);
        if (pm.card) { cardLast4 = pm.card.last4; cardBrand = pm.card.brand; }
      } catch {
        // Non-fatal
      }
    }

    const booking = addBooking({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      service: service.trim(),
      stylist: stylist?.trim() ?? "",
      date,
      time,
      notes: (notes ?? "").slice(0, 1000),
      servicePrice: typeof servicePrice === "number" ? servicePrice : undefined,
      stripeCustomerId,
      stripePaymentMethodId,
      cardLast4,
      cardBrand,
    });

    // Confirmation to client — non-fatal if Resend key isn't configured yet
    sendBookingConfirmation(booking).catch(err =>
      console.error("[bookings] Confirmation failed:", err)
    );
    // Notify the salon inbox so the owner sees the new booking in their email
    sendNewBookingNotification(booking).catch(err =>
      console.error("[bookings] Salon notification failed:", err)
    );

    return NextResponse.json(booking, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

// PATCH — admin only
export async function PATCH(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  try {
    const { id, status, ...rest } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    if (Object.keys(rest).length > 0) {
      const updated = updateBooking(id, { status, ...rest });
      if (!updated) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
      return NextResponse.json(updated);
    }
    const ok = updateBookingStatus(id, status);
    if (!ok) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}

// DELETE — admin only
export async function DELETE(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;
  try {
    const { id } = await req.json();
    const ok = deleteBooking(id);
    if (!ok) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}
