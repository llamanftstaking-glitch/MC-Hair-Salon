import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getCustomerById } from "@/lib/customers";
import { Package } from "lucide-react";

export default async function PackagesPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const customer = getCustomerById(session.id);
  if (!customer) redirect("/login");

  return (
    <div className="min-h-screen bg-[var(--mc-bg)] pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <Link href="/account" className="text-[var(--mc-text-dim)] text-xs uppercase tracking-widest hover:text-[var(--mc-accent)] transition-colors cursor-pointer">← My Account</Link>
          <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mt-4 mb-2">My Packages</p>
          <h1 className="font-serif text-4xl font-bold text-[var(--mc-text)]">Service Packages</h1>
        </div>

        {customer.packages.length === 0 ? (
          <div className="luxury-card p-16 text-center">
            <Package size={40} className="text-[var(--mc-text-dim)] mx-auto mb-4" />
            <p className="text-[var(--mc-muted)] mb-3">No packages yet.</p>
            <p className="text-[var(--mc-text-dim)] text-sm">Packages coming soon — ask your stylist about bundle deals.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {customer.packages.map((pkg) => {
              const pct = Math.round((pkg.sessionsUsed / pkg.sessionsTotal) * 100);
              return (
                <div key={pkg.id} className="luxury-card p-6">
                  <p className="font-serif text-lg font-bold text-[var(--mc-text)]">{pkg.name}</p>
                  <p className="text-[var(--mc-text-dim)] text-xs mt-1">Expires {new Date(pkg.expiresAt).toLocaleDateString()}</p>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-[var(--mc-muted)] mb-1.5">
                      <span>{pkg.sessionsUsed} used</span>
                      <span>{pkg.sessionsTotal - pkg.sessionsUsed} remaining</span>
                    </div>
                    <div className="h-1.5 bg-[var(--mc-border)] rounded-full overflow-hidden">
                      <div className="h-full gold-gradient-bg rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
