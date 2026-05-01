import { NextRequest, NextResponse } from "next/server";
import { getStripe, STRIPE_WEBHOOK_SECRET } from "@/lib/stripe";
import { updateBookingStatus } from "@/lib/bookings";
import { createGiftCard } from "@/lib/gift-cards";
import { getCustomerById, updateCustomer } from "@/lib/customers";
import { hasProcessedEvent, markEventProcessed } from "@/lib/webhook-events";
import { PACKAGES } from "@/lib/data";
import type { CustomerPackage } from "@/lib/customers";
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

  // ── Idempotency check ──────────────────────────────────────────────────────
  if (await hasProcessedEvent(event.id)) {
    console.log(`[stripe/webhook] Already processed event ${event.id} — skipping`);
    return NextResponse.json({ received: true });
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
          await updateBookingStatus(bookingId, "confirmed");
          console.log(`[stripe/webhook] Booking ${bookingId} confirmed after deposit payment`);
        }

        if (type === "gift_card") {
          const m = session.metadata ?? {};
          const card = await createGiftCard({
            amount:          Number(m.amount ?? 0),
            recipientName:   m.recipientName  ?? "",
            recipientEmail:  m.recipientEmail || undefined,
            recipientPhone:  m.recipientPhone || undefined,
            senderName:      m.senderName     ?? "",
            senderEmail:     m.senderEmail || session.customer_email || undefined,
            message:         m.message        ?? "",
            deliveryMethod:  (m.deliveryMethod ?? "email") as "email" | "sms" | "both",
            stripeSessionId: session.id,
          });
          console.log(`[stripe/webhook] Gift card ${card.code} created for session=${session.id}`);

          // Fire email delivery via the email lib (non-fatal)
          try {
            const { sendGiftCardEmail, sendNewGiftCardNotification } = await import("@/lib/email");
            sendNewGiftCardNotification(card).catch(err =>
              console.error("[stripe/webhook] Gift card salon notification failed:", err)
            );
            if ((card.deliveryMethod === "email" || card.deliveryMethod === "both") && card.recipientEmail) {
              await sendGiftCardEmail(card).catch(err =>
                console.error("[stripe/webhook] Gift card email failed:", err)
              );
            }
          } catch (e) {
            console.error("[stripe/webhook] Email import failed:", e);
          }
        }

        if (type === "service" && bookingId) {
          await updateBookingStatus(bookingId, "confirmed");
          console.log(`[stripe/webhook] Booking ${bookingId} confirmed after full payment`);
        }

        if (type === "package") {
          const { packageId, customerId } = session.metadata ?? {};
          if (packageId && customerId) {
            const pkg = PACKAGES.find(p => p.id === packageId);
            if (!pkg) {
              console.error(`[stripe/webhook] Package ${packageId} not found`);
              break;
            }
            const customer = await getCustomerById(customerId);
            if (!customer) {
              console.error(`[stripe/webhook] Customer ${customerId} not found`);
              break;
            }
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + pkg.validityDays);
            const newPkg: CustomerPackage = {
              id:             `cpkg_${Date.now()}`,
              packageId:      pkg.id,
              name:           pkg.name,
              tagline:        pkg.tagline,
              services:       pkg.services,
              price:          pkg.price,
              sessionsTotal:  pkg.sessions,
              sessionsUsed:   0,
              purchasedAt:    new Date().toISOString(),
              expiresAt:      expiresAt.toISOString(),
              stripeSessionId: session.id,
            };
            await updateCustomer(customerId, {
              packages:   [...customer.packages, newPkg],
              points:     customer.points + Math.floor(pkg.price),
              totalSpent: customer.totalSpent + pkg.price,
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

    // Mark as processed so duplicate deliveries are ignored
    await markEventProcessed(event.id);

    return NextResponse.json({ received: true });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Webhook handler error";
    console.error("[stripe/webhook] Handler error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
