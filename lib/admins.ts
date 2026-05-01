import "server-only";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { admins as adminsTable } from "./schema";

export interface AdminEntry {
  email: string;
  addedAt: string;
  addedBy: string;
}

export async function getAllAdmins(): Promise<AdminEntry[]> {
  const rows = await db.select().from(adminsTable);
  return rows.map(r => ({ email: r.email, addedAt: r.addedAt, addedBy: r.addedBy }));
}

export async function isAdminEmail(email: string): Promise<boolean> {
  // Bootstrap: ADMIN_EMAIL env var always works as a fallback
  const envAdmins = (process.env.ADMIN_EMAIL ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (envAdmins.includes(email.toLowerCase())) return true;

  const rows = await db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.email, email.toLowerCase()));
  return rows.length > 0;
}

export async function addAdmin(email: string, addedBy: string): Promise<AdminEntry> {
  const lower = email.toLowerCase();
  const existing = await db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.email, lower));
  if (existing.length > 0) {
    return { email: existing[0].email, addedAt: existing[0].addedAt, addedBy: existing[0].addedBy };
  }
  const entry: AdminEntry = { email: lower, addedAt: new Date().toISOString(), addedBy };
  await db.insert(adminsTable).values(entry);
  return entry;
}

export async function removeAdmin(email: string): Promise<boolean> {
  const result = await db
    .delete(adminsTable)
    .where(eq(adminsTable.email, email.toLowerCase()));
  return (result as unknown as { rowCount?: number })?.rowCount !== 0;
}
