import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { staffSchedule } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export async function GET() {
  const err = await requireAdmin();
  if (err) return err;
  const rows = await db.select().from(staffSchedule).orderBy(staffSchedule.staffName, staffSchedule.dayOfWeek);
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const err = await requireAdmin();
  if (err) return err;

  try {
    const body = await req.json();
    const { staffName, days } = body as {
      staffName: string;
      days: {
        dayOfWeek: number;
        isWorking: boolean;
        startTime: string;
        endTime: string;
      }[];
    };

    if (!staffName || !Array.isArray(days)) {
      return NextResponse.json({ error: "Missing staffName or days" }, { status: 400 });
    }

    // Upsert each day entry
    const results = await Promise.all(
      days.map(async (day) => {
        const existing = await db
          .select()
          .from(staffSchedule)
          .where(
            and(
              eq(staffSchedule.staffName, staffName),
              eq(staffSchedule.dayOfWeek, day.dayOfWeek)
            )
          );

        if (existing.length > 0) {
          const [updated] = await db
            .update(staffSchedule)
            .set({
              isWorking: day.isWorking,
              startTime: day.startTime,
              endTime: day.endTime,
            })
            .where(
              and(
                eq(staffSchedule.staffName, staffName),
                eq(staffSchedule.dayOfWeek, day.dayOfWeek)
              )
            )
            .returning();
          return updated;
        } else {
          const [inserted] = await db
            .insert(staffSchedule)
            .values({
              staffName,
              dayOfWeek: day.dayOfWeek,
              isWorking: day.isWorking,
              startTime: day.startTime,
              endTime: day.endTime,
            })
            .returning();
          return inserted;
        }
      })
    );

    return NextResponse.json(results, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to save schedule" }, { status: 500 });
  }
}
