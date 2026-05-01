#!/usr/bin/env node
/**
 * One-time migration: import existing data/*.json files into PostgreSQL.
 * Run once after setting DATABASE_URL and running `npm run db:push`.
 *
 * Usage: node scripts/import-data.js
 */
const fs       = require("fs");
const path     = require("path");
const postgres = require("postgres");

if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL is not set.");
  process.exit(1);
}

const sql     = postgres(process.env.DATABASE_URL, { max: 1 });
const DATA    = path.join(__dirname, "..", "data");

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return []; }
}

async function main() {
  let imported = 0;
  let skipped  = 0;

  // ── customers ─────────────────────────────────────────────────────────────
  const customers = readJson(path.join(DATA, "customers.json"));
  for (const c of customers) {
    try {
      await sql`
        INSERT INTO customers (
          id, name, email, phone, password_hash, google_id, avatar_url,
          created_at, points, visits, total_spent, tier,
          visit_streak, blowouts_earned,
          stripe_customer_id, stripe_payment_method_id
        ) VALUES (
          ${c.id}, ${c.name}, ${c.email.toLowerCase()}, ${c.phone ?? ""},
          ${c.passwordHash ?? null}, ${c.googleId ?? null}, ${c.avatarUrl ?? null},
          ${c.createdAt ?? new Date().toISOString()},
          ${c.points ?? 0}, ${c.visits ?? 0}, ${c.totalSpent ?? 0},
          ${c.tier ?? "Bronze"}, ${c.visitStreak ?? 0}, ${c.blowoutsEarned ?? 0},
          ${c.stripeCustomerId ?? null}, ${c.stripePaymentMethodId ?? null}
        )
        ON CONFLICT (id) DO NOTHING
      `;
      imported++;

      // appointments
      for (const a of (c.appointments ?? [])) {
        await sql`
          INSERT INTO customer_appointments (
            id, customer_id, service, stylist, date, time, status, points_earned
          ) VALUES (
            ${a.id}, ${c.id}, ${a.service}, ${a.stylist}, ${a.date}, ${a.time},
            ${a.status ?? "upcoming"}, ${a.pointsEarned ?? 0}
          )
          ON CONFLICT (id) DO NOTHING
        `;
      }

      // packages
      for (const p of (c.packages ?? [])) {
        await sql`
          INSERT INTO customer_packages (
            id, customer_id, package_id, name, tagline, services, price,
            sessions_total, sessions_used, purchased_at, expires_at, stripe_session_id
          ) VALUES (
            ${p.id}, ${c.id}, ${p.packageId}, ${p.name}, ${p.tagline ?? null},
            ${JSON.stringify(p.services ?? null)},
            ${p.price}, ${p.sessionsTotal}, ${p.sessionsUsed ?? 0},
            ${p.purchasedAt}, ${p.expiresAt}, ${p.stripeSessionId ?? null}
          )
          ON CONFLICT (id) DO NOTHING
        `;
      }

      // rewards
      for (const r of (c.rewards ?? [])) {
        await sql`
          INSERT INTO customer_rewards (id, customer_id, name, points_cost, redeemed_at)
          VALUES (${r.id}, ${c.id}, ${r.name}, ${r.pointsCost ?? 0}, ${r.redeemedAt})
          ON CONFLICT (id) DO NOTHING
        `;
      }

    } catch (err) {
      console.error(`  Skipped customer ${c.email}: ${err.message}`);
      skipped++;
    }
  }
  console.log(`customers: ${imported} imported, ${skipped} skipped`);
  imported = skipped = 0;

  // ── admins ────────────────────────────────────────────────────────────────
  const admins = readJson(path.join(DATA, "admins.json"));
  for (const a of admins) {
    try {
      await sql`
        INSERT INTO admins (email, added_at, added_by)
        VALUES (${a.email.toLowerCase()}, ${a.addedAt}, ${a.addedBy ?? "import"})
        ON CONFLICT (email) DO NOTHING
      `;
      imported++;
    } catch (err) {
      console.error(`  Skipped admin ${a.email}: ${err.message}`);
      skipped++;
    }
  }
  console.log(`admins: ${imported} imported, ${skipped} skipped`);
  imported = skipped = 0;

  // ── bookings ──────────────────────────────────────────────────────────────
  const bookings = readJson(path.join(DATA, "bookings.json"));
  for (const b of bookings) {
    try {
      await sql`
        INSERT INTO bookings (
          id, name, email, phone, service, stylist, date, time, notes,
          status, created_at, service_price, stripe_customer_id,
          stripe_payment_method_id, card_last4, card_brand,
          noshow_charge_id, cancellation_charge_id
        ) VALUES (
          ${b.id}, ${b.name}, ${b.email}, ${b.phone}, ${b.service},
          ${b.stylist ?? ""}, ${b.date}, ${b.time}, ${b.notes ?? null},
          ${b.status ?? "pending"}, ${b.createdAt},
          ${b.servicePrice ?? null}, ${b.stripeCustomerId ?? null},
          ${b.stripePaymentMethodId ?? null}, ${b.cardLast4 ?? null},
          ${b.cardBrand ?? null}, ${b.noshowChargeId ?? null},
          ${b.cancellationChargeId ?? null}
        )
        ON CONFLICT (id) DO NOTHING
      `;
      imported++;
    } catch (err) {
      console.error(`  Skipped booking ${b.id}: ${err.message}`);
      skipped++;
    }
  }
  console.log(`bookings: ${imported} imported, ${skipped} skipped`);
  imported = skipped = 0;

  // ── gift_cards ────────────────────────────────────────────────────────────
  const giftCards = readJson(path.join(DATA, "gift-cards.json"));
  for (const g of giftCards) {
    try {
      await sql`
        INSERT INTO gift_cards (
          id, code, amount, recipient_name, recipient_email, recipient_phone,
          sender_name, sender_email, message, delivery_method, status,
          created_at, redeemed_at, stripe_session_id
        ) VALUES (
          ${g.id}, ${g.code}, ${g.amount}, ${g.recipientName},
          ${g.recipientEmail ?? null}, ${g.recipientPhone ?? null},
          ${g.senderName}, ${g.senderEmail ?? null}, ${g.message ?? ""},
          ${g.deliveryMethod ?? "email"}, ${g.status ?? "active"},
          ${g.createdAt}, ${g.redeemedAt ?? null}, ${g.stripeSessionId ?? null}
        )
        ON CONFLICT (id) DO NOTHING
      `;
      imported++;
    } catch (err) {
      console.error(`  Skipped gift card ${g.code}: ${err.message}`);
      skipped++;
    }
  }
  console.log(`gift_cards: ${imported} imported, ${skipped} skipped`);
  imported = skipped = 0;

  // ── messages ──────────────────────────────────────────────────────────────
  const messages = readJson(path.join(DATA, "messages.json"));
  for (const m of messages) {
    try {
      await sql`
        INSERT INTO messages (id, name, email, message, read, created_at)
        VALUES (${m.id}, ${m.name}, ${m.email}, ${m.message}, ${m.read ?? false}, ${m.createdAt})
        ON CONFLICT (id) DO NOTHING
      `;
      imported++;
    } catch (err) {
      console.error(`  Skipped message ${m.id}: ${err.message}`);
      skipped++;
    }
  }
  console.log(`messages: ${imported} imported, ${skipped} skipped`);
  imported = skipped = 0;

  // ── subscribers ───────────────────────────────────────────────────────────
  const subscribers = readJson(path.join(DATA, "newsletter.json"));
  for (const s of subscribers) {
    try {
      await sql`
        INSERT INTO subscribers (id, email, name, subscribed_at, active)
        VALUES (${s.id}, ${s.email.toLowerCase()}, ${s.name ?? null}, ${s.subscribedAt}, ${s.active ?? true})
        ON CONFLICT (email) DO NOTHING
      `;
      imported++;
    } catch (err) {
      console.error(`  Skipped subscriber ${s.email}: ${err.message}`);
      skipped++;
    }
  }
  console.log(`subscribers: ${imported} imported, ${skipped} skipped`);
  imported = skipped = 0;

  // ── staff ─────────────────────────────────────────────────────────────────
  const staff = readJson(path.join(DATA, "staff.json"));
  for (const [i, s] of staff.entries()) {
    try {
      await sql`
        INSERT INTO staff (id, name, role, bio, image, specialties, portfolio, is_makeup_artist, "order")
        VALUES (
          ${s.id}, ${s.name}, ${s.role}, ${s.bio}, ${s.image ?? null},
          ${JSON.stringify(s.specialties ?? [])},
          ${JSON.stringify(s.portfolio ?? [])},
          ${s.isMakeupArtist ?? false},
          ${s.order ?? i}
        )
        ON CONFLICT (id) DO NOTHING
      `;
      imported++;
    } catch (err) {
      console.error(`  Skipped staff ${s.name}: ${err.message}`);
      skipped++;
    }
  }
  console.log(`staff: ${imported} imported, ${skipped} skipped`);
  imported = skipped = 0;

  // ── site_settings ─────────────────────────────────────────────────────────
  const siteSettings = (() => {
    try {
      return JSON.parse(fs.readFileSync(path.join(DATA, "site-settings.json"), "utf8"));
    } catch { return null; }
  })();
  if (siteSettings) {
    try {
      await sql`
        INSERT INTO site_settings (key, value)
        VALUES ('settings', ${JSON.stringify(siteSettings)})
        ON CONFLICT (key) DO NOTHING
      `;
      console.log("site_settings: 1 imported");
    } catch (err) {
      console.error(`  Skipped site_settings: ${err.message}`);
    }
  }

  // ── analytics ─────────────────────────────────────────────────────────────
  const analytics = (() => {
    try {
      return JSON.parse(fs.readFileSync(path.join(DATA, "analytics.json"), "utf8"));
    } catch { return null; }
  })();
  if (analytics?.days) {
    imported = skipped = 0;
    for (const d of analytics.days) {
      try {
        await sql`
          INSERT INTO analytics_days (date, views, unique_ips)
          VALUES (${d.date}, ${d.views ?? 0}, ${JSON.stringify(d.uniqueIps ?? [])})
          ON CONFLICT (date) DO NOTHING
        `;
        imported++;
      } catch (err) {
        console.error(`  Skipped analytics day ${d.date}: ${err.message}`);
        skipped++;
      }
    }
    console.log(`analytics_days: ${imported} imported, ${skipped} skipped`);
  }

  console.log("\nImport complete.");
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
}).finally(() => sql.end());
