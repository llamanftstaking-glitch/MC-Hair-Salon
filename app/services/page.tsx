"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Scissors, Wind, Palette, Sparkles, Check } from "lucide-react";
import { SERVICES } from "@/lib/data";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" } }),
};

const iconMap: Record<string, React.ReactNode> = {
  scissors: <Scissors size={24} />,
  wind: <Wind size={24} />,
  palette: <Palette size={24} />,
  sparkles: <Sparkles size={24} />,
};

export default function ServicesPage() {
  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 px-6 bg-black text-center">
        <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={0}
          className="text-[#C9A84C] uppercase tracking-[0.4em] text-xs font-semibold mb-4">
          What We Offer
        </motion.p>
        <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="font-serif text-5xl md:text-6xl font-bold text-white mb-6">
          Services & Pricing
        </motion.h1>
        <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="text-[#a89070] max-w-xl mx-auto leading-relaxed">
          All prices listed are starting rates. Final pricing may vary based on hair length, density, and complexity.
        </motion.p>
      </section>

      {/* Gold divider */}
      <div className="h-px gold-gradient-bg mx-auto w-24 mb-0" />

      {/* Services */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-5xl mx-auto space-y-20">
          {SERVICES.map((category, ci) => (
            <motion.div key={category.category}
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={ci}>
              {/* Category header */}
              <div className="flex items-center gap-4 mb-10 pb-4 border-b border-[#2a2a2a]">
                <div className="w-12 h-12 border border-[#C9A84C] flex items-center justify-center text-[#C9A84C]">
                  {iconMap[category.icon]}
                </div>
                <h2 className="font-serif text-3xl font-bold text-white">{category.category}</h2>
              </div>

              {/* Items */}
              <div className="space-y-4">
                {category.items.map((item, ii) => (
                  <motion.div key={item.name}
                    variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={ii * 0.1}
                    className="flex items-center justify-between p-6 luxury-card group">
                    <div className="flex items-start gap-4">
                      <div className="w-5 h-5 border border-[#C9A84C] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#C9A84C] transition-colors">
                        <Check size={12} className="text-[#C9A84C] group-hover:text-black transition-colors" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">{item.name}</p>
                        <p className="text-[#666] text-sm mt-1">{item.description}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-8">
                      <p className="gold-gradient font-serif text-2xl font-bold">${item.price}+</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Disclaimer + CTA */}
      <section className="py-16 px-6 bg-[#050505] text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-[#555] text-sm mb-10 leading-relaxed">
            * Prices are starting rates and may vary based on hair length, density, and service complexity.
            Consultations are always complimentary. L&apos;Oréal Majerel/Inoa color used for all color services.
          </p>
          <Link href="/book"
            className="gold-gradient-bg text-black font-bold px-12 py-4 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity cursor-pointer">
            Book Your Appointment
          </Link>
        </div>
      </section>
    </>
  );
}
