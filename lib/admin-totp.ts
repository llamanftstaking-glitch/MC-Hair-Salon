import "server-only";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { adminTotp as adminTotpTable } from "./schema";

interface TOTPRecord {
  secret: string;
  enabled: boolean;
  createdAt: string;
}

export async function getTOTPRecord(): Promise<TOTPRecord | null> {
  const rows = await db.select().from(adminTotpTable).where(eq(adminTotpTable.id, 1));
  if (!rows.length) return null;
  return {
    secret:    rows[0].secret,
    enabled:   rows[0].enabled,
    createdAt: rows[0].createdAt,
  };
}

export async function saveTOTPRecord(record: TOTPRecord): Promise<void> {
  await db
    .insert(adminTotpTable)
    .values({ id: 1, secret: record.secret, enabled: record.enabled, createdAt: record.createdAt })
    .onConflictDoUpdate({
      target: adminTotpTable.id,
      set: { secret: record.secret, enabled: record.enabled, createdAt: record.createdAt },
    });
}

export async function isTOTPEnabled(): Promise<boolean> {
  const record = await getTOTPRecord();
  return record?.enabled === true;
}
