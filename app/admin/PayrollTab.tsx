"use client";
import { useEffect, useState, useCallback } from "react";
import TimeClockTab from "./TimeClockTab";

interface StaffMember {
  id: string; name: string; role: string;
  image?: string; hourlyRate?: number; commissionRate?: number;
}
interface TimeEntry {
  id: string; staffId: string; staffName: string;
  clockIn: string; clockOut?: string; date: string;
}
interface Booking {
  id: string; name: string; service: string; stylist: string;
  date: string; status: string; servicePrice?: number;
}

type SubTab = "staff" | "timeclock" | "payroll";

const PERIOD_OPTIONS = [
  { id: "this_week",  label: "This Week"  },
  { id: "last_week",  label: "Last Week"  },
  { id: "this_month", label: "This Month" },
  { id: "custom",     label: "Custom"     },
] as const;
type PeriodId = typeof PERIOD_OPTIONS[number]["id"];

function getDateRange(period: PeriodId, customFrom: string, customTo: string): { from: string; to: string } {
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  if (period === "custom") return { from: customFrom, to: customTo };
  if (period === "this_week") {
    const dow = today.getDay(); // 0=Sun
    const mon = new Date(today); mon.setDate(today.getDate() - ((dow + 6) % 7));
    const sun = new Date(mon);   sun.setDate(mon.getDate() + 6);
    return { from: fmt(mon), to: fmt(sun) };
  }
  if (period === "last_week") {
    const dow = today.getDay();
    const mon = new Date(today); mon.setDate(today.getDate() - ((dow + 6) % 7) - 7);
    const sun = new Date(mon);   sun.setDate(mon.getDate() + 6);
    return { from: fmt(mon), to: fmt(sun) };
  }
  // this_month
  const from = new Date(today.getFullYear(), today.getMonth(), 1);
  const to   = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return { from: fmt(from), to: fmt(to) };
}

function hoursWorked(entry: TimeEntry): number {
  if (!entry.clockOut) return 0;
  return (new Date(entry.clockOut).getTime() - new Date(entry.clockIn).getTime()) / 3_600_000;
}

export default function PayrollTab() {
  const [sub, setSub] = useState<SubTab>("staff");
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Staff edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editHourly, setEditHourly] = useState("");
  const [editCommission, setEditCommission] = useState("");
  const [saving, setSaving] = useState(false);

  // Payroll report state
  const [period, setPeriod] = useState<PeriodId>("this_week");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reportLoading, setReportLoading] = useState(false);

  const loadStaff = useCallback(async () => {
    const data = await fetch("/api/staff").then(r => r.json());
    setStaff(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { loadStaff(); }, [loadStaff]);

  async function saveRates(id: string) {
    setSaving(true);
    const updates: Record<string, number | null> = {
      hourlyRate:     editHourly     !== "" ? parseFloat(editHourly)     : null,
      commissionRate: editCommission !== "" ? parseFloat(editCommission) : null,
    };
    await fetch("/api/staff", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    setSaving(false);
    setEditingId(null);
    loadStaff();
  }

  async function loadReport() {
    setReportLoading(true);
    const { from, to } = getDateRange(period, customFrom, customTo);
    const [entryData, bookingData] = await Promise.all([
      fetch(`/api/timeclock?from=${from}&to=${to}`).then(r => r.json()),
      fetch("/api/bookings").then(r => r.json()),
    ]);
    setEntries(Array.isArray(entryData) ? entryData : []);
    const all: Booking[] = Array.isArray(bookingData) ? bookingData : [];
    setBookings(all.filter(b => b.status === "confirmed" && b.date >= from && b.date <= to));
    setReportLoading(false);
  }

  useEffect(() => {
    if (sub === "payroll") loadReport();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sub, period]);

  // ── Per-staff payroll calc ────────────────────────────────────────────────────
  function calcPayroll(member: StaffMember) {
    const myEntries = entries.filter(e => e.staffName === member.name);
    const totalHours = myEntries.reduce((s, e) => s + hoursWorked(e), 0);
    const hourlyPay  = totalHours * (member.hourlyRate ?? 0);

    const myBookings = bookings.filter(b =>
      b.stylist?.toLowerCase() === member.name.toLowerCase()
    );
    const serviceTotal = myBookings.reduce((s, b) => s + (b.servicePrice ?? 0), 0);
    const stylistPct   = 1 - (member.commissionRate ?? 0) / 100;
    const commissionPay = serviceTotal * stylistPct;

    return { totalHours, hourlyPay, serviceTotal, commissionPay,
             totalPay: hourlyPay + commissionPay, bookingCount: myBookings.length };
  }

  if (loading) return <div className="text-zinc-400 py-12 text-center">Loading…</div>;

  return (
    <div className="space-y-4">
      {/* Sub-tab bar */}
      <div className="flex bg-zinc-800 rounded-lg p-0.5 gap-0.5 w-fit">
        {(["staff", "timeclock", "payroll"] as SubTab[]).map(s => (
          <button key={s} onClick={() => setSub(s)}
            className={`px-4 py-1.5 rounded text-xs font-medium capitalize transition ${sub === s ? "bg-amber-500 text-black" : "text-zinc-400 hover:text-white"}`}>
            {s === "timeclock" ? "Time Clock" : s === "payroll" ? "Payroll Report" : "Staff Rates"}
          </button>
        ))}
      </div>

      {/* ── Staff Rates sub-tab ──────────────────────────────────────────────── */}
      {sub === "staff" && (
        <div className="space-y-2">
          <p className="text-xs text-zinc-500">Set each stylist's hourly rate and the house commission percentage (e.g. 40 = house keeps 40%, stylist keeps 60%).</p>
          {staff.map(m => (
            <div key={m.id} className="bg-zinc-800 rounded-lg p-4 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm">{m.name}</p>
                <p className="text-zinc-400 text-xs">{m.role}</p>
              </div>

              {editingId === m.id ? (
                <div className="flex flex-wrap items-center gap-2">
                  <div className="space-y-0.5">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">Hourly Rate ($)</label>
                    <input type="number" value={editHourly} onChange={e => setEditHourly(e.target.value)}
                      placeholder="0.00" min="0" step="0.01"
                      className="w-24 bg-zinc-700 border border-zinc-600 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-amber-500" />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-[10px] text-zinc-500 uppercase tracking-wider">House % (commission)</label>
                    <input type="number" value={editCommission} onChange={e => setEditCommission(e.target.value)}
                      placeholder="0–100" min="0" max="100"
                      className="w-24 bg-zinc-700 border border-zinc-600 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-amber-500" />
                  </div>
                  <div className="flex gap-1.5 self-end pb-0.5">
                    <button onClick={() => saveRates(m.id)} disabled={saving}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black rounded text-xs font-bold disabled:opacity-50">
                      {saving ? "…" : "Save"}
                    </button>
                    <button onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded text-xs">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-amber-400 font-bold text-sm">{m.hourlyRate != null ? `$${m.hourlyRate.toFixed(2)}/hr` : "—"}</p>
                    <p className="text-zinc-500 text-[10px]">Hourly</p>
                  </div>
                  <div className="text-center">
                    <p className="text-amber-400 font-bold text-sm">{m.commissionRate != null ? `${m.commissionRate}%` : "—"}</p>
                    <p className="text-zinc-500 text-[10px]">House %</p>
                  </div>
                  <div className="text-center">
                    <p className="text-green-400 font-bold text-sm">{m.commissionRate != null ? `${100 - m.commissionRate}%` : "—"}</p>
                    <p className="text-zinc-500 text-[10px]">Stylist %</p>
                  </div>
                  <button onClick={() => {
                    setEditingId(m.id);
                    setEditHourly(m.hourlyRate != null ? String(m.hourlyRate) : "");
                    setEditCommission(m.commissionRate != null ? String(m.commissionRate) : "");
                  }} className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded text-xs">
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Time Clock sub-tab ───────────────────────────────────────────────── */}
      {sub === "timeclock" && <TimeClockTab />}

      {/* ── Payroll Report sub-tab ──────────────────────────────────────────── */}
      {sub === "payroll" && (
        <div className="space-y-4">
          {/* Period selector */}
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex bg-zinc-800 rounded-lg p-0.5 gap-0.5">
              {PERIOD_OPTIONS.map(p => (
                <button key={p.id} onClick={() => setPeriod(p.id)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition ${period === p.id ? "bg-amber-500 text-black" : "text-zinc-400 hover:text-white"}`}>
                  {p.label}
                </button>
              ))}
            </div>
            {period === "custom" && (
              <>
                <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-500" />
                <span className="text-zinc-400 text-sm">to</span>
                <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-amber-500" />
                <button onClick={loadReport}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black rounded text-xs font-bold">
                  Run
                </button>
              </>
            )}
          </div>

          {(() => {
            const { from, to } = getDateRange(period, customFrom, customTo);
            return <p className="text-xs text-zinc-500">Period: {from} → {to}</p>;
          })()}

          {reportLoading ? (
            <div className="text-zinc-400 text-sm py-8 text-center">Calculating…</div>
          ) : (
            <>
              {/* Per-staff cards */}
              <div className="space-y-3">
                {staff.map(m => {
                  const { totalHours, hourlyPay, serviceTotal, commissionPay, totalPay, bookingCount } = calcPayroll(m);
                  const hasActivity = totalHours > 0 || bookingCount > 0;
                  return (
                    <div key={m.id} className={`bg-zinc-800 rounded-lg p-4 ${!hasActivity ? "opacity-50" : ""}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-white font-semibold">{m.name}</p>
                          <p className="text-zinc-400 text-xs">{m.role}</p>
                        </div>
                        <p className="text-green-400 font-bold text-xl">${totalPay.toFixed(2)}</p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-zinc-700/50 rounded p-2 text-center">
                          <p className="text-white font-semibold text-sm">{totalHours.toFixed(1)}h</p>
                          <p className="text-zinc-400 text-[10px] mt-0.5">Hours</p>
                        </div>
                        <div className="bg-zinc-700/50 rounded p-2 text-center">
                          <p className="text-amber-400 font-semibold text-sm">${hourlyPay.toFixed(2)}</p>
                          <p className="text-zinc-400 text-[10px] mt-0.5">
                            {m.hourlyRate != null ? `@ $${m.hourlyRate}/hr` : "No rate set"}
                          </p>
                        </div>
                        <div className="bg-zinc-700/50 rounded p-2 text-center">
                          <p className="text-white font-semibold text-sm">{bookingCount} bookings</p>
                          <p className="text-zinc-400 text-[10px] mt-0.5">${serviceTotal.toFixed(2)} services</p>
                        </div>
                        <div className="bg-zinc-700/50 rounded p-2 text-center">
                          <p className="text-amber-400 font-semibold text-sm">${commissionPay.toFixed(2)}</p>
                          <p className="text-zinc-400 text-[10px] mt-0.5">
                            {m.commissionRate != null ? `${100 - m.commissionRate}% of services` : "No split set"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Grand total */}
              {staff.length > 0 && (() => {
                const grandTotal = staff.reduce((s, m) => s + calcPayroll(m).totalPay, 0);
                const totalServiceRevenue = bookings.reduce((s, b) => s + (b.servicePrice ?? 0), 0);
                const totalHouseRevenue   = bookings.reduce((s, b) => {
                  const stylist = staff.find(m => m.name.toLowerCase() === b.stylist?.toLowerCase());
                  return s + (b.servicePrice ?? 0) * ((stylist?.commissionRate ?? 0) / 100);
                }, 0);
                return (
                  <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-green-400 font-bold text-2xl">${grandTotal.toFixed(2)}</p>
                      <p className="text-zinc-400 text-xs mt-1">Total Payroll</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-bold text-2xl">${totalServiceRevenue.toFixed(2)}</p>
                      <p className="text-zinc-400 text-xs mt-1">Total Service Revenue</p>
                    </div>
                    <div className="text-center">
                      <p className="text-amber-400 font-bold text-2xl">${totalHouseRevenue.toFixed(2)}</p>
                      <p className="text-zinc-400 text-xs mt-1">House Commission</p>
                    </div>
                  </div>
                );
              })()}
            </>
          )}
        </div>
      )}
    </div>
  );
}
