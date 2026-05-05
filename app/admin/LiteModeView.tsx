"use client";
import { useState } from "react";
import {
  Calendar, Users, Settings, Clock, Check, X, Trash2,
  Mail, Pencil, AlertTriangle, Plus, ChevronRight,
  LayoutGrid,
} from "lucide-react";
import type { Booking } from "@/lib/bookings";
import ScheduleTab from "./ScheduleTab";

type LiteTab = "today" | "clients" | "schedule" | "settings";

interface Props {
  bookings: Booking[];
  loading: boolean;
  pending: number;
  updateStatus: (id: string, status: Booking["status"]) => Promise<void>;
  resendEmail: (id: string) => Promise<void>;
  chargeNoShow: (id: string) => Promise<void>;
  startEdit: (b: Booking) => void;
  deleteBooking: (id: string) => Promise<void>;
  noshowLoading: Record<string, boolean>;
  noshowResult: Record<string, "charged" | "error">;
  emailStatus: Record<string, string>;
  openCreate: () => void;
  uniqueClients: Booking[];
  clientMap: Record<string, Booking[]>;
  onFullMode: () => void;
}

const statusBg: Record<string, string> = {
  pending:   "bg-yellow-400/8",
  confirmed: "bg-green-400/8",
  cancelled: "bg-red-400/8",
  no_show:   "bg-orange-400/8",
};

const statusLabel: Record<string, string> = {
  pending:   "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  no_show:   "No Show",
};

export default function LiteModeView({
  bookings, loading, pending,
  updateStatus, resendEmail, chargeNoShow,
  startEdit, deleteBooking,
  noshowLoading, noshowResult, emailStatus,
  openCreate, uniqueClients, clientMap, onFullMode,
}: Props) {
  const [tab, setTab] = useState<LiteTab>("today");
  const [clientSearch, setClientSearch] = useState("");

  const todayStr = new Date().toISOString().split("T")[0];
  const todayBookings = bookings
    .filter(b => b.date === todayStr)
    .sort((a, b) => a.time.localeCompare(b.time));

  const filteredClients = uniqueClients
    .filter(c => {
      if (!clientSearch) return true;
      const q = clientSearch.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const aTotal = (clientMap[a.email] ?? []).reduce((s, v) => s + (v.servicePrice ?? 0), 0);
      const bTotal = (clientMap[b.email] ?? []).reduce((s, v) => s + (v.servicePrice ?? 0), 0);
      return bTotal - aTotal;
    });

  return (
    <div className="min-h-screen bg-[var(--mc-bg)] flex flex-col pb-[calc(64px+env(safe-area-inset-bottom))]">

      {/* ── TODAY TAB ─────────────────────────────────────────────────────── */}
      {tab === "today" && (
        <div className="flex-1 px-3 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[var(--mc-accent)] text-[10px] uppercase tracking-widest font-semibold">Today</p>
              <p className="text-white font-serif text-lg font-bold">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
            </div>
            <button onClick={openCreate}
              className="gold-gradient-bg text-black font-bold px-4 py-2 text-xs uppercase tracking-widest flex items-center gap-1.5 min-h-[44px] cursor-pointer hover:opacity-90 transition-opacity">
              <Plus size={13} /> New
            </button>
          </div>

          {loading ? (
            <div className="text-center py-20 text-[#555]">Loading…</div>
          ) : todayBookings.length === 0 ? (
            <div className="text-center py-20 luxury-card">
              <Calendar size={40} className="text-[#333] mx-auto mb-3" />
              <p className="text-[#555] text-sm">No bookings today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayBookings.map(b => (
                <div key={b.id} className={`luxury-card ${statusBg[b.status] ?? ""} p-4`}>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{b.name}</p>
                      <p className="text-[var(--mc-muted)] text-xs truncate">{b.service}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[var(--mc-accent)] text-xs font-semibold">{b.time}</span>
                        {b.stylist && <span className="text-[#555] text-xs">· {b.stylist}</span>}
                        {b.servicePrice != null && <span className="text-[#555] text-xs">· ${b.servicePrice}</span>}
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-1 uppercase tracking-wider shrink-0 font-semibold ${
                      b.status === "confirmed" ? "bg-green-400/10 text-green-400 border border-green-400/30" :
                      b.status === "cancelled" ? "bg-red-400/10 text-red-400 border border-red-400/30" :
                      b.status === "no_show"   ? "bg-orange-400/10 text-orange-400 border border-orange-400/30" :
                      "bg-yellow-400/10 text-yellow-400 border border-yellow-400/30"
                    }`}>
                      {statusLabel[b.status]}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2">
                    {b.status === "pending" && (
                      <>
                        <button onClick={() => updateStatus(b.id, "confirmed")}
                          className="flex items-center gap-1 min-h-[44px] px-4 bg-green-500/10 border border-green-500/30 text-green-400 text-xs uppercase tracking-wider font-semibold cursor-pointer hover:bg-green-500/20 transition-colors">
                          <Check size={13} /> Confirm
                        </button>
                        <button onClick={() => updateStatus(b.id, "cancelled")}
                          className="flex items-center gap-1 min-h-[44px] px-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs uppercase tracking-wider font-semibold cursor-pointer hover:bg-red-500/20 transition-colors">
                          <X size={13} /> Cancel
                        </button>
                      </>
                    )}
                    {b.status === "confirmed" && (
                      <>
                        <button onClick={() => updateStatus(b.id, "no_show")}
                          className="flex items-center gap-1 min-h-[44px] px-4 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs uppercase tracking-wider font-semibold cursor-pointer hover:bg-orange-500/20 transition-colors">
                          <AlertTriangle size={13} /> No Show
                        </button>
                        <button onClick={() => resendEmail(b.id)}
                          disabled={emailStatus[b.id] === "sending"}
                          className="flex items-center gap-1 min-h-[44px] px-4 border border-[var(--mc-border)] text-[var(--mc-muted)] text-xs uppercase tracking-wider font-semibold cursor-pointer hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-colors disabled:opacity-40">
                          <Mail size={13} />
                          {emailStatus[b.id] === "sending" ? "Sending…" : emailStatus[b.id] === "sent" ? "Sent ✓" : "Resend"}
                        </button>
                      </>
                    )}
                    {b.status === "no_show" && (
                      <button onClick={() => chargeNoShow(b.id)}
                        disabled={noshowLoading[b.id] || noshowResult[b.id] === "charged"}
                        className="flex items-center gap-1 min-h-[44px] px-4 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs uppercase tracking-wider font-semibold cursor-pointer hover:bg-orange-500/20 transition-colors disabled:opacity-40">
                        <AlertTriangle size={13} />
                        {noshowResult[b.id] === "charged" ? "Charged ✓" : noshowLoading[b.id] ? "Charging…" : "Charge Fee"}
                      </button>
                    )}
                    <button onClick={() => startEdit(b)}
                      className="flex items-center gap-1 min-h-[44px] px-4 border border-[var(--mc-border)] text-[var(--mc-muted)] text-xs uppercase tracking-wider font-semibold cursor-pointer hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-colors">
                      <Pencil size={13} /> Edit
                    </button>
                    <button onClick={() => deleteBooking(b.id)}
                      className="flex items-center gap-1 min-h-[44px] px-4 border border-red-500/20 text-red-400/60 text-xs uppercase tracking-wider font-semibold cursor-pointer hover:bg-red-500/10 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── CLIENTS TAB ───────────────────────────────────────────────────── */}
      {tab === "clients" && (
        <div className="flex-1 px-3 py-4">
          <p className="text-[var(--mc-accent)] text-[10px] uppercase tracking-widest font-semibold mb-3">Clients</p>
          <input
            type="search"
            placeholder="Search by name or email…"
            value={clientSearch}
            onChange={e => setClientSearch(e.target.value)}
            className="w-full bg-[var(--mc-surface-dark)] border border-[var(--mc-border)] text-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[#444] mb-4"
          />
          {filteredClients.length === 0 ? (
            <div className="text-center py-20 luxury-card">
              <Users size={40} className="text-[#333] mx-auto mb-3" />
              <p className="text-[#555] text-sm">No clients found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredClients.map(c => {
                const visits = clientMap[c.email] ?? [];
                const total = visits.reduce((s, v) => s + (v.servicePrice ?? 0), 0);
                const last = [...visits].sort((a, b) => b.date.localeCompare(a.date))[0];
                return (
                  <div key={c.email} className="luxury-card p-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{c.name}</p>
                      <p className="text-[#555] text-xs truncate">{c.email}</p>
                      {last && <p className="text-[var(--mc-muted)] text-xs mt-0.5">Last: {last.date} · {last.service.split("–")[1]?.trim() ?? last.service}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[var(--mc-accent)] font-bold text-sm">${total.toLocaleString()}</p>
                      <p className="text-[#555] text-[10px]">{visits.length} visit{visits.length !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── SCHEDULE TAB ──────────────────────────────────────────────────── */}
      {tab === "schedule" && (
        <div className="flex-1 px-3 py-4">
          <p className="text-[var(--mc-accent)] text-[10px] uppercase tracking-widest font-semibold mb-4">Schedule</p>
          <ScheduleTab />
        </div>
      )}

      {/* ── SETTINGS TAB ──────────────────────────────────────────────────── */}
      {tab === "settings" && (
        <div className="flex-1 px-3 py-4">
          <p className="text-[var(--mc-accent)] text-[10px] uppercase tracking-widest font-semibold mb-4">Quick Settings</p>
          <div className="space-y-2">
            {[
              { label: "Reservations" },
              { label: "Clients & Rewards" },
              { label: "Gift Cards & Promos" },
              { label: "Payroll & Staff" },
              { label: "Operations" },
              { label: "Marketing" },
              { label: "Reports" },
              { label: "Site Settings" },
            ].map(item => (
              <button key={item.label} onClick={onFullMode}
                className="luxury-card w-full flex items-center justify-between p-4 cursor-pointer hover:border-[var(--mc-accent)]/40 transition-colors min-h-[52px]">
                <span className="text-white text-sm">{item.label}</span>
                <ChevronRight size={16} className="text-[#555]" />
              </button>
            ))}
          </div>

          <button onClick={onFullMode}
            className="mt-6 w-full flex items-center justify-center gap-2 border border-[var(--mc-accent)] text-[var(--mc-accent)] font-bold px-6 py-4 text-xs uppercase tracking-widest cursor-pointer hover:bg-[var(--mc-accent)]/10 transition-colors min-h-[52px]">
            <LayoutGrid size={15} /> Switch to Full Admin
          </button>
        </div>
      )}

      {/* ── BOTTOM NAV ────────────────────────────────────────────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-[var(--mc-surface-dark)] border-t border-[var(--mc-border)] grid grid-cols-4 z-50"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {([
          { id: "today",    icon: <Clock size={20} />,     label: "Today",    badge: pending },
          { id: "clients",  icon: <Users size={20} />,     label: "Clients",  badge: 0 },
          { id: "schedule", icon: <Calendar size={20} />,  label: "Schedule", badge: 0 },
          { id: "settings", icon: <Settings size={20} />,  label: "Settings", badge: 0 },
        ] as { id: LiteTab; icon: React.ReactNode; label: string; badge: number }[]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex flex-col items-center justify-center py-3 gap-1 relative cursor-pointer transition-colors min-h-[64px] ${
              tab === t.id ? "text-[var(--mc-accent)]" : "text-[#555]"
            }`}>
            {t.icon}
            <span className="text-[9px] uppercase tracking-widest font-semibold">{t.label}</span>
            {t.badge > 0 && (
              <span className="absolute top-2 right-1/2 translate-x-4 bg-[var(--mc-accent)] text-black text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
