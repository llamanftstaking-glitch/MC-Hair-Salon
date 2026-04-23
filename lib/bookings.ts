import fs from "fs";
import path from "path";

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  stylist: string;
  date: string;
  time: string;
  notes?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

const DATA_FILE = path.join(process.cwd(), "data", "bookings.json");

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");
}

export function getBookings(): Booking[] {
  ensureDataDir();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw);
}

export function addBooking(booking: Omit<Booking, "id" | "status" | "createdAt">): Booking {
  const bookings = getBookings();
  const newBooking: Booking = {
    ...booking,
    id: `MC-${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  bookings.push(newBooking);
  fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2));
  return newBooking;
}

export function updateBookingStatus(id: string, status: Booking["status"]): boolean {
  const bookings = getBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) return false;
  bookings[idx].status = status;
  fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2));
  return true;
}

export function deleteBooking(id: string): boolean {
  const bookings = getBookings();
  const filtered = bookings.filter((b) => b.id !== id);
  if (filtered.length === bookings.length) return false;
  fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2));
  return true;
}
