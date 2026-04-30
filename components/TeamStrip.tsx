import Image from "next/image";
import Link from "next/link";
import { TEAM } from "@/lib/data";

export default function TeamStrip() {
  return (
    <section className="py-16 sm:py-20 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">The Team</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white">Meet Your Stylists</h2>
          <p className="text-[var(--mc-muted)] text-sm mt-4 max-w-lg mx-auto">
            Six specialists. One vision — making you look and feel extraordinary.
          </p>
        </div>

        {/* Horizontally scrollable on mobile, grid on desktop */}
        <div className="flex gap-4 sm:gap-6 overflow-x-auto sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 pb-4 sm:pb-0 -mx-6 px-6 sm:mx-0 sm:px-0 snap-x snap-mandatory sm:snap-none scrollbar-none">
          {TEAM.map((member) => (
            <div key={member.name}
              className="flex-shrink-0 w-56 sm:w-full snap-start luxury-card overflow-hidden group">
              <div className="relative aspect-[3/4] overflow-hidden">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={`${member.name} — ${member.role} at MC Hair Salon`}
                    fill
                    sizes="(max-width: 640px) 224px, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--mc-surface)] flex items-center justify-center">
                    <span className="font-serif text-4xl gold-gradient font-bold">{member.name[0]}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>
              <div className="p-4">
                <p className="font-serif text-lg font-bold text-[var(--mc-text)]">{member.name}</p>
                <p className="text-[var(--mc-accent)] text-[10px] uppercase tracking-widest mb-2">{member.role}</p>
                <div className="flex flex-wrap gap-1">
                  {member.specialties.slice(0, 2).map(s => (
                    <span key={s} className="text-[9px] text-[var(--mc-text-dim)] border border-[var(--mc-border)] px-1.5 py-0.5 uppercase tracking-wide">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/team"
            className="border border-[var(--mc-accent)] text-[var(--mc-accent)] px-10 py-4 uppercase tracking-widest text-sm hover:bg-[var(--mc-accent)] hover:text-black transition-all duration-300 cursor-pointer">
            View Full Team
          </Link>
        </div>
      </div>
    </section>
  );
}
