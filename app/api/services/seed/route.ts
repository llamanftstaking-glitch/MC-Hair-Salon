import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { salonServices } from "@/lib/schema";

const SEED_SERVICES: Array<{
  name: string;
  category: string;
  priceMin: number;
  priceMax: number | null;
  durationMins: number | null;
  sortOrder: number;
}> = [
  // Hair
  { name: "Men's Haircut",                    category: "Hair",       priceMin: 50,  priceMax: null, durationMins: 30,  sortOrder: 10  },
  { name: "Women's Haircut",                  category: "Hair",       priceMin: 120, priceMax: null, durationMins: 60,  sortOrder: 20  },
  { name: "Girl's Haircut",                   category: "Hair",       priceMin: 55,  priceMax: null, durationMins: 60,  sortOrder: 30  },
  { name: "Boy's Haircut",                    category: "Hair",       priceMin: 45,  priceMax: null, durationMins: 30,  sortOrder: 40  },
  { name: "Bangs",                            category: "Hair",       priceMin: 20,  priceMax: null, durationMins: 10,  sortOrder: 50  },
  { name: "Blowdry",                          category: "Hair",       priceMin: 45,  priceMax: null, durationMins: 45,  sortOrder: 60  },
  { name: "Updo",                             category: "Hair",       priceMin: 85,  priceMax: null, durationMins: 60,  sortOrder: 70  },
  // Color
  { name: "Clear Glossy",                     category: "Color",      priceMin: 35,  priceMax: null, durationMins: 15,  sortOrder: 80  },
  { name: "Single Process",                   category: "Color",      priceMin: 100, priceMax: null, durationMins: 40,  sortOrder: 90  },
  { name: "Single Process w/ Moroccan Oil",   category: "Color",      priceMin: 120, priceMax: null, durationMins: 50,  sortOrder: 100 },
  { name: "Partial Highlights",               category: "Color",      priceMin: 250, priceMax: null, durationMins: 120, sortOrder: 110 },
  { name: "Full Highlights",                  category: "Color",      priceMin: 350, priceMax: null, durationMins: 155, sortOrder: 120 },
  { name: "Face Frame",                       category: "Color",      priceMin: 130, priceMax: null, durationMins: 60,  sortOrder: 130 },
  { name: "Toner",                            category: "Color",      priceMin: 45,  priceMax: null, durationMins: 20,  sortOrder: 140 },
  { name: "Partial Balayage",                 category: "Color",      priceMin: 250, priceMax: null, durationMins: 120, sortOrder: 150 },
  { name: "Full Balayage",                    category: "Color",      priceMin: 400, priceMax: null, durationMins: 155, sortOrder: 160 },
  { name: "Double Process",                   category: "Color",      priceMin: 0,   priceMax: null, durationMins: 120, sortOrder: 170 },
  { name: "Color Correction",                 category: "Color",      priceMin: 0,   priceMax: null, durationMins: 150, sortOrder: 180 },
  // Treatments
  { name: "Keratin Treatment",                category: "Treatments", priceMin: 350, priceMax: null, durationMins: 150, sortOrder: 190 },
  { name: "Hair Botox Treatment",             category: "Treatments", priceMin: 185, priceMax: null, durationMins: 90,  sortOrder: 200 },
  { name: "Relaxer",                          category: "Treatments", priceMin: 180, priceMax: null, durationMins: 120, sortOrder: 210 },
  { name: "Extensions",                       category: "Treatments", priceMin: 0,   priceMax: null, durationMins: 120, sortOrder: 220 },
  { name: "Extension Removal",                category: "Treatments", priceMin: 100, priceMax: null, durationMins: 30,  sortOrder: 230 },
  // Makeup
  { name: "Makeup Application",               category: "Makeup",     priceMin: 125, priceMax: null, durationMins: null, sortOrder: 240 },
  // Other
  { name: "Other (specify in notes)",         category: "Other",      priceMin: 0,   priceMax: null, durationMins: null, sortOrder: 999 },
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
