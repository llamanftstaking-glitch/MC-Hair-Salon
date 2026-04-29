import { NextRequest, NextResponse } from "next/server";
import { recordView, heartbeat, hashIp } from "@/lib/analytics";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { limited } = checkRateLimit("analytics", ip, 200, 60_000);
  if (limited) return NextResponse.json({}, { status: 429 });

  try {
    const { sessionId, type } = await req.json();
    if (!sessionId || typeof sessionId !== "string" || sessionId.length > 64) {
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }
    if (type === "heartbeat") {
      heartbeat(sessionId);
    } else {
      recordView(hashIp(ip), sessionId);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
