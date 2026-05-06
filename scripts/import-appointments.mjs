#!/usr/bin/env node
/**
 * Import parsed appointments.json into MC Hair Salon via admin API
 * Usage: node scripts/import-appointments.mjs [json_path] [base_url]
 */
import { readFileSync } from "fs";
import { resolve } from "path";

const jsonPath = process.argv[2] || "/Users/rayquinones/Downloads/appointments.json";
const baseUrl  = process.argv[3] || "https://mchairsalon.com";
const email    = process.env.ADMIN_EMAIL    || "hello@mchairsalon.com";
const password = process.env.ADMIN_PASSWORD || "MCAdmin2040!";

const appointments = JSON.parse(readFileSync(resolve(jsonPath), "utf8"));
console.log(`Importing ${appointments.length} appointments to ${baseUrl}...`);

// Login to get session cookie
const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});

if (!loginRes.ok) {
  console.error("Login failed:", await loginRes.text());
  process.exit(1);
}

const cookies = loginRes.headers.get("set-cookie") || "";
console.log("Logged in ✓");

// Import all appointments
const res = await fetch(`${baseUrl}/api/bookings/import`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Cookie": cookies,
  },
  body: JSON.stringify({ appointments }),
});

const data = await res.json();
if (!res.ok) {
  console.error("Import failed:", data);
  process.exit(1);
}

console.log(`Done: ${data.inserted} inserted, ${data.skipped} skipped, ${data.errors} errors`);
