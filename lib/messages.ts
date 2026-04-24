import fs from "fs";
import path from "path";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const DATA_FILE = path.join(process.cwd(), "data", "messages.json");

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");
}

export function getMessages(): ContactMessage[] {
  ensureDataDir();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

export function addMessage(data: Pick<ContactMessage, "name" | "email" | "message">): ContactMessage {
  const messages = getMessages();
  const msg: ContactMessage = { ...data, id: `MSG-${Date.now()}`, read: false, createdAt: new Date().toISOString() };
  messages.push(msg);
  fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));
  return msg;
}

export function markRead(id: string): boolean {
  const messages = getMessages();
  const idx = messages.findIndex(m => m.id === id);
  if (idx === -1) return false;
  messages[idx].read = true;
  fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));
  return true;
}

export function deleteMessage(id: string): boolean {
  const messages = getMessages();
  const filtered = messages.filter(m => m.id !== id);
  if (filtered.length === messages.length) return false;
  fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2));
  return true;
}
