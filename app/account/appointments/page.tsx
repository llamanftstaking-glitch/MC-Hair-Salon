import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getCustomerById } from "@/lib/customers";
import { Calendar, Clock } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  upcoming:  "text-green-400  border-green-400/30  bg-green-400/10",
  completed: "text-[var(--mc-text-dim)] border-[var(--mc-border)] bg-transparent",
  cancelled: "text-red-400    border-red-400/30    bg-red-400/10",
};

export default async function AppointmentsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const customer = getCustomerById(session.id);
  if (!customer) redirect("/login");

  const sorted = [...customer.appointments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen bg-[var(--mc-bg)] pt-28 pb-20 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <Link href="/account" className="text-[var(--mc-text-dim)] text-xs uppercase tracking-widest hover:text-[var(--mc-accent)] transition-colors cursor-pointer">← My Account</Link>
          <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mt-4 mb-2">My Schedule</p>
          <h1 className="font-serif text-4xl font-bold text-[var(--mc-text)]">Appointments</h1>
        </div>

        <Link href="/book" className="inline-block gold-gradient-bg text-black font-bold px-8 py-3 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity cursor-pointer">
          + Book New Appointment
        </Link>

        {sorted.length === 0 ? (
          <div className="luxury-card p-16 text-center">
            <Calendar size={40} className="text-[var(--mc-text-dim)] mx-auto mb-4" />
            <p className="text-[var(--mc-muted)] mb-6">No appointments yet.</p>
            <Link href="/book" className="text-[var(--mc-accent)] text-sm uppercase tracking-widest hover:underline cursor-pointer">Book your first visit →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((a) => (
              <div key={a.id} className="luxury-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-[var(--mc-border)] flex items-center justify-center shrink-0">
                    <Clock size={16} className="text-[var(--mc-accent)]" />
                  </div>
                  <div>
                    <p className="text-[var(--mc-text)] font-semibold">{a.service}</p>
                    <p className="text-[var(--mc-text-dim)] text-sm mt-0.5">{a.date} · {a.time} · {a.stylist}</p>
                    {a.pointsEarned > 0 && <p className="text-[var(--mc-accent)] text-xs mt-1">+{a.pointsEarned} pts earned</p>}
                  </div>
                </div>
                <span className={`text-xs uppercase tracking-widest font-semibold px-3 py-1 border rounded-full w-fit ${STATUS_STYLES[a.status]}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
