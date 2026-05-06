import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { staffSchedule } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

// dayOfWeek: 0=Mon … 6=Sun  |  times: 24h "HH:MM"
const SCHEDULES: Record<string, { dow: number; isWorking: boolean; start: string; end: string }[]> = {
  Kato: [
    { dow: 0, isWorking: false, start: "10:30", end: "18:00" },
    { dow: 1, isWorking: true,  start: "10:30", end: "18:00" },
    { dow: 2, isWorking: true,  start: "10:30", end: "18:00" },
    { dow: 3, isWorking: true,  start: "12:00", end: "18:00" },
    { dow: 4, isWorking: true,  start: "10:30", end: "18:00" },
    { dow: 5, isWorking: true,  start: "11:00", end: "17:00" },
    { dow: 6, isWorking: false, start: "10:00", end: "18:00" },
  ],
  Maria: [
    { dow: 0, isWorking: false, start: "11:00", end: "18:30" },
    { dow: 1, isWorking: false, start: "11:00", end: "18:30" },
    { dow: 2, isWorking: true,  start: "11:00", end: "18:30" },
    { dow: 3, isWorking: true,  start: "11:00", end: "18:30" },
    { dow: 4, isWorking: true,  start: "11:00", end: "18:30" },
    { dow: 5, isWorking: true,  start: "11:00", end: "18:30" },
    { dow: 6, isWorking: false, start: "11:00", end: "18:30" },
  ],
  Meagan: [
    { dow: 0, isWorking: false, start: "12:00", end: "18:30" },
    { dow: 1, isWorking: false, start: "12:00", end: "18:30" },
    { dow: 2, isWorking: false, start: "12:00", end: "18:30" },
    { dow: 3, isWorking: true,  start: "12:00", end: "18:30" },
    { dow: 4, isWorking: true,  start: "12:00", end: "18:30" },
    { dow: 5, isWorking: false, start: "12:00", end: "18:30" },
    { dow: 6, isWorking: true,  start: "12:00", end: "18:00" },
  ],
  Sally: [
    { dow: 0, isWorking: true,  start: "09:30", end: "16:00" },
    { dow: 1, isWorking: true,  start: "10:00", end: "18:00" },
    { dow: 2, isWorking: false, start: "10:00", end: "18:00" },
    { dow: 3, isWorking: true,  start: "10:00", end: "18:00" },
    { dow: 4, isWorking: true,  start: "10:00", end: "18:00" },
    { dow: 5, isWorking: true,  start: "10:00", end: "18:00" }, // NOTE: "1AM" in schedule likely typo → 10:00 AM
    { dow: 6, isWorking: false, start: "10:00", end: "18:00" },
  ],
  Juany: [
    { dow: 0, isWorking: false, start: "10:00", end: "18:00" },
    { dow: 1, isWorking: false, start: "10:00", end: "18:00" },
    { dow: 2, isWorking: true,  start: "10:00", end: "18:00" },
    { dow: 3, isWorking: true,  start: "10:00", end: "18:00" },
    { dow: 4, isWorking: true,  start: "10:00", end: "14:00" }, // Friday short day
    { dow: 5, isWorking: true,  start: "10:00", end: "18:00" },
    { dow: 6, isWorking: false, start: "10:00", end: "18:00" },
  ],
  Nazareth: [
    { dow: 0, isWorking: false, start: "10:00", end: "18:30" },
    { dow: 1, isWorking: true,  start: "10:00", end: "18:30" },
    { dow: 2, isWorking: true,  start: "10:00", end: "18:30" },
    { dow: 3, isWorking: true,  start: "10:00", end: "18:30" },
    { dow: 4, isWorking: true,  start: "10:00", end: "18:30" },
    { dow: 5, isWorking: false, start: "10:00", end: "18:30" },
    { dow: 6, isWorking: false, start: "10:00", end: "18:30" },
  ],
  Nathaly: [
    { dow: 0, isWorking: false, start: "10:30", end: "18:30" },
    { dow: 1, isWorking: false, start: "10:30", end: "18:30" },
    { dow: 2, isWorking: false, start: "10:30", end: "18:30" },
    { dow: 3, isWorking: false, start: "10:30", end: "18:30" },
    { dow: 4, isWorking: false, start: "10:30", end: "18:30" },
    { dow: 5, isWorking: true,  start: "10:30", end: "18:30" },
    { dow: 6, isWorking: true,  start: "12:00", end: "18:00" },
  ],
  Dhariana: [
    { dow: 0, isWorking: false, start: "11:00", end: "18:00" },
    { dow: 1, isWorking: false, start: "11:00", end: "18:00" },
    { dow: 2, isWorking: true,  start: "11:00", end: "18:00" },
    { dow: 3, isWorking: true,  start: "11:00", end: "18:00" },
    { dow: 4, isWorking: true,  start: "11:00", end: "18:00" },
    { dow: 5, isWorking: true,  start: "11:00", end: "18:00" },
    { dow: 6, isWorking: false, start: "11:00", end: "18:00" },
  ],
};

export async function GET() {
  const err = await requireAdmin();
  if (err) return err;

  let upserted = 0;
  for (const [staffName, days] of Object.entries(SCHEDULES)) {
    for (const day of days) {
      const existing = await db.select().from(staffSchedule).where(
        and(eq(staffSchedule.staffName, staffName), eq(staffSchedule.dayOfWeek, day.dow))
      );
      if (existing.length > 0) {
        await db.update(staffSchedule)
          .set({ isWorking: day.isWorking, startTime: day.start, endTime: day.end })
          .where(and(eq(staffSchedule.staffName, staffName), eq(staffSchedule.dayOfWeek, day.dow)));
      } else {
        await db.insert(staffSchedule).values({
          staffName, dayOfWeek: day.dow, isWorking: day.isWorking, startTime: day.start, endTime: day.end,
        });
      }
      upserted++;
    }
  }

  return NextResponse.json({ ok: true, upserted, staff: Object.keys(SCHEDULES).length });
}
