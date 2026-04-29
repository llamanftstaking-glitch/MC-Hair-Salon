import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "admin-totp.json");

interface TOTPRecord {
  secret: string;
  enabled: boolean;
  createdAt: string;
}

export function getTOTPRecord(): TOTPRecord | null {
  try {
    if (fs.existsSync(FILE)) return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {}
  return null;
}

export function saveTOTPRecord(record: TOTPRecord): void {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(record, null, 2));
}

export function isTOTPEnabled(): boolean {
  return getTOTPRecord()?.enabled === true;
}
