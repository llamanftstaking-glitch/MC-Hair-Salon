#!/usr/bin/env node
/**
 * Import parsed appointments.json into MC Hair Salon via admin API
 * Usage: node scripts/import-appointments.mjs [json_path] [base_url]
 */
import { readFileSync } from "fs";
import { resolve } from "path";

const jsonPath = process.argv[2] || "/Users/rayquinones/Downloads/appointments.json";
const baseUrl  = process.argv[3] || "https://mchairsalon.com";
const token = process.env.INTERNAL_API_TOKEN || "local-dev-token";

const appointments = JSON.parse(readFileSync(resolve(jsonPath), "utf8"));
console.log(`Importing ${appointments.length} appointments to ${baseUrl}...`);

// Import all appointments using internal token (no login needed)
const res = await fetch(`${baseUrl}/api/bookings/import`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-internal-token": token,
  },
  body: JSON.stringify({ appointments }),
});

const data = await res.json();
if (!res.ok) {
  console.error("Import failed:", data);
  process.exit(1);
}

console.log(`Done: ${data.inserted} inserted, ${data.skipped} skipped, ${data.errors} errors`);
