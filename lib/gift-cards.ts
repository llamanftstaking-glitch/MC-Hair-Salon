import "server-only";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { db } from "./db";
import { giftCards as giftCardsTable } from "./schema";

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

function generateCode(): string {
  const hex = randomBytes(8).toString("hex").toUpperCase();
  return `${hex.slice(0, 4)}-${hex.slice(4, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}`;
}

function rowToGiftCard(row: typeof giftCardsTable.$inferSelect): GiftCard {
  return {
    id:              row.id,
    code:            row.code,
    amount:          row.amount,
    recipientName:   row.recipientName,
    recipientEmail:  row.recipientEmail ?? undefined,
    recipientPhone:  row.recipientPhone ?? undefined,
    senderName:      row.senderName,
    senderEmail:     row.senderEmail ?? undefined,
    message:         row.message,
    deliveryMethod:  row.deliveryMethod as GiftCard["deliveryMethod"],
    status:          row.status as GiftCard["status"],
    createdAt:       row.createdAt,
    redeemedAt:      row.redeemedAt ?? undefined,
    stripeSessionId: row.stripeSessionId ?? undefined,
  };
}

export async function getGiftCards(): Promise<GiftCard[]> {
  const rows = await db.select().from(giftCardsTable);
  return rows.map(rowToGiftCard);
}

export async function getGiftCardByCode(code: string): Promise<GiftCard | null> {
  const rows = await db
    .select()
    .from(giftCardsTable)
    .where(eq(giftCardsTable.code, code));
  return rows.length ? rowToGiftCard(rows[0]) : null;
}

export async function createGiftCard(
  data: Omit<GiftCard, "id" | "code" | "status" | "createdAt">
): Promise<GiftCard> {
  const card: GiftCard = {
    ...data,
    id:        `GC-${Date.now()}`,
    code:      generateCode(),
    status:    "active",
    createdAt: new Date().toISOString(),
  };
  await db.insert(giftCardsTable).values({
    id:              card.id,
    code:            card.code,
    amount:          card.amount,
    recipientName:   card.recipientName,
    recipientEmail:  card.recipientEmail ?? null,
    recipientPhone:  card.recipientPhone ?? null,
    senderName:      card.senderName,
    senderEmail:     card.senderEmail ?? null,
    message:         card.message,
    deliveryMethod:  card.deliveryMethod,
    status:          card.status,
    createdAt:       card.createdAt,
    redeemedAt:      null,
    stripeSessionId: card.stripeSessionId ?? null,
  });
  return card;
}

export async function redeemGiftCard(code: string): Promise<boolean> {
  const rows = await db
    .select()
    .from(giftCardsTable)
    .where(eq(giftCardsTable.code, code));
  if (!rows.length || rows[0].status !== "active") return false;
  await db
    .update(giftCardsTable)
    .set({ status: "redeemed", redeemedAt: new Date().toISOString() })
    .where(eq(giftCardsTable.code, code));
  return true;
}
