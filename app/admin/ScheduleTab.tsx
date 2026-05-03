"use client";
import { useState, useEffect, useCallback } from "react";
import { Save, Loader, Copy, Check, Plus, Trash2, X, CalendarOff } from "lucide-react";

const STAFF = ["Maria", "Meagan", "Sally", "Kato", "Juany", "Dhariana", "Nazareth", "Nathaly"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const labelCls  = "block text-[var(--mc-accent)] text-[10px] uppercase tracking-widest font-semibold mb-1";
const inputCls  = "w-full bg-[#0f0f0f] border border-[var(--mc-border)] text-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[#444]";

interface StaffBlock {
  id: string; staffName: string; startDate: string; endDate: string; reason?: string;
}
const timeCls =
  "bg-[#0f0f0f] border border-[var(--mc-border)] text-white text-xs px-2 py-1.5 w-full focus:outline-none focus:border-[var(--mc-accent)] transition-colors";

interface DaySchedule {
  dayOfWeek: number;
  isWorking: boolean;
  startTime: string;
  endTime: string;
}

type StaffScheduleMap = Record<string, DaySchedule[]>;

function defaultWeek(): DaySchedule[] {
  return DAYS.map((_, i) => ({
    dayOfWeek: i,
    isWorking: i < 5, // Mon–Fri on by default
    startTime: "09:00",
    endTime: "18:00",
  }));
}

function mergeServerData(
  base: StaffScheduleMap,
  serverRows: { staffName: string; dayOfWeek: number; isWorking: boolean; startTime: string; endTime: string }[]
): StaffScheduleMap {
  const merged = { ...base };
  for (const row of serverRows) {
    if (!merged[row.staffName]) continue;
    merged[row.staffName] = merged[row.staffName].map((d) =>
      d.dayOfWeek === row.dayOfWeek
        ? { ...d, isWorking: row.isWorking, startTime: row.startTime, endTime: row.endTime }
        : d
    );
  }
  return merged;
}

export default function ScheduleTab() {
  const [schedules, setSchedules] = useState<StaffScheduleMap>(() =>
    Object.fromEntries(STAFF.map((name) => [name, defaultWeek()]))
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  // Block-off state
  const [blocks, setBlocks] = useState<StaffBlock[]>([]);
  const [blockModal, setBlockModal] = useState(false);
  const [blockForm, setBlockForm] = useState({ staffName: STAFF[0], startDate: "", endDate: "", reason: "" });
  const [blockSaving, setBlockSaving] = useState(false);

  const fetchBlocks = useCallback(async () => {
    const res = await fetch("/api/schedule/blocks");
    if (res.ok) setBlocks(await res.json());
  }, []);

  const addBlock = async () => {
    if (!blockForm.startDate || !blockForm.endDate) return;
    setBlockSaving(true);
    try {
      await fetch("/api/schedule/blocks", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blockForm),
      });
      setBlockModal(false);
      setBlockForm({ staffName: STAFF[0], startDate: "", endDate: "", reason: "" });
      fetchBlocks();
    } finally { setBlockSaving(false); }
  };

  const deleteBlock = async (id: string) => {
    await fetch("/api/schedule/blocks", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setBlocks(b => b.filter(x => x.id !== id));
  };

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/schedule");
      if (res.ok) {
        const rows = await res.json();
        setSchedules((prev) => mergeServerData(prev, rows));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
    fetchBlocks();
  }, [fetchSchedules, fetchBlocks]);

  const updateDay = (staffName: string, dayOfWeek: number, patch: Partial<DaySchedule>) => {
    setSchedules((prev) => ({
      ...prev,
      [staffName]: prev[staffName].map((d) =>
        d.dayOfWeek === dayOfWeek ? { ...d, ...patch } : d
      ),
    }));
  };

  const copyToAll = (staffName: string) => {
    // Find first working day's times (or fall back to Mon)
    const src =
      schedules[staffName].find((d) => d.isWorking) ?? schedules[staffName][0];
    setSchedules((prev) => ({
      ...prev,
      [staffName]: prev[staffName].map((d) =>
        d.isWorking
          ? { ...d, startTime: src.startTime, endTime: src.endTime }
          : d
      ),
    }));
  };

  const saveStaff = async (staffName: string) => {
    setSaving((s) => ({ ...s, [staffName]: true }));
    try {
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffName, days: schedules[staffName] }),
      });
      if (res.ok) {
        setSaved((s) => ({ ...s, [staffName]: true }));
        setTimeout(() => setSaved((s) => ({ ...s, [staffName]: false })), 2000);
      }
    } finally {
      setSaving((s) => ({ ...s, [staffName]: false }));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold">
          Weekly Schedule
        </p>
        <p className="text-[#444] text-xs">Set working days and hours per stylist</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#555] text-sm">Loading…</div>
      ) : (
        <div className="space-y-4">
          {STAFF.map((staffName) => {
            const days = schedules[staffName];
            const isSaving = !!saving[staffName];
            const wasSaved = !!saved[staffName];

            return (
              <div key={staffName} className="luxury-card p-4">
                {/* Staff header */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <span className="text-white font-semibold text-sm tracking-wide">{staffName}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToAll(staffName)}
                      className="flex items-center gap-1.5 border border-[var(--mc-border)] text-[#555] px-3 py-1.5 text-[10px] uppercase tracking-widest hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer"
                    >
                      <Copy size={10} /> Copy Times to All On
                    </button>
                    <button
                      onClick={() => saveStaff(staffName)}
                      disabled={isSaving}
                      className="flex items-center gap-1.5 gold-gradient-bg text-black font-bold px-4 py-1.5 text-[10px] uppercase tracking-widest hover:opacity-90 disabled:opacity-50 cursor-pointer"
                    >
                      {isSaving ? (
                        <Loader size={11} className="animate-spin" />
                      ) : wasSaved ? (
                        <Check size={11} />
                      ) : (
                        <Save size={11} />
                      )}
                      {wasSaved ? "Saved!" : "Save"}
                    </button>
                  </div>
                </div>

                {/* Day grid */}
                <div className="overflow-x-auto">
                  <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(7, minmax(120px, 1fr))", minWidth: "860px" }}>
                    {/* Column headers */}
                    {DAYS.map((day) => (
                      <div
                        key={day}
                        className="text-[10px] uppercase tracking-widest text-[#444] text-center pb-1 border-b border-[#1a1a1a]"
                      >
                        {day}
                      </div>
                    ))}

                    {/* Day cells */}
                    {days.map((day) => (
                      <div
                        key={day.dayOfWeek}
                        className={`border p-2.5 transition-colors ${
                          day.isWorking
                            ? "border-[var(--mc-accent)]/30 bg-[var(--mc-accent)]/[0.03]"
                            : "border-[#1a1a1a] bg-[#080808]"
                        }`}
                      >
                        {/* Toggle */}
                        <button
                          onClick={() =>
                            updateDay(staffName, day.dayOfWeek, { isWorking: !day.isWorking })
                          }
                          className={`w-full text-center text-[10px] uppercase tracking-widest py-1 mb-2 border transition-all cursor-pointer font-semibold ${
                            day.isWorking
                              ? "border-[var(--mc-accent)]/50 text-[var(--mc-accent)] bg-[var(--mc-accent)]/10 hover:bg-[var(--mc-accent)]/20"
                              : "border-[#2a2a2a] text-[#333] hover:border-[#444] hover:text-[#555]"
                          }`}
                        >
                          {day.isWorking ? "Working" : "Off"}
                        </button>

                        {/* Time inputs — only shown when working */}
                        {day.isWorking && (
                          <div className="space-y-1.5">
                            <div>
                              <label className={labelCls}>Start</label>
                              <input
                                type="time"
                                value={day.startTime}
                                onChange={(e) =>
                                  updateDay(staffName, day.dayOfWeek, { startTime: e.target.value })
                                }
                                className={timeCls}
                                style={{ colorScheme: "dark" }}
                              />
                            </div>
                            <div>
                              <label className={labelCls}>End</label>
                              <input
                                type="time"
                                value={day.endTime}
                                onChange={(e) =>
                                  updateDay(staffName, day.dayOfWeek, { endTime: e.target.value })
                                }
                                className={timeCls}
                                style={{ colorScheme: "dark" }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* ── Blocked Dates ─────────────────────────────────────────────── */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold flex items-center gap-2">
            <CalendarOff size={13} /> Blocked Dates
          </p>
          <button onClick={() => setBlockModal(true)}
            className="flex items-center gap-1.5 gold-gradient-bg text-black font-bold px-3 py-1.5 text-[10px] uppercase tracking-widest hover:opacity-90 cursor-pointer">
            <Plus size={11} /> Block Time Off
          </button>
        </div>

        {blocks.length === 0 ? (
          <div className="border border-[#1a1a1a] py-8 text-center text-[#333] text-sm">No blocked dates</div>
        ) : (
          <div className="border border-[#1a1a1a] overflow-hidden">
            <div className="grid bg-[#080808] border-b border-[#1a1a1a] text-[10px] uppercase tracking-widest text-[#444]"
              style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr auto" }}>
              {["Stylist", "From", "To", "Reason", ""].map((h, i) => (
                <div key={i} className="px-3 py-2">{h}</div>
              ))}
            </div>
            {blocks.map(b => (
              <div key={b.id} className="grid border-b border-[#111] hover:bg-[#0a0a0a] transition-colors"
                style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr auto" }}>
                <div className="px-3 py-2.5 text-sm text-white font-medium">{b.staffName}</div>
                <div className="px-3 py-2.5 text-sm text-[#888]">{b.startDate}</div>
                <div className="px-3 py-2.5 text-sm text-[#888]">{b.endDate}</div>
                <div className="px-3 py-2.5 text-sm text-[#555]">{b.reason || "—"}</div>
                <div className="px-3 py-2.5 flex items-center">
                  <button onClick={() => deleteBlock(b.id)}
                    className="w-7 h-7 flex items-center justify-center border border-[#1a1a1a] text-[#444] hover:border-red-500/40 hover:text-red-400 transition-all cursor-pointer">
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Block Modal */}
      {blockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4" onClick={() => setBlockModal(false)}>
          <div className="luxury-card w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-serif text-lg font-bold text-white">Block Time Off</h3>
              <button onClick={() => setBlockModal(false)} className="w-7 h-7 flex items-center justify-center border border-[var(--mc-border)] text-[#555] hover:text-white cursor-pointer"><X size={14} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className={labelCls}>Stylist</label>
                <select value={blockForm.staffName} onChange={e => setBlockForm(f => ({ ...f, staffName: e.target.value }))} className={inputCls}>
                  {STAFF.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>From</label>
                  <input type="date" value={blockForm.startDate} onChange={e => setBlockForm(f => ({ ...f, startDate: e.target.value }))}
                    className={inputCls} style={{ colorScheme: "dark" }} />
                </div>
                <div>
                  <label className={labelCls}>To</label>
                  <input type="date" value={blockForm.endDate} onChange={e => setBlockForm(f => ({ ...f, endDate: e.target.value }))}
                    className={inputCls} style={{ colorScheme: "dark" }} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Reason <span className="text-[#333] normal-case font-normal tracking-normal">(optional)</span></label>
                <input type="text" value={blockForm.reason} onChange={e => setBlockForm(f => ({ ...f, reason: e.target.value }))}
                  className={inputCls} placeholder="Vacation, sick day, training…" />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={addBlock} disabled={blockSaving || !blockForm.startDate || !blockForm.endDate}
                className="flex-1 gold-gradient-bg text-black font-bold py-2.5 text-xs uppercase tracking-widest hover:opacity-90 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
                {blockSaving ? <Loader size={13} className="animate-spin" /> : <CalendarOff size={13} />} Block Dates
              </button>
              <button onClick={() => setBlockModal(false)} className="px-4 border border-[var(--mc-border)] text-[#555] hover:text-white text-xs cursor-pointer">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
