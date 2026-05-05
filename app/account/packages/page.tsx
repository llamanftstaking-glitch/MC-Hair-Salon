import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getCustomerById } from "@/lib/customers";
import { Package, ChevronRight, Check, Sparkles } from "lucide-react";

export default async function PackagesPage({ searchParams }: { searchParams: Promise<{ purchased?: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const customer = await getCustomerById(session.id);
  if (!customer) redirect("/login");

  const params = await searchParams;
  const justPurchased = params?.purchased === "true";

  const active   = customer.packages.filter(p => p.sessionsUsed < p.sessionsTotal && new Date(p.expiresAt) > new Date());
  const finished = customer.packages.filter(p => p.sessionsUsed >= p.sessionsTotal || new Date(p.expiresAt) <= new Date());

  return (
    <div className="min-h-screen bg-[var(--mc-bg)] pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <Link href="/account" className="text-[var(--mc-text-dim)] text-xs uppercase tracking-widest hover:text-[var(--mc-accent)] transition-colors cursor-pointer">
            ← My Account
          </Link>
          <div className="flex items-end justify-between mt-4 flex-wrap gap-4">
            <div>
              <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-2">My Packages</p>
              <h1 className="font-serif text-4xl font-bold text-[var(--mc-text)]">Service Packages</h1>
            </div>
            <Link href="/packages"
              className="gold-gradient-bg text-black font-bold px-6 py-3 uppercase tracking-widest text-xs hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-2">
              <Sparkles size={13} /> Browse Packages
            </Link>
          </div>
        </div>

        {/* Success banner */}
        {justPurchased && (
          <div className="luxury-card p-5 border border-green-500/30 bg-green-900/10 flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
              <Check size={18} className="text-green-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Package added to your account!</p>
              <p className="text-[var(--mc-text-dim)] text-xs mt-0.5">Your sessions are ready to use. Show this page at the salon or mention it when booking.</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {customer.packages.length === 0 ? (
          <div className="luxury-card p-16 text-center">
            <Package size={48} className="text-[var(--mc-text-dim)] mx-auto mb-5" />
            <h2 className="font-serif text-2xl font-bold text-[var(--mc-text)] mb-3">No Packages Yet</h2>
            <p className="text-[var(--mc-text-dim)] text-sm mb-8 max-w-xs mx-auto">
              Save on your favorite services by pre-purchasing a bundle. Packages are tracked right here.
            </p>
            <Link href="/packages"
              className="gold-gradient-bg text-black font-bold px-10 py-3.5 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity cursor-pointer inline-flex items-center gap-2">
              <Sparkles size={15} /> Shop Packages
            </Link>
          </div>
        ) : (
          <>
            {/* Active packages */}
            {active.length > 0 && (
              <div>
                <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-4">Active</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {active.map(pkg => {
                    const pct = Math.round((pkg.sessionsUsed / pkg.sessionsTotal) * 100);
                    const remaining = pkg.sessionsTotal - pkg.sessionsUsed;
                    const expires = new Date(pkg.expiresAt);
                    const daysLeft = Math.ceil((expires.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    return (
                      <div key={pkg.id} className="luxury-card p-7 ring-1 ring-[var(--mc-accent)]/20">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-serif text-lg font-bold text-[var(--mc-text)]">{pkg.name}</h3>
                          <span className="text-[10px] px-2 py-1 border border-green-400/30 text-green-400 bg-green-400/10 uppercase tracking-wider">Active</span>
                        </div>
                        {pkg.tagline && <p className="text-[var(--mc-text-dim)] text-xs mb-4">{pkg.tagline}</p>}

                        {/* Services */}
                        {pkg.services && pkg.services.length > 0 && (
                          <div className="space-y-1.5 mb-5">
                            {pkg.services.map(s => (
                              <div key={s} className="flex gap-2 items-start text-xs">
                                <ChevronRight size={11} className="text-[var(--mc-accent)] shrink-0 mt-0.5" />
                                <span className="text-[var(--mc-muted)]">{s}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Progress */}
                        <div className="mb-3">
                          <div className="flex justify-between text-xs text-[var(--mc-muted)] mb-2">
                            <span className="text-[var(--mc-accent)] font-semibold">{remaining} session{remaining !== 1 ? "s" : ""} remaining</span>
                            <span>{pkg.sessionsUsed} of {pkg.sessionsTotal} used</span>
                          </div>
                          <div className="h-2 bg-[var(--mc-surface)] rounded-full overflow-hidden">
                            <div className="h-full gold-gradient-bg rounded-full transition-all duration-700"
                              style={{ width: `${pct}%` }} />
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-3 border-t border-[var(--mc-border)]">
                          <span className="text-[#555]">Expires {expires.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          <span className={`font-semibold ${daysLeft < 30 ? "text-yellow-400" : "text-[var(--mc-text-dim)]"}`}>
                            {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Finished / expired packages */}
            {finished.length > 0 && (
              <div>
                <p className="text-[#555] text-xs uppercase tracking-widest font-semibold mb-4">Completed / Expired</p>
                <div className="space-y-3">
                  {finished.map(pkg => (
                    <div key={pkg.id} className="luxury-card p-5 opacity-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[var(--mc-text)] font-semibold text-sm">{pkg.name}</p>
                          <p className="text-[#555] text-xs mt-0.5">
                            {pkg.sessionsUsed >= pkg.sessionsTotal ? "All sessions used" : "Expired"} ·{" "}
                            Purchased {new Date(pkg.purchasedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 border border-[var(--mc-border)] text-[#555] uppercase tracking-wider">Done</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upsell */}
            <div className="luxury-card p-7 text-center">
              <p className="text-[var(--mc-text-dim)] text-sm mb-4">Ready to stock up on more sessions?</p>
              <Link href="/packages"
                className="gold-gradient-bg text-black font-bold px-8 py-3 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity cursor-pointer inline-block">
                Browse All Packages
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
