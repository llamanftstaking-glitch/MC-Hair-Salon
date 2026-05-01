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
    tagline: "Upper East Side's Premier Luxury Salon",
    address: "336 East 78th St, New York, NY 10075",
    phone: "(212) 988-5252",
    email: "hello@mchairsalon.com",
    instagram: "https://www.instagram.com/mchairsalonspa/",
    facebook: "https://www.facebook.com/mchairsalonandspa/",
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
    headline: "Upper East Side's",
    headlineAccent: "Premier Hair Salon",
    subheadline: "Luxury hair and spa services in the heart of New York City. Precision cuts, transformative color, and expert beauty treatments since 2011.",
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

// Convenience helper for server components that need salon info
export function getSalonInfo() {
  const s = getSettings();
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
