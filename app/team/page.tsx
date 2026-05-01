import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllStaff } from "@/lib/staff-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Meet Our Team",
  description:
    "Meet the team at MC Hair Salon & Spa — Upper East Side NYC. Maria, Meagan, Sally, Kato, Juany, Dhariana, Nazareth & Nathaly. Expert cuts, color, keratin, and bridal makeup.",
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

        </div>
      </section>
    </>
  );
}
