#!/usr/bin/env node
/**
 * Idempotent staff account seeder.
 * Runs automatically on every `npm start` (after seed-admin.js).
 * Safe to run multiple times — uses ON CONFLICT DO NOTHING.
 *
 * Staff can log in at /login and access their schedule at /staff.
 * Default password: MCStaff2026!  (change via account settings after first login)
 */
const bcrypt   = require("bcryptjs");
const postgres = require("postgres");

if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL is not set.");
  process.exit(1);
}

const STAFF = [
  { name: "Juany",    email: "juany@mchairsalon.com" },
  { name: "Kato",     email: "kato@mchairsalon.com" },
  { name: "Maria",    email: "maria@mchairsalon.com" },
  { name: "Meagan",   email: "meagan@mchairsalon.com" },
  { name: "Nathaly",  email: "nathaly@mchairsalon.com" },
  { name: "Nazareth", email: "nazareth@mchairsalon.com" },
  { name: "Sally",    email: "sally@mchairsalon.com" },
];

const DEFAULT_PASSWORD = "MCStaff2026!";

const sql = postgres(process.env.DATABASE_URL, { max: 1 });

async function main() {
  const hash = bcrypt.hashSync(DEFAULT_PASSWORD, 10);
  let created = 0;

  for (const { name, email } of STAFF) {
    const existing = await sql`SELECT id FROM customers WHERE email = ${email} LIMIT 1`;
    if (existing.length > 0) {
      continue; // already exists, skip silently
    }
    const id  = `STAFF-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();
    await sql`
      INSERT INTO customers (id, name, email, phone, password_hash, created_at, points, visits, total_spent, tier, visit_streak, blowouts_earned)
      VALUES (${id}, ${name}, ${email}, '', ${hash}, ${now}, 0, 0, 0, 'Bronze', 0, 0)
      ON CONFLICT (email) DO NOTHING
    `;
    created++;
    console.log(`  Created staff account: ${name} <${email}>`);
  }

  if (created === 0) {
    console.log("Staff accounts: all 7 already exist.");
  } else {
    console.log(`Staff accounts: created ${created} new account(s). Default password: ${DEFAULT_PASSWORD}`);
  }
}

main()
  .catch(err => { console.error("Staff seed error:", err.message); })
  .finally(() => sql.end());
