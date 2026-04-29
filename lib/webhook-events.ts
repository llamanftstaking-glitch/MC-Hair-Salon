import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "processed-webhook-events.json");
const TTL  = 48 * 60 * 60 * 1000; // 48 hours

function load(): Record<string, number> {
  try {
    if (fs.existsSync(FILE)) return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {}
  return {};
}

function save(store: Record<string, number>) {
  try {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(store));
  } catch {}
}

export function hasProcessedEvent(eventId: string): boolean {
  const store = load();
  const ts = store[eventId];
  return ts !== undefined && Date.now() - ts < TTL;
}

export function markEventProcessed(eventId: string): void {
  const store = load();
  store[eventId] = Date.now();
  const now = Date.now();
  for (const [id, ts] of Object.entries(store)) {
    if (now - ts >= TTL) delete store[id];
  }
  save(store);
}
