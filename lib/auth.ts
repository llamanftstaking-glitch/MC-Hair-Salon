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
}

export async function signToken(payload: CustomerPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecret());
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

function isAdmin(email: string): boolean {
  const adminEmails = (process.env.ADMIN_EMAIL ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (adminEmails.length === 0) return true; // open during initial setup — lock down by setting ADMIN_EMAIL
  return adminEmails.includes(email.toLowerCase());
}

export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (!isAdmin(session.email)) {
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
