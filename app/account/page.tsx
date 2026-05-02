"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Gift, Package, Scissors, Star, ChevronRight, Loader } from "lucide-react";

interface Appointment {
  id: string; service: string; stylist: string;
  date: string; time: string; status: string; pointsEarned: number;
}
interface CustomerPackage {
  id: string; name: string; sessionsUsed: number; sessionsTotal: number; expiresAt: string;
}
interface Customer {
  id: string; name: string; email: string; phone: string;
  points: number; visits: number; totalSpent: number;
  tier: string; visitStreak: number; blowoutsEarned: number;
  createdAt: string; appointments: Appointment[]; packages: CustomerPackage[];
}

const TIER_NEXT: Record<string, { next: string; needed: number }> = {
  Bronze:   { next: "Silver",   needed: 400  },
  Silver:   { next: "Gold",     needed: 1000 },
  Gold:     { next: "Platinum", needed: 2000 },
  Platinum: { next: "Platinum", needed: 2000 },
};

const TABS = [
  { id: "overview",     label: "Your Account"  },
  { id: "appointments", label: "Appointments", href: "/account/appointments" },
  { id: "rewards",      label: "Rewards",      href: "/account/rewards"      },
  { id: "packages",     label: "Packages",     href: "/account/packages"     },
  { id: "giftcards",    label: "Gift Cards",   href: "/gift-cards"           },
] as const;

type EditField = "name" | "email" | "phone" | "password" | null;

export default function AccountPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [editField, setEditField] = useState<EditField>(null);
  const [editVal, setEditVal] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => { if (r.status === 401) { router.push("/login"); return null; } return r.json(); })
      .then(d => { if (d) setCustomer(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [router]);

  async function saveEdit() {
    if (!editField || !customer) return;
    setSaving(true);
    setSaveError("");
    const body: Record<string, string> = {};
    if (editField === "password") body.password = editVal;
    else body[editField] = editVal;
    const res = await fetch("/api/auth/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const updated = await res.json();
      setCustomer(c => c ? { ...c, ...updated } : c);
      setEditField(null);
    } else {
      const err = await res.json();
      setSaveError(err.error ?? "Failed to save");
    }
    setSaving(false);
  }

  function startEdit(field: EditField) {
    if (!customer || !field) return;
    setEditField(field);
    setSaveError("");
    if (field === "password") setEditVal("");
    else setEditVal(customer[field] ?? "");
  }

  function cancelEdit() { setEditField(null); setSaveError(""); }

  if (loading) return (
    <div className="min-h-screen bg-[var(--mc-bg)] flex items-center justify-center">
      <Loader size={28} className="animate-spin text-[var(--mc-accent)]" />
    </div>
  );
  if (!customer) return null;

  const { next, needed } = TIER_NEXT[customer.tier] ?? { next: "Platinum", needed: 2000 };
  const progress = customer.tier === "Platinum" ? 100 : Math.min(100, Math.round((customer.points / needed) * 100));
  const upcoming = customer.appointments.filter(a => a.status === "upcoming").slice(0, 3);
  const recent   = customer.appointments.filter(a => a.status === "completed").slice(0, 3);

  return (
    <div className="min-h-screen bg-[var(--mc-bg)] pt-24 pb-16">

      {/* ── Tab bar ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-[var(--mc-border)] px-6">
        <div className="max-w-5xl mx-auto flex gap-0 overflow-x-auto">
          {TABS.map(t => {
            const isActive = t.id === "overview";
            const cls = `px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              isActive
                ? "border-[var(--mc-accent)] text-[var(--mc-accent)]"
                : "border-transparent text-[var(--mc-text-dim)] hover:text-[var(--mc-text)]"
            }`;
            return "href" in t
              ? <Link key={t.id} href={t.href} className={cls}>{t.label}</Link>
              : <button key={t.id} className={cls}>{t.label}</button>;
          })}
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

          {/* ── Left column ─────────────────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Loyalty / rewards card */}
            <div className="luxury-card p-6">
              <h2 className="font-serif text-xl font-bold text-[var(--mc-text)] mb-1">
                Earn rewards with every visit.
              </h2>
              <p className="text-[var(--mc-muted)] text-sm leading-relaxed mb-5 max-w-lg">
                You&apos;re a <span className="text-[var(--mc-accent)] font-semibold">{customer.tier}</span> member
                with <span className="text-[var(--mc-accent)] font-semibold">{customer.points.toLocaleString()} points</span>.
                {customer.tier !== "Platinum"
                  ? ` Earn ${needed - customer.points} more points to reach ${next} status.`
                  : " You've reached our highest tier — thank you!"}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/book"
                  className="gold-gradient-bg text-black text-xs font-bold uppercase tracking-widest px-5 py-2.5 hover:opacity-90 transition-opacity cursor-pointer">
                  Book Your Next Visit
                </Link>
                <Link href="/account/rewards"
                  className="border border-[var(--mc-border)] text-[var(--mc-text)] text-xs font-medium uppercase tracking-widest px-5 py-2.5 hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-colors cursor-pointer">
                  Redeem Rewards
                </Link>
              </div>
            </div>

            {/* Upcoming appointments */}
            <div className="luxury-card overflow-hidden">
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[var(--mc-border)]">
                <div className="flex items-center gap-2 text-[var(--mc-text)] font-semibold text-sm">
                  <Calendar size={16} className="text-[var(--mc-accent)]" />
                  Upcoming Appointments
                </div>
                <Link href="/account/appointments"
                  className="text-[var(--mc-accent)] text-xs flex items-center gap-1 hover:underline cursor-pointer">
                  View all <ChevronRight size={12} />
                </Link>
              </div>
              {upcoming.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <p className="text-[var(--mc-muted)] text-sm">You have no upcoming appointments.</p>
                  <Link href="/book" className="mt-3 inline-block text-[var(--mc-accent)] text-xs uppercase tracking-widest hover:underline cursor-pointer">
                    Book Now →
                  </Link>
                </div>
              ) : upcoming.map((a, i) => (
                <div key={a.id} className={`flex items-center justify-between px-6 py-4 ${i < upcoming.length - 1 ? "border-b border-[var(--mc-border)]" : ""}`}>
                  <div>
                    <p className="text-[var(--mc-text)] text-sm font-medium">{a.service}</p>
                    <p className="text-[var(--mc-text-dim)] text-xs mt-0.5">{a.date} · {a.time} · {a.stylist}</p>
                  </div>
                  <span className="text-xs border border-[var(--mc-accent)]/40 text-[var(--mc-accent)] px-2 py-1">
                    Upcoming
                  </span>
                </div>
              ))}
            </div>

            {/* Recent visits */}
            <div className="luxury-card overflow-hidden">
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[var(--mc-border)]">
                <div className="flex items-center gap-2 text-[var(--mc-text)] font-semibold text-sm">
                  <Star size={16} className="text-[var(--mc-accent)]" />
                  Visit History
                </div>
                <Link href="/account/appointments"
                  className="text-[var(--mc-accent)] text-xs flex items-center gap-1 hover:underline cursor-pointer">
                  View all <ChevronRight size={12} />
                </Link>
              </div>
              {recent.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <p className="text-[var(--mc-muted)] text-sm">No visits under this account yet.</p>
                </div>
              ) : recent.map((a, i) => (
                <div key={a.id} className={`flex items-center justify-between px-6 py-4 ${i < recent.length - 1 ? "border-b border-[var(--mc-border)]" : ""}`}>
                  <div>
                    <p className="text-[var(--mc-text)] text-sm font-medium">{a.service}</p>
                    <p className="text-[var(--mc-text-dim)] text-xs mt-0.5">{a.date}</p>
                  </div>
                  <span className="text-[var(--mc-accent)] text-xs font-semibold">+{a.pointsEarned} pts</span>
                </div>
              ))}
            </div>

            {/* Packages */}
            {customer.packages.length > 0 && (
              <div className="luxury-card overflow-hidden">
                <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[var(--mc-border)]">
                  <div className="flex items-center gap-2 text-[var(--mc-text)] font-semibold text-sm">
                    <Package size={16} className="text-[var(--mc-accent)]" />
                    Active Packages
                  </div>
                  <Link href="/account/packages" className="text-[var(--mc-accent)] text-xs flex items-center gap-1 hover:underline cursor-pointer">
                    View all <ChevronRight size={12} />
                  </Link>
                </div>
                {customer.packages.slice(0, 2).map((p, i) => (
                  <div key={p.id} className={`flex items-center justify-between px-6 py-4 ${i < Math.min(customer.packages.length, 2) - 1 ? "border-b border-[var(--mc-border)]" : ""}`}>
                    <div>
                      <p className="text-[var(--mc-text)] text-sm font-medium">{p.name}</p>
                      <p className="text-[var(--mc-text-dim)] text-xs mt-0.5">{p.sessionsUsed}/{p.sessionsTotal} sessions used · expires {p.expiresAt.slice(0, 10)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Right column ────────────────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Account identity */}
            <div className="luxury-card overflow-hidden">
              <div className="px-6 pt-5 pb-4 border-b border-[var(--mc-border)]">
                <h3 className="text-[var(--mc-text)] font-semibold text-sm">Account Details</h3>
              </div>
              <div className="px-6 pb-2">

                {(["name", "email", "phone", "password"] as const).map((field, idx) => {
                  const labels: Record<string, string> = { name: "Name", email: "Email", phone: "Phone", password: "Password" };
                  const displayVal = field === "password" ? "••••••••" : (customer[field] || "—");
                  const isEditing = editField === field;
                  return (
                    <div key={field} className={`py-4 ${idx < 3 ? "border-b border-[var(--mc-border)]" : ""}`}>
                      <p className="text-[var(--mc-text)] text-xs font-semibold uppercase tracking-wider mb-1">{labels[field]}</p>
                      {isEditing ? (
                        <div className="space-y-2 mt-2">
                          <input
                            type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                            value={editVal}
                            onChange={e => setEditVal(e.target.value)}
                            autoFocus
                            placeholder={field === "password" ? "New password (min 8 chars)" : ""}
                            className="w-full bg-[var(--mc-surface-dark)] border border-[var(--mc-border)] focus:border-[var(--mc-accent)] text-[var(--mc-text)] text-sm px-3 py-2 outline-none transition-colors"
                          />
                          {saveError && <p className="text-red-400 text-xs">{saveError}</p>}
                          <div className="flex gap-2">
                            <button
                              onClick={saveEdit}
                              disabled={saving || !editVal}
                              className="flex-1 gold-gradient-bg text-black text-xs font-bold uppercase tracking-widest py-2 hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer"
                            >
                              {saving ? "Saving…" : "Save"}
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="flex-1 border border-[var(--mc-border)] text-[var(--mc-text-dim)] text-xs uppercase tracking-widest py-2 hover:text-[var(--mc-text)] transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-[var(--mc-muted)] text-sm">{displayVal}</span>
                          <button
                            onClick={() => startEdit(field)}
                            className="text-[var(--mc-accent)] text-xs hover:underline cursor-pointer ml-3 flex-shrink-0"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Member since */}
                <div className="py-4 border-t border-[var(--mc-border)]">
                  <p className="text-[var(--mc-text)] text-xs font-semibold uppercase tracking-wider mb-1">Member Since</p>
                  <span className="text-[var(--mc-muted)] text-sm">{new Date(customer.createdAt).getFullYear()}</span>
                </div>
              </div>
            </div>

            {/* Membership / tier */}
            <div className="luxury-card overflow-hidden">
              <div className="px-6 pt-5 pb-4 border-b border-[var(--mc-border)]">
                <h3 className="text-[var(--mc-text)] font-semibold text-sm">Membership</h3>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold">{customer.tier} Member</p>
                    <p className="text-[var(--mc-text)] font-bold text-2xl font-serif mt-0.5">{customer.points.toLocaleString()} pts</p>
                  </div>
                  <Gift size={22} className="text-[var(--mc-accent)]" />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-[var(--mc-text-dim)] mb-1.5">
                    <span>{customer.tier}</span>
                    <span>{customer.tier === "Platinum" ? "Max" : next}</span>
                  </div>
                  <div className="h-1.5 bg-[var(--mc-border)] rounded-full overflow-hidden">
                    <div className="h-full gold-gradient-bg rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  {customer.tier !== "Platinum" && (
                    <p className="text-[var(--mc-text-dim)] text-xs mt-2">{needed - customer.points} pts to {next}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  {[
                    { label: "Visits",   value: customer.visits },
                    { label: "Streak",   value: `${customer.visitStreak} 🔥` },
                  ].map(s => (
                    <div key={s.label} className="text-center bg-[var(--mc-surface-dark)] py-3 rounded">
                      <p className="text-[var(--mc-accent)] font-bold text-lg">{s.value}</p>
                      <p className="text-[var(--mc-text-dim)] text-xs mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
                <Link href="/account/rewards"
                  className="flex items-center justify-between text-xs text-[var(--mc-text-dim)] hover:text-[var(--mc-accent)] transition-colors cursor-pointer pt-1">
                  <span className="flex items-center gap-1.5"><Scissors size={12} /> View available rewards</span>
                  <ChevronRight size={12} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
