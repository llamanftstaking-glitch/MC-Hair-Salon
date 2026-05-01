import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { getCustomerById, updateCustomer, calcTier } from "@/lib/customers";
import { requireAdmin } from "@/lib/auth";

const POINTS_PER_TIER: Record<string, number> = {
  Bronze: 10, Silver: 12, Gold: 15, Platinum: 20,
};

// GET — admin/staff only (scan station looks up client data)
export async function GET(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;

  const customerId = req.nextUrl.searchParams.get("id");
  if (!customerId) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const customer = await getCustomerById(customerId);
  if (!customer) return NextResponse.json({ error: "Client not found" }, { status: 404 });

  return NextResponse.json({
    id:             customer.id,
    name:           customer.name,
    email:          customer.email,
    tier:           customer.tier,
    points:         customer.points,
    visits:         customer.visits,
    visitStreak:    customer.visitStreak    ?? 0,
    blowoutsEarned: customer.blowoutsEarned ?? 0,
  });
}

// POST — admin/staff only (record a visit and handle punch-card reward)
export async function POST(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;

  try {
    const { customerId, serviceType } = await req.json();

    if (!customerId) return NextResponse.json({ error: "Missing customerId" }, { status: 400 });

    const customer = await getCustomerById(customerId);
    if (!customer) return NextResponse.json({ error: "Client not found" }, { status: 404 });

    const isHair        = serviceType === "hair";
    const currentStreak = customer.visitStreak ?? 0;
    const newStreak     = isHair ? currentStreak + 1 : currentStreak;
    const earnedBlowout = newStreak >= 10;
    const finalStreak   = earnedBlowout ? 0 : newStreak;

    const ptsEarned = POINTS_PER_TIER[customer.tier] ?? 10;
    const newPoints = customer.points + ptsEarned;
    const newTier   = calcTier(newPoints);

    const updates: Parameters<typeof updateCustomer>[1] = {
      visits:         customer.visits + 1,
      points:         newPoints,
      tier:           newTier,
      visitStreak:    finalStreak,
      blowoutsEarned: (customer.blowoutsEarned ?? 0) + (earnedBlowout ? 1 : 0),
    };

    if (earnedBlowout) {
      updates.rewards = [
        ...customer.rewards,
        {
          id:         `reward_blowout_${Date.now()}`,
          name:       "Complimentary Blowout",
          pointsCost: 0,
          redeemedAt: new Date().toISOString(),
        },
      ];
    }

    await updateCustomer(customerId, updates);

    return NextResponse.json({
      success:        true,
      earnedBlowout,
      ptsEarned,
      newPoints,
      newTier,
      visitStreak:    finalStreak,
      blowoutsEarned: (customer.blowoutsEarned ?? 0) + (earnedBlowout ? 1 : 0),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to record visit";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
