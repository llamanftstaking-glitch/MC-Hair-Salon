import { NextRequest, NextResponse } from "next/server";
import { createGiftCard, getGiftCards, getGiftCardByCode, redeemGiftCard } from "@/lib/gift-cards";
import { sendGiftCardEmail, sendNewGiftCardNotification } from "@/lib/email";
import { requireAdmin } from "@/lib/auth";

// GET — ?code=XXXX is public (booking page validation); list-all requires admin
export async function GET(req: NextRequest) {
  try {
    const code = new URL(req.url).searchParams.get("code");
    if (code) {
      const card = await getGiftCardByCode(code.toUpperCase());
      if (!card) return NextResponse.json({ error: "Gift card not found" }, { status: 404 });
      return NextResponse.json(card);
    }
    const err = await requireAdmin();
    if (err) return err;
    return NextResponse.json(await getGiftCards());
  } catch {
    return NextResponse.json({ error: "Failed to fetch gift cards" }, { status: 500 });
  }
}

// POST — create, send, and optionally redeem a gift card
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // Create + send (called internally from Stripe webhook after payment)
    if (action === "create") {
      // Must supply the internal webhook token — prevents public gift card creation without payment
      const internalToken = req.headers.get("x-internal-token");
      const expectedToken = process.env.INTERNAL_API_TOKEN ?? "dev-token";
      if (internalToken !== expectedToken) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const { amount, recipientName, recipientEmail, recipientPhone,
              senderName, senderEmail, message, deliveryMethod, stripeSessionId } = body;

      if (!amount || !recipientName || !senderName) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }

      const card = await createGiftCard({
        amount: Number(amount),
        recipientName,
        recipientEmail,
        recipientPhone,
        senderName,
        senderEmail: senderEmail || undefined,
        message: message ?? "",
        deliveryMethod: deliveryMethod ?? "email",
        stripeSessionId,
      });

      // Notify the salon inbox in parallel — fire-and-forget so the public
      // POST flow returns immediately and isn't gated on Resend latency.
      sendNewGiftCardNotification(card).catch(err =>
        console.error("[gift-card] Salon notification failed:", err)
      );

      // Send via email to recipient
      if ((deliveryMethod === "email" || deliveryMethod === "both") && recipientEmail) {
        await sendGiftCardEmail(card).catch(err =>
          console.error("[gift-card] Email send failed:", err)
        );
      }

      // SMS via Twilio — logs if not configured
      if ((deliveryMethod === "sms" || deliveryMethod === "both") && recipientPhone) {
        await sendGiftCardSMS(card).catch(err =>
          console.error("[gift-card] SMS send failed:", err)
        );
      }

      return NextResponse.json(card, { status: 201 });
    }

    // Redeem
    if (action === "redeem") {
      const { code } = body;
      if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });
      const card = await getGiftCardByCode(code.toUpperCase());
      if (!card) return NextResponse.json({ error: "Gift card not found" }, { status: 404 });
      if (card.status !== "active") return NextResponse.json({ error: `Gift card is ${card.status}` }, { status: 400 });
      await redeemGiftCard(code.toUpperCase());
      return NextResponse.json({ success: true, card });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Gift card action failed" }, { status: 500 });
  }
}

async function sendGiftCardSMS(card: import("@/lib/gift-cards").GiftCard) {
  const sid   = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from  = process.env.TWILIO_FROM_NUMBER;

  if (!sid || !token || !from) {
    console.log("[gift-card] Twilio not configured — skipping SMS for card", card.code);
    return;
  }

  const body = `🎁 ${card.senderName} sent you a $${card.amount} MC Hair Salon & Spa gift card!\nCode: ${card.code}\nBook: mchairsalon.com/book or call (212) 988-5252`;
  const url  = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: card.recipientPhone!, From: from, Body: body }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Twilio error: ${err}`);
  }
}
