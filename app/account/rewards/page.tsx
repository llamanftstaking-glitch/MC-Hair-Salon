import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth";
import { getCustomerById, calcTier } from "@/lib/customers";
import { Gift, Star, Crown, Zap, Check, Lock, Calendar, Scissors, QrCode } from "lucide-react";

// ── TIER CONFIG (update with client details) ─────────────────────────────────
const TIERS = [
  {
    name: "Bronze",
    icon: Star,
    points: 0,
    color: "#CD7F32",
    gradient: "from-[#CD7F32] to-[#A0522D]",
    perks: [
      "10 points per $1 spent",
      "Birthday bonus: 100 pts",
      "Early access to promotions",
      "Member-only newsletter",
    ],
  },
  {
    name: "Silver",
    icon: Star,
    points: 400,
    color: "#C0C0C0",
    gradient: "from-[#C0C0C0] to-[#808080]",
    perks: [
      "12 points per $1 spent",
      "Birthday bonus: 200 pts",
      "10% off retail products",
      "Priority booking",
      "Complimentary deep conditioning (1x/year)",
    ],
  },
  {
    name: "Gold",
    icon: Crown,
    points: 1000,
    color: "#C9A84C",
    gradient: "from-[#FFD700] to-[#C9A84C]",
    perks: [
      "15 points per $1 spent",
      "Birthday bonus: 400 pts",
      "15% off retail products",
      "Free blowout (1x every 6 months)",
      "Complimentary scalp treatment (1x/year)",
      "Exclusive Gold member events",
    ],
  },
  {
    name: "Platinum",
    icon: Zap,
    points: 2000,
    color: "#E8E8E8",
    gradient: "from-[#E8E8E8] to-[#A9A9A9]",
    perks: [
      "20 points per $1 spent",
      "Birthday bonus: 600 pts",
      "20% off retail products",
      "Free blowout (1x/month)",
      "Complimentary haircut (1x/year)",
      "Dedicated stylist line",
      "VIP event invitations",
      "Complimentary champagne service",
    ],
  },
];

// ── REDEEMABLE REWARDS (update with client details) ──────────────────────────
const REWARDS = [
  { name: "Free Blowout",              points: 300,  category: "Services",  available: true  },
  { name: "$20 Off Any Service",       points: 200,  category: "Discount",  available: true  },
  { name: "$50 Off Any Service",       points: 450,  category: "Discount",  available: true  },
  { name: "Deep Conditioning Treatment", points: 250, category: "Services", available: true  },
  { name: "Free Scalp Massage",        points: 150,  category: "Spa",       available: true  },
  { name: "Free Eyelash Touch-Up",     points: 400,  category: "Spa",       available: true  },
  { name: "Complimentary Haircut",     points: 600,  category: "Services",  available: true  },
  { name: "$100 Gift Card",            points: 900,  category: "Gift",      available: true  },
];

const TIER_ORDER = ["Bronze", "Silver", "Gold", "Platinum"];

export default async function RewardsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const customer = await getCustomerById(session.id);
  if (!customer) redirect("/login");

  const tier = calcTier(customer.points);
  const tierIdx = TIER_ORDER.indexOf(tier);
  const nextTier = TIERS[Math.min(tierIdx + 1, TIERS.length - 1)];
  const ptsToNext = tier === "Platinum" ? 0 : nextTier.points - customer.points;
  const progress = tier === "Platinum" ? 100 : Math.min(100, Math.round(((customer.points - TIERS[tierIdx].points) / (nextTier.points - TIERS[tierIdx].points)) * 100));

  return (
    <div className="min-h-screen bg-[var(--mc-bg)] pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto space-y-14">

        {/* Header */}
        <div>
          <Link href="/account" className="text-[var(--mc-text-dim)] text-xs uppercase tracking-widest hover:text-[var(--mc-accent)] transition-colors cursor-pointer">← My Account</Link>
          <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mt-4 mb-2">MC Rewards</p>
          <h1 className="font-serif text-5xl font-bold text-[var(--mc-text)]">Your Rewards</h1>
        </div>

        {/* Points card */}
        <div className="luxury-card overflow-hidden">
          <div className={`bg-gradient-to-r ${TIERS[tierIdx].gradient} p-8 relative`}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.5) 0%, transparent 60%)" }} />
            <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <p className="text-black/60 text-xs uppercase tracking-[0.3em] font-semibold">{tier} Member</p>
                <p className="font-serif text-6xl font-bold text-black mt-2">{customer.points.toLocaleString()}</p>
                <p className="text-black/60 text-sm mt-1">points available</p>
              </div>
              <div className="sm:text-right">
                <p className="text-black/70 text-sm font-semibold">{customer.visits} total visits</p>
                <p className="text-black/60 text-xs mt-1">Member since {new Date(customer.createdAt).getFullYear()}</p>
              </div>
            </div>

            {tier !== "Platinum" && (
              <div className="relative mt-6">
                <div className="flex justify-between text-black/60 text-xs mb-2">
                  <span>{tier}</span>
                  <span>{ptsToNext} pts to {nextTier.name}</span>
                </div>
                <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                  <div className="h-full bg-black/50 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 divide-x divide-[var(--mc-border)]">
            {[
              { label: "Points Earned",  value: customer.points.toLocaleString() },
              { label: "Total Visits",   value: customer.visits },
              { label: "Rewards Redeemed", value: customer.rewards.length },
            ].map(({ label, value }) => (
              <div key={label} className="p-5 text-center">
                <p className="font-serif text-2xl font-bold text-[var(--mc-text)]">{value}</p>
                <p className="text-[var(--mc-text-dim)] text-xs uppercase tracking-widest mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Punch Card ──────────────────────────────────────────────────────── */}
        <div className="luxury-card overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-1 flex items-center gap-2">
                  <Scissors size={13} /> Hair Service Punch Card
                </p>
                <h2 className="font-serif text-2xl font-bold text-[var(--mc-text)]">
                  10 Visits = Free Blowout
                </h2>
                <p className="text-[var(--mc-muted)] text-sm mt-1">
                  Every hair service earns one punch. Collect 10 for a complimentary blowout — on us.
                </p>
              </div>
              {(customer.blowoutsEarned ?? 0) > 0 && (
                <div className="shrink-0 text-center border border-[var(--mc-accent)]/30 bg-[var(--mc-accent)]/5 px-4 py-3">
                  <p className="font-serif text-2xl font-bold text-[var(--mc-accent)]">{customer.blowoutsEarned}</p>
                  <p className="text-[var(--mc-text-dim)] text-[10px] uppercase tracking-widest mt-0.5">Earned</p>
                </div>
              )}
            </div>

            {/* 10 punch circles */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
              {Array.from({ length: 10 }).map((_, i) => {
                const filled = i < (customer.visitStreak ?? 0);
                return (
                  <div key={i} className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                    filled ? "bg-[var(--mc-accent)] border-[var(--mc-accent)]" : "border-[var(--mc-border)]"
                  }`}>
                    {filled
                      ? <Check size={16} strokeWidth={3} className="text-black" />
                      : <span className="text-[var(--mc-text-dim)] text-xs font-bold">{i + 1}</span>
                    }
                  </div>
                );
              })}
              {/* Reward circle */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[var(--mc-accent)]/50 bg-[var(--mc-accent)]/5 flex items-center justify-center">
                <Gift size={16} className="text-[var(--mc-accent)]" />
              </div>
            </div>

            {(customer.visitStreak ?? 0) === 9 ? (
              <p className="text-[var(--mc-accent)] text-sm font-semibold">
                ⚡ One more hair service unlocks your free blowout!
              </p>
            ) : (
              <p className="text-[var(--mc-muted)] text-sm">
                <span className="text-[var(--mc-text)] font-semibold">{customer.visitStreak ?? 0}/10</span> hair services completed
                &nbsp;·&nbsp; {10 - (customer.visitStreak ?? 0)} more for your next free blowout
              </p>
            )}
          </div>

          {/* QR code section */}
          <div className="border-t border-[var(--mc-border)] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="shrink-0">
              {/* QR code rendered via API */}
              <div className="w-32 h-32 border border-[var(--mc-border)] overflow-hidden bg-white">
                <Image
                  src={`/api/qr/${customer.id}`}
                  alt="My loyalty QR code"
                  width={128}
                  height={128}
                  className="w-full h-full"
                  unoptimized
                />
              </div>
            </div>
            <div>
              <p className="text-[var(--mc-text)] font-semibold flex items-center gap-2 mb-2">
                <QrCode size={16} className="text-[var(--mc-accent)]" /> Your Loyalty QR Code
              </p>
              <p className="text-[var(--mc-muted)] text-sm leading-relaxed">
                Show this QR code to your stylist at the start of every visit. They&apos;ll scan it to record your service and keep your punch card up to date.
              </p>
              <p className="text-[var(--mc-text-dim)] text-xs mt-2 uppercase tracking-wider">
                Unique to your account · Cannot be transferred
              </p>
            </div>
          </div>
        </div>

        {/* Redeem rewards */}
        <div>
          <h2 className="font-serif text-3xl font-bold text-[var(--mc-text)] mb-2">Redeem Rewards</h2>
          <p className="text-[var(--mc-muted)] text-sm mb-8">Use your points on services, discounts, and more.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {REWARDS.map((reward) => {
              const canRedeem = customer.points >= reward.points;
              return (
                <div key={reward.name}
                  className={`luxury-card p-6 flex flex-col justify-between gap-4 transition-all ${canRedeem ? "hover:border-[var(--mc-accent)]" : "opacity-60"}`}>
                  <div>
                    <span className="text-[var(--mc-accent)] text-[10px] uppercase tracking-widest border border-[var(--mc-border)] px-2 py-0.5">
                      {reward.category}
                    </span>
                    <p className="text-[var(--mc-text)] font-semibold mt-3">{reward.name}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-serif text-xl font-bold text-[var(--mc-accent)]">{reward.points.toLocaleString()} pts</p>
                    <button
                      disabled={!canRedeem}
                      className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${
                        canRedeem
                          ? "gold-gradient-bg text-black hover:opacity-90"
                          : "border border-[var(--mc-border)] text-[var(--mc-text-dim)] cursor-not-allowed"
                      }`}
                    >
                      {canRedeem ? <><Check size={12} /> Redeem</> : <><Lock size={12} /> {reward.points - customer.points} more</>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tier breakdown */}
        <div>
          <h2 className="font-serif text-3xl font-bold text-[var(--mc-text)] mb-2">Membership Tiers</h2>
          <p className="text-[var(--mc-muted)] text-sm mb-8">Earn more points, unlock bigger perks.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TIERS.map((t, i) => {
              const isCurrentTier = t.name === tier;
              const isUnlocked = tierIdx >= i;
              return (
                <div key={t.name}
                  className={`luxury-card overflow-hidden transition-all ${isCurrentTier ? "border-[var(--mc-accent)]" : ""}`}>
                  <div className={`bg-gradient-to-b ${t.gradient} p-5 flex items-center justify-between`}>
                    <div>
                      <p className="text-black font-serif text-xl font-bold">{t.name}</p>
                      <p className="text-black/60 text-xs mt-0.5">{t.points === 0 ? "Starting tier" : `${t.points.toLocaleString()}+ pts`}</p>
                    </div>
                    <t.icon size={22} className="text-black/60" />
                  </div>
                  <div className="p-5 space-y-2.5">
                    {t.perks.map((perk) => (
                      <div key={perk} className="flex items-start gap-2">
                        <Check size={12} className={`mt-0.5 shrink-0 ${isUnlocked ? "text-[var(--mc-accent)]" : "text-[var(--mc-text-dim)]"}`} />
                        <p className={`text-xs leading-relaxed ${isUnlocked ? "text-[var(--mc-text)]" : "text-[var(--mc-text-dim)]"}`}>{perk}</p>
                      </div>
                    ))}
                  </div>
                  {isCurrentTier && (
                    <div className="px-5 pb-4">
                      <div className="text-center border border-[var(--mc-accent)] py-1.5">
                        <p className="text-[var(--mc-accent)] text-[10px] uppercase tracking-widest font-semibold">Current Tier</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* How to earn */}
        <div className="luxury-card p-8">
          <h2 className="font-serif text-2xl font-bold text-[var(--mc-text)] mb-6">How to Earn Points</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { icon: Gift,     title: "Every Visit",    desc: "Earn 10–20 points per $1 spent on services, based on your tier." },
              { icon: Star,     title: "Refer a Friend", desc: "Get 150 bonus points when a friend books their first appointment." },
              { icon: Crown,    title: "Birthday Month", desc: "Receive bonus points automatically during your birthday month." },
              { icon: Zap,      title: "Product Purchase", desc: "Earn points on retail purchases made in-salon." },
              { icon: Check,    title: "Complete Profile", desc: "Earn 50 points for completing your client profile." },
              { icon: Calendar, title: "Online Booking",  desc: "Earn a 25-point bonus every time you book online." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <div className="w-9 h-9 border border-[var(--mc-accent)] flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={15} className="text-[var(--mc-accent)]" />
                </div>
                <div>
                  <p className="text-[var(--mc-text)] font-semibold text-sm">{title}</p>
                  <p className="text-[var(--mc-text-dim)] text-xs mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
