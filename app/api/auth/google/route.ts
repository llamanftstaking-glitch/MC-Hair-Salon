import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { getCustomerByEmail, createCustomer, updateCustomer } from "@/lib/customers";
import { signToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "Google Sign-In is not configured on this server." },
      { status: 503 }
    );
  }

  let credential: string | undefined;
  try {
    const body = await req.json();
    credential = body?.credential;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!credential || typeof credential !== "string") {
    return NextResponse.json({ error: "Missing Google credential" }, { status: 400 });
  }

  const client = new OAuth2Client(clientId);
  let payload;
  try {
    const ticket = await client.verifyIdToken({ idToken: credential, audience: clientId });
    payload = ticket.getPayload();
  } catch {
    return NextResponse.json({ error: "Invalid Google credential" }, { status: 401 });
  }

  if (!payload || !payload.email || !payload.sub) {
    return NextResponse.json({ error: "Google account is missing required information" }, { status: 401 });
  }

  if (payload.email_verified === false) {
    return NextResponse.json(
      { error: "Your Google email is not verified. Please verify it with Google and try again." },
      { status: 401 }
    );
  }

  const email = payload.email;
  const googleId = payload.sub;
  const name = payload.name || payload.given_name || email.split("@")[0];

  let customer = getCustomerByEmail(email);

  if (customer) {
    if (!customer.googleId) {
      const updated = updateCustomer(customer.id, { googleId });
      if (updated) customer = updated;
    }
  } else {
    customer = createCustomer({ name, email, phone: "", googleId });
  }

  const token = await signToken({ id: customer.id, email: customer.email, name: customer.name });

  const res = NextResponse.json({
    success: true,
    customer: { id: customer.id, name: customer.name, email: customer.email },
  });
  res.cookies.set("mc-session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return res;
}
