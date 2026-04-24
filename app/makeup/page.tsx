import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { SERVICES, MAKEUP_GALLERY, TEAM } from "@/lib/data";

const makeupServices = SERVICES.find(s => s.category === "Makeup")!;
const artist = TEAM.find(m => (m as { isMakeupArtist?: boolean }).isMakeupArtist)!;

export const metadata = {
  title: "Makeup Artist | MC Hair Salon & Spa",
  description: "Professional makeup artistry at MC Hair Salon & Spa — bridal, special events, airbrush, and everyday glam on the Upper East Side.",
};

export default function MakeupPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="pt-28 sm:pt-36 pb-16 px-6 bg-black text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(184,134,11,0.12) 0%, transparent 70%)" }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">Beauty Artistry</p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">Makeup</h1>
          <div className="mx-auto h-px w-20 bg-gradient-to-r from-transparent via-[var(--mc-accent)] to-transparent mb-6" />
          <p className="text-[var(--mc-muted)] leading-relaxed text-lg max-w-2xl mx-auto">
            From effortless everyday glam to showstopping bridal looks — MC's resident makeup artist brings editorial precision to every face.
          </p>
        </div>
      </section>

      {/* ── Artist Profile ── */}
      <section className="py-16 px-6 bg-[var(--mc-surface-dark)]">
        <div className="max-w-5xl mx-auto">
          <div className="luxury-card overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Photo */}
              <div className="relative h-72 md:h-auto min-h-[320px]">
                <Image
                  src={artist.image}
                  alt={artist.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/20" />
                <div className="absolute bottom-4 left-4 md:hidden">
                  <p className="font-serif text-2xl font-bold text-white">{artist.name}</p>
                  <p className="text-[var(--mc-accent)] text-sm tracking-widest uppercase">{artist.role}</p>
                </div>
              </div>

              {/* Info */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="hidden md:block mb-6">
                  <p className="text-[var(--mc-accent)] text-xs uppercase tracking-[0.3em] font-semibold mb-2">Featured Artist</p>
                  <h2 className="font-serif text-3xl font-bold text-white">{artist.name}</h2>
                  <p className="text-[var(--mc-muted)] tracking-widest text-sm mt-1">{artist.role}</p>
                </div>
                <p className="text-[var(--mc-text-dim)] leading-relaxed mb-8">{artist.bio}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {artist.specialties.map(s => (
                    <span key={s} className="text-xs px-3 py-1.5 border border-[var(--mc-accent)]/30 text-[var(--mc-accent)] uppercase tracking-wider">
                      {s}
                    </span>
                  ))}
                </div>
                <Link href="/book"
                  className="gold-gradient-bg text-black font-bold px-8 py-3.5 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity cursor-pointer inline-block text-center">
                  Book with {artist.name}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Portfolio Gallery ── */}
      <section className="py-16 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-3">The Work</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">Portfolio</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {MAKEUP_GALLERY.map((img, i) => (
              <div key={img.src}
                className={`relative overflow-hidden group border border-[var(--mc-border)] hover:border-[var(--mc-accent)]/50 transition-all duration-300 ${i === 0 ? "col-span-2 row-span-2" : ""}`}
                style={{ aspectRatio: i === 0 ? "1/1" : "3/4" }}>
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[var(--mc-accent)] text-[10px] tracking-[0.25em] uppercase">{img.label}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-[#444] text-sm mt-8">
            Follow{" "}
            <a href="https://www.instagram.com/mchairsalonspa/" target="_blank" rel="noopener noreferrer"
              className="text-[var(--mc-accent)] hover:underline cursor-pointer">
              @mchairsalonspa
            </a>{" "}
            for the latest looks
          </p>
        </div>
      </section>

      {/* ── Rates ── */}
      <section className="py-16 px-6 bg-[var(--mc-surface-dark)]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-3">Transparent Pricing</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">Rates</h2>
          </div>

          <div className="luxury-card divide-y divide-[var(--mc-border)]">
            {makeupServices.items.map((item) => (
              <div key={item.name} className="flex items-start justify-between gap-6 p-6 hover:bg-[var(--mc-surface)] transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Check size={14} className="text-[var(--mc-accent)] shrink-0" />
                    <p className="text-white font-semibold">{item.name}</p>
                  </div>
                  <p className="text-[var(--mc-text-dim)] text-sm ml-5">{item.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-serif text-xl gold-gradient font-bold">from ${item.price}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-[#555] text-sm mt-6">
            Prices vary based on complexity. Bridal trials available — contact us for packages.
          </p>

          <div className="text-center mt-8">
            <Link href="/book"
              className="gold-gradient-bg text-black font-bold px-12 py-4 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity cursor-pointer inline-block">
              Book Your Session
            </Link>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="py-16 px-6 bg-black">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-white">The MC Difference</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "Premium Products", body: "We use only professional-grade, skin-safe cosmetics from top brands — no compromises." },
              { title: "Custom Looks", body: "Every face is unique. Isabella creates custom looks tailored to your bone structure, coloring, and vision." },
              { title: "Salon Experience", body: "Enjoy the full MC luxury salon environment — champagne vibes on the Upper East Side." },
            ].map(c => (
              <div key={c.title} className="luxury-card p-8 text-center">
                <div className="w-10 h-px bg-[var(--mc-accent)] mx-auto mb-6" />
                <h3 className="font-serif text-lg font-bold text-white mb-3">{c.title}</h3>
                <p className="text-[var(--mc-text-dim)] text-sm leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
