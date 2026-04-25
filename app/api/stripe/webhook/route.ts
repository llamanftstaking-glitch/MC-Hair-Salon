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
          const m = session.metadata ?? {};
          const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
          await fetch(`${BASE}/api/gift-card`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-internal-token": process.env.INTERNAL_API_TOKEN ?? "dev-token",
            },
            body: JSON.stringify({
              action: "create",
              amount: Number(m.amount ?? 0),
              recipientName:  m.recipientName  ?? "",
              recipientEmail: m.recipientEmail ?? "",
              recipientPhone: m.recipientPhone ?? "",
              senderName:     m.senderName     ?? "",
              message:        m.message        ?? "",
              deliveryMethod: m.deliveryMethod ?? "email",
              stripeSessionId: session.id,
            }),
          });
          console.log(`[stripe/webhook] Gift card created and sent for session=${session.id}`);
        }

        if (type === "service" && bookingId) {
          updateBookingStatus(bookingId, "confirmed");
          console.log(`[stripe/webhook] Booking ${bookingId} confirmed after full payment`);
        }

        if (type === "package") {
          const { packageId, customerId } = session.metadata ?? {};
          if (packageId && customerId) {
            const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
            await fetch(`${BASE}/api/packages`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ customerId, packageId, stripeSessionId: session.id }),
            });
            console.log(`[stripe/webhook] Package ${packageId} assigned to customer ${customerId}`);
          }
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
