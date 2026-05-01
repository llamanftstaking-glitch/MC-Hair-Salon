import "server-only";
import { eq } from "drizzle-orm";
import { db } from "./db";
import {
  customers as customersTable,
  customerAppointments,
  customerPackages,
  customerRewards,
} from "./schema";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash?: string;
  googleId?: string;
  avatarUrl?: string;
  createdAt: string;
  points: number;
  visits: number;
  totalSpent: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  appointments: Appointment[];
  packages: CustomerPackage[];
  rewards: RedeemedReward[];
  visitStreak: number;
  blowoutsEarned: number;
  stripeCustomerId?: string;
  stripePaymentMethodId?: string;
}

export interface Appointment {
  id: string;
  service: string;
  stylist: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  pointsEarned: number;
}

export interface CustomerPackage {
  id: string;
  packageId: string;
  name: string;
  tagline?: string;
  services?: string[];
  price: number;
  sessionsTotal: number;
  sessionsUsed: number;
  purchasedAt: string;
  expiresAt: string;
  stripeSessionId?: string;
}

export interface RedeemedReward {
  id: string;
  name: string;
  pointsCost: number;
  redeemedAt: string;
}

// ── helpers ───────────────────────────────────────────────────────────────────

function rowToCustomer(
  row: typeof customersTable.$inferSelect,
  appts: (typeof customerAppointments.$inferSelect)[],
  pkgs: (typeof customerPackages.$inferSelect)[],
  rwds: (typeof customerRewards.$inferSelect)[],
): Customer {
  return {
    id:                   row.id,
    name:                 row.name,
    email:                row.email,
    phone:                row.phone,
    passwordHash:         row.passwordHash ?? undefined,
    googleId:             row.googleId ?? undefined,
    avatarUrl:            row.avatarUrl ?? undefined,
    createdAt:            row.createdAt,
    points:               row.points,
    visits:               row.visits,
    totalSpent:           row.totalSpent,
    tier:                 row.tier as Customer["tier"],
    visitStreak:          row.visitStreak,
    blowoutsEarned:       row.blowoutsEarned,
    stripeCustomerId:     row.stripeCustomerId ?? undefined,
    stripePaymentMethodId: row.stripePaymentMethodId ?? undefined,
    appointments: appts.map(a => ({
      id:           a.id,
      service:      a.service,
      stylist:      a.stylist,
      date:         a.date,
      time:         a.time,
      status:       a.status as Appointment["status"],
      pointsEarned: a.pointsEarned,
    })),
    packages: pkgs.map(p => ({
      id:             p.id,
      packageId:      p.packageId,
      name:           p.name,
      tagline:        p.tagline ?? undefined,
      services:       (p.services as string[] | null) ?? undefined,
      price:          p.price,
      sessionsTotal:  p.sessionsTotal,
      sessionsUsed:   p.sessionsUsed,
      purchasedAt:    p.purchasedAt,
      expiresAt:      p.expiresAt,
      stripeSessionId: p.stripeSessionId ?? undefined,
    })),
    rewards: rwds.map(r => ({
      id:          r.id,
      name:        r.name,
      pointsCost:  r.pointsCost,
      redeemedAt:  r.redeemedAt,
    })),
  };
}

// ── exported functions ────────────────────────────────────────────────────────

export async function getAllCustomers(): Promise<Customer[]> {
  const [rows, appts, pkgs, rwds] = await Promise.all([
    db.select().from(customersTable),
    db.select().from(customerAppointments),
    db.select().from(customerPackages),
    db.select().from(customerRewards),
  ]);
  return rows.map(row =>
    rowToCustomer(
      row,
      appts.filter(a => a.customerId === row.id),
      pkgs.filter(p => p.customerId === row.id),
      rwds.filter(r => r.customerId === row.id),
    )
  );
}

export async function getCustomerByEmail(email: string): Promise<Customer | undefined> {
  const rows = await db
    .select()
    .from(customersTable)
    .where(eq(customersTable.email, email.toLowerCase()));
  if (!rows.length) return undefined;
  const row = rows[0];
  const [appts, pkgs, rwds] = await Promise.all([
    db.select().from(customerAppointments).where(eq(customerAppointments.customerId, row.id)),
    db.select().from(customerPackages).where(eq(customerPackages.customerId, row.id)),
    db.select().from(customerRewards).where(eq(customerRewards.customerId, row.id)),
  ]);
  return rowToCustomer(row, appts, pkgs, rwds);
}

export async function getCustomerById(id: string): Promise<Customer | undefined> {
  const rows = await db
    .select()
    .from(customersTable)
    .where(eq(customersTable.id, id));
  if (!rows.length) return undefined;
  const row = rows[0];
  const [appts, pkgs, rwds] = await Promise.all([
    db.select().from(customerAppointments).where(eq(customerAppointments.customerId, id)),
    db.select().from(customerPackages).where(eq(customerPackages.customerId, id)),
    db.select().from(customerRewards).where(eq(customerRewards.customerId, id)),
  ]);
  return rowToCustomer(row, appts, pkgs, rwds);
}

export async function createCustomer(
  data: Omit<Customer, "id" | "createdAt" | "points" | "visits" | "totalSpent" | "tier" | "appointments" | "packages" | "rewards" | "visitStreak" | "blowoutsEarned">
): Promise<Customer> {
  const id = `cust_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const createdAt = new Date().toISOString();

  await db.insert(customersTable).values({
    id,
    name:                 data.name,
    email:                data.email.toLowerCase(),
    phone:                data.phone ?? "",
    passwordHash:         data.passwordHash ?? null,
    googleId:             data.googleId ?? null,
    avatarUrl:            data.avatarUrl ?? null,
    createdAt,
    points:               0,
    visits:               0,
    totalSpent:           0,
    tier:                 "Bronze",
    visitStreak:          0,
    blowoutsEarned:       0,
    stripeCustomerId:     data.stripeCustomerId ?? null,
    stripePaymentMethodId: data.stripePaymentMethodId ?? null,
  });

  return {
    id,
    name:                 data.name,
    email:                data.email.toLowerCase(),
    phone:                data.phone ?? "",
    passwordHash:         data.passwordHash,
    googleId:             data.googleId,
    avatarUrl:            data.avatarUrl,
    createdAt,
    points:               0,
    visits:               0,
    totalSpent:           0,
    tier:                 "Bronze",
    appointments:         [],
    packages:             [],
    rewards:              [],
    visitStreak:          0,
    blowoutsEarned:       0,
    stripeCustomerId:     data.stripeCustomerId,
    stripePaymentMethodId: data.stripePaymentMethodId,
  };
}

export async function updateCustomer(
  id: string,
  updates: Partial<Customer>
): Promise<Customer | null> {
  // Separate scalar fields from nested arrays
  const { appointments, packages, rewards, ...scalarUpdates } = updates;

  // Build DB column update set (only defined scalar values)
  const dbUpdates: Partial<typeof customersTable.$inferInsert> = {};
  if (scalarUpdates.name !== undefined)         dbUpdates.name = scalarUpdates.name;
  if (scalarUpdates.email !== undefined)        dbUpdates.email = scalarUpdates.email.toLowerCase();
  if (scalarUpdates.phone !== undefined)        dbUpdates.phone = scalarUpdates.phone;
  if ("passwordHash" in scalarUpdates)          dbUpdates.passwordHash = scalarUpdates.passwordHash ?? null;
  if ("googleId" in scalarUpdates)             dbUpdates.googleId = scalarUpdates.googleId ?? null;
  if ("avatarUrl" in scalarUpdates)            dbUpdates.avatarUrl = scalarUpdates.avatarUrl ?? null;
  if (scalarUpdates.points !== undefined)       dbUpdates.points = scalarUpdates.points;
  if (scalarUpdates.visits !== undefined)       dbUpdates.visits = scalarUpdates.visits;
  if (scalarUpdates.totalSpent !== undefined)   dbUpdates.totalSpent = scalarUpdates.totalSpent;
  if (scalarUpdates.tier !== undefined)         dbUpdates.tier = scalarUpdates.tier;
  if (scalarUpdates.visitStreak !== undefined)  dbUpdates.visitStreak = scalarUpdates.visitStreak;
  if (scalarUpdates.blowoutsEarned !== undefined) dbUpdates.blowoutsEarned = scalarUpdates.blowoutsEarned;
  if ("stripeCustomerId" in scalarUpdates)      dbUpdates.stripeCustomerId = scalarUpdates.stripeCustomerId ?? null;
  if ("stripePaymentMethodId" in scalarUpdates) dbUpdates.stripePaymentMethodId = scalarUpdates.stripePaymentMethodId ?? null;

  // Run all DB operations in parallel where possible
  const ops: Promise<unknown>[] = [];

  if (Object.keys(dbUpdates).length > 0) {
    ops.push(
      db.update(customersTable).set(dbUpdates).where(eq(customersTable.id, id))
    );
  }

  // Replace child tables if provided
  if (appointments !== undefined) {
    ops.push(
      db.delete(customerAppointments).where(eq(customerAppointments.customerId, id)).then(() => {
        if (!appointments.length) return;
        return db.insert(customerAppointments).values(
          appointments.map(a => ({
            id:           a.id,
            customerId:   id,
            service:      a.service,
            stylist:      a.stylist,
            date:         a.date,
            time:         a.time,
            status:       a.status,
            pointsEarned: a.pointsEarned,
          }))
        );
      })
    );
  }

  if (packages !== undefined) {
    ops.push(
      db.delete(customerPackages).where(eq(customerPackages.customerId, id)).then(() => {
        if (!packages.length) return;
        return db.insert(customerPackages).values(
          packages.map(p => ({
            id:             p.id,
            customerId:     id,
            packageId:      p.packageId,
            name:           p.name,
            tagline:        p.tagline ?? null,
            services:       p.services ?? null,
            price:          p.price,
            sessionsTotal:  p.sessionsTotal,
            sessionsUsed:   p.sessionsUsed,
            purchasedAt:    p.purchasedAt,
            expiresAt:      p.expiresAt,
            stripeSessionId: p.stripeSessionId ?? null,
          }))
        );
      })
    );
  }

  if (rewards !== undefined) {
    ops.push(
      db.delete(customerRewards).where(eq(customerRewards.customerId, id)).then(() => {
        if (!rewards.length) return;
        return db.insert(customerRewards).values(
          rewards.map(r => ({
            id:          r.id,
            customerId:  id,
            name:        r.name,
            pointsCost:  r.pointsCost,
            redeemedAt:  r.redeemedAt,
          }))
        );
      })
    );
  }

  await Promise.all(ops);

  const result = await getCustomerById(id);
  return result ?? null;
}

export function calcTier(points: number): Customer["tier"] {
  if (points >= 2000) return "Platinum";
  if (points >= 1000) return "Gold";
  if (points >= 400)  return "Silver";
  return "Bronze";
}
