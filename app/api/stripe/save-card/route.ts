import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { getCustomerByEmail, createCustomer, updateCustomer } from "@/lib/customers";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, stripeCustomerId, stripePaymentMethodId } = await req.json();

    if (!email || !stripeCustomerId || !stripePaymentMethodId)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const existing = getCustomerByEmail(email);

    if (existing) {
      updateCustomer(existing.id, { stripeCustomerId, stripePaymentMethodId, name: name || existing.name, phone: phone || existing.phone });
    } else {
      createCustomer({ name: name || "", email, phone: phone || "", stripeCustomerId, stripePaymentMethodId });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save card";
    console.error("[stripe/save-card]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
