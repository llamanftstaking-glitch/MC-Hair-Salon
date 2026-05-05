#!/usr/bin/env node
/**
 * Clears all rows from the bookings table.
 * Usage: node scripts/clear-bookings.js
 */
const postgres = require("postgres");

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

(async () => {
  const sql = postgres(DATABASE_URL, { ssl: "require" });
  try {
    const result = await sql`DELETE FROM bookings`;
    console.log("Bookings cleared.");
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
})();
