/**
 * Creates staff login accounts in the customers table.
 * Run once: node scripts/create-staff-accounts.js
 *
 * Default password: MCStaff2026!
 * Staff can change their password via the account settings page.
 */
const bcrypt = require("bcryptjs");
const { Pool } = require("pg");

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

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  console.log("Creating staff accounts...\n");
  const hash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  for (const { name, email } of STAFF) {
    try {
      // Check if already exists
      const existing = await pool.query(
        "SELECT id FROM customers WHERE email = $1",
        [email]
      );

      if (existing.rows.length > 0) {
        console.log(`  ✓ ${name} (${email}) — already exists`);
        continue;
      }

      const id = `STAFF-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      await pool.query(
        `INSERT INTO customers (id, name, email, phone, password_hash, created_at, points, visits, total_spent, tier, visit_streak, blowouts_earned)
         VALUES ($1, $2, $3, $4, $5, $6, 0, 0, 0, 'Bronze', 0, 0)`,
        [id, name, email, "", hash, new Date().toISOString()]
      );
      console.log(`  ✓ ${name} (${email}) — created`);
    } catch (err) {
      console.error(`  ✗ ${name} (${email}) — error:`, err.message);
    }
  }

  console.log(`\nDone! Default password: ${DEFAULT_PASSWORD}`);
  console.log("Each staff member can log in at /login and access their portal at /staff");
  await pool.end();
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
