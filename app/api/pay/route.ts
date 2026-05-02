import { NextRequest, NextResponse } from "next/server";
import { getBookings, updateBooking } from "@/lib/bookings";
import { getStripe } from "@/lib/stripe";

// GET — public: return safe booking fields for the payment page
export async function GET(req: NextRequest) {
  const bookingId = req.nextUrl.searchParams.get("bookingId");
  if (!bookingId) return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });

  const all = await getBookings();
  const booking = all.find(b => b.id === bookingId);
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (booking.status !== "confirmed") return NextResponse.json({ error: "Booking not confirmed" }, { status: 400 });

  return NextResponse.json({
    id:             booking.id,
    name:           booking.name,
    service:        booking.service,
    stylist:        booking.stylist,
    date:           booking.date,
    time:           booking.time,
    servicePrice:   booking.servicePrice,
    paymentStatus:  booking.paymentStatus ?? "unpaid",
    tipAmount:      booking.tipAmount,
  });
}

// POST — create a PaymentIntent for service + tip
export async function POST(req: NextRequest) {
  try {
    const { bookingId, tipAmount } = await req.json() as { bookingId: string; tipAmount: number };
    if (!bookingId) return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });

    const all = await getBookings();
    const booking = all.find(b => b.id === bookingId);
    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    if (booking.status !== "confirmed") return NextResponse.json({ error: "Booking not confirmed" }, { status: 400 });
    if (booking.paymentStatus === "paid") return NextResponse.json({ error: "Already paid" }, { status: 400 });
    if (!booking.servicePrice || booking.servicePrice <= 0) {
      return NextResponse.json({ error: "No price set on this booking" }, { status: 400 });
    }

    const tip = Math.max(0, tipAmount ?? 0);
    const totalCents = Math.round((booking.servicePrice + tip) * 100);
    if (totalCents < 50) return NextResponse.json({ error: "Amount too small" }, { status: 400 });

    const stripe = getStripe();
    const intent = await stripe.paymentIntents.create({
      amount:      totalCents,
      currency:    "usd",
      description: `MC Hair Salon — ${booking.service} (${booking.name})`,
      metadata:    { bookingId, tipAmount: String(tip) },
    });

    await updateBooking(bookingId, { paymentIntentId: intent.id });

    return NextResponse.json({ clientSecret: intent.client_secret });
  } catch {
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
  }
}

// PATCH — mark booking as paid (called by client after Stripe confirms)
export async function PATCH(req: NextRequest) {
  try {
    const { bookingId, tipAmount, paymentIntentId } = await req.json() as {
      bookingId: string; tipAmount: number; paymentIntentId: string;
    };
    if (!bookingId) return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });

    // Verify the PaymentIntent actually succeeded before marking paid
    const stripe = getStripe();
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (intent.status !== "succeeded") {
      return NextResponse.json({ error: "Payment not confirmed" }, { status: 400 });
    }

    await updateBooking(bookingId, {
      paymentStatus:   "paid",
      tipAmount:       tipAmount ?? 0,
      paymentIntentId,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to confirm payment" }, { status: 500 });
  }
}
