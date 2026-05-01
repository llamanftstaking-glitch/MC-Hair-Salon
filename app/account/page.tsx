import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getCustomerById, calcTier } from "@/lib/customers";
import { Calendar, Gift, Package, Star, ArrowRight, Clock } from "lucide-react";

const TIER_COLORS: Record<string, string> = {
  Bronze:   "from-[#CD7F32] to-[#A0522D]",
  Silver:   "from-[#C0C0C0] to-[#808080]",
  Gold:     "from-[#FFD700] to-[#C9A84C]",
  Platinum: "from-[#E8E8E8] to-[#A9A9A9]",
};

const TIER_NEXT: Record<string, { next: string; needed: number }> = {
  Bronze:   { next: "Silver",   needed: 400  },
  Silver:   { next: "Gold",     needed: 1000 },
  Gold:     { next: "Platinum", needed: 2000 },
  Platinum: { next: "Platinum", needed: 2000 },
};

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const customer = await getCustomerById(session.id);
  if (!customer) redirect("/login");

  const tier = calcTier(customer.points);
  const { next, needed } = TIER_NEXT[tier];
  const progress = tier === "Platinum" ? 100 : Math.min(100, Math.round((customer.points / needed) * 100));
  const upcoming = customer.appointments.filter(a => a.status === "upcoming").slice(0, 2);
  const recent   = customer.appointments.filter(a => a.status === "completed").slice(0, 3);

  return (
    <div className="min-h-screen bg-[var(--mc-bg)] pt-28 pb-16 px-6">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Welcome */}
        <div>
          <p className="text-[var(--mc-accent)] text-xs uppercase tracking-[0.4em] font-semibold mb-1">My Account</p>
          <h1 className="font-serif text-4xl font-bold text-[var(--mc-text)]">Welcome back, {customer.name.split(" ")[0]}</h1>
        </div>

        {/* Tier card */}
        <div className={`luxury-card p-6 bg-gradient-to-r ${TIER_COLORS[tier]} relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.4) 0%, transparent 60%)" }} />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-black/60 text-xs uppercase tracking-widest font-semibold">{tier} Member</p>
              <p className="text-black text-3xl font-bold font-serif mt-1">{customer.points.toLocaleString()} pts</p>
              <p className="text-black/60 text-sm mt-1">{customer.visits} visits · Member since {new Date(customer.createdAt).getFullYear()}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-black/60 text-xs mb-2">{tier === "Platinum" ? "Max tier reached!" : `${needed - customer.points} pts to ${next}`}</p>
              <div className="w-full sm:w-48 h-2 bg-black/20 rounded-full overflow-hidden">
                <div className="h-full bg-black/60 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick nav */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: "/account/rewards",      icon: Gift,     label: "Rewards",      sub: `${customer.points} pts` },
            { href: "/account/appointments", icon: Calendar, label: "Appointments", sub: `${upcoming.length} upcoming` },
            { href: "/account/packages",     icon: Package,  label: "Packages",     sub: `${customer.packages.length} active` },
            { href: "/book",                 icon: Star,     label: "Book Now",     sub: "Reserve your visit" },
          ].map(({ href, icon: Icon, label, sub }) => (
            <Link key={href} href={href}
              className="luxury-card p-5 flex flex-col gap-3 hover:border-[var(--mc-accent)] group cursor-pointer transition-all">
              <Icon size={20} className="text-[var(--mc-accent)]" />
              <div>
                <p className="text-[var(--mc-text)] font-semibold text-sm">{label}</p>
                <p className="text-[var(--mc-text-dim)] text-xs mt-0.5">{sub}</p>
              </div>
              <ArrowRight size={14} className="text-[var(--mc-text-dim)] group-hover:text-[var(--mc-accent)] transition-colors mt-auto" />
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upcoming appointments */}
          <div className="luxury-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-lg font-bold text-[var(--mc-text)]">Upcoming</h2>
              <Link href="/account/appointments" className="text-[var(--mc-accent)] text-xs uppercase tracking-widest hover:underline cursor-pointer">View all</Link>
            </div>
            {upcoming.length === 0 ? (
              <div className="text-center py-8">
                <Clock size={28} className="text-[var(--mc-text-dim)] mx-auto mb-3" />
                <p className="text-[var(--mc-muted)] text-sm">No upcoming appointments</p>
                <Link href="/book" className="mt-4 inline-block text-[var(--mc-accent)] text-xs uppercase tracking-widest hover:underline cursor-pointer">Book now</Link>
              </div>
            ) : upcoming.map(a => (
              <div key={a.id} className="flex items-center justify-between py-3 border-b border-[var(--mc-border)] last:border-0">
                <div>
                  <p className="text-[var(--mc-text)] text-sm font-semibold">{a.service}</p>
                  <p className="text-[var(--mc-text-dim)] text-xs mt-0.5">{a.date} · {a.time}</p>
                </div>
                <span className="text-[var(--mc-accent)] text-xs border border-[var(--mc-border)] px-2 py-1">{a.stylist}</span>
              </div>
            ))}
          </div>

          {/* Recent visits */}
          <div className="luxury-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-lg font-bold text-[var(--mc-text)]">Recent Visits</h2>
              <Link href="/account/appointments" className="text-[var(--mc-accent)] text-xs uppercase tracking-widest hover:underline cursor-pointer">View all</Link>
            </div>
            {recent.length === 0 ? (
              <div className="text-center py-8">
                <Star size={28} className="text-[var(--mc-text-dim)] mx-auto mb-3" />
                <p className="text-[var(--mc-muted)] text-sm">No visits yet — book your first!</p>
              </div>
            ) : recent.map(a => (
              <div key={a.id} className="flex items-center justify-between py-3 border-b border-[var(--mc-border)] last:border-0">
                <div>
                  <p className="text-[var(--mc-text)] text-sm font-semibold">{a.service}</p>
                  <p className="text-[var(--mc-text-dim)] text-xs mt-0.5">{a.date}</p>
                </div>
                <span className="text-[var(--mc-accent)] text-xs font-semibold">+{a.pointsEarned} pts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
