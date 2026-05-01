import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllStaff } from "@/lib/staff-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Meet Our Team",
  description:
    "Meet the stylists at MC Hair Salon & Spa — Upper East Side NYC. Kato, Megan, Sofia, Marcus & Dhariani. Expert cuts, color, lashes & makeup.",
  keywords: [
    "hair stylist Upper East Side NYC", "balayage specialist Manhattan",
    "best hair colorist NYC", "makeup artist Upper East Side",
    "lash specialist NYC", "hair salon team Manhattan",
  ],
  openGraph: {
    title: "Meet Our Team | MC Hair Salon & Spa",
    description: "Expert stylists and spa specialists serving the Upper East Side. Precision cuts, color, lashes, and makeup artistry.",
    url: "https://mchairsalon.com/team",
  },
  alternates: { canonical: "https://mchairsalon.com/team" },
};

export default async function TeamPage() {
  const team = getAllStaff();

  return (
    <>
      <section className="pt-28 sm:pt-36 pb-12 sm:pb-16 px-6 bg-black text-center">
        <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">The Experts</p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">Our Team</h1>
        <p className="text-[var(--mc-muted)] max-w-xl mx-auto leading-relaxed">
          A talented team of stylists and spa specialists who have been crafting beauty together for over a decade.
        </p>
      </section>

      <section className="py-20 px-6 bg-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {team.map((member) => (
            <div key={member.id} className="luxury-card overflow-hidden group">
              <div className="relative h-64 sm:h-80 overflow-hidden bg-[var(--mc-surface-dark)]">
                {member.image ? (
                  <Image
                    src={member.image} alt={member.name} fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl text-[var(--mc-accent)] font-serif font-bold">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <p className="font-serif text-2xl font-bold text-white">{member.name}</p>
                  <p className="text-[var(--mc-accent)] text-sm uppercase tracking-widest mt-1">{member.role}</p>
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-[var(--mc-muted)] text-sm leading-relaxed mb-6">{member.bio}</p>

                {member.portfolio && member.portfolio.length > 0 && (
                  <div className="mb-6">
                    <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-3">Portfolio</p>
                    <div className="grid grid-cols-4 gap-2">
                      {member.portfolio.slice(0, 4).map((item, i) => (
                        <div key={i} className="aspect-square overflow-hidden bg-[var(--mc-surface-dark)] relative">
                          {item.type === "video" ? (
                            <video src={item.src} className="w-full h-full object-cover" muted playsInline />
                          ) : (
                            <Image src={item.src} alt={item.caption || member.name} fill className="object-cover" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-3">Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    {member.specialties.map((spec) => (
                      <span key={spec}
                        className="border border-[var(--mc-border)] text-[var(--mc-text-dim)] text-xs px-3 py-1.5 uppercase tracking-wider">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
                <Link href="/book"
                  className="mt-8 inline-block gold-gradient-bg text-black text-xs font-bold px-8 py-3 uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer">
                  Book with {member.name}
                </Link>
              </div>
            </div>
          ))}

          {/* 6th slot — fills orphan gap, drives bookings */}
          <div className="border border-dashed border-[#222] flex flex-col items-center justify-center text-center p-10 sm:p-14 gap-6">
            <div className="w-14 h-14 border border-[var(--mc-accent)]/30 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--mc-accent)" strokeWidth="1" className="w-6 h-6 opacity-70">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <div>
              <p className="text-[var(--mc-accent)] text-[10px] uppercase tracking-[0.4em] font-semibold mb-2">Not Sure Who to Book?</p>
              <p className="font-serif text-xl text-white font-bold mb-3">Let Us Match You</p>
              <p className="text-[#444] text-xs leading-relaxed max-w-[220px] mx-auto">
                Call us and we&apos;ll pair you with the right specialist for your service and hair type.
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-[200px]">
              <Link href="/book"
                className="gold-gradient-bg text-black text-[10px] font-bold px-6 py-3 uppercase tracking-widest hover:opacity-90 transition-opacity text-center">
                Book Online
              </Link>
              <a href="tel:+12129885252"
                className="border border-[#2a2a2a] text-[#555] text-[10px] px-6 py-3 uppercase tracking-widest hover:border-[var(--mc-accent)]/40 hover:text-[var(--mc-accent)] transition-all text-center">
                (212) 988-5252
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
