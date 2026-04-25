import { NextRequest, NextResponse } from "next/server";
import {
  getBookings,
  addBooking,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
} from "@/lib/bookings";
import { getStripe } from "@/lib/stripe";

export async function GET() {
  try {
    const bookings = getBookings();
    return NextResponse.json(bookings);
  } catch {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name, email, phone, service, stylist, date, time, notes,
      stripeCustomerId, stripePaymentMethodId,
    } = body;

    if (!name || !email || !phone || !service || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Retrieve card details from Stripe when payment method is provided
    let cardLast4: string | undefined;
    let cardBrand: string | undefined;

    if (stripePaymentMethodId) {
      try {
        const stripe = getStripe();
        const pm = await stripe.paymentMethods.retrieve(stripePaymentMethodId);
        if (pm.card) {
          cardLast4 = pm.card.last4;
          cardBrand = pm.card.brand;
        }
      } catch {
        // Non-fatal — card details are cosmetic
      }
    }

    const booking = addBooking({
      name,
      email,
      phone,
      service,
      stylist: stylist ?? "",
      date,
      time,
      notes: notes ?? "",
      stripeCustomerId,
      stripePaymentMethodId,
      cardLast4,
      cardBrand,
    });

    return NextResponse.json(booking, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
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

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const ok = deleteBooking(id);
    if (!ok) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}
