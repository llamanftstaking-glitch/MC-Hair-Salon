"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, ChevronRight, Scissors, Wind, Palette, Sparkles } from "lucide-react";
import { SERVICES, TESTIMONIALS, GALLERY_IMAGES, SALON_INFO } from "@/lib/data";
import HeroLogo from "@/components/HeroLogo";
import NewsletterStrip from "@/components/NewsletterStrip";
import { useTheme } from "@/lib/theme";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.15, ease: "easeOut" } }),
};

const iconMap: Record<string, React.ReactNode> = {
  scissors: <Scissors size={28} />,
  wind: <Wind size={28} />,
  palette: <Palette size={28} />,
  sparkles: <Sparkles size={28} />,
};

export default function Home() {
  const { theme } = useTheme();
  const isLite = theme === "lite";

  const ctaBg = isLite
    ? "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #f5f3ff 100%)"
    : "linear-gradient(135deg, #0a0800 0%, #1a1200 50%, #0a0800 100%)";

  const ctaGlow = isLite
    ? "radial-gradient(circle at 50% 50%, #7c3aed 0%, transparent 60%)"
    : "radial-gradient(circle at 50% 50%, #C9A84C 0%, transparent 60%)";

  return (
    <>
      {/* HERO — Animated Logo */}
      <HeroLogo />

      {/* STATS BAR */}
      <section className="bg-[#0f0f0f] border-y border-[#2a2a2a] py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "13+", label: "Years of Excellence" },
            { value: "5★", label: "Average Rating" },
            { value: "10K+", label: "Happy Clients" },
            { value: "4", label: "Expert Stylists" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-serif text-3xl gold-gradient font-bold">{s.value}</p>
              <p className="text-[#666] text-xs uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-16">
            <p className="text-[#C9A84C] uppercase tracking-[0.4em] text-xs font-semibold mb-4">What We Offer</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">Our Services</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((s, i) => (
              <motion.div key={s.category} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="luxury-card p-8 cursor-pointer">
                <div className="text-[#C9A84C] mb-6">{iconMap[s.icon]}</div>
                <h3 className="font-serif text-xl font-semibold text-white mb-3">{s.category}</h3>
                <p className="text-[#666] text-sm leading-relaxed mb-6">
                  {s.items.length} services available, from ${Math.min(...s.items.map(item => item.price))}+
                </p>
                <Link href="/services" className="text-[#C9A84C] text-xs uppercase tracking-widest hover:text-[#FFD700] transition-colors flex items-center gap-2 cursor-pointer">
                  Explore <ChevronRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/services"
              className="border border-[#C9A84C] text-[#C9A84C] px-10 py-4 uppercase tracking-widest text-sm hover:bg-[#C9A84C] hover:text-black transition-all duration-300 cursor-pointer">
              View Full Menu & Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="py-24 px-6 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-16">
            <p className="text-[#C9A84C] uppercase tracking-[0.4em] text-xs font-semibold mb-4">Our Work</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">Gallery</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {GALLERY_IMAGES.slice(0, 6).map((img, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i * 0.1}
                className="relative overflow-hidden aspect-square group cursor-pointer">
                <Image src={img.src} alt={img.alt} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/gallery"
              className="border border-[#C9A84C] text-[#C9A84C] px-10 py-4 uppercase tracking-widest text-sm hover:bg-[#C9A84C] hover:text-black transition-all duration-300 cursor-pointer">
              View Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-16">
            <p className="text-[#C9A84C] uppercase tracking-[0.4em] text-xs font-semibold mb-4">Client Love</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white">What They Say</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="luxury-card p-8">
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} className="fill-[#C9A84C] text-[#C9A84C]" />
                  ))}
                </div>
                <p className="text-[#a89070] text-sm leading-relaxed mb-6 italic">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-[#555] text-xs mt-1">{t.service}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <NewsletterStrip />

      {/* BOOK CTA */}
      <section className="py-24 px-6 relative overflow-hidden" style={{ background: ctaBg }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: ctaGlow }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="uppercase tracking-[0.4em] text-xs font-semibold mb-6" style={{ color: isLite ? "#7c3aed" : "#C9A84C" }}>
              Ready to Transform?
            </p>
            <h2 className="font-serif text-4xl md:text-6xl font-bold mb-8" style={{ color: isLite ? "#1e1b4b" : "#ffffff" }}>
              Book Your <span className="gold-gradient">Experience</span>
            </h2>
            <p className="text-lg mb-10 leading-relaxed" style={{ color: isLite ? "#6d5b98" : "#a89070" }}>
              Reserve your appointment online or call us at {SALON_INFO.phone}. Walk-ins always welcome.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book"
                className="gold-gradient-bg text-black font-bold px-12 py-5 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity cursor-pointer">
                Book Online
              </Link>
              <a href={`tel:${SALON_INFO.phone}`}
                className="font-semibold px-12 py-5 uppercase tracking-widest text-sm transition-all duration-300 cursor-pointer border"
                style={{
                  borderColor: isLite ? "#7c3aed" : "#C9A84C",
                  color: isLite ? "#7c3aed" : "#C9A84C",
                }}>
                Call Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
