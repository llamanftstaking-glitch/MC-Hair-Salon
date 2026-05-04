"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Calendar, CalendarDays, TrendingUp, Clock,
  DollarSign, Check, User, ChevronLeft, ChevronRight, LogOut,
} from "lucide-react";
import type { Booking } from "@/lib/bookings";

type ViewMode = "day" | "week" | "month";

interface PortalData {
  staffName: string;
  role:      string;
  bookings:  Booking[];
  stats: {
    totalRevenue:   number;
    confirmedCount: number;
    pendingCount:   number;
    totalCount:     number;
  };
}

function toDateStr(d: Date) {
  return d.toISOString().split("T")[0];
}

function addDays(d: Date, n: number) {
  const r = new Date(d); r.setDate(r.getDate() + n); return r;
}

function startOfWeek(d: Date) {
  const r = new Date(d);
  const day = r.getDay(); // 0=Sun
  r.setDate(r.getDate() - (day === 0 ? 6 : day - 1)); // go to Monday
  return r;
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

const statusColors: Record<string, string> = {
  pending:   "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  confirmed: "text-green-400 border-green-400/30 bg-green-400/10",
  cancelled: "text-red-400 border-red-400/30 bg-red-400/10",
  no_show:   "text-orange-400 border-orange-400/30 bg-orange-400/10",
};

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function StaffPortal() {
  const [view,      setView]      = useState<ViewMode>("week");
  const [anchor,    setAnchor]    = useState(new Date());
  const [data,      setData]      = useState<PortalData | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");
  const [authCheck, setAuthCheck] = useState(false);

  // Check auth
  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (!d || !d.email?.endsWith("@mchairsalon.com")) {
          window.location.href = "/login?redirect=/staff";
        } else {
          setAuthCheck(true);
        }
      })
      .catch(() => { window.location.href = "/login?redirect=/staff"; });
  }, []);

  const getDateRange = useCallback((): [string, string] => {
    if (view === "day") {
      const s = toDateStr(anchor);
      return [s, s];
    }
    if (view === "week") {
      const s = startOfWeek(anchor);
      return [toDateStr(s), toDateStr(addDays(s, 6))];
    }
    // month
    return [toDateStr(startOfMonth(anchor)), toDateStr(endOfMonth(anchor))];
  }, [view, anchor]);

  const load = useCallback(async () => {
    setLoading(true);
    const [start, end] = getDateRange();
    try {
      const res = await fetch(`/api/staff/portal?start=${start}&end=${end}`);
      if (!res.ok) { setError("Failed to load data"); setLoading(false); return; }
      setData(await res.json());
      setError("");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }, [getDateRange]);

  useEffect(() => {
    if (authCheck) load();
  }, [authCheck, load]);

  function navigate(dir: 1 | -1) {
    setAnchor(prev => {
      if (view === "day")   return addDays(prev, dir);
      if (view === "week")  return addDays(prev, dir * 7);
      const d = new Date(prev);
      d.setMonth(d.getMonth() + dir);
      return d;
    });
  }

  function getRangeLabel() {
    if (view === "day") {
      return anchor.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    }
    if (view === "week") {
      const s = startOfWeek(anchor);
      const e = addDays(s, 6);
      return `${s.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – ${e.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
    }
    return anchor.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  if (!authCheck || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#222] border-t-[#C9A84C] rounded-full animate-spin" />
      </div>
    );
  }

  const bookings = data?.bookings ?? [];
  const stats    = data?.stats;

  // Build day buckets for week/day view
  const [startStr] = getDateRange();
  const weekStart  = view === "week" ? startOfWeek(anchor) : anchor;
  const daysInView = view === "day" ? 1 : view === "week" ? 7 : endOfMonth(anchor).getDate();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center">
              <User size={18} className="text-[#C9A84C]" />
            </div>
            <div>
              <p className="font-serif font-bold text-white text-lg leading-none">{data?.staffName}</p>
              <p className="text-[#555] text-xs mt-0.5">{data?.role} · MC Hair Salon & Spa</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-[#555] hover:text-white transition-colors text-xs uppercase tracking-widest">
              Site
            </Link>
            <button onClick={handleLogout} className="text-[#555] hover:text-red-400 transition-colors cursor-pointer">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Appointments",   value: stats.totalCount,      icon: <Calendar size={14} /> },
              { label: "Confirmed",      value: stats.confirmedCount,  icon: <Check size={14} /> },
              { label: "Pending",        value: stats.pendingCount,    icon: <Clock size={14} /> },
              { label: "Est. Revenue",   value: `$${stats.totalRevenue.toFixed(0)}`, icon: <DollarSign size={14} /> },
            ].map(s => (
              <div key={s.label} className="border border-[#1a1a1a] bg-[#080808] px-4 py-4">
                <div className="flex items-center gap-1.5 text-[#555] mb-2">
                  {s.icon}
                  <span className="text-[10px] uppercase tracking-widest">{s.label}</span>
                </div>
                <p className="font-serif text-2xl font-bold text-white">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* View controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* View toggle */}
          <div className="flex gap-1">
            {(["day", "week", "month"] as ViewMode[]).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer ${
                  view === v
                    ? "bg-[#C9A84C] text-black"
                    : "border border-[#2a2a2a] text-[#555] hover:border-[#C9A84C] hover:text-[#C9A84C]"
                }`}>
                {v}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)}
              className="w-8 h-8 border border-[#2a2a2a] flex items-center justify-center hover:border-[#C9A84C] transition-colors cursor-pointer">
              <ChevronLeft size={15} className="text-[#555]" />
            </button>
            <span className="text-sm text-white font-medium min-w-[180px] text-center">{getRangeLabel()}</span>
            <button onClick={() => navigate(1)}
              className="w-8 h-8 border border-[#2a2a2a] flex items-center justify-center hover:border-[#C9A84C] transition-colors cursor-pointer">
              <ChevronRight size={15} className="text-[#555]" />
            </button>
            <button onClick={() => setAnchor(new Date())}
              className="px-3 py-1.5 text-[10px] uppercase tracking-widest border border-[#2a2a2a] text-[#555] hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors cursor-pointer">
              Today
            </button>
          </div>
        </div>

        {error && (
          <div className="border border-red-900/50 bg-red-950/20 px-4 py-3 text-red-400 text-sm">{error}</div>
        )}

        {/* Schedule */}
        {view === "month" ? (
          /* Month grid */
          <div>
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {DAY_NAMES.map(d => (
                <div key={d} className="text-center text-[10px] uppercase tracking-widest text-[#444] py-2">{d}</div>
              ))}
            </div>
            {/* Calendar cells */}
            {(() => {
              const first   = startOfMonth(anchor);
              const last    = endOfMonth(anchor);
              const offset  = (first.getDay() + 6) % 7; // Monday-first offset
              const cells: (Date | null)[] = [];
              for (let i = 0; i < offset; i++) cells.push(null);
              for (let d = 1; d <= last.getDate(); d++) cells.push(new Date(anchor.getFullYear(), anchor.getMonth(), d));
              const rows = Math.ceil(cells.length / 7);
              while (cells.length < rows * 7) cells.push(null);
              return (
                <div className="grid grid-cols-7 gap-px bg-[#1a1a1a]">
                  {cells.map((cell, i) => {
                    if (!cell) return <div key={i} className="bg-black h-20" />;
                    const ds = toDateStr(cell);
                    const dayBookings = bookings.filter(b => b.date === ds);
                    const isToday = ds === toDateStr(new Date());
                    return (
                      <div key={i} className={`bg-[#0a0a0a] h-20 p-1.5 overflow-hidden ${isToday ? "outline outline-1 outline-[#C9A84C]/50" : ""}`}>
                        <p className={`text-[11px] font-semibold mb-1 ${isToday ? "text-[#C9A84C]" : "text-[#555]"}`}>
                          {cell.getDate()}
                        </p>
                        <div className="space-y-0.5">
                          {dayBookings.slice(0, 2).map(b => (
                            <div key={b.id} className="text-[9px] bg-[#1a1a1a] text-[#aaa] px-1 py-0.5 truncate">
                              {b.time} {b.name.split(" ")[0]}
                            </div>
                          ))}
                          {dayBookings.length > 2 && (
                            <div className="text-[9px] text-[#555]">+{dayBookings.length - 2} more</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        ) : (
          /* Day / Week list */
          <div className="space-y-4">
            {Array.from({ length: daysInView }, (_, i) => {
              const day   = addDays(view === "day" ? anchor : weekStart, i);
              const ds    = toDateStr(day);
              const dayBk = bookings.filter(b => b.date === ds).sort((a, b) => a.time.localeCompare(b.time));
              const isToday = ds === toDateStr(new Date());
              return (
                <div key={ds}>
                  <div className={`flex items-center gap-3 mb-2 py-1 border-b ${isToday ? "border-[#C9A84C]/30" : "border-[#1a1a1a]"}`}>
                    <span className={`text-xs font-bold uppercase tracking-widest ${isToday ? "text-[#C9A84C]" : "text-[#444]"}`}>
                      {day.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                      {isToday && " — Today"}
                    </span>
                    {dayBk.length > 0 && (
                      <span className="text-[10px] text-[#555]">{dayBk.length} appointment{dayBk.length !== 1 ? "s" : ""}</span>
                    )}
                  </div>
                  {dayBk.length === 0 ? (
                    <p className="text-[#333] text-sm pl-1">No appointments</p>
                  ) : (
                    <div className="space-y-2">
                      {dayBk.map(b => (
                        <div key={b.id} className="border border-[#1a1a1a] bg-[#080808] px-4 py-3 flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-[#C9A84C] text-xs font-bold">{b.time}</p>
                              <span className={`text-[10px] px-2 py-0.5 border ${statusColors[b.status] ?? "text-[#555]"}`}>
                                {b.status}
                              </span>
                            </div>
                            <p className="text-white font-semibold text-sm">{b.name}</p>
                            <p className="text-[#555] text-xs mt-0.5 truncate">
                              {b.services && b.services.length > 1
                                ? b.services.map(s => s.name).join(", ")
                                : b.service}
                            </p>
                          </div>
                          {b.servicePrice != null && (
                            <p className="text-[#C9A84C] text-sm font-bold shrink-0">${b.servicePrice}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Personal performance section */}
        <div className="border border-[#1a1a1a] bg-[#080808] p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={16} className="text-[#C9A84C]" />
            <h3 className="font-serif text-white font-bold">My Performance</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-[#444] text-xs uppercase tracking-widest mb-1">This Period</p>
              <p className="text-white font-bold text-2xl">{stats?.confirmedCount ?? 0}</p>
              <p className="text-[#555] text-xs">confirmed appointments</p>
            </div>
            <div>
              <p className="text-[#444] text-xs uppercase tracking-widest mb-1">Revenue</p>
              <p className="text-[#C9A84C] font-bold text-2xl">${(stats?.totalRevenue ?? 0).toFixed(0)}</p>
              <p className="text-[#555] text-xs">estimated service revenue</p>
            </div>
            <div>
              <p className="text-[#444] text-xs uppercase tracking-widest mb-1">Avg per Visit</p>
              <p className="text-white font-bold text-2xl">
                {stats && stats.confirmedCount > 0
                  ? `$${(stats.totalRevenue / stats.confirmedCount).toFixed(0)}`
                  : "—"}
              </p>
              <p className="text-[#555] text-xs">per confirmed appointment</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
