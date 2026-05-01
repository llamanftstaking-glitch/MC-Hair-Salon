import "server-only";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { siteSettings as siteSettingsTable } from "./schema";

export interface SiteSettings {
  business: {
    name: string;
    tagline: string;
    address: string;
    phone: string;
    email: string;
    instagram: string;
    facebook: string;
  };
  hours: {
    day: string;
    open: string;
    close: string;
    closed?: boolean;
  }[];
  hero: {
    headline: string;
    headlineAccent: string;
    subheadline: string;
  };
}

const SETTINGS_KEY = "settings";

const DEFAULTS: SiteSettings = {
  business: {
    name:      "MC Hair Salon & Spa",
    tagline:   "Upper East Side's Premier Luxury Salon",
    address:   "336 East 78th St, New York, NY 10075",
    phone:     "(212) 988-5252",
    email:     "hello@mchairsalon.com",
    instagram: "https://www.instagram.com/mchairsalonspa/",
    facebook:  "https://www.facebook.com/mchairsalonandspa/",
  },
  hours: [
    { day: "Monday",    open: "9:30 AM",  close: "4:00 PM" },
    { day: "Tuesday",   open: "10:30 AM", close: "7:30 PM" },
    { day: "Wednesday", open: "10:30 AM", close: "7:30 PM" },
    { day: "Thursday",  open: "10:30 AM", close: "7:30 PM" },
    { day: "Friday",    open: "10:00 AM", close: "7:00 PM" },
    { day: "Saturday",  open: "10:00 AM", close: "7:00 PM" },
    { day: "Sunday",    open: "11:00 AM", close: "6:00 PM" },
  ],
  hero: {
    headline:       "Upper East Side's",
    headlineAccent: "Premier Hair Salon",
    subheadline:    "Luxury hair and spa services in the heart of New York City. Precision cuts, transformative color, and expert beauty treatments since 2011.",
  },
};

export async function getSettings(): Promise<SiteSettings> {
  const rows = await db
    .select()
    .from(siteSettingsTable)
    .where(eq(siteSettingsTable.key, SETTINGS_KEY));

  if (!rows.length) {
    // First-run: seed defaults
    await db.insert(siteSettingsTable).values({ key: SETTINGS_KEY, value: DEFAULTS });
    return DEFAULTS;
  }

  const stored = rows[0].value as Partial<SiteSettings>;
  return {
    business: { ...DEFAULTS.business, ...(stored.business ?? {}) },
    hours:    stored.hours    ?? DEFAULTS.hours,
    hero:     { ...DEFAULTS.hero,     ...(stored.hero     ?? {}) },
  };
}

// Convenience helper for server components that need salon info
export async function getSalonInfo() {
  const s = await getSettings();
  return {
    name:        s.business.name,
    tagline:     s.business.tagline,
    address:     s.business.address,
    phone:       s.business.phone,
    email:       s.business.email,
    instagram:   s.business.instagram,
    facebook:    s.business.facebook,
    hours:       s.hours,
    established: 2011,
  };
}

export async function updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSettings();
  const updated: SiteSettings = {
    business: { ...current.business, ...(updates.business ?? {}) },
    hours:    updates.hours    ?? current.hours,
    hero:     { ...current.hero,     ...(updates.hero     ?? {}) },
  };
  await db
    .insert(siteSettingsTable)
    .values({ key: SETTINGS_KEY, value: updated })
    .onConflictDoUpdate({ target: siteSettingsTable.key, set: { value: updated } });
  return updated;
}
