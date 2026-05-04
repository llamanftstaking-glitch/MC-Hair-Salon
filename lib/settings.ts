import "server-only";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { siteSettings as siteSettingsTable } from "./schema";

export interface ThemeColors {
  accent:      string; // primary accent (gold by default)
  accent2:     string; // secondary accent
  bg:          string; // page background
  surface:     string; // card/surface background
  border:      string; // border color
  text:        string; // primary text
  muted:       string; // muted / subtext
}

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
  theme: ThemeColors;
}

const SETTINGS_KEY = "settings";

export const DEFAULT_THEME: ThemeColors = {
  accent:  "#C9A84C",
  accent2: "#FFD700",
  bg:      "#000000",
  surface: "#0f0f0f",
  border:  "#2a2a2a",
  text:    "#f5f0e8",
  muted:   "#a89070",
};

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
  theme: DEFAULT_THEME,
};

export async function getSettings(): Promise<SiteSettings> {
  let rows: { value: unknown }[];
  try {
    rows = await db
      .select()
      .from(siteSettingsTable)
      .where(eq(siteSettingsTable.key, SETTINGS_KEY));
  } catch (err) {
    console.warn(
      "[settings] DB read failed, returning DEFAULTS:",
      err instanceof Error ? err.message : err,
    );
    return DEFAULTS;
  }

  if (!rows.length) {
    try {
      await db
        .insert(siteSettingsTable)
        .values({ key: SETTINGS_KEY, value: DEFAULTS })
        .onConflictDoNothing({ target: siteSettingsTable.key });
    } catch (err) {
      console.warn(
        "[settings] DB seed failed, returning DEFAULTS:",
        err instanceof Error ? err.message : err,
      );
    }
    return DEFAULTS;
  }

  const stored = rows[0].value as Partial<SiteSettings>;
  return {
    business: { ...DEFAULTS.business, ...(stored.business ?? {}) },
    hours:    stored.hours ?? DEFAULTS.hours,
    hero:     { ...DEFAULTS.hero,     ...(stored.hero     ?? {}) },
    theme:    { ...DEFAULT_THEME,     ...(stored.theme    ?? {}) },
  };
}

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

export async function upsertKey(key: string, value: unknown): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const v = value as any;
  await db
    .insert(siteSettingsTable)
    .values({ key, value: v })
    .onConflictDoUpdate({ target: siteSettingsTable.key, set: { value: v } });
}

export async function getKey(key: string): Promise<unknown | null> {
  const rows = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, key));
  return rows.length ? rows[0].value : null;
}

export async function updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSettings();
  const updated: SiteSettings = {
    business: { ...current.business, ...(updates.business ?? {}) },
    hours:    updates.hours ?? current.hours,
    hero:     { ...current.hero,     ...(updates.hero     ?? {}) },
    theme:    { ...current.theme,    ...(updates.theme    ?? {}) },
  };
  await db
    .insert(siteSettingsTable)
    .values({ key: SETTINGS_KEY, value: updated })
    .onConflictDoUpdate({ target: siteSettingsTable.key, set: { value: updated } });
  return updated;
}
