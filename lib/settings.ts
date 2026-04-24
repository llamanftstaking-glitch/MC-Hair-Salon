import "server-only";
import fs from "fs";
import path from "path";

export interface SiteHour {
  day: string;
  open: string;
  close: string;
  closed?: boolean;
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
  hours: SiteHour[];
  hero: {
    headline: string;
    headlineAccent: string;
    subheadline: string;
  };
}

const FILE = path.join(process.cwd(), "data/site-settings.json");

const DEFAULT: SiteSettings = {
  business: {
    name: "MC Hair Salon & Spa",
    tagline: "Upper East Side's Premier Luxury Salon",
    address: "336 East 78th St, New York, NY 10075",
    phone: "(212) 988-5252",
    email: "info@mchairsalon.com",
    instagram: "https://www.instagram.com/mchairsalonspa/",
    facebook: "https://www.facebook.com/mchairsalonandspa/",
  },
  hours: [
    { day: "Monday",    open: "10:00 AM", close: "5:00 PM",  closed: false },
    { day: "Tuesday",   open: "10:30 AM", close: "7:30 PM",  closed: false },
    { day: "Wednesday", open: "10:30 AM", close: "7:30 PM",  closed: false },
    { day: "Thursday",  open: "10:30 AM", close: "7:30 PM",  closed: false },
    { day: "Friday",    open: "10:00 AM", close: "7:00 PM",  closed: false },
    { day: "Saturday",  open: "10:00 AM", close: "7:00 PM",  closed: false },
    { day: "Sunday",    open: "11:00 AM", close: "6:00 PM",  closed: false },
  ],
  hero: {
    headline: "Upper East Side's",
    headlineAccent: "Premier Hair Salon",
    subheadline: "Luxury hair and spa services in the heart of New York City. Precision cuts, transformative color, and expert beauty treatments since 2011.",
  },
};

export function getSettings(): SiteSettings {
  try {
    if (!fs.existsSync(FILE)) return DEFAULT;
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return DEFAULT;
  }
}

export function updateSettings(updates: Partial<SiteSettings>): SiteSettings {
  const current = getSettings();
  const merged: SiteSettings = {
    ...current,
    ...updates,
    business: updates.business ? { ...current.business, ...updates.business } : current.business,
    hero:     updates.hero     ? { ...current.hero,     ...updates.hero }     : current.hero,
    hours:    updates.hours    ?? current.hours,
  };
  fs.writeFileSync(FILE, JSON.stringify(merged, null, 2));
  return merged;
}
