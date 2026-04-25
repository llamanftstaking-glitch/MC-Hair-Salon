import type { Metadata } from "next";
import Link from "next/link";
import {
  Star, Crown, Zap, Check, Gift, Scissors,
  Calendar, UserPlus, Heart, ShoppingBag, QrCode, ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "MC Rewards — Loyalty Program",
  description:
    "Join MC Rewards and earn points on every visit. Bronze, Silver, Gold, and Platinum tiers with exclusive perks. 10 hair services earns a complimentary blowout. Upper East Side NYC.",
  keywords: [
    "hair salon rewards program NYC", "salon loyalty program Upper East Side",
    "MC Rewards", "earn points hair salon", "free blowout loyalty",
    "hair salon membership Manhattan",
  ],
  openGraph: {
    title: "MC Rewards — Loyalty Program | MC Hair Salon & Spa",
    description: "Earn points on every visit. Four exclusive tiers. 10 hair services = free blowout. Join free.",
    url: "https://mchairsalon.com/rewards",
  },
  alternates: { canonical: "https://mchairsalon.com/rewards" },
};

// ── Program data ──────────────────────────────────────────────────────────────

const TIERS = [
  {
    name: "Bronze",
    threshold: "0 pts",
    icon: Star,
    gradient: "from-[#CD7F32] to-[#A0522D]",
    color: "#CD7F32",
    earn: "10 pts / $1",
    perks: [
      "10 points per $1 spent",
      "Birthday bonus: 100 pts",
      "Early access to promotions",
      "Member-only newsletter",
    ],
  },
  {
    name: "Silver",
    threshold: "400 pts",
    icon: Star,
    gradient: "from-[#C0C0C0] to-[#808080]",
    color: "#C0C0C0",
    earn: "12 pts / $1",
    perks: [
      "12 points per $1 spent",
      "Birthday bonus: 200 pts",
      "10% off retail products",
      "Priority booking",
      "Complimentary deep conditioning (1× / year)",
    ],
  },
  {
    name: "Gold",
    threshold: "1,000 pts",
    icon: Crown,
    gradient: "from-[#FFD700] to-[#C9A84C]",
    color: "#C9A84C",
    earn: "15 pts / $1",
    popular: true,
    perks: [
      "15 points per $1 spent",
      "Birthday bonus: 400 pts",
      "15% off retail products",
      "Free blowout (1× / 6 months)",
      "Complimentary scalp treatment (1× / year)",
      "Exclusive Gold member events",
    ],
  },
  {
    name: "Platinum",
    threshold: "2,000 pts",
    icon: Zap,
    gradient: "from-[#E8E8E8] to-[#A9A9A9]",
    color: "#E8E8E8",
    earn: "20 pts / $1",
    perks: [
      "20 points per $1 spent",
      "Birthday bonus: 600 pts",
      "20% off retail products",
      "Free blowout (1× / month)",
      "Complimentary haircut (1× / year)",
      "Dedicated stylist hotline",
      "VIP event invitations",
      "Complimentary champagne service",
    ],
  },
];

const EARN_WAYS = [
  { icon: Scissors,    title: "Every Visit",         desc: "Earn 10–20 points per $1 spent on services, based on your current tier." },
  { icon: Gift,        title: "Hair Punch Card",      desc: "Complete 10 hair services and receive a complimentary blowout — automatically added to your account." },
  { icon: UserPlus,    title: "Refer a Friend",       desc: "Earn 150 bonus points when a friend books their first appointment at MC." },
  { icon: Heart,       title: "Birthday Month",       desc: "Receive a tier-based birthday bonus automatically — up to 600 points just for being you." },
  { icon: ShoppingBag, title: "Product Purchases",    desc: "Earn points on retail purchases made in-salon during your visit." },
  { icon: Calendar,    title: "Online Booking",       desc: "Book online through our website and earn a 25-point bonus on every appointment." },
];

const REDEEMABLE = [
  { name: "Free Scalp Massage",           points: 150,  category: "Spa"      },
  { name: "$20 Off Any Service",          points: 200,  category: "Discount" },
  { name: "Deep Conditioning Treatment",  points: 250,  category: "Services" },
  { name: "Free Blowout",                 points: 300,  category: "Services" },
  { name: "$50 Off Any Service",          points: 450,  category: "Discount" },
  { name: "Free Eyelash Touch-Up",        points: 400,  category: "Spa"      },
  { name: "Complimentary Haircut",        points: 600,  category: "Services" },
  { name: "$100 Gift Card",               points: 900,  category: "Gift"     },
];

const CATEGORY_COLOR: Record<string, string> = {
  Spa:      "text-purple-400  border-purple-400/30  bg-purple-400/10",
  Discount: "text-green-400   border-green-400/30   bg-green-400/10",
  Services: "text-[var(--mc-accent)] border-[var(--mc-accent)]/30 bg-[var(--mc-accent)]/10",
  Gift:     "text-blue-400    border-blue-400/30    bg-blue-400/10",
};

export default function RewardsPage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-28 sm:pt-40 pb-20 px-6 bg-black text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10"
            style={{ background: "radial-gradient(ellipse, #B8860B 0%, transparent 70%)" }} />
        </div>

        <div className="relative">
          <p className="text-[var(--mc-accent)] uppercase tracking-[0.5em] text-xs font-semibold mb-5">
            Loyalty Program
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            MC <span className="gold-gradient">Rewards</span>
          </h1>
          <p className="text-[var(--mc-muted)] max-w-xl mx-auto text-base leading-relaxed mb-10">
            Every visit counts. Earn points on every service, climb through four exclusive tiers,
            and unlock rewards that celebrate your loyalty.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup"
              className="gold-gradient-bg text-black font-bold px-10 py-4 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity cursor-pointer">
              Join Free — It&apos;s Instant
            </Link>
            <Link href="/login"
              className="border border-[#333] text-[var(--mc-muted)] px-10 py-4 uppercase tracking-widest text-sm hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-colors cursor-pointer">
              Sign In to My Account
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it works — 3 steps ─────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#040404] border-t border-[#111]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">Simple by Design</p>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01", icon: <UserPlus size={28} className="text-[var(--mc-accent)]" />,
                title: "Join Free",
                desc: "Create your MC account in seconds at mchairsalon.com. No card required. You start earning immediately.",
              },
              {
                step: "02", icon: <Scissors size={28} className="text-[var(--mc-accent)]" />,
                title: "Earn on Every Visit",
                desc: "Every dollar spent on services earns points. Show your QR code at the start of each visit so your stylist can record it.",
              },
              {
                step: "03", icon: <Gift size={28} className="text-[var(--mc-accent)]" />,
                title: "Redeem Rewards",
                desc: "Trade your points for free services, discounts, and gift cards — directly from your account dashboard.",
              },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="luxury-card p-8 relative overflow-hidden">
                <span className="absolute top-4 right-5 font-serif text-6xl font-bold text-[#0d0d0d] select-none">
                  {step}
                </span>
                <div className="mb-5">{icon}</div>
                <h3 className="font-serif text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-[var(--mc-muted)] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Punch Card ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-black border-t border-[#111]">
        <div className="max-w-4xl mx-auto">
          <div className="luxury-card overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left — description */}
              <div className="p-8 sm:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 border border-[var(--mc-accent)]/40 flex items-center justify-center">
                    <Scissors size={18} className="text-[var(--mc-accent)]" />
                  </div>
                  <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold">
                    Hair Service Punch Card
                  </p>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                  10 Visits.<br />1 Free Blowout.
                </h2>
                <p className="text-[var(--mc-muted)] text-sm leading-relaxed mb-6">
                  Every hair service — cuts, color, blowouts, balayage — earns one punch on your card.
                  Complete 10 and we&apos;ll add a complimentary blowout to your account, automatically.
                  No redemption codes. No expiry. Just show up.
                </p>
                <ul className="space-y-2.5 text-sm text-[var(--mc-muted)]">
                  {[
                    "Applies to all hair services (not spa or makeup)",
                    "Punch card resets after each free blowout earned",
                    "Tracked digitally — visible in your account",
                    "Staff scan your QR code at each visit",
                  ].map(item => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check size={14} className="text-[var(--mc-accent)] mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right — visual punch card */}
              <div className="bg-[#080808] border-l border-[#1a1a1a] p-8 sm:p-10 flex flex-col items-center justify-center">
                <p className="text-[#444] text-[10px] uppercase tracking-widest mb-6">Your Punch Card</p>
                <div className="grid grid-cols-5 gap-3 mb-4">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                      i < 7
                        ? "bg-[var(--mc-accent)] border-[var(--mc-accent)]"
                        : "border-[#2a2a2a]"
                    }`}>
                      {i < 7
                        ? <Check size={14} strokeWidth={3} className="text-black" />
                        : <span className="text-[#333] text-xs font-bold">{i + 1}</span>
                      }
                    </div>
                  ))}
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-[var(--mc-accent)] bg-[var(--mc-accent)]/10 flex items-center justify-center mt-1">
                  <Gift size={16} className="text-[var(--mc-accent)]" />
                </div>
                <p className="text-[#555] text-xs text-center mt-4">
                  Example: 7/10 visits completed<br />3 more for a free blowout
                </p>

                <div className="mt-6 border border-[var(--mc-accent)]/20 bg-[var(--mc-accent)]/5 px-4 py-3 flex items-center gap-2.5 w-full">
                  <QrCode size={16} className="text-[var(--mc-accent)] shrink-0" />
                  <p className="text-[var(--mc-muted)] text-xs">
                    Your account QR code is in <strong className="text-white">My Account → Rewards</strong>. Show it to your stylist at check-in.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Membership Tiers ───────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#040404] border-t border-[#111]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">Membership Tiers</p>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">The More You Visit,<br />The More You Earn</h2>
            <p className="text-[var(--mc-muted)] max-w-xl mx-auto text-sm leading-relaxed">
              Four tiers, each with its own multiplier and exclusive perks. Tier upgrades happen automatically
              as your points accumulate.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TIERS.map((tier) => {
              const Icon = tier.icon;
              return (
                <div key={tier.name} className={`luxury-card overflow-hidden relative ${tier.popular ? "ring-1 ring-[var(--mc-accent)]" : ""}`}>
                  {tier.popular && (
                    <div className="absolute top-0 left-0 right-0 text-center py-1 bg-[var(--mc-accent)] text-black text-[10px] font-bold uppercase tracking-widest">
                      Most Popular
                    </div>
                  )}
                  <div className={`bg-gradient-to-b ${tier.gradient} p-6 ${tier.popular ? "pt-8" : ""}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-black font-serif text-2xl font-bold">{tier.name}</p>
                        <p className="text-black/60 text-xs mt-0.5">{tier.threshold}</p>
                      </div>
                      <Icon size={22} className="text-black/50" />
                    </div>
                    <div className="mt-3 bg-black/15 px-3 py-1.5 inline-block">
                      <p className="text-black text-xs font-bold uppercase tracking-wider">{tier.earn}</p>
                    </div>
                  </div>
                  <div className="p-5 space-y-2.5">
                    {tier.perks.map(perk => (
                      <div key={perk} className="flex items-start gap-2">
                        <Check size={12} className="mt-0.5 shrink-0" style={{ color: tier.color }} />
                        <p className="text-[var(--mc-muted)] text-xs leading-relaxed">{perk}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[#333] text-xs text-center mt-8">
            Tier status is calculated from your lifetime points balance and reviewed monthly.
          </p>
        </div>
      </section>

      {/* ── Ways to Earn ───────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-black border-t border-[#111]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">Earn Points</p>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white">Every Moment Counts</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {EARN_WAYS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="luxury-card p-6 flex gap-4">
                <div className="w-10 h-10 border border-[var(--mc-accent)]/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={16} className="text-[var(--mc-accent)]" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm mb-1.5">{title}</p>
                  <p className="text-[var(--mc-muted)] text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Rewards Catalog ────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#040404] border-t border-[#111]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">Redeem</p>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">Rewards Catalog</h2>
            <p className="text-[var(--mc-muted)] text-sm max-w-lg mx-auto">
              Redeem your points at any time from your account dashboard.
              Rewards never expire as long as your account is active.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REDEEMABLE.map((reward) => (
              <div key={reward.name} className="luxury-card p-5 flex flex-col justify-between gap-4 hover:border-[var(--mc-accent)] transition-colors">
                <div>
                  <span className={`text-[10px] border uppercase tracking-widest px-2 py-0.5 ${CATEGORY_COLOR[reward.category]}`}>
                    {reward.category}
                  </span>
                  <p className="text-white font-semibold text-sm mt-3 leading-snug">{reward.name}</p>
                </div>
                <p className="font-serif text-xl font-bold text-[var(--mc-accent)]">
                  {reward.points.toLocaleString()} pts
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QR + How to Use at Salon ───────────────────────────────────────── */}
      <section className="py-20 px-6 bg-black border-t border-[#111]">
        <div className="max-w-4xl mx-auto">
          <div className="luxury-card p-8 sm:p-12">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">At the Salon</p>
                <h2 className="font-serif text-3xl font-bold text-white mb-5">Using Your QR Code</h2>
                <div className="space-y-5">
                  {[
                    { n: "1", t: "Open Your Account", d: "Log in to mchairsalon.com and go to My Account → Rewards." },
                    { n: "2", t: "Show Your QR Code", d: "Your unique loyalty QR code is displayed on your rewards page. Show it to your stylist at the start of every visit." },
                    { n: "3", t: "Stylist Scans It", d: "Your stylist scans your QR code on the salon device. Your points and punch card update instantly." },
                    { n: "4", t: "Watch Your Rewards Grow", d: "Check your balance anytime in My Account. Rewards are added automatically — no manual claiming." },
                  ].map(({ n, t, d }) => (
                    <div key={n} className="flex gap-4">
                      <div className="w-7 h-7 rounded-full gold-gradient-bg flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-black text-xs font-bold">{n}</span>
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{t}</p>
                        <p className="text-[var(--mc-muted)] text-xs mt-1 leading-relaxed">{d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 border border-[var(--mc-accent)]/30 bg-[#080808] flex items-center justify-center mb-5">
                  <QrCode size={56} className="text-[var(--mc-accent)]" />
                </div>
                <p className="text-white font-semibold mb-2">Your QR is in your account</p>
                <p className="text-[var(--mc-muted)] text-xs leading-relaxed mb-6 max-w-xs">
                  Unique to your loyalty account. Can&apos;t be transferred or shared.
                </p>
                <Link href="/account/rewards"
                  className="gold-gradient-bg text-black font-bold px-8 py-3 text-xs uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer">
                  View My QR Code
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-[#040404] border-t border-[#111]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl font-bold text-white">Common Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                q: "Is it free to join?",
                a: "Yes. Creating an MC account and enrolling in the rewards program is completely free. You start earning points from your very first visit.",
              },
              {
                q: "When do my points update?",
                a: "Points are added to your account at the end of each visit when your stylist scans your QR code or records your service in the system.",
              },
              {
                q: "Do points expire?",
                a: "Points do not expire as long as your account has had at least one activity (visit, redemption, or login) in the past 12 months.",
              },
              {
                q: "How does the punch card work if I forgot to show my QR code?",
                a: "Let the front desk know before you leave. Staff can look up your account by name or email and record the visit manually.",
              },
              {
                q: "Can I redeem a reward and use my punch card blowout on the same day?",
                a: "Yes. Redeemable rewards and punch card blowouts are separate benefits and can be used independently.",
              },
              {
                q: "What counts as a \"hair service\" for the punch card?",
                a: "Cuts, color, blowouts, highlights, balayage, treatments, and updos all count. Spa services (facials, lashes) and makeup appointments do not count toward the punch card.",
              },
            ].map(({ q, a }) => (
              <details key={q} className="group luxury-card overflow-hidden">
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <span className="text-white font-semibold text-sm pr-4">{q}</span>
                  <ChevronRight size={16} className="text-[var(--mc-accent)] shrink-0 transition-transform group-open:rotate-90" />
                </summary>
                <div className="px-5 pb-5 text-[var(--mc-muted)] text-sm leading-relaxed border-t border-[#1a1a1a] pt-4">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-black border-t border-[#111] text-center">
        <div className="max-w-xl mx-auto">
          <div className="w-16 h-px bg-[var(--mc-accent)] mx-auto mb-8 opacity-50" />
          <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">Ready to Start?</p>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-6">
            Join MC Rewards Today
          </h2>
          <p className="text-[var(--mc-muted)] text-sm leading-relaxed mb-10">
            Create your free account, earn points from your very first visit,
            and enjoy exclusive perks as a member of the MC family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup"
              className="gold-gradient-bg text-black font-bold px-12 py-4 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity cursor-pointer">
              Create Free Account
            </Link>
            <Link href="/terms#rewards"
              className="border border-[#333] text-[var(--mc-muted)] px-12 py-4 uppercase tracking-widest text-sm hover:border-[#555] transition-colors cursor-pointer">
              Program Terms
            </Link>
          </div>
          <p className="text-[#333] text-xs mt-8">
            Already a member?{" "}
            <Link href="/login" className="text-[var(--mc-accent)] hover:underline cursor-pointer">Sign in to your account →</Link>
          </p>
          <div className="w-16 h-px bg-[var(--mc-accent)] mx-auto mt-8 opacity-50" />
        </div>
      </section>
    </>
  );
}
