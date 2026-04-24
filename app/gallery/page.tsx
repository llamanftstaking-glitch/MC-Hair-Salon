"use client";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { GALLERY_IMAGES } from "@/lib/data";

const CATEGORIES = ["All", "Color & Balayage", "Cuts & Styling", "Blowouts", "Spa & Beauty"];

const categorized = GALLERY_IMAGES.map((img, i) => ({
  ...img,
  category: CATEGORIES[1 + (i % (CATEGORIES.length - 1))],
}));

export default function GalleryPage() {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });
  const [activeFilter, setActiveFilter] = useState("All");
  const [selected, setSelected] = useState<{ src: string; alt: string } | null>(null);

  const filtered = activeFilter === "All" ? categorized : categorized.filter(p => p.category === activeFilter);

  return (
    <>
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 px-6 bg-black text-center">
        <div ref={headerRef}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4"
          >
            Our Work
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4"
          >
            Gallery
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={headerInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto h-px w-20 bg-gradient-to-r from-transparent via-[var(--mc-accent)] to-transparent mb-6"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-[var(--mc-muted)] max-w-xl mx-auto leading-relaxed"
          >
            Transformations, artistry, and the luxury experience at MC Hair Salon & Spa.
          </motion.p>
        </div>
      </section>

      <section className="py-12 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          {/* Category filters */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex gap-2 flex-wrap justify-center mb-10"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`cursor-pointer px-5 py-3 text-xs tracking-widest uppercase transition-all duration-200 border ${
                  activeFilter === cat
                    ? "bg-[var(--mc-accent)] text-black border-[var(--mc-accent)] font-semibold"
                    : "bg-transparent border-[var(--mc-border)] text-[var(--mc-text-dim)] hover:border-[var(--mc-accent)]/50 hover:text-[var(--mc-accent)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
            >
              {filtered.map((img, i) => (
                <motion.div
                  key={img.src}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative overflow-hidden cursor-pointer group border border-[var(--mc-border)] hover:border-[var(--mc-accent)]/40 transition-all duration-300 ${
                    i % 7 === 0 ? "col-span-2 row-span-2" : ""
                  }`}
                  style={{ aspectRatio: i % 7 === 0 ? "1/1" : "3/4" }}
                  onClick={() => setSelected({ src: img.src, alt: img.alt })}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Category tag */}
                  <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[var(--mc-accent)] text-[9px] tracking-[0.3em] uppercase">{img.category}</span>
                  </div>
                  {/* Expand icon */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 bg-black/60 backdrop-blur-sm border border-[var(--mc-accent)]/30 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="var(--mc-accent)" strokeWidth="1.5" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          <div className="text-center mt-16">
            <p className="text-[var(--mc-text-dim)] text-sm mb-6">Follow us for daily inspiration</p>
            <a
              href="https://www.instagram.com/mchairsalonspa/"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[var(--mc-accent)] text-[var(--mc-accent)] px-10 py-4 uppercase tracking-widest text-sm hover:bg-[var(--mc-accent)] hover:text-black transition-all duration-300 cursor-pointer inline-block"
            >
              @mchairsalonspa
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-[var(--mc-surface-dark)] text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl text-white mb-4">Ready for Your Transformation?</h2>
          <p className="text-[var(--mc-text-dim)] text-sm mb-8">Book your appointment online — it takes less than a minute.</p>
          <Link
            href="/book"
            className="gold-gradient-bg text-black font-bold px-12 py-4 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity cursor-pointer inline-block"
          >
            Book Now
          </Link>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-10"
            style={{ background: "rgba(0,0,0,0.95)", backdropFilter: "blur(16px)" }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative overflow-hidden border border-[var(--mc-accent)]/20">
                <Image
                  src={selected.src}
                  alt={selected.alt}
                  width={1200}
                  height={900}
                  className="object-contain w-full max-h-[82vh]"
                />
              </div>
            </motion.div>

            <button
              onClick={() => setSelected(null)}
              className="cursor-pointer absolute top-5 right-5 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors border border-white/20 bg-black/50 backdrop-blur-sm"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
