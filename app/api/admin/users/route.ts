import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAllAdmins, addAdmin, removeAdmin } from "@/lib/admins";
import { getAllCustomers } from "@/lib/customers";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const admins = await getAllAdmins();
  const customers = await getAllCustomers();

  const adminEmails = new Set(admins.map((a) => a.email.toLowerCase()));

  // Env-var admins (bootstrap)
  const envAdmins = (process.env.ADMIN_EMAIL ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  envAdmins.forEach((e) => adminEmails.add(e));

  const users = customers.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    isAdmin: adminEmails.has(c.email.toLowerCase()),
    isEnvAdmin: envAdmins.includes(c.email.toLowerCase()),
    adminEntry: admins.find((a) => a.email.toLowerCase() === c.email.toLowerCase()) ?? null,
  }));

  return NextResponse.json({ users, admins });
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const session = (await import("@/lib/auth")).getSession();
  const s = await session;

  const { email, action } = await req.json();
  if (!email || !action) {
    return NextResponse.json({ error: "email and action required" }, { status: 400 });
  }

  if (action === "grant") {
    const entry = await addAdmin(email, s?.email ?? "system");
    return NextResponse.json({ success: true, entry });
  }

  if (action === "revoke") {
    const removed = await removeAdmin(email);
    return NextResponse.json({ success: removed });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
