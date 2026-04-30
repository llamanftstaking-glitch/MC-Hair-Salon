import fs from "fs";
import path from "path";

const STAFF_FILE = path.join(process.cwd(), "data", "staff.json");

export interface PortfolioItem {
  type: "image" | "video";
  src: string;
  caption?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image?: string;
  specialties: string[];
  portfolio?: PortfolioItem[];
}

const STAFF: StaffMember[] = [
  {
    id: "maria",
    name: "Maria",
    role: "Stylist",
    bio: "Maria brings a versatile touch to every appointment at MC Hair Salon. From precision haircuts and curly cuts to advanced color services, relaxers, and highlights, she tailors every look to the client's unique texture, lifestyle, and goals.",
    specialties: ["Color Correction", "Balayage", "Updo", "Curly Haircut", "Highlights", "Relaxer", "Color"],
    image: "",
    portfolio: [],
  },
  {
    id: "meagan",
    name: "Meagan",
    role: "Stylist",
    bio: "Meagan brings artistry and technical excellence to every appointment. Her expertise in L'Oréal color systems makes her our go-to for transformational color.",
    specialties: ["Hair Color", "Highlights", "Blowouts"],
    image: "/instagram/mchairsalonspa_1533145637_1836481173825515947_509340228.jpg",
    portfolio: [],
  },
  {
    id: "sally",
    name: "Sally",
    role: "Stylist",
    bio: "Sally is one of MC's most versatile stylists, skilled across all hair types and textures. Her services span women's and men's haircuts, curly cuts, keratin and hair Botox treatments, color, balayage, baby lights, updos, and eyebrow and lip waxing.",
    specialties: ["Women's Haircuts", "Men's Haircuts", "Curly Cuts", "Keratin Treatment", "Balayage", "Baby Lights", "Eyebrow & Lip Wax"],
    image: "",
    portfolio: [],
  },
  {
    id: "kato",
    name: "Kato",
    role: "Stylist",
    bio: "With 30 years of experience as a hairdresser, Kato is a true master of the craft. He specializes in hair color, natural highlights, and men's precision cutting — delivering refined results for both men and women.",
    specialties: ["Hair Color", "Natural Highlights", "Men's Hair", "Precision Cutting"],
    image: "/instagram/mchairsalonspa_1550078255_1978522269296608933_509340228.jpg",
    portfolio: [],
  },
  {
    id: "juany",
    name: "Juany",
    role: "Stylist",
    bio: "Juany specializes in smoothing and restorative hair treatments. Whether you're looking for a polished blowout, a long-lasting keratin treatment, or a hair Botox service to restore softness and shine, Juany delivers flawless results every time.",
    specialties: ["Blow Dry", "Keratin Treatment", "Botox Treatment for Hair"],
    image: "",
    portfolio: [],
  },
  {
    id: "isabella",
    name: "Isabella",
    role: "Makeup Artist",
    bio: "Isabella is MC's in-house beauty expert, bringing editorial precision to every look. From subtle everyday glam to showstopping bridal artistry, she tailors every look to your unique features and personal style.",
    specialties: ["Bridal Makeup", "Eye Makeup", "Lashes", "Makeup Lessons"],
    image: "/instagram/mchairsalonspa_1595346452_2358259426203129087_509340228.jpg",
    portfolio: [],
  },
];

function readStaff(): StaffMember[] {
  try {
    return JSON.parse(fs.readFileSync(STAFF_FILE, "utf8")) as StaffMember[];
  } catch {
    return STAFF;
  }
}

function writeStaff(staff: StaffMember[]): void {
  fs.writeFileSync(STAFF_FILE, JSON.stringify(staff, null, 2));
}

export function getAllStaff(): StaffMember[] {
  return readStaff();
}

export function getStaffById(id: string): StaffMember | undefined {
  return readStaff().find((s) => s.id === id);
}

export function createStaff(data: Omit<StaffMember, "id">): StaffMember {
  const staff = readStaff();
  const id = data.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
  const created: StaffMember = { id, ...data };
  writeStaff([...staff, created]);
  return created;
}

export function updateStaff(id: string, updates: Partial<Omit<StaffMember, "id">>): StaffMember {
  const staff = readStaff();
  const idx = staff.findIndex((s) => s.id === id);
  if (idx === -1) throw new Error(`Staff member "${id}" not found`);
  staff[idx] = { ...staff[idx], ...updates };
  writeStaff(staff);
  return staff[idx];
}

export function deleteStaff(id: string): void {
  const staff = readStaff();
  const filtered = staff.filter((s) => s.id !== id);
  if (filtered.length === staff.length) throw new Error(`Staff member "${id}" not found`);
  writeStaff(filtered);
}
