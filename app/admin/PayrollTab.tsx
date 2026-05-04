"use client";
import { useEffect, useState, useCallback } from "react";
import TimeClockTab from "./TimeClockTab";
import { DollarSign, Clock, Users, Edit2, Check, X, Loader, BarChart2, Calendar } from "lucide-react";

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

const inputCls = "w-full bg-[var(--mc-surface-dark)] border border-[var(--mc-border)] text-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[#444]";
const labelCls = "block text-[var(--mc-accent)] text-[10px] uppercase tracking-widest font-semibold mb-1.5";

function getDateRange(period: PeriodId, customFrom: string, customTo: string): { from: string; to: string } {
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  if (period === "custom") return { from: customFrom, to: customTo };
  if (period === "this_week") {
    const dow = today.getDay();
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

  const [editingId,    setEditingId]    = useState<string | null>(null);
  const [editHourly,   setEditHourly]   = useState("");
  const [editCommission, setEditCommission] = useState("");
  const [saving, setSaving] = useState(false);

  const [period,     setPeriod]     = useState<PeriodId>("this_week");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo,   setCustomTo]   = useState("");
  const [entries,    setEntries]    = useState<TimeEntry[]>([]);
  const [bookings,   setBookings]   = useState<Booking[]>([]);
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

  function calcPayroll(member: StaffMember) {
    const myEntries    = entries.filter(e => e.staffName === member.name);
    const totalHours   = myEntries.reduce((s, e) => s + hoursWorked(e), 0);
    const hourlyPay    = totalHours * (member.hourlyRate ?? 0);
    const myBookings   = bookings.filter(b => b.stylist?.toLowerCase() === member.name.toLowerCase());
    const serviceTotal = myBookings.reduce((s, b) => s + (b.servicePrice ?? 0), 0);
    const stylistPct   = 1 - (member.commissionRate ?? 0) / 100;
    const commissionPay = serviceTotal * stylistPct;
    return { totalHours, hourlyPay, serviceTotal, commissionPay, totalPay: hourlyPay + commissionPay, bookingCount: myBookings.length };
  }

  if (loading) return <div className="text-[#555] py-12 text-center text-sm">Loading…</div>;

  const subTabs: { id: SubTab; label: string; icon: React.ReactNode }[] = [
    { id: "staff",     label: "Staff Rates",     icon: <Users size={13} /> },
    { id: "timeclock", label: "Time Clock",       icon: <Clock size={13} /> },
    { id: "payroll",   label: "Payroll Report",   icon: <BarChart2 size={13} /> },
  ];

  return (
    <div className="space-y-5">
      {/* Sub-tab bar */}
      <div className="flex bg-[var(--mc-surface-dark)] p-0.5 gap-0.5 w-fit border border-[var(--mc-border)]">
        {subTabs.map(s => (
          <button key={s.id} onClick={() => setSub(s.id)}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer ${
              sub === s.id ? "gold-gradient-bg text-black" : "text-[#555] hover:text-white"
            }`}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* ── Staff Rates ───────────────────────────────────────────────────────── */}
      {sub === "staff" && (
        <div>
          <p className="text-[#444] text-xs mb-4">Set each stylist's hourly rate and the house commission percentage (e.g. 40 = house keeps 40%, stylist keeps 60%).</p>
          <div className="space-y-2">
            {staff.map(m => (
              <div key={m.id} className="luxury-card p-4 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{m.name}</p>
                  <p className="text-[#555] text-xs">{m.role}</p>
                </div>

                {editingId === m.id ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <div>
                      <label className={labelCls}>Hourly Rate ($)</label>
                      <input type="number" value={editHourly} onChange={e => setEditHourly(e.target.value)}
                        placeholder="0.00" min="0" step="0.01"
                        className="w-28 bg-[var(--mc-surface-dark)] border border-[var(--mc-border)] text-white px-3 py-1.5 text-sm focus:outline-none focus:border-[var(--mc-accent)]" />
                    </div>
                    <div>
                      <label className={labelCls}>House % (commission)</label>
                      <input type="number" value={editCommission} onChange={e => setEditCommission(e.target.value)}
                        placeholder="0–100" min="0" max="100"
                        className="w-28 bg-[var(--mc-surface-dark)] border border-[var(--mc-border)] text-white px-3 py-1.5 text-sm focus:outline-none focus:border-[var(--mc-accent)]" />
                    </div>
                    <div className="flex gap-2 self-end pb-0.5">
                      <button onClick={() => saveRates(m.id)} disabled={saving}
                        className="flex items-center gap-1.5 gold-gradient-bg text-black font-bold px-4 py-1.5 text-xs uppercase tracking-widest hover:opacity-90 disabled:opacity-50 cursor-pointer">
                        {saving ? <Loader size={12} className="animate-spin" /> : <Check size={12} />} Save
                      </button>
                      <button onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 border border-[var(--mc-border)] text-[#555] hover:text-white text-xs cursor-pointer">
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-5">
                    <div className="text-center">
                      <p className="text-[var(--mc-accent)] font-bold text-sm">{m.hourlyRate != null ? `$${m.hourlyRate.toFixed(2)}/hr` : "—"}</p>
                      <p className="text-[#444] text-[10px] uppercase tracking-wider mt-0.5">Hourly</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[var(--mc-accent)] font-bold text-sm">{m.commissionRate != null ? `${m.commissionRate}%` : "—"}</p>
                      <p className="text-[#444] text-[10px] uppercase tracking-wider mt-0.5">House %</p>
                    </div>
                    <div className="text-center">
                      <p className="text-green-400 font-bold text-sm">{m.commissionRate != null ? `${100 - m.commissionRate}%` : "—"}</p>
                      <p className="text-[#444] text-[10px] uppercase tracking-wider mt-0.5">Stylist %</p>
                    </div>
                    <button onClick={() => {
                      setEditingId(m.id);
                      setEditHourly(m.hourlyRate != null ? String(m.hourlyRate) : "");
                      setEditCommission(m.commissionRate != null ? String(m.commissionRate) : "");
                    }} className="w-9 h-9 flex items-center justify-center border border-[var(--mc-border)] text-[#555] hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer">
                      <Edit2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Time Clock ────────────────────────────────────────────────────────── */}
      {sub === "timeclock" && <TimeClockTab />}

      {/* ── Payroll Report ────────────────────────────────────────────────────── */}
      {sub === "payroll" && (
        <div className="space-y-5">
          {/* Period selector */}
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex bg-[var(--mc-surface-dark)] p-0.5 gap-0.5 border border-[var(--mc-border)]">
              {PERIOD_OPTIONS.map(p => (
                <button key={p.id} onClick={() => setPeriod(p.id)}
                  className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer ${
                    period === p.id ? "gold-gradient-bg text-black" : "text-[#555] hover:text-white"
                  }`}>
                  {p.label}
                </button>
              ))}
            </div>
            {period === "custom" && (
              <>
                <div>
                  <label className={labelCls}>From</label>
                  <input type="date" value={customFrom} onChange={e => setCustomFrom(e.target.value)}
                    className={inputCls} style={{ colorScheme: "dark", width: "140px" }} />
                </div>
                <div>
                  <label className={labelCls}>To</label>
                  <input type="date" value={customTo} onChange={e => setCustomTo(e.target.value)}
                    className={inputCls} style={{ colorScheme: "dark", width: "140px" }} />
                </div>
                <button onClick={loadReport}
                  className="gold-gradient-bg text-black font-bold px-4 py-2 text-xs uppercase tracking-widest hover:opacity-90 cursor-pointer self-end">
                  Run
                </button>
              </>
            )}
          </div>

          {(() => {
            const { from, to } = getDateRange(period, customFrom, customTo);
            return <p className="text-[#444] text-xs flex items-center gap-1.5"><Calendar size={11} /> Period: {from} → {to}</p>;
          })()}

          {reportLoading ? (
            <div className="text-center py-16 text-[#555] text-sm flex items-center justify-center gap-2">
              <Loader size={14} className="animate-spin" /> Calculating…
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {staff.map(m => {
                  const { totalHours, hourlyPay, serviceTotal, commissionPay, totalPay, bookingCount } = calcPayroll(m);
                  const hasActivity = totalHours > 0 || bookingCount > 0;
                  return (
                    <div key={m.id} className={`luxury-card p-5 ${!hasActivity ? "opacity-40" : ""}`}>
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <div>
                          <p className="text-white font-semibold">{m.name}</p>
                          <p className="text-[#444] text-xs">{m.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-serif text-2xl font-bold text-green-400">${totalPay.toFixed(2)}</p>
                          <p className="text-[#444] text-[10px] uppercase tracking-wider">Total Pay</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-[var(--mc-border)] pt-4">
                        <div className="text-center">
                          <p className="text-white font-semibold text-sm">{totalHours.toFixed(1)}h</p>
                          <p className="text-[#444] text-[10px] uppercase tracking-wider mt-0.5">Hours</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[var(--mc-accent)] font-semibold text-sm">${hourlyPay.toFixed(2)}</p>
                          <p className="text-[#444] text-[10px] mt-0.5">{m.hourlyRate != null ? `@ $${m.hourlyRate}/hr` : "No rate"}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-white font-semibold text-sm">{bookingCount} bookings</p>
                          <p className="text-[#444] text-[10px] mt-0.5">${serviceTotal.toFixed(2)} services</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[var(--mc-accent)] font-semibold text-sm">${commissionPay.toFixed(2)}</p>
                          <p className="text-[#444] text-[10px] mt-0.5">{m.commissionRate != null ? `${100 - m.commissionRate}% of services` : "No split"}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Grand total */}
              {staff.length > 0 && (() => {
                const grandTotal          = staff.reduce((s, m) => s + calcPayroll(m).totalPay, 0);
                const totalServiceRevenue = bookings.reduce((s, b) => s + (b.servicePrice ?? 0), 0);
                const totalHouseRevenue   = bookings.reduce((s, b) => {
                  const stylist = staff.find(m => m.name.toLowerCase() === b.stylist?.toLowerCase());
                  return s + (b.servicePrice ?? 0) * ((stylist?.commissionRate ?? 0) / 100);
                }, 0);
                return (
                  <div className="luxury-card p-6 border border-[var(--mc-accent)]/20">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                      <div>
                        <p className="font-serif text-3xl font-bold text-green-400">${grandTotal.toFixed(2)}</p>
                        <p className="text-[#555] text-xs uppercase tracking-widest mt-1">Total Payroll</p>
                      </div>
                      <div>
                        <p className="font-serif text-3xl font-bold gold-gradient">${totalServiceRevenue.toFixed(2)}</p>
                        <p className="text-[#555] text-xs uppercase tracking-widest mt-1">Service Revenue</p>
                      </div>
                      <div>
                        <p className="font-serif text-3xl font-bold text-[var(--mc-accent)]">${totalHouseRevenue.toFixed(2)}</p>
                        <p className="text-[#555] text-xs uppercase tracking-widest mt-1">House Commission</p>
                      </div>
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
