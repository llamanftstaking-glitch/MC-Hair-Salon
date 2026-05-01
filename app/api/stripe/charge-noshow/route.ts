import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getBookings, updateBooking } from "@/lib/bookings";
import { requireAdmin } from "@/lib/auth";

// POST — admin only (charge a no-show fee against a customer's saved card)
export async function POST(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;

  try {
    const { bookingId } = await req.json();
    if (!bookingId) return NextResponse.json({ error: "bookingId required" }, { status: 400 });

    const bookings = await getBookings();
    const booking  = bookings.find((b) => b.id === bookingId);
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    if (!booking.stripeCustomerId || !booking.stripePaymentMethodId) {
      return NextResponse.json({ error: "No card on file for this booking" }, { status: 400 });
    }
    if (!booking.servicePrice || booking.servicePrice <= 0) {
      return NextResponse.json({ error: "No service price on record — cannot compute 30% fee" }, { status: 400 });
    }

    const feeAmount = Math.round(booking.servicePrice * 0.30 * 100); // cents

    const stripe = getStripe();
    const paymentIntent = await stripe.paymentIntents.create({
      amount:         feeAmount,
      currency:       "usd",
      customer:       booking.stripeCustomerId,
      payment_method: booking.stripePaymentMethodId,
      confirm:        true,
      off_session:    true,
      description:    `Cancellation fee (30%) — ${booking.service} on ${booking.date} at ${booking.time}`,
      metadata:       { bookingId, customerName: booking.name, serviceTotalCents: booking.servicePrice * 100 },
    });

    await updateBooking(bookingId, { status: "cancelled", cancellationChargeId: paymentIntent.id });

    const feeInDollars = Math.round(booking.servicePrice * 0.30 * 100) / 100;
    return NextResponse.json({ success: true, chargeId: paymentIntent.id, amount: feeInDollars });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to charge no-show fee";
    console.error("[stripe/charge-noshow]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
