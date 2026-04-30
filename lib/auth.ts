import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const JWT_SECRET_VALUE = process.env.JWT_SECRET || "mc-hair-salon-dev-only-NOT-FOR-PRODUCTION";

function getSecret(): Uint8Array {
  if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable must be set in production.");
  }
  return new TextEncoder().encode(JWT_SECRET_VALUE);
}

export interface CustomerPayload {
  id: string;
  email: string;
  name: string;
  isAdmin?: boolean;
}

export async function signToken(payload: CustomerPayload) {
  return await new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecret());
}

// Signs a short-lived token containing only an email, used as a "pending" 2FA token
export async function signPartialToken(email: string): Promise<string> {
  return await new SignJWT({ email, partial: true })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(getSecret());
}

// Verifies a partial token and returns the email, or null if invalid/expired
export async function verifyPartialToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.partial || typeof payload.email !== "string") return null;
    return payload.email;
  } catch {
    return null;
  }
}

export async function verifyToken(token: string): Promise<CustomerPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as CustomerPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<CustomerPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("mc-session")?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (!session.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function requireAuth(): Promise<{ session: CustomerPayload } | NextResponse> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  return { session };
}
