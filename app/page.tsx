import Link from "next/link";
import Image from "next/image";
import { Star, ChevronRight, Scissors, Wind, Palette, Sparkles } from "lucide-react";
import { SERVICES, TESTIMONIALS, GALLERY_IMAGES, SALON_INFO } from "@/lib/data";
import HeroLogo from "@/components/HeroLogo";
import NewsletterStrip from "@/components/NewsletterStrip";
import FadeIn from "@/components/FadeIn";
import FaqSection from "@/components/FaqSection";

const HOME_FAQS = [
  { q: "Where is MC Hair Salon & Spa located?", a: "MC Hair Salon & Spa is located at 336 East 78th Street, between 1st and 2nd Avenues, on Manhattan's Upper East Side (zip code 10075). The nearest subway is the 6 train at 77th St (approximately 2 minutes away) or the Q train at 72nd St & 2nd Ave (approximately 6 minutes away)." },
  { q: "How long has MC Hair Salon been open?", a: "MC Hair Salon & Spa has been serving the Upper East Side since 2011 — over 13 years. We have built a loyal base of more than 10,000 clients and maintain a consistent 5-star rating." },
  { q: "What services does MC Hair Salon & Spa offer?", a: "We offer a full range of hair and beauty services including women's and men's haircuts, blowouts, balayage, highlights, full color, corrective color, updos, bridal styling, eyelash extensions, facials, and professional makeup artistry. We are one of the only salons on the Upper East Side that combines hair, spa, and makeup under one roof." },
  { q: "How much does a haircut cost at MC Hair Salon?", a: "Women's cuts start at $45, men's cuts start at $30, and children's cuts start at $20. All prices are starting rates and may vary based on hair length and complexity. View our full pricing at mchairsalon.com/services." },
  { q: "How much does balayage cost at MC Hair Salon?", a: "Balayage and highlights start at $120 at MC Hair Salon & Spa. Final pricing depends on hair length, density, and the complexity of the color design. Our colorists use L'Oréal professional color systems for all services." },
  { q: "Does MC Hair Salon offer bridal hair and makeup?", a: "Yes — bridal services are one of our specialties. We offer complete wedding packages including bridal updos, trial sessions, hair and makeup for the full bridal party, and day-of coordination. Our resident makeup artist Isabella specializes in bridal looks. Contact us to discuss your wedding date and party size." },
  { q: "Can I walk in without an appointment?", a: "Yes, walk-ins are always welcome at MC Hair Salon & Spa. We recommend calling ahead at (212) 988-5252 to confirm availability, especially on weekends and for color services. Online booking is also available 24/7 at mchairsalon.com/book." },
  { q: "What are MC Hair Salon's hours?", a: "Monday: 10AM–5PM. Tuesday–Thursday: 10:30AM–7:30PM. Friday: 10AM–7PM. Saturday: 10AM–7PM. Sunday: 11AM–6PM." },
];

const iconMap: Record<string, React.ReactNode> = {
  scissors: <Scissors size={28} />,
  wind:     <Wind size={28} />,
  palette:  <Palette size={28} />,
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
            { value: "5★",  label: "Average Rating" },
            { value: "10K+", label: "Happy Clients" },
            { value: "4",   label: "Expert Stylists" },
          ].map((s, i) => (
            <FadeIn key={s.label} delay={i * 80}>
              <p className="font-serif text-3xl gold-gradient font-bold">{s.value}</p>
              <p className="text-[var(--mc-text-dim)] text-xs uppercase tracking-widest mt-1">{s.label}</p>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="py-16 sm:py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-10 sm:mb-16">
            <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">What We Offer</p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white">Our Services</h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {SERVICES.map((s, i) => (
              <FadeIn key={s.category} delay={i * 70}>
                <div className="luxury-card p-6 sm:p-8 cursor-pointer h-full">
                  <div className="text-[var(--mc-accent)] mb-6">{iconMap[s.icon]}</div>
                  <h3 className="font-serif text-xl font-semibold text-white mb-3">{s.category}</h3>
                  <p className="text-[var(--mc-text-dim)] text-sm leading-relaxed mb-6">
                    {s.items.length} services available, from ${Math.min(...s.items.map(item => item.price))}+
                  </p>
                  <Link href="/services" className="text-[var(--mc-accent)] text-xs uppercase tracking-widest hover:text-[var(--mc-accent-2)] transition-colors flex items-center gap-2 cursor-pointer">
                    Explore <ChevronRight size={14} />
                  </Link>
                </div>
              </FadeIn>
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
          <FadeIn className="text-center mb-10 sm:mb-16">
            <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">Our Work</p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white">Gallery</h2>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
            {GALLERY_IMAGES.slice(0, 6).map((img, i) => (
              <FadeIn key={i} delay={i * 60}>
                <div className="relative overflow-hidden aspect-square group cursor-pointer">
                  <Image src={img.src} alt={img.alt} fill sizes="(max-width: 640px) 50vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
                </div>
              </FadeIn>
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
          <FadeIn className="text-center mb-10 sm:mb-16">
            <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">Client Love</p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white">What They Say</h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {TESTIMONIALS.map((t, i) => (
              <FadeIn key={i} delay={i * 80}>
                <div className="luxury-card p-6 sm:p-8 h-full">
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
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <NewsletterStrip />

      {/* FAQ */}
      <section className="py-16 sm:py-24 px-6 bg-[var(--mc-surface-dark)]">
        <div className="max-w-4xl mx-auto">
          <FaqSection faqs={HOME_FAQS} title="Questions About MC Hair Salon" />
          <div className="text-center mt-10">
            <Link href="/about"
              className="text-[var(--mc-accent)] text-xs uppercase tracking-widest hover:text-[var(--mc-accent-2)] transition-colors flex items-center justify-center gap-2 cursor-pointer">
              Learn More About Us <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* BOOK CTA */}
      <section className="py-16 sm:py-24 px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a0800 0%, #1a1200 50%, #0a0800 100%)" }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 50% 50%, var(--mc-accent) 0%, transparent 60%)" }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <FadeIn>
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
          </FadeIn>
        </div>
      </section>
    </>
  );
}
