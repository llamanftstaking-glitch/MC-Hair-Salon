"use client";
import { useRef, useState, useEffect } from "react";
import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/data";
import FadeIn from "@/components/FadeIn";

export default function TestimonialsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const index = Math.round(el.scrollLeft / el.offsetWidth);
      setActive(index);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (i: number) => {
    scrollRef.current?.scrollTo({ left: i * scrollRef.current.offsetWidth, behavior: "smooth" });
  };

  return (
    <>
      {/* Mobile: snap carousel */}
      <FadeIn className="md:hidden">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-0"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="snap-center shrink-0 w-full px-1">
            <div className="luxury-card p-6 flex flex-col">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} className="fill-[var(--mc-accent)] text-[var(--mc-accent)]" />
                ))}
              </div>
              <p className="text-[var(--mc-muted)] text-sm leading-relaxed mb-6 italic flex-1">&ldquo;{t.text}&rdquo;</p>
              <div className="border-t border-[var(--mc-border)] pt-4">
                <p className="text-white font-semibold text-sm">{t.name}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <p className="text-[var(--mc-text-dim)] text-xs">{t.service}</p>
                  {"date" in t && t.date && (
                    <>
                      <span className="text-[var(--mc-border)] text-xs">·</span>
                      <p className="text-[var(--mc-text-dim)] text-xs">{String(t.date)}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      </FadeIn>

      {/* Mobile dot indicators */}
      <div className="md:hidden flex justify-center gap-2 mt-5">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              i === active ? "bg-[var(--mc-accent)] w-4" : "bg-[var(--mc-border)] w-1.5"
            }`}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>

      {/* Desktop: 3-col grid — middle card featured */}
      <div className="hidden md:grid md:grid-cols-3 gap-6 md:gap-8 items-stretch">
        {TESTIMONIALS.map((t, i) => {
          const featured = i === 1;
          return (
            <FadeIn key={i} delay={i * 100} className="h-full">
            <div className={`h-full flex flex-col ${
              featured
                ? "p-8 sm:p-10 bg-[var(--mc-surface)] border border-[var(--mc-accent)]/25 relative overflow-hidden"
                : "luxury-card p-6 sm:p-8"
            }`}>
              {featured && (
                <span className="absolute top-3 right-5 font-serif text-8xl text-[var(--mc-accent)]/10 leading-none select-none pointer-events-none">&rdquo;</span>
              )}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={featured ? 16 : 14} className="fill-[var(--mc-accent)] text-[var(--mc-accent)]" />
                ))}
              </div>
              <p className={`leading-relaxed mb-6 italic flex-1 ${
                featured
                  ? "font-serif text-base text-[var(--mc-text-body)]"
                  : "text-[var(--mc-muted)] text-sm"
              }`}>&ldquo;{t.text}&rdquo;</p>
              <div className="border-t border-[var(--mc-border)] pt-4">
                <p className="text-white font-semibold text-sm">{t.name}</p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <p className="text-[var(--mc-text-dim)] text-xs">{t.service}</p>
                  {"date" in t && t.date && (
                    <>
                      <span className="text-[var(--mc-border)] text-xs">·</span>
                      <p className="text-[var(--mc-text-dim)] text-xs">{String(t.date)}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            </FadeIn>
          );
        })}
      </div>
    </>
  );
}
