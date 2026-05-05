"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import FadeIn from "@/components/FadeIn";

export interface FaqItem {
  q: string;
  a: string;
}

export default function FaqSection({
  faqs,
  title = "Frequently Asked Questions",
  className = "",
}: {
  faqs: FaqItem[];
  title?: string;
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section className={className}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4 text-center">
        Questions
      </p>
      <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-10 text-center">
        {title}
      </h2>

      <div className="space-y-2 max-w-3xl mx-auto">
        {faqs.map((item, i) => (
          <FadeIn key={i} delay={i * 45}>
          <div
            className="border border-[var(--mc-border)] bg-[var(--mc-surface-dark)] overflow-hidden"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer group"
              aria-expanded={open === i}
            >
              <span className="text-white font-semibold text-sm leading-snug pr-4 group-hover:text-[var(--mc-accent)] transition-colors">
                {item.q}
              </span>
              <ChevronDown
                size={16}
                className={`text-[var(--mc-accent)] shrink-0 transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
              />
            </button>
            {open === i && (
              <div className="px-6 pb-5 text-[var(--mc-muted)] text-sm leading-relaxed border-t border-[var(--mc-border)]">
                <div className="pt-4">{item.a}</div>
              </div>
            )}
          </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
