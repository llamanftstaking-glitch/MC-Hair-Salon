import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "admins.json");

export interface AdminEntry {
  email: string;
  addedAt: string;
  addedBy: string;
}

function read(): AdminEntry[] {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return [];
  }
}

function write(admins: AdminEntry[]) {
  fs.writeFileSync(FILE, JSON.stringify(admins, null, 2));
}

export function getAllAdmins(): AdminEntry[] {
  return read();
}

export function isAdminEmail(email: string): boolean {
  // Bootstrap: ADMIN_EMAIL env var always works as a fallback
  const envAdmins = (process.env.ADMIN_EMAIL ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (envAdmins.includes(email.toLowerCase())) return true;

  return read().some((a) => a.email.toLowerCase() === email.toLowerCase());
}

export function addAdmin(email: string, addedBy: string): AdminEntry {
  const admins = read();
  const existing = admins.find((a) => a.email.toLowerCase() === email.toLowerCase());
  if (existing) return existing;
  const entry: AdminEntry = { email: email.toLowerCase(), addedAt: new Date().toISOString(), addedBy };
  write([...admins, entry]);
  return entry;
}

export function removeAdmin(email: string): boolean {
  const admins = read();
  const filtered = admins.filter((a) => a.email.toLowerCase() !== email.toLowerCase());
  if (filtered.length === admins.length) return false;
  write(filtered);
  return true;
}
