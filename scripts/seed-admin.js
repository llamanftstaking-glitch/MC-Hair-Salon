#!/usr/bin/env node
/**
 * Run once on a fresh deploy to create the initial admin account.
 * Requires DATABASE_URL to be set.
 * Usage: node scripts/seed-admin.js
 *
 * Override defaults with env vars:
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=yourpass node scripts/seed-admin.js
 */
const bcrypt   = require("bcryptjs");
const postgres = require("postgres");

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || "admin@mchairsalonspa.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "MCAdmin2026!";

if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL is not set. Please add it as a Replit secret.");
  process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL, { max: 1 });

async function main() {
  try {
    // Ensure tables exist (drizzle-kit push should have already run)
    // Check if admin customer already exists
    const existing = await sql`
      SELECT id FROM customers WHERE email = ${ADMIN_EMAIL} LIMIT 1
    `;

    if (existing.length > 0) {
      console.log(`Admin account already exists: ${ADMIN_EMAIL}`);
    } else {
      const passwordHash = bcrypt.hashSync(ADMIN_PASSWORD, 10);
      const now = new Date().toISOString();
      await sql`
        INSERT INTO customers (
          id, name, email, phone, password_hash, created_at,
          points, visits, total_spent, tier, visit_streak, blowouts_earned
        ) VALUES (
          'admin-001', 'MC Admin', ${ADMIN_EMAIL}, '', ${passwordHash}, ${now},
          0, 0, 0, 'Bronze', 0, 0
        )
        ON CONFLICT (email) DO NOTHING
      `;
      console.log(`Created customer account: ${ADMIN_EMAIL}`);
    }

    // Check if admin entry already exists
    const existingAdmin = await sql`
      SELECT email FROM admins WHERE email = ${ADMIN_EMAIL} LIMIT 1
    `;

    if (existingAdmin.length > 0) {
      console.log(`Admin access already granted: ${ADMIN_EMAIL}`);
    } else {
      const now = new Date().toISOString();
      await sql`
        INSERT INTO admins (email, added_at, added_by)
        VALUES (${ADMIN_EMAIL}, ${now}, 'seed')
        ON CONFLICT (email) DO NOTHING
      `;
      console.log(`Granted admin access: ${ADMIN_EMAIL}`);
    }

    console.log("\nDone. Login at /login with:");
    console.log(`  Email:    ${ADMIN_EMAIL}`);
    console.log(`  Password: ${ADMIN_PASSWORD}`);
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
