import fs from "fs";
import path from "path";

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

const DATA_FILE = path.join(process.cwd(), "data", "site-settings.json");

const DEFAULTS: SiteSettings = {
  business: {
    name: "MC Hair Salon & Spa",
    tagline: "Luxury Hair Care on the Upper East Side",
    address: "1231 Lexington Ave, New York, NY 10028",
    phone: "(212) 555-0190",
    email: "hello@mchairsalon.com",
    instagram: "https://instagram.com/mchairsalon",
    facebook: "https://facebook.com/mchairsalon",
  },
  hours: [
    { day: "Monday",    open: "9:00 AM",  close: "7:00 PM" },
    { day: "Tuesday",   open: "9:00 AM",  close: "7:00 PM" },
    { day: "Wednesday", open: "9:00 AM",  close: "7:00 PM" },
    { day: "Thursday",  open: "9:00 AM",  close: "8:00 PM" },
    { day: "Friday",    open: "9:00 AM",  close: "8:00 PM" },
    { day: "Saturday",  open: "9:00 AM",  close: "6:00 PM" },
    { day: "Sunday",    open: "10:00 AM", close: "5:00 PM" },
  ],
  hero: {
    headline: "Your Hair.",
    headlineAccent: "Your Crown.",
    subheadline: "Premium salon services tailored to you.",
  },
};

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DEFAULTS, null, 2));
  }
}

export function getSettings(): SiteSettings {
  ensureDataDir();
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

export function updateSettings(updates: Partial<SiteSettings>): SiteSettings {
  const current = getSettings();
  const updated: SiteSettings = {
    business: { ...current.business, ...(updates.business ?? {}) },
    hours:    updates.hours    ?? current.hours,
    hero:     { ...current.hero,     ...(updates.hero     ?? {}) },
  };
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(updated, null, 2));
  return updated;
}
