import "server-only";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { timeEntries as table } from "./schema";

export interface TimeEntry {
  id: string;
  staffId: string;
  staffName: string;
  clockIn: string;
  clockOut?: string;
  date: string;
  notes?: string;
}

function row(r: typeof table.$inferSelect): TimeEntry {
  return {
    id:        r.id,
    staffId:   r.staffId,
    staffName: r.staffName,
    clockIn:   r.clockIn,
    clockOut:  r.clockOut ?? undefined,
    date:      r.date,
    notes:     r.notes ?? undefined,
  };
}

export async function getTimeEntries(from?: string, to?: string): Promise<TimeEntry[]> {
  const rows = await db.select().from(table);
  return rows
    .filter(r => !from || r.date >= from)
    .filter(r => !to   || r.date <= to)
    .map(row)
    .sort((a, b) => b.clockIn.localeCompare(a.clockIn));
}

export async function addTimeEntry(entry: Omit<TimeEntry, "id">): Promise<TimeEntry> {
  const e: TimeEntry = { ...entry, id: `tc-${Date.now()}-${Math.random().toString(36).slice(2,6)}` };
  await db.insert(table).values({
    id: e.id, staffId: e.staffId, staffName: e.staffName,
    clockIn: e.clockIn, clockOut: e.clockOut ?? null,
    date: e.date, notes: e.notes ?? null,
  });
  return e;
}

export async function updateTimeEntry(id: string, updates: Partial<Omit<TimeEntry, "id">>): Promise<TimeEntry | null> {
  const set: Partial<typeof table.$inferInsert> = {};
  if (updates.clockIn  !== undefined) set.clockIn  = updates.clockIn;
  if (updates.clockOut !== undefined) set.clockOut = updates.clockOut;
  if ("notes" in updates)             set.notes    = updates.notes ?? null;
  if (Object.keys(set).length) await db.update(table).set(set).where(eq(table.id, id));
  const rows = await db.select().from(table).where(eq(table.id, id));
  return rows.length ? row(rows[0]) : null;
}

export async function deleteTimeEntry(id: string): Promise<boolean> {
  const res = await db.delete(table).where(eq(table.id, id)).returning({ id: table.id });
  return res.length > 0;
}

export function hoursWorked(entry: TimeEntry): number | null {
  if (!entry.clockOut) return null;
  return (new Date(entry.clockOut).getTime() - new Date(entry.clockIn).getTime()) / 3_600_000;
}

export function formatHours(h: number): string {
  const hrs = Math.floor(h);
  const mins = Math.round((h - hrs) * 60);
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}
