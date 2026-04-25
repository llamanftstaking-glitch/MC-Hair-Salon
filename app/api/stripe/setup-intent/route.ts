import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const stripe = getStripe();

    const existing = await stripe.customers.list({ email, limit: 1 });
    const customer =
      existing.data.length > 0
        ? existing.data[0]
        : await stripe.customers.create({ email, name: name ?? "" });

    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      usage: "off_session",
      payment_method_types: ["card"],
      metadata: { source: "mc_hair_salon_booking" },
    });

    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
      customerId: customer.id,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create setup intent";
    console.error("[stripe/setup-intent]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
