"use client";
import Link from "next/link";
import { Scissors, Wind, Palette, Sparkles, Check } from "lucide-react";
import { SERVICES } from "@/lib/data";


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
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 px-6 bg-black text-center">
        <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">What We Offer</p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">Services & Pricing</h1>
        <p className="text-[var(--mc-muted)] max-w-xl mx-auto leading-relaxed text-sm sm:text-base">
          All prices listed are starting rates. Final pricing may vary based on hair length, density, and complexity.
        </p>
      </section>

      {/* Gold divider */}
      <div className="h-px gold-gradient-bg mx-auto w-24 mb-0" />

      {/* Services */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 bg-black">
        <div className="max-w-5xl mx-auto space-y-14 sm:space-y-20">
          {SERVICES.map((category, ci) => (
            <div key={category.category}>
              {/* Category header */}
              <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10 pb-4 border-b border-[var(--mc-border)]">
                <div className="w-10 h-10 sm:w-12 sm:h-12 border border-[var(--mc-accent)] flex items-center justify-center text-[var(--mc-accent)] shrink-0">
                  {iconMap[category.icon]}
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">{category.category}</h2>
              </div>

              {/* Items */}
              <div className="space-y-3 sm:space-y-4">
                {category.items.map((item, ii) => (
                  <div key={item.name}
                    className="flex items-center justify-between p-4 sm:p-6 luxury-card group gap-3">
                    <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="w-5 h-5 border border-[var(--mc-accent)] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[var(--mc-accent)] transition-colors">
                        <Check size={12} className="text-[var(--mc-accent)] group-hover:text-black transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white font-semibold text-sm sm:text-base">{item.name}</p>
                        <p className="text-[var(--mc-text-dim)] text-xs sm:text-sm mt-1 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2 sm:ml-8">
                      <p className="gold-gradient font-serif text-xl sm:text-2xl font-bold">${item.price}+</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer + CTA */}
      <section className="py-12 sm:py-16 px-6 bg-[var(--mc-surface-dark)] text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-[#555] text-sm mb-8 sm:mb-10 leading-relaxed">
            * Prices are starting rates and may vary based on hair length, density, and service complexity.
            Consultations are always complimentary. L&apos;Oréal Majerel/Inoa color used for all color services.
          </p>
          <Link href="/book"
            className="gold-gradient-bg text-black font-bold px-10 sm:px-12 py-4 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity cursor-pointer inline-block">
            Book Your Appointment
          </Link>
        </div>
      </section>
    </>
  );
}
