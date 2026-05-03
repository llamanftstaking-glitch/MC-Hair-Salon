import {
  pgTable,
  text,
  integer,
  boolean,
  bigint,
  jsonb,
  timestamp,
  real,
  numeric,
  uuid,
  unique,
} from "drizzle-orm/pg-core";

// ── customers ────────────────────────────────────────────────────────────────
export const customers = pgTable("customers", {
  id:                   text("id").primaryKey(),
  name:                 text("name").notNull(),
  email:                text("email").notNull().unique(),
  phone:                text("phone").notNull().default(""),
  passwordHash:         text("password_hash"),
  googleId:             text("google_id"),
  avatarUrl:            text("avatar_url"),
  createdAt:            text("created_at").notNull(),
  points:               integer("points").notNull().default(0),
  visits:               integer("visits").notNull().default(0),
  totalSpent:           real("total_spent").notNull().default(0),
  tier:                 text("tier").notNull().default("Bronze"),
  visitStreak:          integer("visit_streak").notNull().default(0),
  blowoutsEarned:       integer("blowouts_earned").notNull().default(0),
  stripeCustomerId:     text("stripe_customer_id"),
  stripePaymentMethodId: text("stripe_payment_method_id"),
});

// ── customer_appointments ────────────────────────────────────────────────────
export const customerAppointments = pgTable("customer_appointments", {
  id:          text("id").primaryKey(),
  customerId:  text("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
  service:     text("service").notNull(),
  stylist:     text("stylist").notNull(),
  date:        text("date").notNull(),
  time:        text("time").notNull(),
  status:      text("status").notNull().default("upcoming"),
  pointsEarned: integer("points_earned").notNull().default(0),
});

// ── customer_packages ────────────────────────────────────────────────────────
export const customerPackages = pgTable("customer_packages", {
  id:             text("id").primaryKey(),
  customerId:     text("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
  packageId:      text("package_id").notNull(),
  name:           text("name").notNull(),
  tagline:        text("tagline"),
  services:       jsonb("services").$type<string[]>(),
  price:          real("price").notNull(),
  sessionsTotal:  integer("sessions_total").notNull(),
  sessionsUsed:   integer("sessions_used").notNull().default(0),
  purchasedAt:    text("purchased_at").notNull(),
  expiresAt:      text("expires_at").notNull(),
  stripeSessionId: text("stripe_session_id"),
});

// ── customer_rewards ─────────────────────────────────────────────────────────
export const customerRewards = pgTable("customer_rewards", {
  id:          text("id").primaryKey(),
  customerId:  text("customer_id").notNull().references(() => customers.id, { onDelete: "cascade" }),
  name:        text("name").notNull(),
  pointsCost:  integer("points_cost").notNull().default(0),
  redeemedAt:  text("redeemed_at").notNull(),
});

// ── admins ───────────────────────────────────────────────────────────────────
export const admins = pgTable("admins", {
  email:    text("email").primaryKey(),
  addedAt:  text("added_at").notNull(),
  addedBy:  text("added_by").notNull(),
});

// ── bookings ─────────────────────────────────────────────────────────────────
export const bookings = pgTable("bookings", {
  id:                   text("id").primaryKey(),
  name:                 text("name").notNull(),
  email:                text("email").notNull(),
  phone:                text("phone").notNull(),
  service:              text("service").notNull(),
  stylist:              text("stylist").notNull(),
  date:                 text("date").notNull(),
  time:                 text("time").notNull(),
  notes:                text("notes"),
  status:               text("status").notNull().default("pending"),
  createdAt:            text("created_at").notNull(),
  servicePrice:         real("service_price"),
  stripeCustomerId:     text("stripe_customer_id"),
  stripePaymentMethodId: text("stripe_payment_method_id"),
  cardLast4:            text("card_last4"),
  cardBrand:            text("card_brand"),
  noshowChargeId:       text("noshow_charge_id"),
  cancellationChargeId: text("cancellation_charge_id"),
  paymentStatus:        text("payment_status").default("unpaid"),
  tipAmount:            real("tip_amount"),
  paymentIntentId:      text("payment_intent_id"),
});

// ── gift_cards ────────────────────────────────────────────────────────────────
export const giftCards = pgTable("gift_cards", {
  id:              text("id").primaryKey(),
  code:            text("code").notNull().unique(),
  amount:          real("amount").notNull(),
  recipientName:   text("recipient_name").notNull(),
  recipientEmail:  text("recipient_email"),
  recipientPhone:  text("recipient_phone"),
  senderName:      text("sender_name").notNull(),
  senderEmail:     text("sender_email"),
  message:         text("message").notNull().default(""),
  deliveryMethod:  text("delivery_method").notNull().default("email"),
  status:          text("status").notNull().default("active"),
  createdAt:       text("created_at").notNull(),
  redeemedAt:      text("redeemed_at"),
  stripeSessionId: text("stripe_session_id"),
});

// ── messages ──────────────────────────────────────────────────────────────────
export const messages = pgTable("messages", {
  id:        text("id").primaryKey(),
  name:      text("name").notNull(),
  email:     text("email").notNull(),
  message:   text("message").notNull(),
  read:      boolean("read").notNull().default(false),
  createdAt: text("created_at").notNull(),
});

// ── subscribers ───────────────────────────────────────────────────────────────
export const subscribers = pgTable("subscribers", {
  id:           text("id").primaryKey(),
  email:        text("email").notNull().unique(),
  name:         text("name"),
  subscribedAt: text("subscribed_at").notNull(),
  active:       boolean("active").notNull().default(true),
});

// ── staff ─────────────────────────────────────────────────────────────────────
export const staff = pgTable("staff", {
  id:            text("id").primaryKey(),
  name:          text("name").notNull(),
  role:          text("role").notNull(),
  bio:           text("bio").notNull(),
  image:         text("image"),
  specialties:   jsonb("specialties").$type<string[]>().notNull().default([]),
  portfolio:     jsonb("portfolio").$type<{ type: "image" | "video"; src: string; caption?: string }[]>().default([]),
  isMakeupArtist: boolean("is_makeup_artist").notNull().default(false),
  order:         integer("order").notNull().default(0),
  hourlyRate:    real("hourly_rate"),
  commissionRate: real("commission_rate"), // % the house keeps (e.g. 40 = stylist keeps 60%)
});

// ── site_settings ─────────────────────────────────────────────────────────────
export const siteSettings = pgTable("site_settings", {
  key:   text("key").primaryKey(),
  value: jsonb("value").notNull(),
});

// ── admin_totp ────────────────────────────────────────────────────────────────
export const adminTotp = pgTable("admin_totp", {
  id:        integer("id").primaryKey().default(1),
  secret:    text("secret").notNull(),
  enabled:   boolean("enabled").notNull().default(false),
  createdAt: text("created_at").notNull(),
});

// ── analytics_days ────────────────────────────────────────────────────────────
export const analyticsDays = pgTable("analytics_days", {
  date:      text("date").primaryKey(),
  views:     integer("views").notNull().default(0),
  uniqueIps: jsonb("unique_ips").$type<string[]>().notNull().default([]),
});

// ── rate_limits ───────────────────────────────────────────────────────────────
export const rateLimits = pgTable("rate_limits", {
  key:         text("key").primaryKey(),
  count:       integer("count").notNull().default(0),
  windowStart: bigint("window_start", { mode: "number" }).notNull().default(0),
});

// ── products ──────────────────────────────────────────────────────────────────
export const products = pgTable("products", {
  id:           text("id").primaryKey(),
  name:         text("name").notNull(),
  brand:        text("brand"),
  category:     text("category").notNull().default("general"),
  sku:          text("sku"),
  costPrice:    real("cost_price").notNull().default(0),
  retailPrice:  real("retail_price"),
  unit:         text("unit").notNull().default("each"),
  currentStock: real("current_stock").notNull().default(0),
  minStock:     real("min_stock").notNull().default(1),
  vendor:       text("vendor"),
  notes:        text("notes"),
  isActive:     boolean("is_active").notNull().default(true),
  createdAt:    text("created_at").notNull(),
  updatedAt:    text("updated_at").notNull(),
  serviceUsage: jsonb("service_usage").$type<{ service: string; qty: number }[]>().default([]),
});

// ── inventory_transactions ─────────────────────────────────────────────────────
export const inventoryTransactions = pgTable("inventory_transactions", {
  id:          text("id").primaryKey(),
  productId:   text("product_id").notNull(),
  productName: text("product_name").notNull(),
  type:        text("type").notNull(), // received | used | sold | adjustment | waste
  quantity:    real("quantity").notNull(),
  date:        text("date").notNull(),
  staffName:   text("staff_name"),
  bookingId:   text("booking_id"),
  notes:       text("notes"),
  costAtTime:  real("cost_at_time"),
  createdAt:   text("created_at").notNull(),
});

// ── time_entries ──────────────────────────────────────────────────────────────
export const timeEntries = pgTable("time_entries", {
  id:        text("id").primaryKey(),
  staffId:   text("staff_id").notNull(),
  staffName: text("staff_name").notNull(),
  clockIn:   text("clock_in").notNull(),
  clockOut:  text("clock_out"),
  date:      text("date").notNull(),
  notes:     text("notes"),
});

// ── staff_schedule ────────────────────────────────────────────────────────────
export const staffSchedule = pgTable("staff_schedule", {
  id:          uuid("id").primaryKey().defaultRandom(),
  staffName:   text("staff_name").notNull(),
  dayOfWeek:   integer("day_of_week").notNull(), // 0=Mon, 6=Sun
  isWorking:   boolean("is_working").notNull().default(false),
  startTime:   text("start_time").notNull().default("09:00"),
  endTime:     text("end_time").notNull().default("18:00"),
}, (t) => ({
  unq: unique().on(t.staffName, t.dayOfWeek),
}));

// ── salon_services ────────────────────────────────────────────────────────────
export const salonServices = pgTable("salon_services", {
  id:           text("id").primaryKey(),
  name:         text("name").notNull(),
  category:     text("category").notNull().default("Other"),
  priceMin:     numeric("price_min", { precision: 10, scale: 2 }).notNull().default("0"),
  priceMax:     numeric("price_max", { precision: 10, scale: 2 }),
  durationMins: integer("duration_mins"),
  isActive:     boolean("is_active").notNull().default(true),
  sortOrder:    integer("sort_order").notNull().default(0),
  createdAt:    timestamp("created_at").notNull().defaultNow(),
});

// ── promo_codes ───────────────────────────────────────────────────────────────
export const promoCodes = pgTable("promo_codes", {
  id:            uuid("id").primaryKey().defaultRandom(),
  code:          text("code").notNull().unique(),
  discountType:  text("discount_type").notNull(), // "percent" | "flat"
  discountValue: numeric("discount_value", { precision: 10, scale: 2 }).notNull(),
  expiryDate:    text("expiry_date"),              // nullable ISO date string
  maxUses:       integer("max_uses"),              // nullable
  usedCount:     integer("used_count").notNull().default(0),
  isActive:      boolean("is_active").notNull().default(true),
  createdAt:     timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── staff_blocks ──────────────────────────────────────────────────────────────
export const staffBlocks = pgTable("staff_blocks", {
  id:        uuid("id").primaryKey().defaultRandom(),
  staffName: text("staff_name").notNull(),
  startDate: text("start_date").notNull(), // ISO date "YYYY-MM-DD"
  endDate:   text("end_date").notNull(),
  reason:    text("reason"),
  createdAt: text("created_at").notNull(),
});

// ── stripe_events ─────────────────────────────────────────────────────────────
export const stripeEvents = pgTable("stripe_events", {
  eventId:     text("event_id").primaryKey(),
  processedAt: text("processed_at").notNull(),
});

// ── finance_bills ─────────────────────────────────────────────────────────────
export const financeBills = pgTable("finance_bills", {
  id:        text("id").primaryKey(),
  name:      text("name").notNull(),
  category:  text("category").notNull().default("general"), // rent | utilities | supplies | subscriptions | general
  amount:    numeric("amount", { precision: 10, scale: 2 }).notNull().default("0"),
  dueDay:    integer("due_day").notNull().default(1), // day of month 1-31
  isPaid:    boolean("is_paid").notNull().default(false),
  autoPay:   boolean("auto_pay").notNull().default(false),
  notes:     text("notes"),
  createdAt: text("created_at").notNull(),
});
