"use client";
import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, Loader, ChevronRight, Star, Plus, Minus } from "lucide-react";
import { PACKAGES } from "@/lib/data";

export default function PackagesPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [guestCounts, setGuestCounts] = useState<Record<string, number>>(() => {
    const defaults: Record<string, number> = {};
    PACKAGES.forEach(p => { if (p.baseGuests) defaults[p.id] = p.baseGuests; });
    return defaults;
  });

  function adjustGuests(packageId: string, delta: number) {
    setGuestCounts(prev => ({ ...prev, [packageId]: Math.max(1, (prev[packageId] ?? 1) + delta) }));
  }

  async function handleBuy(packageId: string) {
    setLoading(packageId);
    setError("");
    try {
      const meRes = await fetch("/api/auth/me");
      const me = meRes.ok ? await meRes.json() : null;

      const pkg = PACKAGES.find(p => p.id === packageId);
      const guestCount = pkg?.baseGuests ? guestCounts[packageId] : undefined;

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "package",
          packageId,
          guestCount,
          customerId: me?.id ?? "",
          customerEmail: me?.email ?? "",
          customerName: me?.name ?? "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(null);
    }
  }

  return (
    <>
      {/* ── Hero ── */}
      <section className="pt-28 sm:pt-36 pb-16 px-6 bg-black text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(184,134,11,0.14) 0%, transparent 70%)" }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">Save & Elevate</p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">Service Packages</h1>
          <div className="mx-auto h-px w-20 bg-gradient-to-r from-transparent via-[var(--mc-accent)] to-transparent mb-6" />
          <p className="text-[var(--mc-muted)] text-lg leading-relaxed max-w-xl mx-auto">
            Curated bundles at exclusive member pricing. Pre-purchase your favorite services and save — packages are tracked in your account and never expire before their validity period.
          </p>
          {/* Benefits strip */}
          <div className="flex flex-wrap justify-center gap-6 mt-10">
            {["Instant savings", "Tracked in your account", "Use anytime", "Transferable to a friend"].map(b => (
              <div key={b} className="flex items-center gap-2 text-sm text-[var(--mc-text-dim)]">
                <Check size={14} className="text-[var(--mc-accent)]" />
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Packages Grid ── */}
      <section className="py-16 px-6 bg-[var(--mc-bg)]">
        <div className="max-w-7xl mx-auto">
          {error && <p className="text-red-400 text-sm text-center mb-8">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {PACKAGES.map(pkg => {
              const isGuest = !!pkg.baseGuests && !!pkg.pricePerGuest;
              const guestCount = isGuest ? (guestCounts[pkg.id] ?? pkg.baseGuests!) : null;
              const displayPrice = isGuest ? pkg.pricePerGuest! * guestCount! : pkg.price;
              const displayOriginal = isGuest ? Math.round(pkg.originalValue / pkg.baseGuests!) * guestCount! : pkg.originalValue;
              const savePct = Math.round(((displayOriginal - displayPrice) / displayOriginal) * 100);
              const isLoading = loading === pkg.id;
              return (
                <div key={pkg.id}
                  className={`luxury-card flex flex-col relative overflow-hidden transition-all duration-300 hover:-translate-y-1 ${pkg.badge ? "ring-1 ring-[var(--mc-accent)]/40" : ""}`}>

                  {/* Badge */}
                  {pkg.badge && (
                    <div className="absolute top-0 right-0">
                      <div className="gold-gradient-bg text-black text-[10px] font-bold px-4 py-1.5 uppercase tracking-widest">
                        {pkg.badge}
                      </div>
                    </div>
                  )}

                  <div className="p-7 flex flex-col flex-1">
                    {/* Save badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-green-400 border border-green-400/30 bg-green-400/10 px-2 py-1">
                        Save {savePct}%
                      </span>
                      <span className="text-[#555] text-xs">{pkg.validityDays === 365 ? "1-year validity" : `${pkg.validityDays / 30}-month validity`}</span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[var(--mc-text)] mb-1">{pkg.name}</h3>
                    <p className="text-[var(--mc-text-dim)] text-sm mb-5">{pkg.tagline}</p>

                    {/* Services list */}
                    <div className="space-y-2 mb-6 flex-1">
                      {pkg.services.map(s => (
                        <div key={s} className="flex gap-2 items-start text-sm">
                          <ChevronRight size={13} className="text-[var(--mc-accent)] shrink-0 mt-0.5" />
                          <span className="text-[var(--mc-muted)]">{s}</span>
                        </div>
                      ))}
                    </div>

                    {/* Guest count stepper */}
                    {isGuest && (
                      <div className="mb-5 pb-5 border-b border-[var(--mc-border)]">
                        <p className="text-[var(--mc-accent)] text-[10px] uppercase tracking-widest font-semibold mb-3">Number of Guests</p>
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => adjustGuests(pkg.id, -1)}
                            disabled={guestCount! <= 1}
                            className="w-9 h-9 border border-[var(--mc-border)] flex items-center justify-center text-[var(--mc-muted)] hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-serif text-2xl font-bold gold-gradient w-8 text-center">{guestCount}</span>
                          <button
                            onClick={() => adjustGuests(pkg.id, 1)}
                            className="w-9 h-9 border border-[var(--mc-border)] flex items-center justify-center text-[var(--mc-muted)] hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-colors cursor-pointer"
                          >
                            <Plus size={14} />
                          </button>
                          <span className="text-[#555] text-xs">guests</span>
                        </div>
                      </div>
                    )}

                    {/* Highlight */}
                    {!isGuest && (
                      <p className="text-[var(--mc-accent)] text-xs mb-5 pb-5 border-b border-[var(--mc-border)]">
                        {pkg.highlight}
                      </p>
                    )}

                    {/* Pricing */}
                    <div className="flex items-end justify-between mb-5">
                      <div>
                        <p className="font-serif text-3xl font-bold gold-gradient">${displayPrice}</p>
                        <p className="text-[#555] text-xs line-through mt-0.5">Value ${displayOriginal}</p>
                      </div>
                      <div className="text-right">
                        {isGuest ? (
                          <>
                            <p className="text-[var(--mc-accent)] text-sm font-semibold">${pkg.pricePerGuest}/guest</p>
                            <p className="text-[#555] text-xs">{guestCount} guest{guestCount! > 1 ? "s" : ""}</p>
                          </>
                        ) : (
                          <>
                            <p className="text-[var(--mc-accent)] text-sm font-semibold">{pkg.sessions} sessions</p>
                            <p className="text-[#555] text-xs">${Math.round(pkg.price / pkg.sessions)}/each</p>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleBuy(pkg.id)}
                      disabled={isLoading || !!loading}
                      className="w-full gold-gradient-bg text-black font-bold py-3.5 uppercase tracking-widest text-xs hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
                      {isLoading
                        ? <><Loader size={14} className="animate-spin" /> Processing...</>
                        : <><Sparkles size={14} /> Buy Package</>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How Packages Work ── */}
      <section className="py-16 px-6 bg-[var(--mc-surface-dark)]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-[var(--mc-text)]">How Packages Work</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { n: "01", title: "Purchase Online", body: "Securely check out with Stripe. Your package is instantly credited to your account." },
              { n: "02", title: "Book Anytime", body: "Call, book online, or walk in. Just let us know you're using your package — we'll check you in." },
              { n: "03", title: "Track Progress", body: "Log in to your account to see sessions used, remaining, and expiry date at any time." },
            ].map(s => (
              <div key={s.n} className="text-center">
                <p className="font-serif text-4xl gold-gradient font-bold mb-4">{s.n}</p>
                <h3 className="text-[var(--mc-text)] font-semibold mb-2">{s.title}</h3>
                <p className="text-[var(--mc-text-dim)] text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-6 bg-[var(--mc-bg)]">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-[var(--mc-text)] mb-10 text-center">Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Do packages expire?", a: "Each package has a validity period (6 or 12 months from purchase), shown on the package card. Unused sessions expire at the end of that period." },
              { q: "Can I share a package with a friend?", a: "Yes — packages are transferable. Just let the front desk know and they'll apply your session to any guest." },
              { q: "What if I need to cancel a session?", a: "Standard cancellation policy applies (24-hour notice). Your session is returned to your package if cancelled in time." },
              { q: "Can I combine packages?", a: "Absolutely. You can own multiple packages at the same time and choose which one to apply at each visit." },
              { q: "Do I need an account to purchase?", a: "You don't need an account to buy — but creating one lets you track your sessions and view your history." },
            ].map(faq => (
              <div key={faq.q} className="luxury-card p-6">
                <div className="flex gap-3">
                  <Star size={14} className="text-[var(--mc-accent)] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[var(--mc-text)] font-semibold mb-1">{faq.q}</p>
                    <p className="text-[var(--mc-text-dim)] text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-6 bg-[var(--mc-surface-dark)] text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-[var(--mc-text)] mb-4">Not sure which package?</h2>
          <p className="text-[var(--mc-text-dim)] mb-8">Call us and we&apos;ll match you to the right one based on your services.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+12129885252"
              className="gold-gradient-bg text-black font-bold px-10 py-4 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity cursor-pointer">
              (212) 988-5252
            </a>
            <Link href="/account"
              className="border border-[var(--mc-border)] text-[var(--mc-muted)] hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] px-10 py-4 uppercase tracking-widest text-sm transition-all cursor-pointer">
              View My Packages
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
