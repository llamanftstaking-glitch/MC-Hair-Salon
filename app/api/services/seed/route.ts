import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { salonServices } from "@/lib/schema";

// Seed data derived from SERVICES_LIST in app/admin/page.tsx
// with reasonable prices for each service
const SEED_SERVICES: Array<{
  name: string;
  category: string;
  priceMin: number;
  priceMax: number | null;
  durationMins: number | null;
  sortOrder: number;
}> = [
  // Hair
  { name: "Women's Haircut",           category: "Hair",       priceMin: 45,  priceMax: 65,  durationMins: 60,  sortOrder: 10 },
  { name: "Men's Haircut",             category: "Hair",       priceMin: 30,  priceMax: 40,  durationMins: 30,  sortOrder: 20 },
  { name: "Kids' Haircut",             category: "Hair",       priceMin: 20,  priceMax: 30,  durationMins: 30,  sortOrder: 30 },
  { name: "Curly Cut",                 category: "Hair",       priceMin: 55,  priceMax: 80,  durationMins: 75,  sortOrder: 40 },
  // Color
  { name: "Balayage",                  category: "Color",      priceMin: 120, priceMax: 200, durationMins: 180, sortOrder: 50 },
  { name: "Highlights",                category: "Color",      priceMin: 95,  priceMax: 150, durationMins: 120, sortOrder: 60 },
  { name: "Baby Lights",               category: "Color",      priceMin: 110, priceMax: 170, durationMins: 150, sortOrder: 70 },
  { name: "Hair Color",                category: "Color",      priceMin: 75,  priceMax: 110, durationMins: 90,  sortOrder: 80 },
  { name: "Color Correction",          category: "Color",      priceMin: 150, priceMax: 300, durationMins: 240, sortOrder: 90 },
  // Treatments
  { name: "Keratin Treatment",         category: "Treatments", priceMin: 200, priceMax: 350, durationMins: 180, sortOrder: 100 },
  { name: "Hair Botox Treatment",      category: "Treatments", priceMin: 150, priceMax: 250, durationMins: 120, sortOrder: 110 },
  { name: "Relaxer",                   category: "Treatments", priceMin: 80,  priceMax: 120, durationMins: 120, sortOrder: 120 },
  // Styling
  { name: "Blowout / Blow Dry",        category: "Hair",       priceMin: 55,  priceMax: 75,  durationMins: 45,  sortOrder: 130 },
  { name: "Updo & Special Event Styling", category: "Hair",    priceMin: 85,  priceMax: 150, durationMins: 90,  sortOrder: 140 },
  // Makeup
  { name: "Bridal Makeup",             category: "Makeup",     priceMin: 150, priceMax: 250, durationMins: 90,  sortOrder: 150 },
  { name: "Makeup Application",        category: "Makeup",     priceMin: 75,  priceMax: 120, durationMins: 60,  sortOrder: 160 },
  // Skin
  { name: "Eyebrow & Lip Wax",         category: "Skin",       priceMin: 25,  priceMax: 40,  durationMins: 20,  sortOrder: 170 },
  // Other
  { name: "Other (specify in notes)",  category: "Other",      priceMin: 0,   priceMax: null, durationMins: null, sortOrder: 999 },
];

export async function GET() {
  const err = await requireAdmin();
  if (err) return err;

  // Check if the table already has data
  const existing = await db.select().from(salonServices).limit(1);
  if (existing.length > 0) {
    return NextResponse.json({ message: "Services table already has data. Skipping seed.", seeded: 0 });
  }

  const now = new Date();
  const rows = SEED_SERVICES.map((s, i) => ({
    id: `svc-seed-${i}-${Math.random().toString(36).slice(2, 6)}`,
    name: s.name,
    category: s.category,
    priceMin: String(s.priceMin),
    priceMax: s.priceMax != null ? String(s.priceMax) : null,
    durationMins: s.durationMins,
    isActive: true as const,
    sortOrder: s.sortOrder,
    createdAt: now,
  }));

  await db.insert(salonServices).values(rows);

  return NextResponse.json({ message: `Seeded ${rows.length} services.`, seeded: rows.length });
}
