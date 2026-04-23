import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "mc-hair-salon-secret-2025"
);

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
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<CustomerPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
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
