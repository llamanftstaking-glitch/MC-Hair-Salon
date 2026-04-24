"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Calendar, Users, TrendingUp, Clock, Check, X, Trash2,
  RefreshCw, Mail, Send, Bell, UserCheck, BarChart2, Plus, Loader
} from "lucide-react";
import type { Booking } from "@/lib/bookings";

type Tab = "reservations" | "clients" | "newsletter" | "reports";

interface Subscriber { id: string; email: string; name?: string; subscribedAt: string; active: boolean; }

const statusColors: Record<string, string> = {
  pending: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  confirmed: "text-green-400 border-green-400/30 bg-green-400/10",
  cancelled: "text-red-400 border-red-400/30 bg-red-400/10",
};

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("reservations");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const [emailStatus, setEmailStatus] = useState<Record<string, string>>({});

  // Newsletter state
  const [newsletter, setNewsletter] = useState({ subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ sent?: number; failed?: number; error?: string } | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [addingSubscriber, setAddingSubscriber] = useState(false);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings");
      setBookings(await res.json());
    } finally { setLoading(false); }
  }, []);

  const fetchSubscribers = useCallback(async () => {
    const res = await fetch("/api/newsletter");
    setSubscribers(await res.json());
  }, []);

  useEffect(() => { fetchBookings(); fetchSubscribers(); }, [fetchBookings, fetchSubscribers]);

  const updateStatus = async (id: string, status: Booking["status"]) => {
    await fetch("/api/bookings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (status === "confirmed") await sendConfirmationEmail(id);
    fetchBookings();
  };

  const sendConfirmationEmail = async (bookingId: string) => {
    setEmailStatus(p => ({ ...p, [bookingId]: "sending" }));
    try {
      const res = await fetch("/api/email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "confirm_booking", bookingId }) });
      const data = await res.json();
      setEmailStatus(p => ({ ...p, [bookingId]: data.success ? "sent" : "failed" }));
    } catch { setEmailStatus(p => ({ ...p, [bookingId]: "failed" })); }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Delete this booking?")) return;
    await fetch("/api/bookings", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchBookings();
  };

  const addManualSubscriber = async () => {
    if (!newEmail) return;
    setAddingSubscriber(true);
    await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "subscribe", email: newEmail, name: newName }) });
    setNewEmail(""); setNewName("");
    setAddingSubscriber(false);
    fetchSubscribers();
  };

  const removeSubscriber = async (id: string) => {
    if (!confirm("Remove this subscriber?")) return;
    await fetch("/api/newsletter", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchSubscribers();
  };

  const sendNewsletter = async () => {
    if (!newsletter.subject || !newsletter.message) return;
    setSending(true); setSendResult(null);
    try {
      const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "send", ...newsletter }) });
      const data = await res.json();
      setSendResult(data);
    } catch { setSendResult({ error: "Failed to send" }); }
    setSending(false);
  };

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);
  const pending = bookings.filter(b => b.status === "pending").length;
  const confirmed = bookings.filter(b => b.status === "confirmed").length;
  const uniqueClients = [...new Map(bookings.map(b => [b.email, b])).values()];
  const activeSubscribers = subscribers.filter(s => s.active).length;

  const clientMap: Record<string, Booking[]> = {};
  bookings.forEach(b => { if (!clientMap[b.email]) clientMap[b.email] = []; clientMap[b.email].push(b); });

  const serviceCount: Record<string, number> = {};
  bookings.forEach(b => { const s = b.service.split("–")[1]?.trim() || b.service; serviceCount[s] = (serviceCount[s] || 0) + 1; });
  const topServices = Object.entries(serviceCount).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const stylistCount: Record<string, number> = {};
  bookings.forEach(b => { if (b.stylist) stylistCount[b.stylist] = (stylistCount[b.stylist] || 0) + 1; });

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "reservations", label: "Reservations", icon: <Calendar size={15} /> },
    { id: "clients", label: "Clients", icon: <Users size={15} /> },
    { id: "newsletter", label: "Newsletter", icon: <Mail size={15} /> },
    { id: "reports", label: "Reports", icon: <BarChart2 size={15} /> },
  ];

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Header */}
      <div className="border-b border-[var(--mc-border)] bg-[var(--mc-surface-dark)]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold gold-gradient">MC Admin Panel</h1>
            <p className="text-[#555] text-sm mt-1">Reservations · Clients · Newsletter · Reports</p>
          </div>
          <button onClick={() => { fetchBookings(); fetchSubscribers(); }}
            className="flex items-center gap-2 border border-[var(--mc-border)] text-[var(--mc-text-dim)] px-4 py-2 text-sm hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <Calendar size={20} />, label: "Total Bookings", value: bookings.length },
            { icon: <Clock size={20} />, label: "Pending", value: pending },
            { icon: <UserCheck size={20} />, label: "Confirmed", value: confirmed },
            { icon: <Bell size={20} />, label: "Subscribers", value: activeSubscribers },
          ].map((s) => (
            <div key={s.label} className="luxury-card p-5">
              <div className="text-[var(--mc-accent)] mb-3">{s.icon}</div>
              <p className="font-serif text-3xl font-bold text-white">{s.value}</p>
              <p className="text-[#555] text-xs uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-8 border-b border-[var(--mc-border)] overflow-x-auto">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm uppercase tracking-widest font-semibold transition-all cursor-pointer border-b-2 -mb-px whitespace-nowrap ${
                tab === t.id ? "border-[var(--mc-accent)] text-[var(--mc-accent)]" : "border-transparent text-[#555] hover:text-[var(--mc-muted)]"
              }`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── RESERVATIONS ── */}
        {tab === "reservations" && (
          <div>
            <div className="flex gap-3 mb-6 flex-wrap">
              {(["all", "pending", "confirmed", "cancelled"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 text-xs uppercase tracking-widest cursor-pointer transition-all ${
                    filter === f ? "gold-gradient-bg text-black font-bold" : "border border-[var(--mc-border)] text-[var(--mc-text-dim)] hover:border-[var(--mc-accent)]"
                  }`}>
                  {f} ({f === "all" ? bookings.length : bookings.filter(b => b.status === f).length})
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-20 text-[#555]">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 luxury-card">
                <Calendar size={48} className="text-[#333] mx-auto mb-4" />
                <p className="text-[#555]">No bookings found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((booking) => (
                  <div key={booking.id} className="luxury-card p-5 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <p className="text-white font-semibold">{booking.name}</p>
                          <span className={`text-xs px-2 py-0.5 border uppercase tracking-wider ${statusColors[booking.status]}`}>{booking.status}</span>
                          <span className="text-[#333] text-xs font-mono">{booking.id}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm mb-2">
                          <span className="text-[var(--mc-text-dim)] truncate">{booking.email}</span>
                          <span className="text-[var(--mc-text-dim)]">{booking.phone}</span>
                          <span className="text-[var(--mc-accent)] font-medium">{booking.date} · {booking.time}</span>
                          <span className="text-[var(--mc-muted)]">{booking.stylist || "No preference"}</span>
                        </div>
                        <p className="text-[#555] text-sm">{booking.service}</p>
                        {booking.notes && <p className="text-[var(--mc-text-dim)] text-xs mt-1 italic">"{booking.notes}"</p>}
                        {emailStatus[booking.id] && (
                          <p className={`text-xs mt-2 ${emailStatus[booking.id] === "sent" ? "text-green-400" : emailStatus[booking.id] === "sending" ? "text-yellow-400" : "text-red-400"}`}>
                            {emailStatus[booking.id] === "sending" ? "Sending email..." : emailStatus[booking.id] === "sent" ? "✓ Confirmation email sent" : "✗ Email failed"}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {booking.status !== "confirmed" && (
                          <button onClick={() => updateStatus(booking.id, "confirmed")}
                            className="w-9 h-9 flex items-center justify-center border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-colors cursor-pointer" title="Confirm & send email">
                            <Check size={16} />
                          </button>
                        )}
                        {booking.status === "confirmed" && (
                          <button onClick={() => sendConfirmationEmail(booking.id)}
                            className="w-9 h-9 flex items-center justify-center border border-[var(--mc-accent)]/30 text-[var(--mc-accent)] hover:bg-[var(--mc-accent)/10] transition-colors cursor-pointer" title="Resend confirmation email">
                            <Send size={14} />
                          </button>
                        )}
                        {booking.status === "pending" && (
                          <button onClick={() => updateStatus(booking.id, "cancelled")}
                            className="w-9 h-9 flex items-center justify-center border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer">
                            <X size={16} />
                          </button>
                        )}
                        <button onClick={() => deleteBooking(booking.id)}
                          className="w-9 h-9 flex items-center justify-center border border-[var(--mc-border)] text-[#555] hover:border-red-500/50 hover:text-red-400 transition-all cursor-pointer">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── CLIENTS ── */}
        {tab === "clients" && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-[#555] text-sm">{uniqueClients.length} unique client{uniqueClients.length !== 1 ? "s" : ""}</p>
            </div>
            {uniqueClients.length === 0 ? (
              <div className="text-center py-20 luxury-card">
                <Users size={48} className="text-[#333] mx-auto mb-4" />
                <p className="text-[#555]">No clients yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {uniqueClients.map(client => {
                  const visits = clientMap[client.email] || [];
                  const lastVisit = visits.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
                  return (
                    <div key={client.email} className="luxury-card p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                        <div>
                          <p className="text-white font-semibold text-lg">{client.name}</p>
                          <p className="text-[var(--mc-text-dim)] text-sm">{client.email}</p>
                          <p className="text-[var(--mc-text-dim)] text-sm">{client.phone}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-serif text-3xl gold-gradient font-bold">{visits.length}</p>
                          <p className="text-[#555] text-xs">appointment{visits.length !== 1 ? "s" : ""}</p>
                          <span className={`text-xs px-2 py-0.5 border mt-2 inline-block ${statusColors[lastVisit?.status || "pending"]}`}>
                            Last: {lastVisit?.status}
                          </span>
                        </div>
                      </div>
                      <div className="border-t border-[var(--mc-border)] pt-4 space-y-2">
                        <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-3">Appointment History</p>
                        {visits.map(v => (
                          <div key={v.id} className="flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-1">
                            <div>
                              <span className="text-[var(--mc-muted)]">{v.date} at {v.time}</span>
                              <span className="text-[var(--mc-text-dim)] mx-2">·</span>
                              <span className="text-[var(--mc-text-dim)]">{v.service.split("–")[1]?.trim() || v.service}</span>
                              {v.stylist && <><span className="text-[var(--mc-text-dim)] mx-2">·</span><span className="text-[#555]">{v.stylist}</span></>}
                            </div>
                            <span className={`text-xs px-2 py-0.5 border ${statusColors[v.status]}`}>{v.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── NEWSLETTER ── */}
        {tab === "newsletter" && (
          <div>

            {/* Left — Compose */}
            <div className="space-y-6">
              <div className="luxury-card p-6">
                <h3 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
                  <Send size={18} className="text-[var(--mc-accent)]" /> Compose Newsletter
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-2">Subject</label>
                    <input
                      type="text" value={newsletter.subject}
                      onChange={e => setNewsletter(p => ({ ...p, subject: e.target.value }))}
                      placeholder="e.g. Spring Specials at MC Salon"
                      className="w-full bg-[var(--mc-surface-dark)] border border-[var(--mc-border)] text-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[#444]"
                    />
                  </div>
                  <div>
                    <label className="block text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-2">Message</label>
                    <textarea
                      rows={10} value={newsletter.message}
                      onChange={e => setNewsletter(p => ({ ...p, message: e.target.value }))}
                      placeholder="Write your newsletter here...&#10;&#10;Tips, promotions, seasonal offers..."
                      className="w-full bg-[var(--mc-surface-dark)] border border-[var(--mc-border)] text-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[#444] resize-none"
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-[#555] text-xs">Sending to <span className="text-[var(--mc-accent)]">{activeSubscribers}</span> subscriber{activeSubscribers !== 1 ? "s" : ""}</p>
                    <button onClick={sendNewsletter} disabled={sending || !newsletter.subject || !newsletter.message || activeSubscribers === 0}
                      className="gold-gradient-bg text-black font-bold px-8 py-3 text-sm uppercase tracking-widest hover:opacity-90 disabled:opacity-40 cursor-pointer flex items-center gap-2 transition-opacity">
                      {sending ? <><Loader size={14} className="animate-spin" /> Sending...</> : <><Send size={14} /> Send Now</>}
                    </button>
                  </div>

                  {sendResult && (
                    <div className={`p-4 border text-sm ${sendResult.error ? "border-red-500/30 text-red-400 bg-red-500/5" : "border-green-500/30 text-green-400 bg-green-500/5"}`}>
                      {sendResult.error ? `✗ ${sendResult.error}` : `✓ Sent to ${sendResult.sent} subscribers${sendResult.failed ? ` · ${sendResult.failed} failed` : ""}`}
                    </div>
                  )}
                </div>
              </div>

              {/* Add manual subscriber */}
              <div className="luxury-card p-6">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Plus size={16} className="text-[var(--mc-accent)]" /> Add Subscriber
                </h3>
                <div className="flex flex-col gap-3">
                  <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Name (optional)"
                    className="w-full bg-[var(--mc-surface-dark)] border border-[var(--mc-border)] text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[#444]" />
                  <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email address"
                    className="w-full bg-[var(--mc-surface-dark)] border border-[var(--mc-border)] text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[#444]" />
                  <button onClick={addManualSubscriber} disabled={!newEmail || addingSubscriber}
                    className="gold-gradient-bg text-black font-bold py-2.5 text-sm uppercase tracking-widest hover:opacity-90 disabled:opacity-40 cursor-pointer">
                    {addingSubscriber ? "Adding..." : "Add Subscriber"}
                  </button>
                </div>
              </div>
            </div>

            {/* Right — Subscriber list */}
            <div className="luxury-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Users size={16} className="text-[var(--mc-accent)]" /> Subscribers
                  <span className="text-[var(--mc-accent)] text-sm font-normal">({activeSubscribers} active)</span>
                </h3>
              </div>
              {subscribers.length === 0 ? (
                <div className="text-center py-12">
                  <Mail size={40} className="text-[#333] mx-auto mb-3" />
                  <p className="text-[#555] text-sm">No subscribers yet</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                  {subscribers.map(sub => (
                    <div key={sub.id} className={`flex items-center justify-between p-3 border ${sub.active ? "border-[var(--mc-border)]" : "border-[var(--mc-border)] opacity-40"}`}>
                      <div>
                        {sub.name && <p className="text-white text-sm font-medium">{sub.name}</p>}
                        <p className="text-[var(--mc-text-dim)] text-sm">{sub.email}</p>
                        <p className="text-[#333] text-xs mt-0.5">{new Date(sub.subscribedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 border ${sub.active ? "text-green-400 border-green-400/30 bg-green-400/10" : "text-[#555] border-[var(--mc-border)]"}`}>
                          {sub.active ? "active" : "off"}
                        </span>
                        <button onClick={() => removeSubscriber(sub.id)}
                          className="w-7 h-7 flex items-center justify-center text-[var(--mc-text-dim)] hover:text-red-400 transition-colors cursor-pointer">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── REPORTS ── */}
        {tab === "reports" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: <TrendingUp size={22} />, label: "Est. Revenue", value: `$${(confirmed * 85).toLocaleString()}`, sub: "Based on confirmed bookings" },
                { icon: <Check size={22} />, label: "Confirmation Rate", value: `${bookings.length > 0 ? Math.round((confirmed / bookings.length) * 100) : 0}%`, sub: "Of all bookings" },
                { icon: <Users size={22} />, label: "Avg Visits / Client", value: uniqueClients.length > 0 ? (bookings.length / uniqueClients.length).toFixed(1) : "0", sub: "Per unique client" },
              ].map(s => (
                <div key={s.label} className="luxury-card p-6">
                  <div className="text-[var(--mc-accent)] mb-4">{s.icon}</div>
                  <p className="font-serif text-4xl font-bold gold-gradient">{s.value}</p>
                  <p className="text-[#555] text-xs uppercase tracking-widest mt-1">{s.label}</p>
                  <p className="text-[#333] text-xs mt-1">{s.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="luxury-card p-6">
                <h3 className="text-white font-semibold mb-6 flex items-center gap-2"><BarChart2 size={16} className="text-[var(--mc-accent)]" /> Top Services</h3>
                {topServices.length === 0 ? <p className="text-[#555] text-sm">No data yet</p> : (
                  <div className="space-y-4">
                    {topServices.map(([name, count]) => (
                      <div key={name}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-[var(--mc-muted)] truncate mr-4">{name}</span>
                          <span className="text-[var(--mc-accent)] shrink-0">{count} booking{count !== 1 ? "s" : ""}</span>
                        </div>
                        <div className="h-1.5 bg-[var(--mc-surface-2)] rounded-full">
                          <div className="h-full gold-gradient-bg rounded-full transition-all duration-700"
                            style={{ width: `${(count / bookings.length) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="luxury-card p-6">
                <h3 className="text-white font-semibold mb-6 flex items-center gap-2"><Users size={16} className="text-[var(--mc-accent)]" /> Bookings by Stylist</h3>
                {Object.keys(stylistCount).length === 0 ? <p className="text-[#555] text-sm">No data yet</p> : (
                  <div className="space-y-4">
                    {Object.entries(stylistCount).sort((a, b) => b[1] - a[1]).map(([stylist, count]) => (
                      <div key={stylist}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-[var(--mc-muted)]">{stylist}</span>
                          <span className="text-[var(--mc-accent)]">{count} booking{count !== 1 ? "s" : ""}</span>
                        </div>
                        <div className="h-1.5 bg-[var(--mc-surface-2)] rounded-full">
                          <div className="h-full gold-gradient-bg rounded-full"
                            style={{ width: `${(count / bookings.length) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
