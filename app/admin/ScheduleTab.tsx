"use client";
import { useState, useEffect, useCallback } from "react";
import { Save, Loader, Copy, Check } from "lucide-react";

const STAFF = ["Maria", "Meagan", "Sally", "Kato", "Juany", "Dhariana", "Nazareth", "Nathaly"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const labelCls = "block text-[var(--mc-accent)] text-[10px] uppercase tracking-widest font-semibold mb-1";
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
  }, [fetchSchedules]);

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
        <div className="text-center py-12 text-[#555] text-sm">Loading schedules…</div>
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
    </div>
  );
}
