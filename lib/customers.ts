import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "customers.json");

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  createdAt: string;
  points: number;
  visits: number;
  totalSpent: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  appointments: Appointment[];
  packages: CustomerPackage[];
  rewards: RedeemedReward[];
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
  name: string;
  sessionsTotal: number;
  sessionsUsed: number;
  purchasedAt: string;
  expiresAt: string;
}

export interface RedeemedReward {
  id: string;
  name: string;
  pointsCost: number;
  redeemedAt: string;
}

function read(): Customer[] {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return [];
  }
}

function write(customers: Customer[]) {
  fs.writeFileSync(FILE, JSON.stringify(customers, null, 2));
}

export function getAllCustomers(): Customer[] {
  return read();
}

export function getCustomerByEmail(email: string): Customer | undefined {
  return read().find((c) => c.email.toLowerCase() === email.toLowerCase());
}

export function getCustomerById(id: string): Customer | undefined {
  return read().find((c) => c.id === id);
}

export function createCustomer(data: Omit<Customer, "id" | "createdAt" | "points" | "visits" | "totalSpent" | "tier" | "appointments" | "packages" | "rewards">): Customer {
  const customers = read();
  const customer: Customer = {
    ...data,
    id: `cust_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    points: 0,
    visits: 0,
    totalSpent: 0,
    tier: "Bronze",
    appointments: [],
    packages: [],
    rewards: [],
  };
  customers.push(customer);
  write(customers);
  return customer;
}

export function updateCustomer(id: string, updates: Partial<Customer>): Customer | null {
  const customers = read();
  const idx = customers.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  customers[idx] = { ...customers[idx], ...updates };
  write(customers);
  return customers[idx];
}

export function calcTier(points: number): Customer["tier"] {
  if (points >= 2000) return "Platinum";
  if (points >= 1000) return "Gold";
  if (points >= 400)  return "Silver";
  return "Bronze";
}
