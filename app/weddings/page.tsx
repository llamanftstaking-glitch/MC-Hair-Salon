import Image from "next/image";
import Link from "next/link";
import { Star, Check, Phone, Mail, ChevronRight, Heart } from "lucide-react";
import { WEDDING_SERVICES, WEDDING_TESTIMONIALS, WEDDING_GALLERY, SALON_INFO } from "@/lib/data";

export const metadata = {
  title: "Wedding Hair & Makeup | MC Hair Salon & Spa NYC",
  description: "Luxury bridal hair and makeup on the Upper East Side. Serving NYC brides since 2011 — in-salon and on-location for your entire bridal party.",
};

export default function WeddingsPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 bg-black overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/instagram/mchairsalonspa_1774207263_3858649997122708575_509340228.jpg"
            alt="Bridal styling at MC Hair Salon"
            fill className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        </div>

        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(184,134,11,0.14) 0%, transparent 70%)" }} />

        <div className="relative z-10 max-w-4xl mx-auto pt-28">
          <p className="text-[var(--mc-accent)] uppercase tracking-[0.5em] text-xs font-semibold mb-6">MC Hair Salon & Spa</p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[1.05]">
            Your Wedding<br />Day Begins Here
          </h1>
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-[var(--mc-accent)] to-transparent mb-8" />
          <p className="text-[var(--mc-muted)] text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-12">
            Upper East Side&apos;s most trusted bridal team — luxury hair, makeup, and beauty for you and your entire party. In-salon or at your venue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book"
              className="gold-gradient-bg text-black font-bold px-10 py-4 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity cursor-pointer">
              Book a Consultation
            </Link>
            <a href={`tel:${SALON_INFO.phone}`}
              className="border border-[var(--mc-accent)] text-[var(--mc-accent)] px-10 py-4 uppercase tracking-widest text-sm hover:bg-[var(--mc-accent)] hover:text-black transition-all cursor-pointer">
              {SALON_INFO.phone}
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-10 border-t border-white/10">
            {[
              { value: "13+", label: "Years Serving NYC Brides" },
              { value: "500+", label: "Bridal Parties Styled" },
              { value: "5★", label: "WeddingWire Rated" },
              { value: "100%", label: "Custom Looks" },
            ].map(b => (
              <div key={b.label} className="text-center">
                <p className="font-serif text-2xl gold-gradient font-bold">{b.value}</p>
                <p className="text-[#555] text-xs uppercase tracking-widest mt-1">{b.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-white text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white to-transparent" />
        </div>
      </section>

      {/* ── THE EXPERIENCE ── */}
      <section className="py-24 px-6 bg-[var(--mc-surface-dark)]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">Why MC for Your Wedding</p>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-8 leading-tight">
                Your Day.<br />Our Expertise.
              </h2>
              <div className="space-y-6">
                {[
                  { title: "Full Bridal Party Capability", body: "Hair, makeup, lashes, and pre-wedding treatments — we handle the entire party so you can stay in one place." },
                  { title: "In-Salon or On-Location", body: "Relax at our Upper East Side salon, or let us come to your hotel, venue, or home anywhere in NYC." },
                  { title: "Dedicated Consultations", body: "Every bride gets a private consultation and a trial run before the big day. No surprises — only perfection." },
                  { title: "Over 13 Years of Bridal Experience", body: "We've been part of hundreds of NYC weddings. We know what works, what photographs beautifully, and what lasts all day." },
                ].map(f => (
                  <div key={f.title} className="flex gap-4">
                    <div className="w-5 h-5 rounded-full gold-gradient-bg flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={11} className="text-black" strokeWidth={3} />
                    </div>
                    <div>
                      <p className="text-white font-semibold mb-1">{f.title}</p>
                      <p className="text-[var(--mc-text-dim)] text-sm leading-relaxed">{f.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery mosaic */}
            <div className="grid grid-cols-2 gap-3">
              {WEDDING_GALLERY.slice(0, 4).map((img, i) => (
                <div key={img.src}
                  className={`relative overflow-hidden border border-[var(--mc-border)] ${i === 0 ? "row-span-2" : ""}`}
                  style={{ aspectRatio: i === 0 ? "3/4" : "1/1" }}>
                  <Image src={img.src} alt={img.alt} fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="25vw" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES & PRICING ── */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">Transparent Pricing</p>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">Bridal Services</h2>
            <p className="text-[var(--mc-muted)] max-w-xl mx-auto">All prices are starting rates. Final pricing based on hair length, complexity, and party size.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {WEDDING_SERVICES.map(cat => (
              <div key={cat.category} className="luxury-card p-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--mc-border)]">
                  <span className="text-2xl">{cat.icon}</span>
                  <h3 className="font-serif text-xl font-bold text-white">{cat.category}</h3>
                </div>
                <div className="space-y-4">
                  {cat.services.map(s => (
                    <div key={s.name} className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <ChevronRight size={13} className="text-[var(--mc-accent)] shrink-0" />
                          <p className="text-[var(--mc-text)] text-sm font-semibold">{s.name}</p>
                        </div>
                        <p className="text-[#555] text-xs ml-5 mt-0.5">{s.note}</p>
                      </div>
                      <p className="text-[var(--mc-accent)] font-semibold text-sm shrink-0">from ${s.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-[#555] text-sm mb-6">Custom packages available for full bridal parties of 5+. Contact us for group rates.</p>
            <Link href="/book"
              className="gold-gradient-bg text-black font-bold px-12 py-4 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity cursor-pointer inline-block">
              Request a Quote
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6 bg-[var(--mc-surface-dark)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">The Process</p>
            <h2 className="font-serif text-4xl font-bold text-white">From Consultation to &ldquo;I Do&rdquo;</h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--mc-border)] to-transparent -translate-x-1/2" />

            <div className="space-y-16">
              {[
                {
                  step: "01", side: "left",
                  title: "Initial Consultation",
                  body: "Book a complimentary consultation — in person or by phone. We discuss your vision, venue, bridal party size, and timeline. You leave with a personalized quote and a plan.",
                  detail: "Complimentary · 30 minutes",
                },
                {
                  step: "02", side: "right",
                  title: "Hair & Makeup Trial",
                  body: "4–8 weeks before your wedding, we do a full trial run. You'll see exactly how your look will come together — and we refine it until it's perfect. Bring your veil if you have it.",
                  detail: "Recommended 4–8 weeks before",
                },
                {
                  step: "03", side: "left",
                  title: "Wedding Day",
                  body: "Our team arrives on time, calm, and fully prepared. We work through your party with precision and care, building from the bridesmaids to the final bridal reveal. Zero stress.",
                  detail: "In-salon or on-location",
                },
                {
                  step: "04", side: "right",
                  title: "You Walk Down the Aisle",
                  body: "Feeling your most radiant self — looks that last from ceremony to reception. We use professional-grade, long-wearing products designed for the full day ahead.",
                  detail: "All-day staying power",
                },
              ].map((item) => (
                <div key={item.step}
                  className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center ${item.side === "right" ? "md:[&>:first-child]:order-2" : ""}`}>
                  <div className={`luxury-card p-8 ${item.side === "right" ? "md:text-right" : ""}`}>
                    <p className="font-serif text-4xl gold-gradient font-bold mb-3">{item.step}</p>
                    <h3 className="font-serif text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-[var(--mc-text-dim)] text-sm leading-relaxed mb-4">{item.body}</p>
                    <span className="text-[var(--mc-accent)] text-xs uppercase tracking-widest">{item.detail}</span>
                  </div>
                  {/* Spacer for opposite side */}
                  <div className="hidden md:flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full gold-gradient-bg flex items-center justify-center shadow-lg z-10">
                      <Heart size={16} className="text-black" fill="black" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">Our Work</p>
            <h2 className="font-serif text-4xl font-bold text-white">Bridal Gallery</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {WEDDING_GALLERY.map((img, i) => (
              <div key={img.src}
                className={`relative overflow-hidden group border border-[var(--mc-border)] hover:border-[var(--mc-accent)]/40 transition-all duration-300 ${i === 0 ? "col-span-2 sm:col-span-1 row-span-2" : ""}`}
                style={{ aspectRatio: i === 0 ? "2/3" : "1/1" }}>
                <Image src={img.src} alt={img.alt} fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <a href={SALON_INFO.instagram} target="_blank" rel="noopener noreferrer"
              className="border border-[var(--mc-accent)] text-[var(--mc-accent)] px-10 py-3 uppercase tracking-widest text-sm hover:bg-[var(--mc-accent)] hover:text-black transition-all cursor-pointer inline-block">
              See More on Instagram
            </a>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-6 bg-[var(--mc-surface-dark)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">Brides Love Us</p>
            <h2 className="font-serif text-4xl font-bold text-[var(--mc-text)] mb-4">Real Stories</h2>
            {/* WeddingWire badge row */}
            <a href="https://www.weddingwire.com/biz/mc-hair-salon-and-spa/a3991b6360a5145a.html"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-[var(--mc-border)] px-5 py-2.5 mt-4 hover:border-[var(--mc-accent)] transition-colors cursor-pointer group">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#C9A84C" className="text-[#C9A84C]" />
                ))}
              </div>
              <span className="text-[var(--mc-text-dim)] text-xs uppercase tracking-widest group-hover:text-[var(--mc-accent)] transition-colors">
                Reviewed on WeddingWire
              </span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WEDDING_TESTIMONIALS.map((t) => (
              <div key={t.name} className="luxury-card p-8">
                <div className="flex mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="#C9A84C" className="text-[#C9A84C]" />
                  ))}
                </div>
                <p className="text-[var(--mc-text-dim)] leading-relaxed mb-6 italic">&ldquo;{t.review}&rdquo;</p>
                <div className="flex items-center justify-between border-t border-[var(--mc-border)] pt-5">
                  <div>
                    <p className="text-[var(--mc-text)] font-semibold text-sm">{t.name}</p>
                    <p className="text-[var(--mc-accent)] text-xs tracking-widest uppercase mt-0.5">Wedding · {t.wedding}</p>
                  </div>
                  <Heart size={16} className="text-[var(--mc-accent)]" fill="currentColor" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="https://www.weddingwire.com/biz/mc-hair-salon-and-spa/a3991b6360a5145a.html"
              target="_blank" rel="noopener noreferrer"
              className="text-[var(--mc-accent)] text-sm hover:underline cursor-pointer tracking-widest uppercase">
              Read all reviews on WeddingWire →
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-serif text-4xl font-bold text-white">Wedding FAQ</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "How far in advance should I book?", a: "We recommend booking 6–12 months before your wedding date, especially for peak season (May–October). Saturdays book up fast." },
              { q: "Do you offer a bridal trial?", a: "Absolutely — and we highly recommend it. Trials are scheduled 4–8 weeks before your wedding so we can perfect your look and ease any nerves." },
              { q: "Can your team come to our venue?", a: "Yes. We travel throughout NYC and the tri-state area. An on-location fee applies depending on distance. Call us to discuss your venue." },
              { q: "How many people can you accommodate?", a: "We can handle bridal parties of any size. For large parties (6+), we assign multiple artists and stylists to ensure everyone is ready on time." },
              { q: "What if I want hair AND makeup?", a: "We handle both. Our team includes dedicated hair stylists and makeup artists, so you get full-service beauty in one place." },
              { q: "Do you do destination weddings?", a: "For destination weddings outside NYC, please contact us directly. We may be able to arrange travel depending on your location and date." },
              { q: "How do I get a quote?", a: "Call us at (212) 988-5252 or book a consultation online. We'll put together a custom quote based on your party size and services needed." },
            ].map(faq => (
              <div key={faq.q} className="luxury-card p-6">
                <div className="flex gap-4">
                  <ChevronRight size={16} className="text-[var(--mc-accent)] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold mb-2">{faq.q}</p>
                    <p className="text-[var(--mc-text-dim)] text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <Image
            src="/instagram/mchairsalonspa_1664479225_2938187155735434916_509340228.jpg"
            alt="Bridal beauty"
            fill className="object-cover opacity-15"
          />
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(184,134,11,0.12) 0%, transparent 70%)" }} />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full gold-gradient-bg flex items-center justify-center mx-auto mb-8">
            <Heart size={28} className="text-black" fill="black" />
          </div>
          <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">Let&apos;s Make It Happen</p>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Plan Your<br />Wedding Beauty?
          </h2>
          <p className="text-[var(--mc-muted)] mb-10 leading-relaxed text-lg">
            Book a consultation today and let&apos;s create a custom plan for your most important day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book"
              className="gold-gradient-bg text-black font-bold px-12 py-4 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity cursor-pointer">
              Book Consultation
            </Link>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href={`tel:${SALON_INFO.phone}`}
                className="flex items-center justify-center gap-2 border border-[var(--mc-border)] text-[var(--mc-muted)] hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] px-8 py-4 text-sm uppercase tracking-widest transition-all cursor-pointer">
                <Phone size={15} /> Call Us
              </a>
              <a href={`mailto:info@mchairsalon.com?subject=Wedding Inquiry`}
                className="flex items-center justify-center gap-2 border border-[var(--mc-border)] text-[var(--mc-muted)] hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] px-8 py-4 text-sm uppercase tracking-widest transition-all cursor-pointer">
                <Mail size={15} /> Email Us
              </a>
            </div>
          </div>
          <p className="text-[#444] text-xs mt-8 uppercase tracking-widest">
            336 East 78th St, New York, NY 10075 · Upper East Side
          </p>
        </div>
      </section>
    </>
  );
}
