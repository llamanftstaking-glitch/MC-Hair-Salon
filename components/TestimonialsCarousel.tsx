"use client";
import { useRef, useState, useEffect } from "react";
import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/data";

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
      <div
        ref={scrollRef}
        className="md:hidden flex overflow-x-auto snap-x snap-mandatory gap-0"
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
                  <p className="text-[#555] text-xs">{t.service}</p>
                  {"date" in t && t.date && (
                    <>
                      <span className="text-[#333] text-xs">·</span>
                      <p className="text-[#444] text-xs">{String(t.date)}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile dot indicators */}
      <div className="md:hidden flex justify-center gap-2 mt-5">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${
              i === active ? "bg-[var(--mc-accent)] w-4" : "bg-[#333] w-1.5"
            }`}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>

      {/* Desktop: 3-col grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-6 md:gap-8">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="luxury-card p-6 sm:p-8 h-full flex flex-col">
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} size={14} className="fill-[var(--mc-accent)] text-[var(--mc-accent)]" />
              ))}
            </div>
            <p className="text-[var(--mc-muted)] text-sm leading-relaxed mb-6 italic flex-1">&ldquo;{t.text}&rdquo;</p>
            <div className="border-t border-[var(--mc-border)] pt-4">
              <p className="text-white font-semibold text-sm">{t.name}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <p className="text-[#555] text-xs">{t.service}</p>
                {"date" in t && t.date && (
                  <>
                    <span className="text-[#333] text-xs">·</span>
                    <p className="text-[#444] text-xs">{String(t.date)}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
