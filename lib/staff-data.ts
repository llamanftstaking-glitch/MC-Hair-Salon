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
    id: "kato",
    name: "Kato",
    role: "Master Stylist",
    bio: "With over a decade of experience, Kato specializes in precision cuts and advanced color techniques. A client favorite known for attention to detail.",
    specialties: ["Precision Cuts", "Balayage", "Color Correction"],
    image: "/instagram/mchairsalonspa_1550078255_1978522269296608933_509340228.jpg",
    portfolio: [
      { type: "image", src: "/instagram/mchairsalonspa_1550078255_1978522269296608933_509340228.jpg", caption: "Balayage" },
      { type: "image", src: "/instagram/mchairsalonspa_1533145637_1836481173825515947_509340228.jpg", caption: "Color" },
    ],
  },
  {
    id: "megan",
    name: "Megan",
    role: "Senior Stylist & Color Expert",
    bio: "Megan brings artistry and technical excellence to every appointment. Her expertise in L'Oréal color systems makes her our go-to for transformational color.",
    specialties: ["Hair Color", "Highlights", "Blowouts"],
    image: "/instagram/mchairsalonspa_1533145637_1836481173825515947_509340228.jpg",
    portfolio: [
      { type: "image", src: "/instagram/mchairsalonspa_1533145637_1836481173825515947_509340228.jpg", caption: "Highlights" },
      { type: "image", src: "/instagram/mchairsalonspa_1528578580_1798169924515305526_509340228.jpg", caption: "Color" },
    ],
  },
  {
    id: "sofia",
    name: "Sofia",
    role: "Senior Stylist",
    bio: "Sofia brings warmth and precision to every appointment. Known for her meticulous attention to detail and ability to create stunning looks tailored to each client.",
    specialties: ["Cuts", "Blowouts", "Styling"],
    image: "/instagram/mchairsalonspa_1528578580_1798169924515305526_509340228.jpg",
  },
  {
    id: "marcus",
    name: "Marcus",
    role: "Men's Grooming Expert",
    bio: "Marcus is the Upper East Side's top choice for men's cuts and grooming. Precise, efficient, and always on trend.",
    specialties: ["Men's Cuts", "Fades", "Styling"],
    image: "/instagram/mchairsalonspa_1526678565_1782231439342285913_509340228.jpg",
  },
  {
    id: "isabella",
    name: "Isabella",
    role: "Resident Makeup Artist",
    bio: "Isabella is MC's in-house beauty expert, bringing editorial precision to every look. From subtle everyday glam to showstopping bridal artistry, she tailors every look to your unique features and personal style.",
    specialties: ["Bridal Makeup", "Airbrush", "Special Events", "Makeup Lessons"],
    image: "/instagram/mchairsalonspa_1595346452_2358259426203129087_509340228.jpg",
    portfolio: [
      { type: "image", src: "/instagram/mchairsalonspa_1595346452_2358259426203129087_509340228.jpg", caption: "Bridal Glam" },
    ],
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
