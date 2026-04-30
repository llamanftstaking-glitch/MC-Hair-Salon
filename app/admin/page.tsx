"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Calendar, Users, TrendingUp, Clock, Check, X, Trash2,
  RefreshCw, Mail, Send, Bell, UserCheck, BarChart2, Plus, Loader,
  MessageSquare, MailCheck, Upload, Film, Pencil, User, Settings,
  Building2, Globe, Phone, ChevronRight, Image as ImageIcon, Save,
  CreditCard, AlertTriangle, ShieldCheck,
  Gift, Star, Crown, Zap, Minus, Scissors, QrCode,
} from "lucide-react";
import type { Booking } from "@/lib/bookings";
import type { ContactMessage } from "@/lib/messages";

// ── Types ──────────────────────────────────────────────────────────────────────
type Tab = "reservations" | "clients" | "newsletter" | "reports" | "messages" | "staff" | "settings" | "rewards" | "users";

interface RewardCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  points: number;
  visits: number;
  totalSpent: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
  rewards: { id: string; name: string; pointsCost: number; redeemedAt: string }[];
  createdAt: string;
}

interface Subscriber { id: string; email: string; name?: string; subscribedAt: string; active: boolean; }

interface PortfolioItem { src: string; type: "image" | "video"; caption?: string; }

interface StaffMember {
  id: string; name: string; role: string; bio: string;
  specialties: string[]; image: string; portfolio: PortfolioItem[];
  isMakeupArtist?: boolean; order?: number;
}

interface SiteSettings {
  business: { name: string; tagline: string; address: string; phone: string; email: string; instagram: string; facebook: string; };
  hours: { day: string; open: string; close: string; closed?: boolean; }[];
  hero: { headline: string; headlineAccent: string; subheadline: string; };
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isEnvAdmin: boolean;
  adminEntry: { email: string; addedAt: string; addedBy: string } | null;
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const statusColors: Record<string, string> = {
  pending:   "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  confirmed: "text-green-400 border-green-400/30 bg-green-400/10",
  cancelled: "text-red-400 border-red-400/30 bg-red-400/10",
  no_show:   "text-orange-400 border-orange-400/30 bg-orange-400/10",
};

const inputCls = "w-full bg-[var(--mc-surface-dark)] border border-[var(--mc-border)] text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[#444]";
const labelCls = "block text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-2";

// ── Component ──────────────────────────────────────────────────────────────────
export default function AdminPage() {
  // ── Existing state ──────────────────────────────────────────────────────────
  const [tab, setTab] = useState<Tab>("reservations");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled" | "no_show">("all");
  const [emailStatus, setEmailStatus] = useState<Record<string, string>>({});
  const [newsletter, setNewsletter] = useState({ subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ sent?: number; failed?: number; error?: string } | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [addingSubscriber, setAddingSubscriber] = useState(false);

  // ── Staff state ─────────────────────────────────────────────────────────────
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [editingStaff, setEditingStaff] = useState<string | null>(null);
  const [staffForm, setStaffForm] = useState<Partial<StaffMember>>({});
  const [uploadingPhoto, setUploadingPhoto] = useState<string | null>(null);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);
  const [savingStaff, setSavingStaff] = useState(false);
  const [staffSaved, setStaffSaved] = useState(false);
  const editPanelRef = useRef<HTMLDivElement>(null);

  // ── Settings state ──────────────────────────────────────────────────────────
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [settingsForm, setSettingsForm] = useState<SiteSettings | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"business" | "hours" | "hero">("business");

  // ── Rewards state ────────────────────────────────────────────────────────────
  const [rewardsData,    setRewardsData]    = useState<RewardCustomer[]>([]);
  const [adjustTarget,   setAdjustTarget]   = useState<string | null>(null);
  const [adjustAmount,   setAdjustAmount]   = useState("");
  const [adjustMode,     setAdjustMode]     = useState<"add" | "subtract">("add");
  const [adjustReason,   setAdjustReason]   = useState("");
  const [adjusting,      setAdjusting]      = useState(false);
  const [adjustSuccess,  setAdjustSuccess]  = useState<string | null>(null);

  // ── Users/admin state ────────────────────────────────────────────────────────
  const [adminUsers,       setAdminUsers]       = useState<AdminUser[]>([]);
  const [adminGrantEmail,  setAdminGrantEmail]  = useState("");
  const [adminGrantLoading, setAdminGrantLoading] = useState(false);
  const [usersLoading,     setUsersLoading]     = useState(false);

  // ── Fetch functions ─────────────────────────────────────────────────────────
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try { const res = await fetch("/api/bookings"); setBookings(await res.json()); }
    finally { setLoading(false); }
  }, []);
  const fetchSubscribers = useCallback(async () => {
    const res = await fetch("/api/newsletter"); setSubscribers(await res.json());
  }, []);
  const fetchMessages = useCallback(async () => {
    const res = await fetch("/api/contact"); setMessages(await res.json());
  }, []);
  const fetchStaff = useCallback(async () => {
    const res = await fetch("/api/staff"); setStaff(await res.json());
  }, []);
  const fetchSettings = useCallback(async () => {
    const res = await fetch("/api/settings");
    const data = await res.json();
    setSettings(data); setSettingsForm(data);
  }, []);

  const fetchRewards = useCallback(async () => {
    try { const res = await fetch("/api/rewards"); setRewardsData(await res.json()); }
    catch { /* non-fatal */ }
  }, []);

  const fetchAdminUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) { const data = await res.json(); setAdminUsers(data.users); }
    } finally { setUsersLoading(false); }
  }, []);

  useEffect(() => {
    fetchBookings(); fetchSubscribers(); fetchMessages(); fetchStaff(); fetchSettings(); fetchRewards(); fetchAdminUsers();
  }, [fetchBookings, fetchSubscribers, fetchMessages, fetchStaff, fetchSettings, fetchRewards, fetchAdminUsers]);

  // ── Booking handlers ────────────────────────────────────────────────────────
  const [noshowLoading, setNoshowLoading] = useState<Record<string, boolean>>({});
  const [noshowResult,  setNoshowResult]  = useState<Record<string, "charged" | "error">>({});

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
  const chargeNoShow = async (id: string) => {
    if (!confirm("Charge the $20 no-show fee to the card on file?")) return;
    setNoshowLoading(p => ({ ...p, [id]: true }));
    try {
      const res = await fetch("/api/stripe/charge-noshow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: id }),
      });
      const data = await res.json();
      if (res.ok) {
        setNoshowResult(p => ({ ...p, [id]: "charged" }));
        fetchBookings();
      } else {
        alert(data.error ?? "Charge failed");
        setNoshowResult(p => ({ ...p, [id]: "error" }));
      }
    } catch { setNoshowResult(p => ({ ...p, [id]: "error" })); }
    finally   { setNoshowLoading(p => ({ ...p, [id]: false })); }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Delete this booking?")) return;
    await fetch("/api/bookings", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchBookings();
  };

  // ── Rewards handlers ─────────────────────────────────────────────────────────
  const applyPointAdjustment = async (customerId: string) => {
    const amount = parseInt(adjustAmount, 10);
    if (!amount || isNaN(amount)) return;
    const delta = adjustMode === "add" ? amount : -amount;
    setAdjusting(true);
    try {
      const res = await fetch("/api/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, delta, reason: adjustReason }),
      });
      if (res.ok) {
        const data = await res.json();
        setAdjustSuccess(`Points updated — new balance: ${data.points.toLocaleString()} (${data.tier})`);
        setAdjustTarget(null);
        setAdjustAmount("");
        setAdjustReason("");
        fetchRewards();
        setTimeout(() => setAdjustSuccess(null), 4000);
      }
    } finally { setAdjusting(false); }
  };

  // ── Message handlers ────────────────────────────────────────────────────────
  const markMessageRead = async (id: string) => {
    await fetch("/api/contact", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchMessages();
  };
  const deleteMessage = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    await fetch("/api/contact", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchMessages();
  };

  // ── Newsletter handlers ─────────────────────────────────────────────────────
  const addManualSubscriber = async () => {
    if (!newEmail) return;
    setAddingSubscriber(true);
    await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "subscribe", email: newEmail, name: newName }) });
    setNewEmail(""); setNewName(""); setAddingSubscriber(false); fetchSubscribers();
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
      setSendResult(await res.json());
    } catch { setSendResult({ error: "Failed to send" }); }
    setSending(false);
  };

  // ── Staff handlers ──────────────────────────────────────────────────────────
  const startEditStaff = (member: StaffMember) => {
    setEditingStaff(member.id);
    setStaffForm({ ...member });
    setTimeout(() => editPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const handlePhotoUpload = async (staffId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(staffId);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("category", "staff");
    const res  = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) {
      await fetch("/api/staff", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: staffId, image: data.url }) });
      if (editingStaff === staffId) setStaffForm(f => ({ ...f, image: data.url }));
      fetchStaff();
    }
    setUploadingPhoto(null);
    e.target.value = "";
  };

  const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingPortfolio(true);
    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("category", "portfolio");
      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        const type = file.type.startsWith("video") ? "video" as const : "image" as const;
        setStaffForm(f => ({ ...f, portfolio: [...(f.portfolio || []), { src: data.url, type }] }));
      }
    }
    setUploadingPortfolio(false);
    e.target.value = "";
  };

  const removePortfolioItem = (index: number) => {
    setStaffForm(f => ({ ...f, portfolio: (f.portfolio || []).filter((_, i) => i !== index) }));
  };

  const saveStaffEdits = async () => {
    if (!editingStaff || !staffForm) return;
    setSavingStaff(true);
    await fetch("/api/staff", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingStaff, ...staffForm }) });
    setSavingStaff(false); setStaffSaved(true);
    setTimeout(() => setStaffSaved(false), 3000);
    fetchStaff();
  };

  const handleDeleteStaff = async (id: string) => {
    if (!confirm("Remove this team member permanently?")) return;
    await fetch("/api/staff", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    if (editingStaff === id) { setEditingStaff(null); setStaffForm({}); }
    fetchStaff();
  };

  const createNewStaff = async () => {
    const res = await fetch("/api/staff", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "New Team Member", role: "Stylist", bio: "", specialties: [], image: "", portfolio: [] }) });
    const created = await res.json();
    fetchStaff();
    startEditStaff(created);
  };

  // ── Admin users handlers ─────────────────────────────────────────────────────
  const handleAdminToggle = async (email: string, action: "grant" | "revoke") => {
    await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, action }) });
    fetchAdminUsers();
  };
  const handleAdminGrant = async (email: string) => {
    if (!email) return;
    setAdminGrantLoading(true);
    await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, action: "grant" }) });
    setAdminGrantEmail("");
    setAdminGrantLoading(false);
    fetchAdminUsers();
  };

  // ── Settings handlers ───────────────────────────────────────────────────────
  const saveSettings = async () => {
    if (!settingsForm) return;
    setSavingSettings(true);
    const res = await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settingsForm) });
    const data = await res.json();
    setSettings(data); setSettingsForm(data);
    setSavingSettings(false); setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // ── Derived ─────────────────────────────────────────────────────────────────
  const filtered         = filter === "all" ? bookings : bookings.filter(b => b.status === filter);
  const pending          = bookings.filter(b => b.status === "pending").length;
  const confirmed        = bookings.filter(b => b.status === "confirmed").length;
  const uniqueClients    = [...new Map(bookings.map(b => [b.email, b])).values()];
  const activeSubscribers = subscribers.filter(s => s.active).length;
  const unreadMessages   = messages.filter(m => !m.read).length;

  const clientMap: Record<string, Booking[]> = {};
  bookings.forEach(b => { if (!clientMap[b.email]) clientMap[b.email] = []; clientMap[b.email].push(b); });

  const serviceCount: Record<string, number> = {};
  bookings.forEach(b => { const s = b.service.split("–")[1]?.trim() || b.service; serviceCount[s] = (serviceCount[s] || 0) + 1; });
  const topServices = Object.entries(serviceCount).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const stylistCount: Record<string, number> = {};
  bookings.forEach(b => { if (b.stylist) stylistCount[b.stylist] = (stylistCount[b.stylist] || 0) + 1; });

  const tabs: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "reservations", label: "Reservations", icon: <Calendar size={15} /> },
    { id: "clients",      label: "Clients",      icon: <Users size={15} /> },
    { id: "rewards",      label: "Rewards",      icon: <Gift size={15} /> },
    { id: "messages",     label: "Messages",     icon: <MessageSquare size={15} />, badge: unreadMessages },
    { id: "newsletter",   label: "Newsletter",   icon: <Mail size={15} /> },
    { id: "reports",      label: "Reports",      icon: <BarChart2 size={15} /> },
    { id: "staff",        label: "Staff",        icon: <UserCheck size={15} /> },
    { id: "settings",     label: "Settings",     icon: <Settings size={15} /> },
    { id: "users",        label: "Users",        icon: <ShieldCheck size={15} /> },
  ];

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black pt-28">
      {/* Header */}
      <div className="border-b border-[var(--mc-border)] bg-[var(--mc-surface-dark)]">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold gold-gradient">MC Admin Panel</h1>
            <p className="text-[#555] text-sm mt-1">Reservations · Staff · Settings · Reports</p>
          </div>
          <button onClick={() => { fetchBookings(); fetchSubscribers(); fetchStaff(); fetchSettings(); }}
            className="flex items-center gap-2 border border-[var(--mc-border)] text-[var(--mc-text-dim)] px-4 py-2 text-sm hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <Calendar size={20} />, label: "Total Bookings",   value: bookings.length },
            { icon: <Clock size={20} />,    label: "Pending",          value: pending },
            { icon: <MessageSquare size={20} />, label: "Unread Msgs", value: unreadMessages },
            { icon: <Bell size={20} />,     label: "Subscribers",      value: activeSubscribers },
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
              className={`flex items-center gap-2 px-5 py-3 text-sm uppercase tracking-widest font-semibold transition-all cursor-pointer border-b-2 -mb-px whitespace-nowrap ${
                tab === t.id ? "border-[var(--mc-accent)] text-[var(--mc-accent)]" : "border-transparent text-[#555] hover:text-[var(--mc-muted)]"
              }`}>
              {t.icon} {t.label}
              {t.badge && t.badge > 0 ? (
                <span className="ml-1 bg-[var(--mc-accent)] text-black text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">{t.badge}</span>
              ) : null}
            </button>
          ))}
        </div>

        {/* ── RESERVATIONS ─────────────────────────────────────────────────── */}
        {tab === "reservations" && (
          <div>
            <div className="flex gap-3 mb-6 flex-wrap">
              {(["all", "pending", "confirmed", "cancelled", "no_show"] as const).map(f => (
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
              <div className="text-center py-20 luxury-card"><Calendar size={48} className="text-[#333] mx-auto mb-4" /><p className="text-[#555]">No bookings found</p></div>
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
                        {/* Card on file */}
                        {booking.stripePaymentMethodId && (
                          <div className="flex items-center gap-2 mt-2">
                            <CreditCard size={12} className={noshowResult[booking.id] === "charged" ? "text-orange-400" : "text-[#555]"} />
                            <span className="text-[10px] uppercase tracking-wider text-[#555]">
                              {booking.cardBrand ? `${booking.cardBrand.charAt(0).toUpperCase()}${booking.cardBrand.slice(1)} ` : "Card "}
                              {booking.cardLast4 ? `·· ${booking.cardLast4}` : "on file"}
                            </span>
                            {noshowResult[booking.id] === "charged" && (
                              <span className="text-[10px] text-orange-400 uppercase tracking-wider">$20 charged</span>
                            )}
                          </div>
                        )}
                        {emailStatus[booking.id] && (
                          <p className={`text-xs mt-2 ${emailStatus[booking.id] === "sent" ? "text-green-400" : emailStatus[booking.id] === "sending" ? "text-yellow-400" : "text-red-400"}`}>
                            {emailStatus[booking.id] === "sending" ? "Sending email…" : emailStatus[booking.id] === "sent" ? "✓ Confirmation sent" : "✗ Email failed"}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {booking.status !== "confirmed" && (
                          <button onClick={() => updateStatus(booking.id, "confirmed")}
                            className="w-9 h-9 flex items-center justify-center border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-colors cursor-pointer" title="Confirm">
                            <Check size={16} />
                          </button>
                        )}
                        {booking.status === "confirmed" && (
                          <button onClick={() => sendConfirmationEmail(booking.id)}
                            className="w-9 h-9 flex items-center justify-center border border-[var(--mc-accent)]/30 text-[var(--mc-accent)] hover:bg-[var(--mc-accent)]/10 transition-colors cursor-pointer" title="Resend email">
                            <Send size={14} />
                          </button>
                        )}
                        {booking.status === "pending" && (
                          <button onClick={() => updateStatus(booking.id, "cancelled")}
                            className="w-9 h-9 flex items-center justify-center border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer">
                            <X size={16} />
                          </button>
                        )}
                        {/* No-show charge button — shows when card is on file and booking is not already charged */}
                        {booking.stripePaymentMethodId && booking.status !== "no_show" && !noshowResult[booking.id] && (
                          <button
                            onClick={() => chargeNoShow(booking.id)}
                            disabled={noshowLoading[booking.id]}
                            title="Charge $20 no-show fee"
                            className="h-9 px-3 flex items-center gap-1.5 border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 transition-colors cursor-pointer text-xs font-semibold uppercase tracking-wider disabled:opacity-50"
                          >
                            {noshowLoading[booking.id] ? (
                              <Loader size={12} className="animate-spin" />
                            ) : (
                              <AlertTriangle size={13} />
                            )}
                            No-Show $20
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

        {/* ── MESSAGES ─────────────────────────────────────────────────────── */}
        {tab === "messages" && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <p className="text-white font-semibold text-lg flex items-center gap-2">
                  <MessageSquare size={18} className="text-[var(--mc-accent)]" /> Help Desk
                </p>
                <p className="text-[#555] text-sm mt-1">{messages.length} total · {unreadMessages} unread</p>
              </div>
              <button onClick={fetchMessages} className="flex items-center gap-2 border border-[var(--mc-border)] text-[var(--mc-text-dim)] px-4 py-2 text-sm hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer">
                <RefreshCw size={14} /> Refresh
              </button>
            </div>
            {messages.length === 0 ? (
              <div className="text-center py-20 luxury-card"><MessageSquare size={48} className="text-[#333] mx-auto mb-4" /><p className="text-[#555]">No messages yet</p></div>
            ) : (
              <div className="space-y-3">
                {[...messages].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(msg => (
                  <div key={msg.id} className={`luxury-card p-5 border-l-2 ${msg.read ? "border-l-[var(--mc-border)] opacity-70" : "border-l-[var(--mc-accent)]"}`}>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="text-white font-semibold">{msg.name}</p>
                          {!msg.read && <span className="text-[10px] px-2 py-0.5 bg-[var(--mc-accent)]/15 border border-[var(--mc-accent)]/30 text-[var(--mc-accent)] uppercase tracking-wider">New</span>}
                        </div>
                        <p className="text-[var(--mc-text-dim)] text-sm mb-1"><a href={`mailto:${msg.email}`} className="hover:text-[var(--mc-accent)] transition-colors">{msg.email}</a></p>
                        <p className="text-[#333] text-xs mb-3">{new Date(msg.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                        <div className="bg-[var(--mc-surface-dark)] border border-[var(--mc-border)] p-4 text-[var(--mc-muted)] text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {!msg.read && (
                          <button onClick={() => markMessageRead(msg.id)} title="Mark as read"
                            className="w-9 h-9 flex items-center justify-center border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-colors cursor-pointer">
                            <MailCheck size={16} />
                          </button>
                        )}
                        <a href={`mailto:${msg.email}?subject=Re: Your message to MC Hair Salon`}
                          className="w-9 h-9 flex items-center justify-center border border-[var(--mc-accent)]/30 text-[var(--mc-accent)] hover:bg-[var(--mc-accent)]/10 transition-colors cursor-pointer" title="Reply">
                          <Send size={14} />
                        </a>
                        <button onClick={() => deleteMessage(msg.id)}
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

        {/* ── CLIENTS ──────────────────────────────────────────────────────── */}
        {tab === "clients" && (
          <div>
            <div className="mb-6"><p className="text-[#555] text-sm">{uniqueClients.length} unique client{uniqueClients.length !== 1 ? "s" : ""}</p></div>
            {uniqueClients.length === 0 ? (
              <div className="text-center py-20 luxury-card"><Users size={48} className="text-[#333] mx-auto mb-4" /><p className="text-[#555]">No clients yet</p></div>
            ) : (
              <div className="space-y-4">
                {uniqueClients.map(client => {
                  const visits   = clientMap[client.email] || [];
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
                          <span className={`text-xs px-2 py-0.5 border mt-2 inline-block ${statusColors[lastVisit?.status || "pending"]}`}>Last: {lastVisit?.status}</span>
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

        {/* ── NEWSLETTER ───────────────────────────────────────────────────── */}
        {tab === "newsletter" && (
          <div className="space-y-6">
            <div className="luxury-card p-6">
              <h3 className="text-white font-semibold text-lg mb-6 flex items-center gap-2"><Send size={18} className="text-[var(--mc-accent)]" /> Compose Newsletter</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Subject</label>
                  <input type="text" value={newsletter.subject} onChange={e => setNewsletter(p => ({ ...p, subject: e.target.value }))} placeholder="e.g. Spring Specials at MC Salon" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Message</label>
                  <textarea rows={10} value={newsletter.message} onChange={e => setNewsletter(p => ({ ...p, message: e.target.value }))} placeholder="Write your newsletter here…" className={`${inputCls} resize-none`} />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <p className="text-[#555] text-xs">Sending to <span className="text-[var(--mc-accent)]">{activeSubscribers}</span> subscriber{activeSubscribers !== 1 ? "s" : ""}</p>
                  <button onClick={sendNewsletter} disabled={sending || !newsletter.subject || !newsletter.message || activeSubscribers === 0}
                    className="gold-gradient-bg text-black font-bold px-8 py-3 text-sm uppercase tracking-widest hover:opacity-90 disabled:opacity-40 cursor-pointer flex items-center gap-2 transition-opacity">
                    {sending ? <><Loader size={14} className="animate-spin" /> Sending…</> : <><Send size={14} /> Send Now</>}
                  </button>
                </div>
                {sendResult && (
                  <div className={`p-4 border text-sm ${sendResult.error ? "border-red-500/30 text-red-400 bg-red-500/5" : "border-green-500/30 text-green-400 bg-green-500/5"}`}>
                    {sendResult.error ? `✗ ${sendResult.error}` : `✓ Sent to ${sendResult.sent} subscribers${sendResult.failed ? ` · ${sendResult.failed} failed` : ""}`}
                  </div>
                )}
              </div>
            </div>
            <div className="luxury-card p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Plus size={16} className="text-[var(--mc-accent)]" /> Add Subscriber</h3>
              <div className="flex flex-col gap-3">
                <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Name (optional)" className={inputCls} />
                <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="Email address" className={inputCls} />
                <button onClick={addManualSubscriber} disabled={!newEmail || addingSubscriber}
                  className="gold-gradient-bg text-black font-bold py-2.5 text-sm uppercase tracking-widest hover:opacity-90 disabled:opacity-40 cursor-pointer">
                  {addingSubscriber ? "Adding…" : "Add Subscriber"}
                </button>
              </div>
            </div>
            <div className="luxury-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold flex items-center gap-2"><Users size={16} className="text-[var(--mc-accent)]" /> Subscribers <span className="text-[var(--mc-accent)] text-sm font-normal">({activeSubscribers} active)</span></h3>
              </div>
              {subscribers.length === 0 ? (
                <div className="text-center py-12"><Mail size={40} className="text-[#333] mx-auto mb-3" /><p className="text-[#555] text-sm">No subscribers yet</p></div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {subscribers.map(sub => (
                    <div key={sub.id} className={`flex items-center justify-between p-3 border ${sub.active ? "border-[var(--mc-border)]" : "border-[var(--mc-border)] opacity-40"}`}>
                      <div>
                        {sub.name && <p className="text-white text-sm font-medium">{sub.name}</p>}
                        <p className="text-[var(--mc-text-dim)] text-sm">{sub.email}</p>
                        <p className="text-[#333] text-xs mt-0.5">{new Date(sub.subscribedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 border ${sub.active ? "text-green-400 border-green-400/30 bg-green-400/10" : "text-[#555] border-[var(--mc-border)]"}`}>{sub.active ? "active" : "off"}</span>
                        <button onClick={() => removeSubscriber(sub.id)} className="w-7 h-7 flex items-center justify-center text-[var(--mc-text-dim)] hover:text-red-400 transition-colors cursor-pointer"><Trash2 size={13} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── REPORTS ──────────────────────────────────────────────────────── */}
        {tab === "reports" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: <TrendingUp size={22} />, label: "Est. Revenue",        value: `$${(confirmed * 85).toLocaleString()}`, sub: "Based on confirmed bookings" },
                { icon: <Check size={22} />,      label: "Confirmation Rate",   value: `${bookings.length > 0 ? Math.round((confirmed / bookings.length) * 100) : 0}%`, sub: "Of all bookings" },
                { icon: <Users size={22} />,      label: "Avg Visits / Client", value: uniqueClients.length > 0 ? (bookings.length / uniqueClients.length).toFixed(1) : "0", sub: "Per unique client" },
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
                        <div className="flex justify-between text-sm mb-1.5"><span className="text-[var(--mc-muted)] truncate mr-4">{name}</span><span className="text-[var(--mc-accent)] shrink-0">{count}</span></div>
                        <div className="h-1.5 bg-[var(--mc-surface-2)] rounded-full"><div className="h-full gold-gradient-bg rounded-full" style={{ width: `${(count / bookings.length) * 100}%` }} /></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="luxury-card p-6">
                <h3 className="text-white font-semibold mb-6 flex items-center gap-2"><Users size={16} className="text-[var(--mc-accent)]" /> By Stylist</h3>
                {Object.keys(stylistCount).length === 0 ? <p className="text-[#555] text-sm">No data yet</p> : (
                  <div className="space-y-4">
                    {Object.entries(stylistCount).sort((a, b) => b[1] - a[1]).map(([stylist, count]) => (
                      <div key={stylist}>
                        <div className="flex justify-between text-sm mb-1.5"><span className="text-[var(--mc-muted)]">{stylist}</span><span className="text-[var(--mc-accent)]">{count}</span></div>
                        <div className="h-1.5 bg-[var(--mc-surface-2)] rounded-full"><div className="h-full gold-gradient-bg rounded-full" style={{ width: `${(count / bookings.length) * 100}%` }} /></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── STAFF ────────────────────────────────────────────────────────── */}
        {tab === "staff" && (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <p className="text-white font-semibold text-lg flex items-center gap-2"><UserCheck size={18} className="text-[var(--mc-accent)]" /> Team Management</p>
                <p className="text-[#555] text-sm mt-1">{staff.length} team member{staff.length !== 1 ? "s" : ""} · Click a card to edit</p>
              </div>
              <button onClick={createNewStaff}
                className="flex items-center gap-2 gold-gradient-bg text-black font-bold px-5 py-2.5 text-xs uppercase tracking-widest hover:opacity-90 cursor-pointer transition-opacity">
                <Plus size={14} /> Add Member
              </button>
            </div>

            {/* Staff cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              {staff.map(member => (
                <div key={member.id}
                  className={`luxury-card overflow-hidden transition-all duration-200 ${editingStaff === member.id ? "ring-1 ring-[var(--mc-accent)]" : "hover:-translate-y-0.5"}`}>
                  {/* Photo with upload overlay */}
                  <div className="relative h-52 bg-[var(--mc-surface-dark)]">
                    {member.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User size={48} className="text-[#333]" />
                      </div>
                    )}
                    {/* Upload overlay */}
                    <label className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                      {uploadingPhoto === member.id ? (
                        <Loader size={24} className="text-white animate-spin" />
                      ) : (
                        <>
                          <Upload size={22} className="text-white" />
                          <span className="text-white text-xs uppercase tracking-wider">Change Photo</span>
                          <span className="text-white/50 text-[10px]">JPG, PNG, WEBP, MP4</span>
                        </>
                      )}
                      <input type="file" className="hidden" accept="image/*,video/mp4,video/mov,video/webm"
                        onChange={e => handlePhotoUpload(member.id, e)} />
                    </label>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-white font-semibold text-lg leading-tight">{member.name}</p>
                        <p className="text-[var(--mc-accent)] text-xs uppercase tracking-wider mt-0.5">{member.role}</p>
                      </div>
                      {member.isMakeupArtist && (
                        <span className="text-[10px] px-2 py-0.5 border border-[var(--mc-accent)]/40 text-[var(--mc-accent)] uppercase tracking-wider shrink-0 ml-2">MUA</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {member.specialties.slice(0, 3).map(s => (
                        <span key={s} className="text-[10px] px-2 py-0.5 border border-[var(--mc-border)] text-[#555]">{s}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => editingStaff === member.id ? (setEditingStaff(null), setStaffForm({})) : startEditStaff(member)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs uppercase tracking-wider transition-all cursor-pointer ${
                          editingStaff === member.id
                            ? "bg-[var(--mc-accent)]/10 border border-[var(--mc-accent)] text-[var(--mc-accent)]"
                            : "border border-[var(--mc-border)] text-[var(--mc-text-dim)] hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)]"
                        }`}>
                        <Pencil size={11} /> {editingStaff === member.id ? "Close" : "Edit Profile"}
                      </button>
                      <button onClick={() => handleDeleteStaff(member.id)}
                        className="w-9 h-9 flex items-center justify-center border border-[var(--mc-border)] text-[#555] hover:border-red-500/50 hover:text-red-400 transition-all cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit panel */}
            {editingStaff && staffForm.id && (
              <div ref={editPanelRef} className="luxury-card p-7 border border-[var(--mc-accent)]/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                    <Pencil size={16} className="text-[var(--mc-accent)]" /> Editing: {staffForm.name}
                  </h3>
                  {staffSaved && <span className="text-green-400 text-sm flex items-center gap-1"><Check size={13} /> Saved!</span>}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left: profile fields */}
                  <div className="space-y-5">
                    <div>
                      <label className={labelCls}>Full Name</label>
                      <input type="text" value={staffForm.name || ""} onChange={e => setStaffForm(f => ({ ...f, name: e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Role / Title</label>
                      <input type="text" value={staffForm.role || ""} onChange={e => setStaffForm(f => ({ ...f, role: e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Bio</label>
                      <textarea rows={5} value={staffForm.bio || ""} onChange={e => setStaffForm(f => ({ ...f, bio: e.target.value }))} className={`${inputCls} resize-none`} />
                    </div>
                    <div>
                      <label className={labelCls}>Specialties (comma-separated)</label>
                      <input type="text" value={(staffForm.specialties || []).join(", ")}
                        onChange={e => setStaffForm(f => ({ ...f, specialties: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))}
                        className={inputCls} placeholder="Balayage, Precision Cuts, Color" />
                    </div>
                    <div>
                      <label className={labelCls}>Display Order</label>
                      <input type="number" min={0} value={staffForm.order ?? 0} onChange={e => setStaffForm(f => ({ ...f, order: Number(e.target.value) }))} className={inputCls} />
                    </div>
                    <div className="flex items-center gap-4 pt-1">
                      <label className="text-[var(--mc-muted)] text-sm">Makeup Artist</label>
                      <button
                        onClick={() => setStaffForm(f => ({ ...f, isMakeupArtist: !f.isMakeupArtist }))}
                        className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer shrink-0 ${staffForm.isMakeupArtist ? "bg-[var(--mc-accent)]" : "bg-[var(--mc-surface-dark)] border border-[var(--mc-border)]"}`}>
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${staffForm.isMakeupArtist ? "right-1" : "left-1"}`} />
                      </button>
                    </div>
                  </div>

                  {/* Right: portfolio */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className={labelCls + " mb-0"}>Portfolio Media</label>
                      <span className="text-[#555] text-xs">{(staffForm.portfolio || []).length} item{(staffForm.portfolio || []).length !== 1 ? "s" : ""}</span>
                    </div>
                    <p className="text-[#555] text-xs mb-4">Upload photos & videos. Supports JPG, PNG, WEBP, MP4, MOV — any size.</p>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {(staffForm.portfolio || []).map((media, i) => (
                        <div key={i} className="relative aspect-square bg-[var(--mc-surface-dark)] group overflow-hidden">
                          {media.type === "video" ? (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                              <Film size={24} className="text-[var(--mc-accent)]" />
                              <span className="text-[10px] text-[#555]">Video</span>
                            </div>
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={media.src} alt={media.caption || "Portfolio"} className="w-full h-full object-cover" />
                          )}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button onClick={() => removePortfolioItem(i)}
                              className="w-8 h-8 bg-red-500 flex items-center justify-center cursor-pointer hover:bg-red-600 transition-colors">
                              <Trash2 size={14} className="text-white" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Upload cell */}
                      <label className="aspect-square border border-dashed border-[var(--mc-border)] flex flex-col items-center justify-center cursor-pointer hover:border-[var(--mc-accent)] hover:bg-[var(--mc-accent)]/5 transition-all">
                        {uploadingPortfolio ? (
                          <Loader size={22} className="text-[var(--mc-accent)] animate-spin" />
                        ) : (
                          <>
                            <Upload size={20} className="text-[#555] mb-1" />
                            <span className="text-[10px] text-[#555] text-center">Add Photos<br/>or Videos</span>
                          </>
                        )}
                        <input type="file" className="hidden" accept="image/*,video/*" multiple
                          onChange={handlePortfolioUpload} />
                      </label>
                    </div>

                    {/* Current profile photo preview */}
                    {staffForm.image && (
                      <div>
                        <label className={labelCls}>Profile Photo</label>
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={staffForm.image} alt="Profile" className="w-16 h-16 object-cover border border-[var(--mc-border)]" />
                          <div>
                            <p className="text-[var(--mc-muted)] text-xs mb-1">{staffForm.image.split("/").pop()}</p>
                            <label className="flex items-center gap-1.5 text-xs text-[var(--mc-accent)] cursor-pointer hover:underline">
                              <Upload size={11} /> Replace photo
                              <input type="file" className="hidden" accept="image/*,video/mp4,video/mov,video/webm"
                                onChange={e => handlePhotoUpload(editingStaff, e)} />
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Save / Cancel */}
                <div className="flex items-center gap-3 pt-6 border-t border-[var(--mc-border)] mt-6">
                  <button onClick={saveStaffEdits} disabled={savingStaff}
                    className="flex items-center gap-2 gold-gradient-bg text-black font-bold px-8 py-3 text-sm uppercase tracking-widest hover:opacity-90 disabled:opacity-50 cursor-pointer transition-opacity">
                    {savingStaff ? <><Loader size={14} className="animate-spin" /> Saving…</> : <><Save size={14} /> Save Changes</>}
                  </button>
                  <button onClick={() => { setEditingStaff(null); setStaffForm({}); }}
                    className="px-6 py-3 border border-[var(--mc-border)] text-[var(--mc-text-dim)] text-sm uppercase tracking-wider hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── REWARDS ──────────────────────────────────────────────────────── */}
        {tab === "rewards" && (() => {
          const sorted       = [...rewardsData].sort((a, b) => b.points - a.points);
          const totalPoints  = rewardsData.reduce((s, c) => s + c.points, 0);
          const totalRedeem  = rewardsData.reduce((s, c) => s + c.rewards.length, 0);
          const tierCount    = { Bronze: 0, Silver: 0, Gold: 0, Platinum: 0 } as Record<string, number>;
          rewardsData.forEach(c => { tierCount[c.tier] = (tierCount[c.tier] || 0) + 1; });

          const TIER_META: Record<string, { color: string; bg: string; border: string; icon: React.ReactNode }> = {
            Bronze:   { color: "#CD7F32", bg: "bg-[#CD7F32]/10",  border: "border-[#CD7F32]/30", icon: <Star size={13} />   },
            Silver:   { color: "#C0C0C0", bg: "bg-[#C0C0C0]/10",  border: "border-[#C0C0C0]/30", icon: <Star size={13} />   },
            Gold:     { color: "#FFD700", bg: "bg-[#FFD700]/10",   border: "border-[#FFD700]/30", icon: <Crown size={13} />  },
            Platinum: { color: "#E8E8E8", bg: "bg-[#E8E8E8]/10",  border: "border-[#E8E8E8]/30", icon: <Zap size={13} />    },
          };

          return (
            <div>
              {/* Header */}
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                  <p className="text-white font-semibold text-lg flex items-center gap-2">
                    <Gift size={18} className="text-[var(--mc-accent)]" /> MC Rewards Program
                  </p>
                  <p className="text-[#555] text-sm mt-1">
                    {rewardsData.length} members &nbsp;·&nbsp; {totalPoints.toLocaleString()} points issued &nbsp;·&nbsp; {totalRedeem} rewards redeemed
                  </p>
                </div>
                <button onClick={fetchRewards}
                  className="flex items-center gap-2 border border-[var(--mc-border)] text-[var(--mc-text-dim)] px-4 py-2 text-sm hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer">
                  <RefreshCw size={14} /> Refresh
                </button>
              </div>

              {/* Success toast */}
              {adjustSuccess && (
                <div className="mb-4 flex items-center gap-2 border border-green-500/30 bg-green-950/20 px-4 py-3 text-green-400 text-sm">
                  <Check size={15} /> {adjustSuccess}
                </div>
              )}

              {/* Scan station quick-access */}
              <div className="border border-[var(--mc-accent)]/30 bg-[#0a0800] p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                <div>
                  <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-1 flex items-center gap-2">
                    <Scissors size={13} /> On-Site Scan Station
                  </p>
                  <p className="text-[var(--mc-muted)] text-sm">
                    Open on any salon device to look up clients and record visits manually.
                    Clients can also show their QR code to jump straight to their profile.
                  </p>
                </div>
                <a href="/scan" target="_blank" rel="noopener noreferrer"
                  className="shrink-0 gold-gradient-bg text-black font-bold px-6 py-2.5 text-xs uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer">
                  Open Station ↗
                </a>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: "Total Members",      value: rewardsData.length,                                                    icon: <Users size={18} />    },
                  { label: "Points Issued",       value: totalPoints.toLocaleString(),                                          icon: <Star size={18} />     },
                  { label: "Blowouts Earned",     value: rewardsData.reduce((s, c) => s + (c.blowoutsEarned ?? 0), 0),          icon: <Scissors size={18} /> },
                  { label: "Rewards Redeemed",    value: totalRedeem,                                                           icon: <Gift size={18} />     },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="luxury-card p-5">
                    <div className="text-[var(--mc-accent)] mb-3">{icon}</div>
                    <p className="font-serif text-2xl font-bold text-white">{value}</p>
                    <p className="text-[#555] text-xs uppercase tracking-widest mt-1">{label}</p>
                  </div>
                ))}
              </div>

              {/* Tier breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {(["Bronze", "Silver", "Gold", "Platinum"] as const).map((tier) => {
                  const meta = TIER_META[tier];
                  const count = tierCount[tier] || 0;
                  const pct = rewardsData.length ? Math.round((count / rewardsData.length) * 100) : 0;
                  return (
                    <div key={tier} className={`border ${meta.border} ${meta.bg} p-4`}>
                      <div className="flex items-center gap-2 mb-2" style={{ color: meta.color }}>
                        {meta.icon}
                        <span className="text-xs uppercase tracking-widest font-bold">{tier}</span>
                      </div>
                      <p className="font-serif text-3xl font-bold text-white">{count}</p>
                      <p className="text-[#555] text-xs mt-1">{pct}% of members</p>
                      <div className="mt-3 h-1 bg-[#111]">
                        <div className="h-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: meta.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Member leaderboard */}
              <div>
                <p className="text-white font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp size={15} className="text-[var(--mc-accent)]" /> Member Leaderboard
                </p>

                {sorted.length === 0 ? (
                  <div className="text-center py-20 luxury-card">
                    <Gift size={40} className="text-[#333] mx-auto mb-4" />
                    <p className="text-[#555]">No members yet. Clients who sign up will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sorted.map((customer, idx) => {
                      const meta      = TIER_META[customer.tier];
                      const isOpen    = adjustTarget === customer.id;
                      const maxPoints = 2000;
                      const barPct    = Math.min(100, Math.round((customer.points / maxPoints) * 100));

                      return (
                        <div key={customer.id} className="luxury-card overflow-hidden">
                          {/* Main row */}
                          <div className="p-4 flex items-center gap-4 flex-wrap">
                            {/* Rank */}
                            <span className="text-[#333] font-mono text-sm w-7 shrink-0 text-center">
                              {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                            </span>

                            {/* Name + email */}
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-semibold text-sm truncate">{customer.name}</p>
                              <p className="text-[#555] text-xs truncate">{customer.email}</p>
                            </div>

                            {/* Tier badge */}
                            <span className={`text-[10px] px-2.5 py-1 border uppercase tracking-widest font-bold shrink-0 ${meta.border} ${meta.bg}`}
                              style={{ color: meta.color }}>
                              {customer.tier}
                            </span>

                            {/* Points + bar */}
                            <div className="w-32 shrink-0 hidden sm:block">
                              <div className="flex justify-between text-[10px] mb-1">
                                <span className="text-white font-semibold">{customer.points.toLocaleString()} pts</span>
                                <span className="text-[#444]">{customer.visits} visits</span>
                              </div>
                              <div className="h-1.5 bg-[#111]">
                                <div className="h-full transition-all" style={{ width: `${barPct}%`, backgroundColor: meta.color }} />
                              </div>
                            </div>

                            {/* Punch card mini-progress */}
                            <div className="items-center gap-1 hidden md:flex shrink-0">
                              {Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className={`w-2 h-2 rounded-full ${i < (customer.visitStreak ?? 0) ? "bg-[var(--mc-accent)]" : "bg-[#1a1a1a]"}`} />
                              ))}
                              <span className="text-[#444] text-[10px] ml-1">{customer.visitStreak ?? 0}/10</span>
                            </div>

                            {/* Blowouts earned */}
                            {(customer.blowoutsEarned ?? 0) > 0 && (
                              <div className="items-center gap-1 hidden lg:flex shrink-0">
                                <Scissors size={11} className="text-[var(--mc-accent)]" />
                                <span className="text-[var(--mc-accent)] text-xs">{customer.blowoutsEarned}</span>
                              </div>
                            )}

                            {/* QR link */}
                            <a href={`/scan/${customer.id}`} target="_blank" rel="noopener noreferrer"
                              title="Open scan page"
                              className="w-8 h-8 shrink-0 border border-[#222] flex items-center justify-center text-[#444] hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer">
                              <QrCode size={13} />
                            </a>

                            {/* Joined */}
                            <span className="text-[#444] text-xs shrink-0 hidden lg:block">
                              {new Date(customer.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                            </span>

                            {/* Adjust button */}
                            <button
                              onClick={() => {
                                setAdjustTarget(isOpen ? null : customer.id);
                                setAdjustAmount("");
                                setAdjustMode("add");
                                setAdjustReason("");
                              }}
                              className={`shrink-0 h-8 px-3 border text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                                isOpen
                                  ? "border-[var(--mc-accent)] text-[var(--mc-accent)] bg-[var(--mc-accent)]/10"
                                  : "border-[#222] text-[#555] hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)]"
                              }`}
                            >
                              <Star size={11} /> Adjust
                            </button>
                          </div>

                          {/* Inline adjustment panel */}
                          {isOpen && (
                            <div className="border-t border-[#1a1a1a] bg-[#060606] p-4">
                              <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-3">
                                Adjust Points for {customer.name}
                              </p>
                              <div className="flex flex-wrap items-end gap-3">
                                {/* Add / Subtract toggle */}
                                <div className="flex border border-[#222]">
                                  <button
                                    onClick={() => setAdjustMode("add")}
                                    className={`flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                      adjustMode === "add" ? "bg-green-500/20 text-green-400 border-r border-[#222]" : "text-[#555] border-r border-[#222]"
                                    }`}
                                  >
                                    <Plus size={11} /> Add
                                  </button>
                                  <button
                                    onClick={() => setAdjustMode("subtract")}
                                    className={`flex items-center gap-1 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                      adjustMode === "subtract" ? "bg-red-500/20 text-red-400" : "text-[#555]"
                                    }`}
                                  >
                                    <Minus size={11} /> Deduct
                                  </button>
                                </div>

                                {/* Amount */}
                                <div className="flex flex-col gap-1">
                                  <label className="text-[#444] text-[10px] uppercase tracking-widest">Points</label>
                                  <input
                                    type="number"
                                    min="1"
                                    placeholder="e.g. 100"
                                    value={adjustAmount}
                                    onChange={(e) => setAdjustAmount(e.target.value)}
                                    className="w-28 bg-[#0a0a0a] border border-[#222] text-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors"
                                  />
                                </div>

                                {/* Reason */}
                                <div className="flex flex-col gap-1 flex-1 min-w-40">
                                  <label className="text-[#444] text-[10px] uppercase tracking-widest">Reason (optional)</label>
                                  <input
                                    type="text"
                                    placeholder="Birthday bonus, service adjustment..."
                                    value={adjustReason}
                                    onChange={(e) => setAdjustReason(e.target.value)}
                                    className="w-full bg-[#0a0a0a] border border-[#222] text-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors"
                                  />
                                </div>

                                {/* Apply */}
                                <button
                                  onClick={() => applyPointAdjustment(customer.id)}
                                  disabled={!adjustAmount || adjusting}
                                  className="gold-gradient-bg text-black font-bold px-5 py-2 text-xs uppercase tracking-widest hover:opacity-90 disabled:opacity-40 cursor-pointer flex items-center gap-2 transition-opacity"
                                >
                                  {adjusting ? <Loader size={12} className="animate-spin" /> : <Check size={12} />}
                                  Apply
                                </button>
                                <button
                                  onClick={() => setAdjustTarget(null)}
                                  className="border border-[#222] text-[#555] px-4 py-2 text-xs hover:border-[#444] transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                              </div>

                              {/* Preview */}
                              {adjustAmount && (
                                <p className="text-[#555] text-xs mt-3">
                                  Current: <span className="text-white">{customer.points.toLocaleString()} pts</span>
                                  {" → "}
                                  New:{" "}
                                  <span className={adjustMode === "add" ? "text-green-400" : "text-red-400"}>
                                    {Math.max(0, customer.points + (adjustMode === "add" ? parseInt(adjustAmount || "0") : -parseInt(adjustAmount || "0"))).toLocaleString()} pts
                                  </span>
                                </p>
                              )}

                              {/* Redemption history */}
                              {customer.rewards.length > 0 && (
                                <div className="mt-4 border-t border-[#111] pt-3">
                                  <p className="text-[#444] text-[10px] uppercase tracking-widest mb-2">Redemption History</p>
                                  <div className="space-y-1.5">
                                    {customer.rewards.slice(0, 5).map((r) => (
                                      <div key={r.id} className="flex justify-between text-xs">
                                        <span className="text-[#777]">{r.name}</span>
                                        <span className="text-[var(--mc-accent)]">−{r.pointsCost} pts &nbsp;·&nbsp; {new Date(r.redeemedAt).toLocaleDateString()}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          );
        })()}

        {/* ── SETTINGS ─────────────────────────────────────────────────────── */}
        {tab === "settings" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-white font-semibold text-lg flex items-center gap-2"><Settings size={18} className="text-[var(--mc-accent)]" /> Site Settings</p>
                <p className="text-[#555] text-sm mt-1">Edit business info, hours, and homepage content</p>
              </div>
              {settingsSaved && <span className="text-green-400 text-sm flex items-center gap-1"><Check size={13} /> Saved!</span>}
            </div>

            {/* Sub-tabs */}
            <div className="flex gap-0 mb-8 border-b border-[var(--mc-border)]">
              {(["business", "hours", "hero"] as const).map(s => (
                <button key={s} onClick={() => setSettingsTab(s)}
                  className={`px-6 py-3 text-sm uppercase tracking-widest cursor-pointer border-b-2 -mb-px transition-all ${
                    settingsTab === s ? "border-[var(--mc-accent)] text-[var(--mc-accent)]" : "border-transparent text-[#555] hover:text-[var(--mc-muted)]"
                  }`}>
                  {s === "business" ? "Business Info" : s === "hours" ? "Hours" : "Homepage"}
                </button>
              ))}
            </div>

            {/* Business Info */}
            {settingsTab === "business" && settingsForm && (
              <div className="luxury-card p-7 max-w-2xl">
                <h3 className="text-white font-semibold mb-6 flex items-center gap-2"><Building2 size={16} className="text-[var(--mc-accent)]" /> Business Information</h3>
                <div className="space-y-5">
                  {([
                    { label: "Salon Name",     key: "name",      hint: "Appears in header, email, and meta tags" },
                    { label: "Tagline",        key: "tagline",   hint: "Short description shown under the name" },
                    { label: "Street Address", key: "address",   hint: "Shown on contact page and footer" },
                    { label: "Phone",          key: "phone",     hint: "Clickable tel: link on mobile" },
                    { label: "Email",          key: "email",     hint: "Public-facing contact email" },
                    { label: "Instagram URL",  key: "instagram", hint: "Full URL including https://" },
                    { label: "Facebook URL",   key: "facebook",  hint: "Full URL including https://" },
                  ] as { label: string; key: keyof typeof settingsForm.business; hint: string }[]).map(f => (
                    <div key={f.key}>
                      <label className={labelCls}>{f.label}</label>
                      <input type="text"
                        value={settingsForm.business[f.key] || ""}
                        onChange={e => setSettingsForm(p => p ? ({ ...p, business: { ...p.business, [f.key]: e.target.value } }) : p)}
                        className={inputCls} />
                      <p className="text-[#444] text-xs mt-1">{f.hint}</p>
                    </div>
                  ))}
                  <button onClick={saveSettings} disabled={savingSettings}
                    className="flex items-center gap-2 gold-gradient-bg text-black font-bold px-8 py-3 text-sm uppercase tracking-widest hover:opacity-90 disabled:opacity-50 cursor-pointer transition-opacity mt-2">
                    {savingSettings ? <><Loader size={14} className="animate-spin" /> Saving…</> : <><Save size={14} /> Save Business Info</>}
                  </button>
                </div>
              </div>
            )}

            {/* Hours */}
            {settingsTab === "hours" && settingsForm && (
              <div className="luxury-card p-7 max-w-xl">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2"><Clock size={16} className="text-[var(--mc-accent)]" /> Operating Hours</h3>
                <p className="text-[#555] text-sm mb-6">Use any format: "10:00 AM", "10am", "Closed"</p>
                <div className="space-y-3">
                  {settingsForm.hours.map((h, i) => (
                    <div key={h.day} className="flex items-center gap-3">
                      <span className="text-[var(--mc-muted)] text-sm w-28 shrink-0 font-medium">{h.day}</span>
                      <div className="flex items-center gap-2 flex-1">
                        <input type="text" value={h.open}
                          onChange={e => {
                            const hours = [...settingsForm.hours];
                            hours[i] = { ...hours[i], open: e.target.value };
                            setSettingsForm(p => p ? ({ ...p, hours }) : p);
                          }}
                          placeholder="Open" className={`${inputCls} flex-1`} />
                        <span className="text-[#555] shrink-0">—</span>
                        <input type="text" value={h.close}
                          onChange={e => {
                            const hours = [...settingsForm.hours];
                            hours[i] = { ...hours[i], close: e.target.value };
                            setSettingsForm(p => p ? ({ ...p, hours }) : p);
                          }}
                          placeholder="Close" className={`${inputCls} flex-1`} />
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={saveSettings} disabled={savingSettings}
                  className="mt-6 flex items-center gap-2 gold-gradient-bg text-black font-bold px-8 py-3 text-sm uppercase tracking-widest hover:opacity-90 disabled:opacity-50 cursor-pointer transition-opacity">
                  {savingSettings ? <><Loader size={14} className="animate-spin" /> Saving…</> : <><Save size={14} /> Save Hours</>}
                </button>
              </div>
            )}

            {/* Homepage */}
            {settingsTab === "hero" && settingsForm && (
              <div className="luxury-card p-7 max-w-2xl">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2"><Globe size={16} className="text-[var(--mc-accent)]" /> Homepage Content</h3>
                <p className="text-[#555] text-sm mb-6">Controls the main hero section on the home page</p>
                <div className="space-y-5">
                  <div>
                    <label className={labelCls}>Main Headline</label>
                    <input type="text" value={settingsForm.hero.headline}
                      onChange={e => setSettingsForm(p => p ? ({ ...p, hero: { ...p.hero, headline: e.target.value } }) : p)}
                      className={inputCls} placeholder="e.g. Upper East Side's" />
                    <p className="text-[#444] text-xs mt-1">First line of the hero heading (plain white text)</p>
                  </div>
                  <div>
                    <label className={labelCls}>Headline Accent (Gold Text)</label>
                    <input type="text" value={settingsForm.hero.headlineAccent}
                      onChange={e => setSettingsForm(p => p ? ({ ...p, hero: { ...p.hero, headlineAccent: e.target.value } }) : p)}
                      className={inputCls} placeholder="e.g. Premier Hair Salon" />
                    <p className="text-[#444] text-xs mt-1">Second line rendered in gold gradient</p>
                  </div>
                  <div>
                    <label className={labelCls}>Subheadline</label>
                    <textarea rows={3} value={settingsForm.hero.subheadline}
                      onChange={e => setSettingsForm(p => p ? ({ ...p, hero: { ...p.hero, subheadline: e.target.value } }) : p)}
                      className={`${inputCls} resize-none`} />
                    <p className="text-[#444] text-xs mt-1">Paragraph text below the heading</p>
                  </div>
                  {/* Live preview */}
                  <div className="border border-[var(--mc-border)] p-6 bg-black text-center">
                    <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest mb-2">Preview</p>
                    <h2 className="font-serif text-2xl font-bold text-white">{settingsForm.hero.headline}</h2>
                    <h2 className="font-serif text-2xl font-bold gold-gradient">{settingsForm.hero.headlineAccent}</h2>
                    <p className="text-[var(--mc-muted)] text-sm mt-3 leading-relaxed">{settingsForm.hero.subheadline}</p>
                  </div>
                  <button onClick={saveSettings} disabled={savingSettings}
                    className="flex items-center gap-2 gold-gradient-bg text-black font-bold px-8 py-3 text-sm uppercase tracking-widest hover:opacity-90 disabled:opacity-50 cursor-pointer transition-opacity">
                    {savingSettings ? <><Loader size={14} className="animate-spin" /> Saving…</> : <><Save size={14} /> Save Homepage</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── USERS ────────────────────────────────────────────────────────── */}
        {tab === "users" && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <p className="text-white font-semibold text-lg flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[var(--mc-accent)]" /> Admin Access
                </p>
                <p className="text-[#555] text-sm mt-1">
                  {adminUsers.filter(u => u.isAdmin).length} admin{adminUsers.filter(u => u.isAdmin).length !== 1 ? "s" : ""} · {adminUsers.length} registered users
                </p>
              </div>
            </div>

            {/* Grant by email */}
            <div className="luxury-card p-6 mb-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Plus size={16} className="text-[var(--mc-accent)]" /> Grant Admin by Email
              </h3>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={adminGrantEmail}
                  onChange={e => setAdminGrantEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleAdminGrant(adminGrantEmail)}
                  placeholder="Email address"
                  className={`${inputCls} flex-1`}
                />
                <button
                  onClick={() => handleAdminGrant(adminGrantEmail)}
                  disabled={!adminGrantEmail || adminGrantLoading}
                  className="gold-gradient-bg text-black font-bold px-6 py-2 text-sm uppercase tracking-widest hover:opacity-90 disabled:opacity-40 cursor-pointer shrink-0 transition-opacity"
                >
                  {adminGrantLoading ? "Granting…" : "Grant"}
                </button>
              </div>
              <p className="text-[#444] text-xs mt-2">User must log out and back in for changes to take effect.</p>
            </div>

            {/* Users list */}
            {usersLoading ? (
              <div className="text-center py-20 text-[#555]">Loading…</div>
            ) : adminUsers.length === 0 ? (
              <div className="text-center py-20 luxury-card">
                <Users size={48} className="text-[#333] mx-auto mb-4" />
                <p className="text-[#555]">No registered users yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {[...adminUsers].sort((a, b) => Number(b.isAdmin) - Number(a.isAdmin)).map(user => (
                  <div key={user.id} className={`luxury-card p-4 flex items-center justify-between gap-4 flex-wrap border-l-2 ${user.isAdmin ? "border-l-[var(--mc-accent)]" : "border-l-transparent"}`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <p className="text-white font-semibold text-sm">{user.name}</p>
                        {user.isAdmin && (
                          <span className="text-[10px] px-2 py-0.5 bg-[var(--mc-accent)]/15 border border-[var(--mc-accent)]/30 text-[var(--mc-accent)] uppercase tracking-wider flex items-center gap-1">
                            <ShieldCheck size={10} /> Admin
                          </span>
                        )}
                        {user.isEnvAdmin && (
                          <span className="text-[10px] px-2 py-0.5 border border-[#555]/40 text-[#555] uppercase tracking-wider" title="Set via ADMIN_EMAIL env var">ENV</span>
                        )}
                      </div>
                      <p className="text-[#555] text-xs">{user.email}</p>
                      {user.adminEntry && (
                        <p className="text-[#333] text-[10px] mt-0.5">
                          Added by {user.adminEntry.addedBy} · {new Date(user.adminEntry.addedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {user.isEnvAdmin ? (
                      <span className="text-[#444] text-xs shrink-0">env-protected</span>
                    ) : (
                      <button
                        onClick={() => handleAdminToggle(user.email, user.isAdmin ? "revoke" : "grant")}
                        className={`shrink-0 px-4 py-1.5 border text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer ${
                          user.isAdmin
                            ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                            : "border-green-500/30 text-green-400 hover:bg-green-500/10"
                        }`}
                      >
                        {user.isAdmin ? "Revoke" : "Grant"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
