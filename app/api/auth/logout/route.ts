import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("mc-session", "", { maxAge: 0, path: "/" });
  return res;
}
