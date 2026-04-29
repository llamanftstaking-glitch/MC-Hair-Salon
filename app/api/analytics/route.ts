import { NextResponse } from "next/server";
import { getAnalytics } from "@/lib/analytics";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const err = await requireAdmin();
  if (err) return err;
  return NextResponse.json(getAnalytics());
}
