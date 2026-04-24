import Link from "next/link";
import Image from "next/image";
import { Star, ChevronRight, Scissors, Wind, Palette, Sparkles } from "lucide-react";
import { SERVICES, TESTIMONIALS, GALLERY_IMAGES, SALON_INFO } from "@/lib/data";
import HeroLogo from "@/components/HeroLogo";
import NewsletterStrip from "@/components/NewsletterStrip";

const iconMap: Record<string, React.ReactNode> = {
  scissors: <Scissors size={28} />,
  wind: <Wind size={28} />,
  palette: <Palette size={28} />,
  sparkles: <Sparkles size={28} />,
};

export default function Home() {
  return (
    <>
      <HeroLogo />

      {/* STATS BAR */}
      <section className="bg-[var(--mc-surface)] border-y border-[var(--mc-border)] py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
          {[
            { value: "13+", label: "Years of Excellence" },
            { value: "5★", label: "Average Rating" },
            { value: "10K+", label: "Happy Clients" },
            { value: "4", label: "Expert Stylists" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-serif text-3xl gold-gradient font-bold">{s.value}</p>
              <p className="text-[var(--mc-text-dim)] text-xs uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="py-16 sm:py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">What We Offer</p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white">Our Services</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {SERVICES.map((s) => (
              <div key={s.category} className="luxury-card p-6 sm:p-8 cursor-pointer">
                <div className="text-[var(--mc-accent)] mb-6">{iconMap[s.icon]}</div>
                <h3 className="font-serif text-xl font-semibold text-white mb-3">{s.category}</h3>
                <p className="text-[var(--mc-text-dim)] text-sm leading-relaxed mb-6">
                  {s.items.length} services available, from ${Math.min(...s.items.map(item => item.price))}+
                </p>
                <Link href="/services" className="text-[var(--mc-accent)] text-xs uppercase tracking-widest hover:text-[var(--mc-accent-2)] transition-colors flex items-center gap-2 cursor-pointer">
                  Explore <ChevronRight size={14} />
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/services"
              className="border border-[var(--mc-accent)] text-[var(--mc-accent)] px-10 py-4 uppercase tracking-widest text-sm hover:bg-[var(--mc-accent)] hover:text-black transition-all duration-300 cursor-pointer">
              View Full Menu & Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="py-16 sm:py-24 px-6 bg-[var(--mc-surface-dark)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">Our Work</p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white">Gallery</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
            {GALLERY_IMAGES.slice(0, 6).map((img, i) => (
              <div key={i} className="relative overflow-hidden aspect-square group cursor-pointer">
                <Image src={img.src} alt={img.alt} fill sizes="(max-width: 640px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/gallery"
              className="border border-[var(--mc-accent)] text-[var(--mc-accent)] px-10 py-4 uppercase tracking-widest text-sm hover:bg-[var(--mc-accent)] hover:text-black transition-all duration-300 cursor-pointer">
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 sm:py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">Client Love</p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white">What They Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="luxury-card p-6 sm:p-8">
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} className="fill-[var(--mc-accent)] text-[var(--mc-accent)]" />
                  ))}
                </div>
                <p className="text-[var(--mc-muted)] text-sm leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-[#555] text-xs mt-1">{t.service}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NewsletterStrip />

      {/* BOOK CTA */}
      <section className="py-16 sm:py-24 px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a0800 0%, #1a1200 50%, #0a0800 100%)" }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 50% 50%, var(--mc-accent) 0%, transparent 60%)" }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-6">Ready to Transform?</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6 sm:mb-8">
            Book Your <span className="gold-gradient">Experience</span>
          </h2>
          <p className="text-[var(--mc-muted)] text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed">
            Reserve your appointment online or call us at {SALON_INFO.phone}. Walk-ins always welcome.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book"
              className="gold-gradient-bg text-black font-bold px-12 py-5 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity cursor-pointer">
              Book Online
            </Link>
            <a href={`tel:${SALON_INFO.phone}`}
              className="border border-[var(--mc-accent)] text-[var(--mc-accent)] font-semibold px-12 py-5 uppercase tracking-widest text-sm hover:bg-[var(--mc-accent)] hover:text-black transition-all duration-300 cursor-pointer">
              Call Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
