import Link from "next/link";
import { ChevronRight, Scissors, Wind, Palette, Sparkles } from "lucide-react";
import { SERVICES } from "@/lib/data";
import { getSalonInfo } from "@/lib/settings";
import HeroLogo from "@/components/HeroLogo";
import MarqueeStrip from "@/components/MarqueeStrip";
import WorkShowcase from "@/components/WorkShowcase";
import ResultsGallery from "@/components/ResultsGallery";
import SectionDivider from "@/components/SectionDivider";
import NewsletterStrip from "@/components/NewsletterStrip";
import FadeIn from "@/components/FadeIn";
import FaqSection from "@/components/FaqSection";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";

const HOME_FAQS = [
  { q: "Where is MC Hair Salon & Spa located?", a: "MC Hair Salon & Spa is located at 336 East 78th Street, between 1st and 2nd Avenues, on Manhattan's Upper East Side (zip code 10075). The nearest subway is the 6 train at 77th St (approximately 2 minutes away) or the Q train at 72nd St & 2nd Ave (approximately 6 minutes away)." },
  { q: "How long has MC Hair Salon been open?", a: "MC Hair Salon & Spa has been serving the Upper East Side since 2011 — over 13 years. We have built a loyal base of more than 10,000 clients and maintain a consistent 5-star rating." },
  { q: "What services does MC Hair Salon & Spa offer?", a: "We offer a full range of hair and beauty services including women's and men's haircuts, blowouts, balayage, highlights, full color, corrective color, updos, bridal styling, eyelash extensions, facials, and professional makeup artistry. We are one of the only salons on the Upper East Side that combines hair, spa, and makeup under one roof." },
  { q: "How much does a haircut cost at MC Hair Salon?", a: "Women's cuts start at $45, men's cuts start at $30, and children's cuts start at $20. All prices are starting rates and may vary based on hair length and complexity. View our full pricing at mchairsalon.com/services." },
  { q: "How much does balayage cost at MC Hair Salon?", a: "Balayage and highlights start at $120 at MC Hair Salon & Spa. Final pricing depends on hair length, density, and the complexity of the color design. Our colorists use L'Oréal professional color systems for all services." },
  { q: "Does MC Hair Salon offer bridal hair and makeup?", a: "Yes — bridal services are one of our specialties. We offer complete wedding packages including bridal updos, trial sessions, hair and makeup for the full bridal party, and day-of coordination. Our resident makeup artist Dhariana specializes in bridal looks. Contact us to discuss your wedding date and party size." },
  { q: "Can I walk in without an appointment?", a: "Yes, walk-ins are always welcome at MC Hair Salon & Spa. We recommend calling ahead at (212) 988-5252 to confirm availability, especially on weekends and for color services. Online booking is also available 24/7 at mchairsalon.com/book." },
  { q: "What are MC Hair Salon's hours?", a: "Monday: 9:30AM–4PM. Tuesday–Thursday: 10:30AM–7:30PM. Friday: 10AM–7PM. Saturday: 10AM–7PM. Sunday: 11AM–6PM." },
];

const iconMap: Record<string, React.ReactNode> = {
  scissors: <Scissors size={28} />,
  wind:     <Wind size={28} />,
  palette:  <Palette size={28} />,
  sparkles: <Sparkles size={28} />,
};

export default async function Home() {
  const SALON_INFO = await getSalonInfo();
  return (
    <>
      <HeroLogo />
      <SectionDivider />
      <WorkShowcase />

      {/* TRUST STRIP */}
      <section className="bg-[var(--mc-surface)] border-y border-[var(--mc-border)] py-4">
        <FadeIn>
          <p className="text-center text-[var(--mc-muted)] text-xs tracking-widest uppercase">
            Serving the Upper East Side since 2011&nbsp;&nbsp;·&nbsp;&nbsp;10,000+ clients&nbsp;&nbsp;·&nbsp;&nbsp;5-star rated&nbsp;&nbsp;·&nbsp;&nbsp;8 stylists
          </p>
        </FadeIn>
      </section>

      {/* PRICING CALLOUT */}
      <section className="py-5 px-6 bg-[var(--mc-surface-dark)] border-b border-[var(--mc-border)]">
        <p className="text-center text-[var(--mc-text-dim)] text-[10px] uppercase tracking-widest mb-3 sm:hidden">Starting from</p>
        <div className="max-w-7xl mx-auto grid grid-cols-3 sm:flex sm:flex-wrap sm:items-center sm:justify-center gap-3 sm:gap-x-6 sm:gap-y-2">
          <span className="text-[var(--mc-text-dim)] text-[10px] uppercase tracking-widest hidden sm:block shrink-0">Starting from</span>
          {[
            { label: "Kids Cut",    price: "$20" },
            { label: "Men's Cut",   price: "$30" },
            { label: "Blowout",     price: "$33" },
            { label: "Women's Cut", price: "$45" },
            { label: "Color",       price: "$85" },
            { label: "Balayage",    price: "$120" },
          ].map((item, i, arr) => (
            <div key={i} className="flex flex-col sm:flex-row items-center sm:items-center gap-0.5 sm:gap-3 text-center sm:text-left">
              <span className="font-serif text-2xl sm:text-xl gold-gradient font-bold">{item.price}</span>
              <span className="text-[var(--mc-text-dim)] text-[10px] uppercase tracking-wider leading-tight">{item.label}</span>
              {i < arr.length - 1 && <span className="text-[var(--mc-border)] text-sm hidden sm:block">·</span>}
            </div>
          ))}
          <Link href="/services" className="text-[var(--mc-accent)] text-xs uppercase tracking-widest hover:underline col-span-3 text-center mt-1 sm:mt-0 sm:col-span-1 cursor-pointer">
            Full Menu →
          </Link>
        </div>
      </section>

      <SectionDivider />

      <ResultsGallery />

      {/* TESTIMONIALS */}
      <section className="py-16 sm:py-24 px-6 bg-[var(--mc-bg)]">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-10 sm:mb-16">
            <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">Client Love</p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white">What They Say</h2>
          </FadeIn>

          <TestimonialsCarousel />
        </div>
      </section>

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
