import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { customers, admins } from "@/lib/schema";
import { eq } from "drizzle-orm";

const BOOTSTRAP_EMAIL    = "hello@mchairsalon.com";
const BOOTSTRAP_PASSWORD = "MCAdmin2040!";

export async function GET(req: NextRequest) {
  // Safety: only works if no admin exists yet OR called with the correct token
  const token = req.nextUrl.searchParams.get("token");
  const EXPECTED = process.env.BOOTSTRAP_TOKEN || "mc-bootstrap-2040";

  if (token !== EXPECTED) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // Check if admin customer already exists
    const existing = await db
      .select()
      .from(customers)
      .where(eq(customers.email, BOOTSTRAP_EMAIL));

    if (existing.length === 0) {
      const passwordHash = bcrypt.hashSync(BOOTSTRAP_PASSWORD, 10);
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
      }).onConflictDoNothing();
    }

    // Ensure admin row exists
    await db.insert(admins).values({
      email: BOOTSTRAP_EMAIL,
      addedAt: new Date().toISOString(),
      addedBy: "bootstrap",
    }).onConflictDoNothing();

    return NextResponse.json({
      success: true,
      message: "Admin account ready. Login at /login",
      email: BOOTSTRAP_EMAIL,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Bootstrap failed" },
      { status: 500 }
    );
  }
}
