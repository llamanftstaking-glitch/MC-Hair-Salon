import path from "path";
import fs from "fs";

const DATA_FILE = path.join(process.cwd(), "data", "analytics.json");

interface DayBucket {
  date: string;
  views: number;
  uniqueIps: string[];
}

interface AnalyticsStore {
  days: DayBucket[];
}

// In-memory active sessions: sessionId -> lastSeen ms
const activeSessions = new Map<string, number>();

setInterval(() => {
  const cutoff = Date.now() - 2 * 60 * 1000;
  for (const [id, ts] of activeSessions) {
    if (ts < cutoff) activeSessions.delete(id);
  }
}, 60_000);

function loadStore(): AnalyticsStore {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
    }
  } catch {}
  return { days: [] };
}

function saveStore(store: AnalyticsStore) {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
  } catch {}
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function hashIp(ip: string): string {
  let h = 5381;
  for (let i = 0; i < ip.length; i++) h = ((h << 5) + h) ^ ip.charCodeAt(i);
  return (h >>> 0).toString(36);
}

export function recordView(ipHash: string, sessionId: string) {
  const store = loadStore();
  const date = todayStr();
  let bucket = store.days.find(d => d.date === date);
  if (!bucket) {
    bucket = { date, views: 0, uniqueIps: [] };
    store.days.push(bucket);
  }
  bucket.views++;
  if (!bucket.uniqueIps.includes(ipHash)) bucket.uniqueIps.push(ipHash);
  store.days = store.days.sort((a, b) => a.date.localeCompare(b.date)).slice(-90);
  saveStore(store);
  activeSessions.set(sessionId, Date.now());
}

export function heartbeat(sessionId: string) {
  activeSessions.set(sessionId, Date.now());
}

export function getActiveNow(): number {
  const cutoff = Date.now() - 2 * 60 * 1000;
  let n = 0;
  for (const ts of activeSessions.values()) if (ts >= cutoff) n++;
  return n;
}

export function getAnalytics() {
  const store = loadStore();
  const now = new Date();
  const today = todayStr();
  const weekAgo  = new Date(now.getTime() -  7 * 86400_000).toISOString().slice(0, 10);
  const monthAgo = new Date(now.getTime() - 30 * 86400_000).toISOString().slice(0, 10);

  const todayBucket  = store.days.find(d => d.date === today);
  const weekBuckets  = store.days.filter(d => d.date >= weekAgo);
  const monthBuckets = store.days.filter(d => d.date >= monthAgo);

  return {
    activeNow: getActiveNow(),
    today: {
      views:    todayBucket?.views              ?? 0,
      visitors: todayBucket?.uniqueIps.length   ?? 0,
    },
    week: {
      views:    weekBuckets.reduce((s, d) => s + d.views, 0),
      visitors: new Set(weekBuckets.flatMap(d => d.uniqueIps)).size,
    },
    month: {
      views:    monthBuckets.reduce((s, d) => s + d.views, 0),
      visitors: new Set(monthBuckets.flatMap(d => d.uniqueIps)).size,
    },
    chart: store.days
      .filter(d => d.date >= monthAgo)
      .map(d => ({ date: d.date, views: d.views, visitors: d.uniqueIps.length })),
  };
}
