import fs from "fs";
import path from "path";

export interface Subscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: string;
  active: boolean;
}

const FILE = path.join(process.cwd(), "data", "newsletter.json");

function read(): Subscriber[] {
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]");
  return JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

function write(data: Subscriber[]) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

export function getSubscribers(): Subscriber[] {
  return read().filter(s => s.active);
}

export function getAllSubscribers(): Subscriber[] {
  return read();
}

export function addSubscriber(email: string, name?: string): { ok: boolean; message: string } {
  const list = read();
  const existing = list.find(s => s.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    if (existing.active) return { ok: false, message: "Already subscribed." };
    existing.active = true;
    write(list);
    return { ok: true, message: "Resubscribed successfully." };
  }
  list.push({ id: `SUB-${Date.now()}`, email, name, subscribedAt: new Date().toISOString(), active: true });
  write(list);
  return { ok: true, message: "Subscribed successfully." };
}

export function unsubscribe(email: string): boolean {
  const list = read();
  const sub = list.find(s => s.email.toLowerCase() === email.toLowerCase());
  if (!sub) return false;
  sub.active = false;
  write(list);
  return true;
}

export function removeSubscriber(id: string): boolean {
  const list = read();
  const filtered = list.filter(s => s.id !== id);
  if (filtered.length === list.length) return false;
  write(filtered);
  return true;
}
