#!/usr/bin/env node
/**
 * Run once on a fresh deploy to create the initial admin account.
 * Usage: node scripts/seed-admin.js
 *
 * Override defaults with env vars:
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=yourpass node scripts/seed-admin.js
 */
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ADMIN_EMAIL    = process.env.ADMIN_EMAIL    || "admin@mchairsalonspa.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "MCAdmin2026!";
const DATA_DIR       = path.join(__dirname, "..", "data");

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return []; }
}
function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

const customersFile = path.join(DATA_DIR, "customers.json");
const adminsFile    = path.join(DATA_DIR, "admins.json");

const customers = readJson(customersFile);
const admins    = readJson(adminsFile);

if (customers.some(c => c.email === ADMIN_EMAIL)) {
  console.log(`Admin account already exists: ${ADMIN_EMAIL}`);
} else {
  const passwordHash = bcrypt.hashSync(ADMIN_PASSWORD, 10);
  customers.push({
    id: "admin-001",
    name: "MC Admin",
    email: ADMIN_EMAIL,
    phone: "",
    passwordHash,
    createdAt: new Date().toISOString(),
    points: 0,
    visits: 0,
    tier: "Bronze",
    rewards: [],
  });
  writeJson(customersFile, customers);
  console.log(`✓ Created customer account: ${ADMIN_EMAIL}`);
}

if (!admins.some(a => a.email === ADMIN_EMAIL)) {
  admins.push({ email: ADMIN_EMAIL, addedAt: new Date().toISOString(), addedBy: "seed" });
  writeJson(adminsFile, admins);
  console.log(`✓ Granted admin access: ${ADMIN_EMAIL}`);
} else {
  console.log(`Admin access already granted: ${ADMIN_EMAIL}`);
}

console.log("\nDone. Login at /login with:");
console.log(`  Email:    ${ADMIN_EMAIL}`);
console.log(`  Password: ${ADMIN_PASSWORD}`);
