import { NextRequest, NextResponse } from "next/server";
import { getStripe, PRICES } from "@/lib/stripe";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, bookingId, bookingDetails, giftCardAmount, customerEmail, customerName,
            recipientName, recipientEmail, recipientPhone, senderName, message, deliveryMethod,
            packageId, customerId } = body;

    if (!type) {
      return NextResponse.json({ error: "Missing checkout type" }, { status: 400 });
    }

    // ── Booking Deposit ──────────────────────────────────────────────────────
    if (type === "deposit") {
      if (!bookingId || !bookingDetails) {
        return NextResponse.json({ error: "Missing bookingId or bookingDetails" }, { status: 400 });
      }

      const session = await (await getStripe()).checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: customerEmail,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: PRICES.booking_deposit,
              product_data: {
                name: "MC Hair Salon — Appointment Deposit",
                description: `${bookingDetails.service} · ${bookingDetails.date} at ${bookingDetails.time}${bookingDetails.stylist ? ` · with ${bookingDetails.stylist}` : ""}`,
                images: [],
              },
            },
          },
        ],
        metadata: {
          type: "deposit",
          bookingId,
          customerName: customerName ?? "",
          service: bookingDetails.service ?? "",
          date: bookingDetails.date ?? "",
          time: bookingDetails.time ?? "",
        },
        success_url: `${BASE_URL}/book/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
        cancel_url:  `${BASE_URL}/book?cancelled=true`,
      });

      return NextResponse.json({ url: session.url, sessionId: session.id });
    }

    // ── Gift Card Purchase ───────────────────────────────────────────────────
    if (type === "gift_card") {
      const validAmounts = [25, 50, 100, 200];
      if (!giftCardAmount || !validAmounts.includes(giftCardAmount)) {
        return NextResponse.json({ error: "Invalid gift card amount. Must be 25, 50, 100, or 200." }, { status: 400 });
      }

      const amountCents = giftCardAmount * 100;

      const session = await (await getStripe()).checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: customerEmail,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: amountCents,
              product_data: {
                name: `MC Hair Salon & Spa — $${giftCardAmount} Gift Card`,
                description: "Redeemable for any service at MC Hair Salon & Spa, 336 East 78th St, New York, NY 10075",
              },
            },
          },
        ],
        metadata: {
          type: "gift_card",
          amount: String(giftCardAmount),
          recipientName:  recipientName  ?? customerName ?? "",
          recipientEmail: recipientEmail ?? customerEmail ?? "",
          recipientPhone: recipientPhone ?? "",
          senderName:     senderName     ?? customerName ?? "",
          message:        (message ?? "").slice(0, 490),
          deliveryMethod: deliveryMethod ?? "email",
        },
        success_url: `${BASE_URL}/gift-card/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url:  `${BASE_URL}/gift-card?cancelled=true`,
      });

      return NextResponse.json({ url: session.url, sessionId: session.id });
    }

    // ── Full Service Payment ─────────────────────────────────────────────────
    if (type === "service") {
      const { serviceName, servicePrice } = body;
      if (!serviceName || !servicePrice) {
        return NextResponse.json({ error: "Missing serviceName or servicePrice" }, { status: 400 });
      }

      const session = await (await getStripe()).checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: customerEmail,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: Math.round(servicePrice * 100),
              product_data: {
                name: `MC Hair Salon — ${serviceName}`,
                description: "Professional beauty service at 336 East 78th St, New York, NY 10075",
              },
            },
          },
        ],
        metadata: {
          type: "service",
          bookingId: bookingId ?? "",
          serviceName,
          customerName: customerName ?? "",
        },
        success_url: `${BASE_URL}/account?payment=success`,
        cancel_url:  `${BASE_URL}/book`,
      });

      return NextResponse.json({ url: session.url, sessionId: session.id });
    }

    // ── Package Purchase ─────────────────────────────────────────────────────
    if (type === "package") {
      const { PACKAGES } = await import("@/lib/data");
      const pkg = PACKAGES.find(p => p.id === packageId);
      if (!pkg) return NextResponse.json({ error: "Package not found" }, { status: 404 });

      const session = await (await getStripe()).checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: customerEmail,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "usd",
              unit_amount: pkg.price * 100,
              product_data: {
                name: `MC Hair Salon — ${pkg.name}`,
                description: `${pkg.tagline} · ${pkg.sessions} sessions · Valid ${pkg.validityDays} days`,
              },
            },
          },
        ],
        metadata: {
          type: "package",
          packageId: pkg.id,
          customerId: customerId ?? "",
          customerName: customerName ?? "",
        },
        success_url: `${BASE_URL}/account/packages?purchased=true`,
        cancel_url:  `${BASE_URL}/packages`,
      });

      return NextResponse.json({ url: session.url, sessionId: session.id });
    }

    return NextResponse.json({ error: `Unknown checkout type: ${type}` }, { status: 400 });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Checkout session failed";
    console.error("[stripe/checkout]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
