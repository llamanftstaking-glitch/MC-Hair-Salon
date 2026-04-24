import { NextRequest, NextResponse } from "next/server";
import { getStripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";
import { updateBookingStatus } from "@/lib/bookings";
import Stripe from "stripe";

// Required: disable body parsing so we get the raw buffer for signature verification
export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  if (!STRIPE_WEBHOOK_SECRET) {
    console.error("[stripe/webhook] STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    const rawBody = await req.text();
    event = (await getStripe()).webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook signature verification failed";
    console.error("[stripe/webhook] Signature error:", message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  // ── Handle events ──────────────────────────────────────────────────────────
  try {
    switch (event.type) {

      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const { type, bookingId } = session.metadata ?? {};

        console.log(`[stripe/webhook] checkout.session.completed — type=${type}, bookingId=${bookingId}`);

        if (type === "deposit" && bookingId) {
          // Mark booking as confirmed when deposit is paid
          updateBookingStatus(bookingId, "confirmed");
          console.log(`[stripe/webhook] Booking ${bookingId} confirmed after deposit payment`);
        }

        if (type === "gift_card") {
          // TODO: generate and email a gift card code to the customer
          console.log(`[stripe/webhook] Gift card purchased — amount=$${session.metadata?.amount}, session=${session.id}`);
        }

        if (type === "service" && bookingId) {
          updateBookingStatus(bookingId, "confirmed");
          console.log(`[stripe/webhook] Booking ${bookingId} confirmed after full payment`);
        }

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`[stripe/webhook] Checkout expired — session=${session.id}`);
        break;
      }

      case "payment_intent.payment_failed": {
        const intent = event.data.object as Stripe.PaymentIntent;
        console.log(`[stripe/webhook] Payment failed — intent=${intent.id}, reason=${intent.last_payment_error?.message}`);
        break;
      }

      default:
        console.log(`[stripe/webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook handler error";
    console.error("[stripe/webhook] Handler error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
