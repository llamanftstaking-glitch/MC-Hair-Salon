import "server-only";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { messages as messagesTable } from "./schema";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

function rowToMessage(row: typeof messagesTable.$inferSelect): ContactMessage {
  return {
    id:        row.id,
    name:      row.name,
    email:     row.email,
    message:   row.message,
    read:      row.read,
    createdAt: row.createdAt,
  };
}

export async function getMessages(): Promise<ContactMessage[]> {
  const rows = await db.select().from(messagesTable);
  return rows.map(rowToMessage);
}

export async function addMessage(
  data: Pick<ContactMessage, "name" | "email" | "message">
): Promise<ContactMessage> {
  const msg: ContactMessage = {
    ...data,
    id:        `MSG-${Date.now()}`,
    read:      false,
    createdAt: new Date().toISOString(),
  };
  await db.insert(messagesTable).values({
    id:        msg.id,
    name:      msg.name,
    email:     msg.email,
    message:   msg.message,
    read:      false,
    createdAt: msg.createdAt,
  });
  return msg;
}

export async function markRead(id: string): Promise<boolean> {
  const result = await db
    .update(messagesTable)
    .set({ read: true })
    .where(eq(messagesTable.id, id))
    .returning({ id: messagesTable.id });
  return result.length > 0;
}

export async function deleteMessage(id: string): Promise<boolean> {
  const result = await db
    .delete(messagesTable)
    .where(eq(messagesTable.id, id))
    .returning({ id: messagesTable.id });
  return result.length > 0;
}
