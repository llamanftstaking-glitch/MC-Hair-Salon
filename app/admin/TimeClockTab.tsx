"use client";
import { useState, useEffect, useCallback } from "react";
import { Clock, Plus, Edit2, Trash2, X, Save, Loader, LogIn, LogOut, ChevronLeft, ChevronRight } from "lucide-react";

interface TimeEntry {
  id: string; staffId: string; staffName: string;
  clockIn: string; clockOut?: string; date: string; notes?: string;
}

const STAFF = ["Maria", "Meagan", "Sally", "Kato", "Juany", "Dhariana", "Nazareth", "Nathaly"];

const inputCls = "w-full bg-[#0f0f0f] border border-[var(--mc-border)] text-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[#444]";
const labelCls = "block text-[var(--mc-accent)] text-[10px] uppercase tracking-widest font-semibold mb-1.5";

function hoursWorked(entry: TimeEntry): number | null {
  if (!entry.clockOut) return null;
  return (new Date(entry.clockOut).getTime() - new Date(entry.clockIn).getTime()) / 3_600_000;
}
function fmtHours(h: number) {
  const hrs = Math.floor(h); const mins = Math.round((h - hrs) * 60);
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}
function elapsed(clockIn: string) {
  const diff = (Date.now() - new Date(clockIn).getTime()) / 3_600_000;
  return fmtHours(diff);
}
function isoToInput(iso: string) {
  // Convert ISO to datetime-local input value
  const d = new Date(iso);
  return d.getFullYear() + "-" +
    String(d.getMonth()+1).padStart(2,"0") + "-" +
    String(d.getDate()).padStart(2,"0") + "T" +
    String(d.getHours()).padStart(2,"0") + ":" +
    String(d.getMinutes()).padStart(2,"0");
}

export default function TimeClockTab() {
  const [entries, setEntries]       = useState<TimeEntry[]>([]);
  const [loading, setLoading]       = useState(true);
  const [tick, setTick]             = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [weekOffset, setWeekOffset] = useState(0);

  // Manual entry / edit modal
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editEntry, setEditEntry] = useState<TimeEntry | null>(null);
  const [form, setForm] = useState({ staffId: "", staffName: "", clockIn: "", clockOut: "", date: "", notes: "" });
  const [saving, setSaving] = useState(false);

  // Live clock tick every 30s
  useEffect(() => { const t = setInterval(() => setTick(n => n+1), 30_000); return () => clearInterval(t); }, []);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch 5 weeks of data for the weekly view
      const from = new Date(); from.setDate(from.getDate() - 35);
      const res = await fetch(`/api/timeclock?from=${from.toISOString().split("T")[0]}`);
      setEntries(await res.json());
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  // ── Clock in/out ────────────────────────────────────────────────────────────
  const doClock = async (action: "clock_in" | "clock_out", staffName: string, entryId?: string) => {
    await fetch("/api/timeclock", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, staffId: staffName.toLowerCase(), staffName, entryId }),
    });
    fetchEntries();
  };

  // ── Save manual / edit ──────────────────────────────────────────────────────
  const saveEntry = async () => {
    setSaving(true);
    try {
      if (modal === "edit" && editEntry) {
        await fetch("/api/timeclock", {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editEntry.id,
            clockIn:  new Date(form.clockIn).toISOString(),
            clockOut: form.clockOut ? new Date(form.clockOut).toISOString() : undefined,
            notes:    form.notes || undefined,
          }),
        });
      } else {
        await fetch("/api/timeclock", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action:    "manual",
            staffId:   form.staffName.toLowerCase(),
            staffName: form.staffName,
            clockIn:   new Date(form.clockIn).toISOString(),
            clockOut:  form.clockOut ? new Date(form.clockOut).toISOString() : undefined,
            date:      form.date || form.clockIn.split("T")[0],
            notes:     form.notes || undefined,
          }),
        });
      }
      setModal(null);
      fetchEntries();
    } finally { setSaving(false); }
  };

  const deleteEntry = async (id: string) => {
    if (!confirm("Delete this time entry?")) return;
    await fetch("/api/timeclock", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchEntries();
  };

  const openEdit = (entry: TimeEntry) => {
    setEditEntry(entry);
    setForm({ staffId: entry.staffId, staffName: entry.staffName,
      clockIn: isoToInput(entry.clockIn), clockOut: entry.clockOut ? isoToInput(entry.clockOut) : "",
      date: entry.date, notes: entry.notes ?? "" });
    setModal("edit");
  };

  const openAdd = () => {
    const now = isoToInput(new Date().toISOString());
    setEditEntry(null);
    setForm({ staffId: "", staffName: STAFF[0], clockIn: now, clockOut: "", date: selectedDate, notes: "" });
    setModal("add");
  };

  // ── Derived ─────────────────────────────────────────────────────────────────
  const today = new Date().toISOString().split("T")[0];

  // Who's currently clocked in (open entry today)
  const currentlyIn: Record<string, TimeEntry> = {};
  entries.forEach(e => { if (!e.clockOut && e.date === today) currentlyIn[e.staffName] = e; });

  // Entries for selected date
  const dayEntries = entries.filter(e => e.date === selectedDate)
    .sort((a, b) => a.clockIn.localeCompare(b.clockIn));

  // Weekly grid
  const monday = new Date();
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7) + weekOffset * 7);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday); d.setDate(monday.getDate() + i);
    return d.toISOString().split("T")[0];
  });
  const weekLabel = `${new Date(weekDays[0]+"T12:00").toLocaleDateString("en-US",{month:"short",day:"numeric"})} – ${new Date(weekDays[6]+"T12:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}`;

  function staffWeekHours(name: string, date: string): number {
    return entries.filter(e => e.staffName === name && e.date === date && e.clockOut)
      .reduce((sum, e) => sum + (hoursWorked(e) ?? 0), 0);
  }
  function staffWeekTotal(name: string): number {
    return weekDays.reduce((sum, d) => sum + staffWeekHours(name, d), 0);
  }

  return (
    <div>
      {/* ── Live Status ───────────────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold">Live Status — {new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}</p>
          <button onClick={openAdd} className="flex items-center gap-1.5 border border-[var(--mc-border)] text-[#555] px-3 py-1.5 text-xs hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer">
            <Plus size={11} /> Manual Entry
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STAFF.map(name => {
            const entry = currentlyIn[name];
            const isIn  = !!entry;
            return (
              <div key={name} className={`border p-3 ${isIn ? "border-green-500/30 bg-green-500/[0.04]" : "border-[#1a1a1a] bg-[#080808]"}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-semibold">{name}</span>
                  <span className={`w-2 h-2 rounded-full ${isIn ? "bg-green-400" : "bg-[#333]"}`} />
                </div>
                {isIn ? (
                  <>
                    <p className="text-green-400 text-[10px] uppercase tracking-wider mb-1">In since {fmtTime(entry.clockIn)}</p>
                    <p className="text-[#555] text-[10px] mb-2">{elapsed(entry.clockIn)} elapsed</p>
                    <button onClick={() => doClock("clock_out", name, entry.id)}
                      className="w-full flex items-center justify-center gap-1 bg-[#0f0f0f] border border-[#2a2a2a] text-[#888] text-xs py-1.5 hover:border-red-500/40 hover:text-red-400 transition-all cursor-pointer">
                      <LogOut size={11} /> Clock Out
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-[#333] text-[10px] uppercase tracking-wider mb-3">Out</p>
                    <button onClick={() => doClock("clock_in", name)}
                      className="w-full flex items-center justify-center gap-1 bg-[#0f0f0f] border border-[#2a2a2a] text-[#555] text-xs py-1.5 hover:border-green-500/40 hover:text-green-400 transition-all cursor-pointer">
                      <LogIn size={11} /> Clock In
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Daily Log ─────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold">Daily Log</p>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
            className="bg-[#0f0f0f] border border-[var(--mc-border)] text-white text-xs px-2 py-1 focus:outline-none focus:border-[var(--mc-accent)]" style={{ colorScheme: "dark" }} />
          {selectedDate !== today && (
            <button onClick={() => setSelectedDate(today)} className="text-[#444] text-xs hover:text-[var(--mc-accent)] transition-colors cursor-pointer">Today</button>
          )}
        </div>
        {loading ? (
          <div className="text-center py-8 text-[#555] text-sm">Loading…</div>
        ) : dayEntries.length === 0 ? (
          <div className="text-center py-8 border border-[#1a1a1a] text-[#333] text-sm">No entries for this date</div>
        ) : (
          <div className="border border-[#1a1a1a] overflow-hidden">
            <div className="grid bg-[#080808] border-b border-[#1a1a1a] text-[10px] uppercase tracking-widest text-[#444]" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr auto" }}>
              {["Staff","Clock In","Clock Out","Hours",""].map((h,i) => <div key={i} className="px-3 py-2">{h}</div>)}
            </div>
            {dayEntries.map(e => {
              const h = hoursWorked(e);
              return (
                <div key={e.id} className="grid border-b border-[#111] hover:bg-[#0a0a0a] transition-colors" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr auto" }}>
                  <div className="px-3 py-2.5 text-sm text-white font-medium">{e.staffName}</div>
                  <div className="px-3 py-2.5 text-sm text-[#888]">{fmtTime(e.clockIn)}</div>
                  <div className="px-3 py-2.5 text-sm text-[#888]">{e.clockOut ? fmtTime(e.clockOut) : <span className="text-green-400">Active</span>}</div>
                  <div className="px-3 py-2.5 text-sm text-[var(--mc-accent)] font-semibold">{h !== null ? fmtHours(h) : "—"}</div>
                  <div className="px-3 py-2.5 flex items-center gap-1.5">
                    <button onClick={() => openEdit(e)} className="w-7 h-7 flex items-center justify-center border border-[#1a1a1a] text-[#444] hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer"><Edit2 size={11} /></button>
                    <button onClick={() => deleteEntry(e.id)} className="w-7 h-7 flex items-center justify-center border border-[#1a1a1a] text-[#444] hover:border-red-500/40 hover:text-red-400 transition-all cursor-pointer"><Trash2 size={11} /></button>
                  </div>
                </div>
              );
            })}
            {/* Day total */}
            <div className="grid bg-[#080808] border-t border-[#1a1a1a]" style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr auto" }}>
              <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-[#444] col-span-3">Total hours</div>
              <div className="px-3 py-2 text-sm text-[var(--mc-accent)] font-bold">
                {fmtHours(dayEntries.filter(e => e.clockOut).reduce((s, e) => s + (hoursWorked(e) ?? 0), 0))}
              </div>
              <div />
            </div>
          </div>
        )}
      </div>

      {/* ── Weekly Summary ────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold">Weekly Summary</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setWeekOffset(o => o-1)} className="border border-[#1a1a1a] text-[#444] px-2 py-1 text-xs hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer flex items-center gap-1"><ChevronLeft size={11}/> Prev</button>
            <span className="text-[#555] text-xs">{weekLabel}</span>
            <button onClick={() => setWeekOffset(o => o+1)} className="border border-[#1a1a1a] text-[#444] px-2 py-1 text-xs hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer flex items-center gap-1">Next <ChevronRight size={11}/></button>
            {weekOffset !== 0 && <button onClick={() => setWeekOffset(0)} className="text-[#333] text-xs hover:text-[var(--mc-accent)] cursor-pointer">This week</button>}
          </div>
        </div>
        <div className="overflow-x-auto border border-[#1a1a1a]">
          <div style={{ minWidth: "700px" }}>
            {/* Header */}
            <div className="grid bg-[#080808] border-b border-[#1a1a1a] text-[10px] uppercase tracking-widest text-[#444]" style={{ gridTemplateColumns: "120px repeat(7,1fr) 80px" }}>
              <div className="px-3 py-2">Staff</div>
              {weekDays.map(d => (
                <div key={d} className={`px-2 py-2 text-center ${d === today ? "text-[var(--mc-accent)]" : ""}`}>
                  {new Date(d+"T12:00").toLocaleDateString("en-US",{weekday:"short"})}<br/>
                  <span className="text-[#333] normal-case">{new Date(d+"T12:00").getDate()}</span>
                </div>
              ))}
              <div className="px-2 py-2 text-center">Total</div>
            </div>
            {STAFF.map(name => {
              const total = staffWeekTotal(name);
              return (
                <div key={name} className="grid border-b border-[#111] hover:bg-[#0a0a0a] transition-colors" style={{ gridTemplateColumns: "120px repeat(7,1fr) 80px" }}>
                  <div className="px-3 py-2.5 text-sm text-white font-medium">{name}</div>
                  {weekDays.map(d => {
                    const h = staffWeekHours(name, d);
                    const active = entries.some(e => e.staffName === name && e.date === d && !e.clockOut);
                    return (
                      <div key={d} className={`px-2 py-2.5 text-xs text-center ${d === today ? "bg-[var(--mc-accent)]/[0.03]" : ""}`}>
                        {active ? <span className="text-green-400">Active</span>
                          : h > 0 ? <span className="text-[#888]">{fmtHours(h)}</span>
                          : <span className="text-[#222]">—</span>}
                      </div>
                    );
                  })}
                  <div className="px-2 py-2.5 text-xs text-center font-bold text-[var(--mc-accent)]">
                    {total > 0 ? fmtHours(total) : "—"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Add / Edit Modal ──────────────────────────────────────────────── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4" onClick={() => setModal(null)}>
          <div className="luxury-card w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-lg font-bold text-white">{modal === "edit" ? "Edit Entry" : "Add Manual Entry"}</h3>
              <button onClick={() => setModal(null)} className="w-7 h-7 flex items-center justify-center border border-[var(--mc-border)] text-[#555] hover:text-white cursor-pointer"><X size={14}/></button>
            </div>
            <div className="space-y-3">
              {modal === "add" && (
                <div>
                  <label className={labelCls}>Staff Member</label>
                  <select value={form.staffName} onChange={e => setForm(f => ({...f, staffName: e.target.value}))} className={inputCls}>
                    {STAFF.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}
              {modal === "edit" && <p className="text-[#555] text-sm">{editEntry?.staffName}</p>}
              <div>
                <label className={labelCls}>Clock In</label>
                <input type="datetime-local" value={form.clockIn} onChange={e => setForm(f => ({...f, clockIn: e.target.value}))}
                  className={inputCls} style={{ colorScheme: "dark" }} />
              </div>
              <div>
                <label className={labelCls}>Clock Out <span className="text-[#333] normal-case tracking-normal font-normal">(leave blank if still in)</span></label>
                <input type="datetime-local" value={form.clockOut} onChange={e => setForm(f => ({...f, clockOut: e.target.value}))}
                  className={inputCls} style={{ colorScheme: "dark" }} />
              </div>
              <div>
                <label className={labelCls}>Notes</label>
                <input type="text" value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))}
                  className={inputCls} placeholder="Optional" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={saveEntry} disabled={saving || !form.clockIn}
                className="flex-1 gold-gradient-bg text-black font-bold py-2.5 text-xs uppercase tracking-widest hover:opacity-90 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
                {saving ? <Loader size={13} className="animate-spin"/> : <Save size={13}/>} Save
              </button>
              <button onClick={() => setModal(null)} className="px-4 border border-[var(--mc-border)] text-[#555] hover:text-white text-xs cursor-pointer">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
