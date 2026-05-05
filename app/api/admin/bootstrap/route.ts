import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { customers, admins } from "@/lib/schema";
import { eq, or } from "drizzle-orm";
import { signToken } from "@/lib/auth";

const BOOTSTRAP_EMAIL    = "hello@mchairsalon.com";
const BOOTSTRAP_PASSWORD = "MCAdmin2040!";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const EXPECTED = process.env.BOOTSTRAP_TOKEN || "mc-bootstrap-2040";

  if (token !== EXPECTED) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const passwordHash = bcrypt.hashSync(BOOTSTRAP_PASSWORD, 10);

    // Find by email OR by the known admin id
    const existing = await db
      .select()
      .from(customers)
      .where(or(eq(customers.email, BOOTSTRAP_EMAIL), eq(customers.id, "admin-001")));

    if (existing.length > 0) {
      // Update email + password on whatever row exists
      await db
        .update(customers)
        .set({ email: BOOTSTRAP_EMAIL, passwordHash })
        .where(eq(customers.id, existing[0].id));
    } else {
      await db.insert(customers).values({
        id: "admin-001",
        name: "MC Admin",
        email: BOOTSTRAP_EMAIL,
        phone: "",
        passwordHash,
        createdAt: new Date().toISOString(),
        points: 0,
        visits: 0,
        totalSpent: 0,
        tier: "Bronze",
        visitStreak: 0,
        blowoutsEarned: 0,
      });
    }

    await db
      .insert(admins)
      .values({ email: BOOTSTRAP_EMAIL, addedAt: new Date().toISOString(), addedBy: "bootstrap" })
      .onConflictDoNothing();

    // Sign session and redirect straight to /admin
    const sessionToken = await signToken({ id: "admin-001", email: BOOTSTRAP_EMAIL, name: "MC Admin", isAdmin: true });
    const res = NextResponse.redirect(new URL("/admin", req.url));
    res.cookies.set("mc-session", sessionToken, {
      httpOnly: true, secure: true, sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, path: "/",
    });
    return res;
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Bootstrap failed" },
      { status: 500 }
    );
  }
}
