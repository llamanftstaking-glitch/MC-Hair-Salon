import fs from "fs";
import path from "path";
import { randomBytes } from "crypto";

export interface GiftCard {
  id: string;
  code: string;
  amount: number;
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  senderName: string;
  senderEmail?: string;
  message: string;
  deliveryMethod: "email" | "sms" | "both";
  status: "active" | "redeemed" | "expired";
  createdAt: string;
  redeemedAt?: string;
  stripeSessionId?: string;
}

const DATA_FILE = path.join(process.cwd(), "data", "gift-cards.json");

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");
}

function generateCode(): string {
  const hex = randomBytes(8).toString("hex").toUpperCase();
  return `${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}`;
}

export function getGiftCards(): GiftCard[] {
  ensureDataDir();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

export function getGiftCardByCode(code: string): GiftCard | null {
  return getGiftCards().find(g => g.code === code) ?? null;
}

export function createGiftCard(data: Omit<GiftCard, "id" | "code" | "status" | "createdAt">): GiftCard {
  const cards = getGiftCards();
  const card: GiftCard = {
    ...data,
    id: `GC-${Date.now()}`,
    code: generateCode(),
    status: "active",
    createdAt: new Date().toISOString(),
  };
  cards.push(card);
  fs.writeFileSync(DATA_FILE, JSON.stringify(cards, null, 2));
  return card;
}

export function redeemGiftCard(code: string): boolean {
  const cards = getGiftCards();
  const idx = cards.findIndex(g => g.code === code);
  if (idx === -1 || cards[idx].status !== "active") return false;
  cards[idx].status = "redeemed";
  cards[idx].redeemedAt = new Date().toISOString();
  fs.writeFileSync(DATA_FILE, JSON.stringify(cards, null, 2));
  return true;
}
