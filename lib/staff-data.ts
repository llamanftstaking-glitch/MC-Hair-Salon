import "server-only";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { staff as staffTable } from "./schema";

export interface PortfolioItem {
  type: "image" | "video";
  src: string;
  caption?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
  specialties: string[];
  portfolio?: PortfolioItem[];
  isMakeupArtist?: boolean;
  order?: number;
  hourlyRate?: number;
  commissionRate?: number; // % house keeps (e.g. 40 = stylist earns 60% of service)
}

// Default seed data — used if DB is empty
const STAFF_DEFAULTS: StaffMember[] = [
  {
    id: "maria",
    name: "Maria",
    role: "Stylist",
    bio: "Maria brings a versatile touch to every appointment at MC Hair Salon. From precision haircuts and curly cuts to advanced color services, relaxers, and highlights, she tailors every look to the client's unique texture, lifestyle, and goals.",
    specialties: ["Color Correction", "Balayage", "Updo", "Curly Haircut", "Highlights", "Relaxer", "Color"],
    image: "/instagram/mchairsalonspa_1523641801_1756757213798938429_509340228.jpg",
    portfolio: [],
    isMakeupArtist: false,
    order: 0,
  },
  {
    id: "meagan",
    name: "Meagan",
    role: "Stylist",
    bio: "Meagan brings artistry and technical excellence to every appointment. Her expertise in L'Oréal color systems makes her our go-to for transformational color.",
    specialties: ["Hair Color", "Highlights", "Blowouts"],
    image: "/instagram/mchairsalonspa_1533145637_1836481173825515947_509340228.jpg",
    portfolio: [],
    isMakeupArtist: false,
    order: 1,
  },
  {
    id: "sally",
    name: "Sally",
    role: "Stylist",
    bio: "Sally is one of MC's most versatile stylists, skilled across all hair types and textures. Her services span women's and men's haircuts, curly cuts, keratin and hair Botox treatments, color, balayage, baby lights, updos, and eyebrow and lip waxing.",
    specialties: ["Women's Haircuts", "Men's Haircuts", "Curly Cuts", "Keratin Treatment", "Balayage", "Baby Lights", "Eyebrow & Lip Wax"],
    image: "/instagram/mchairsalonspa_1732646348_3510014434303531709_509340228.jpg",
    portfolio: [],
    isMakeupArtist: false,
    order: 2,
  },
  {
    id: "kato",
    name: "Kato",
    role: "Stylist",
    bio: "With 30 years of experience as a hairdresser, Kato is a true master of the craft. He specializes in hair color, natural highlights, and men's precision cutting — delivering refined results for both men and women.",
    specialties: ["Hair Color", "Natural Highlights", "Men's Hair", "Precision Cutting"],
    image: "/instagram/mchairsalonspa_1550078255_1978522269296608933_509340228.jpg",
    portfolio: [],
    isMakeupArtist: false,
    order: 3,
  },
  {
    id: "juany",
    name: "Juany",
    role: "Stylist",
    bio: "Juany specializes in smoothing and restorative hair treatments. Whether you're looking for a polished blowout, a long-lasting keratin treatment, or a hair Botox service to restore softness and shine, Juany delivers flawless results every time.",
    specialties: ["Blow Dry", "Keratin Treatment", "Botox Treatment for Hair"],
    image: "/instagram/mchairsalonspa_1708007392_3303327885522806092_509340228.jpg",
    portfolio: [],
    isMakeupArtist: false,
    order: 4,
  },
  {
    id: "dhariana",
    name: "Dhariana Suriel",
    role: "Professional Makeup Artist",
    bio: "Dhariana Suriel is MC's professional makeup artist with 18 years of experience creating breathtaking bridal and special event looks. As a woman-owned beauty professional featured on WeddingWire and The Knot, she specializes in timeless, polished looks that photograph beautifully and last all day — from morning preparations through the final dance. Fluent in English and Spanish, Dhariana works closely with each bride to bring her unique vision to life.",
    specialties: ["Bridal Makeup", "Contour Makeup", "Eye Makeup", "Lashes", "Makeup Lessons", "Special Event Makeup"],
    image: "/instagram/mchairsalonspa_1595346452_2358259426203129087_509340228.jpg",
    portfolio: [],
    isMakeupArtist: true,
    order: 5,
  },
  {
    id: "nazareth",
    name: "Nazareth",
    role: "Salon Manager",
    bio: "Nazareth keeps MC Hair Salon & Spa running beautifully behind the scenes. With a sharp eye for detail and a warm presence, she ensures every client has a seamless, elevated experience from the moment they walk in.",
    specialties: ["Salon Operations", "Team Management", "Client Relations", "Guest Experience"],
    portfolio: [],
    isMakeupArtist: false,
    order: 6,
  },
  {
    id: "nathaly",
    name: "Nathaly",
    role: "Receptionist",
    bio: "Nathaly is the welcoming face of MC Hair Salon & Spa. She handles scheduling, coordinates appointments, and makes sure every guest feels at home the moment they arrive.",
    specialties: ["Scheduling", "Client Coordination", "Front Desk", "Guest Relations"],
    portfolio: [],
    isMakeupArtist: false,
    order: 7,
  },
];

function rowToStaff(row: typeof staffTable.$inferSelect): StaffMember {
  return {
    id:             row.id,
    name:           row.name,
    role:           row.role,
    bio:            row.bio,
    image:          row.image ?? undefined,
    specialties:    (row.specialties as string[]) ?? [],
    portfolio:      (row.portfolio as PortfolioItem[] | null) ?? [],
    isMakeupArtist: row.isMakeupArtist,
    order:          row.order,
    hourlyRate:     row.hourlyRate ?? undefined,
    commissionRate: row.commissionRate ?? undefined,
  };
}

async function ensureSeeded(): Promise<void> {
  const existing = await db.select({ id: staffTable.id }).from(staffTable).limit(1);
  if (existing.length === 0) {
    await db.insert(staffTable).values(
      STAFF_DEFAULTS.map(s => ({
        id:             s.id,
        name:           s.name,
        role:           s.role,
        bio:            s.bio,
        image:          s.image ?? null,
        specialties:    s.specialties,
        portfolio:      s.portfolio ?? [],
        isMakeupArtist: s.isMakeupArtist ?? false,
        order:          s.order ?? 0,
      }))
    );
  }
}

export async function getAllStaff(): Promise<StaffMember[]> {
  await ensureSeeded();
  const rows = await db.select().from(staffTable);
  return rows.map(rowToStaff).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getStaffById(id: string): Promise<StaffMember | undefined> {
  const rows = await db.select().from(staffTable).where(eq(staffTable.id, id));
  return rows.length ? rowToStaff(rows[0]) : undefined;
}

export async function createStaff(data: Omit<StaffMember, "id">): Promise<StaffMember> {
  const id = data.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
  const created: StaffMember = { id, ...data };
  await db.insert(staffTable).values({
    id,
    name:           data.name,
    role:           data.role,
    bio:            data.bio,
    image:          data.image ?? null,
    specialties:    data.specialties,
    portfolio:      data.portfolio ?? [],
    isMakeupArtist: data.isMakeupArtist ?? false,
    order:          data.order ?? 0,
  });
  return created;
}

export async function updateStaff(
  id: string,
  updates: Partial<Omit<StaffMember, "id">>
): Promise<StaffMember> {
  const existing = await db.select().from(staffTable).where(eq(staffTable.id, id));
  if (!existing.length) throw new Error(`Staff member "${id}" not found`);

  const dbUpdates: Partial<typeof staffTable.$inferInsert> = {};
  if (updates.name !== undefined)           dbUpdates.name = updates.name;
  if (updates.role !== undefined)           dbUpdates.role = updates.role;
  if (updates.bio !== undefined)            dbUpdates.bio = updates.bio;
  if ("image" in updates)                  dbUpdates.image = updates.image ?? null;
  if (updates.specialties !== undefined)    dbUpdates.specialties = updates.specialties;
  if ("portfolio" in updates)              dbUpdates.portfolio = updates.portfolio ?? [];
  if ("isMakeupArtist" in updates)         dbUpdates.isMakeupArtist = updates.isMakeupArtist ?? false;
  if ("order" in updates)                  dbUpdates.order = updates.order ?? 0;
  if ("hourlyRate" in updates)             dbUpdates.hourlyRate = updates.hourlyRate ?? null;
  if ("commissionRate" in updates)         dbUpdates.commissionRate = updates.commissionRate ?? null;

  if (Object.keys(dbUpdates).length > 0) {
    await db.update(staffTable).set(dbUpdates).where(eq(staffTable.id, id));
  }

  const updated = await db.select().from(staffTable).where(eq(staffTable.id, id));
  return rowToStaff(updated[0]);
}

export async function deleteStaff(id: string): Promise<void> {
  const result = await db
    .delete(staffTable)
    .where(eq(staffTable.id, id))
    .returning({ id: staffTable.id });
  if (result.length === 0) throw new Error(`Staff member "${id}" not found`);
}
