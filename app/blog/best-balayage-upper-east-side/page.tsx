import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import FaqSection from "@/components/FaqSection";

export const metadata: Metadata = {
  title: "Best Balayage on the Upper East Side: What to Look for in 2025",
  description:
    "Balayage is New York City's most requested color service. We break down what separates great balayage from mediocre, what to expect at your appointment, realistic pricing on the Upper East Side, and how to maintain your color.",
  keywords: [
    "best balayage upper east side nyc",
    "balayage salon upper east side",
    "hand-painted highlights nyc",
    "balayage vs highlights nyc",
    "balayage price upper east side",
    "balayage nyc 2025",
    "hair color upper east side manhattan",
    "MC Hair Salon balayage",
  ],
  openGraph: {
    title: "Best Balayage on the Upper East Side — 2025 Guide | MC Hair Salon",
    description:
      "What to know before booking a balayage on the Upper East Side: technique, pricing, what to ask for, and how to maintain the look.",
    url: "https://mchairsalon.com/blog/best-balayage-upper-east-side",
  },
  alternates: { canonical: "https://mchairsalon.com/blog/best-balayage-upper-east-side" },
};

const ARTICLE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Best Balayage on the Upper East Side: What to Look for in 2025",
  description:
    "A complete guide to booking balayage on the Upper East Side of Manhattan — technique, pricing, what to ask for, and aftercare.",
  author: {
    "@type": "Organization",
    name: "MC Hair Salon & Spa",
    url: "https://mchairsalon.com",
  },
  publisher: {
    "@type": "Organization",
    name: "MC Hair Salon & Spa",
    logo: { "@type": "ImageObject", url: "https://mchairsalon.com/mc-logo-bw.png" },
  },
  datePublished: "2025-04-01",
  dateModified: "2025-04-01",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://mchairsalon.com/blog/best-balayage-upper-east-side" },
  about: [
    { "@type": "Thing", name: "Balayage" },
    { "@type": "Thing", name: "Hair Color" },
    { "@type": "Place", name: "Upper East Side, New York City" },
  ],
};

const FAQS = [
  {
    q: "How much does balayage cost on the Upper East Side?",
    a: "Balayage pricing on the Upper East Side typically ranges from $120 to $450 depending on the salon, the stylist's experience level, and the complexity of the technique. At MC Hair Salon & Spa, balayage starts at $120 — competitive with the neighborhood average for expert hand-painted color. Very high-end boutique salons in the area charge $350–$450 for specialty techniques like AirTouch.",
  },
  {
    q: "What is the difference between balayage and highlights?",
    a: "Highlights are applied with foils that saturate the hair strand completely from root to tip, creating uniform, distinct sections of lightened hair. Balayage is a hand-painting technique where color is swept freehand across sections of hair, typically skipping the root area and concentrating on mid-lengths and ends. The result is a softer, more sun-kissed, gradient effect that grows out more naturally than traditional highlights.",
  },
  {
    q: "How long does a balayage appointment take?",
    a: "A full balayage appointment typically takes 2.5 to 4 hours, depending on hair length, density, and the complexity of the color design. The processing time alone is 30–60 minutes. Plan to spend at least half a day at the salon for a thorough balayage service.",
  },
  {
    q: "How often do you need to touch up balayage?",
    a: "One of balayage's biggest advantages is its low maintenance schedule. Most clients return every 10–16 weeks for a refresh, compared to every 6–8 weeks for traditional foil highlights. Because the technique avoids a hard root line, the grow-out is gradual and natural-looking.",
  },
  {
    q: "Can balayage work on dark hair?",
    a: "Yes, absolutely. Balayage can be applied to any hair color, including very dark brown and black hair. However, lifting dark hair significantly lighter typically requires multiple sessions to avoid damaging the hair's integrity. Your colorist will assess your hair's current condition and set realistic expectations for how much lightness can be achieved safely in one session.",
  },
  {
    q: "What should I bring to a balayage consultation?",
    a: "Bring photos of your target look — the more reference images, the better. Show inspiration for both color and tone (warm/golden vs. cool/ash). Also be prepared to discuss your maintenance preferences: how often you want to come in, how much grow-out you're comfortable with, and your budget. An honest consultation is the best investment you can make in a great color result.",
  },
];

export default function BalayageBlogPost() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_SCHEMA) }}
      />

      {/* Header */}
      <section className="pt-28 sm:pt-36 pb-12 px-6 bg-[var(--mc-bg)]">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog"
            className="inline-flex items-center gap-2 text-[#555] text-xs uppercase tracking-widest hover:text-[var(--mc-accent)] transition-colors cursor-pointer mb-8">
            <ArrowLeft size={12} /> Back to Journal
          </Link>
          <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-4">
            Color & Highlights
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Best Balayage on the Upper East Side: What to Look for in 2025
          </h1>
          <p className="text-[var(--mc-muted)] text-base leading-relaxed mb-6">
            Balayage is the most requested color service in New York City — and on the Upper East Side,
            the options range from $120 to $450. Here&apos;s what separates a great balayage from a
            mediocre one, and what to look for before you book.
          </p>
          <div className="flex items-center gap-4 text-[#444] text-xs border-t border-[#111] pt-6">
            <span>By the MC Hair Salon & Spa Team</span>
            <span>·</span>
            <span>April 2025</span>
            <span>·</span>
            <span>7 min read</span>
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="py-12 px-6 bg-[var(--mc-bg)]">
        <div className="max-w-3xl mx-auto prose-custom space-y-10 text-[var(--mc-muted)] text-base leading-relaxed">

          <section>
            <h2 className="font-serif text-2xl font-bold text-white mb-4">What Is Balayage?</h2>
            <p>
              Balayage (from the French word meaning &ldquo;to sweep&rdquo;) is a hair coloring technique in which
              lightener or color is hand-painted directly onto sections of hair — without foils — creating
              a soft, graduated, sun-kissed effect. Unlike traditional foil highlights, which saturate
              strands completely from root to tip, balayage concentrates color on the mid-lengths and ends
              while leaving the roots closer to the natural base.
            </p>
            <p className="mt-4">
              The result is a dimensional, natural-looking lightening effect that mimics the way hair
              naturally lightens in the sun. Balayage grows out gradually without a harsh line of
              demarcation at the root — which is why clients typically need touch-ups only every
              10–16 weeks, compared to every 6–8 weeks for traditional highlights.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-white mb-4">Balayage vs. Highlights: Key Differences</h2>
            <div className="border border-[#1a1a1a] bg-[#080808] overflow-hidden rounded-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1a1a1a]">
                    <th className="text-left px-5 py-3 text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold" />
                    <th className="text-left px-5 py-3 text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold">Balayage</th>
                    <th className="text-left px-5 py-3 text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold">Foil Highlights</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#111]">
                  {[
                    ["Technique", "Hand-painted freehand", "Applied with foils"],
                    ["Result", "Soft, sun-kissed gradient", "Uniform, distinct sections"],
                    ["Root area", "Blended, natural", "Often colored to root"],
                    ["Grow-out", "Gradual, low-maintenance", "Visible root line at 6–8 weeks"],
                    ["Touch-up frequency", "Every 10–16 weeks", "Every 6–8 weeks"],
                    ["Best for", "Natural, dimensional look", "High contrast, defined color"],
                    ["UES price range", "$120 – $450", "$120 – $360"],
                  ].map(([label, b, h]) => (
                    <tr key={label}>
                      <td className="px-5 py-3 text-[#888] text-xs font-semibold">{label}</td>
                      <td className="px-5 py-3 text-[var(--mc-muted)] text-xs">{b}</td>
                      <td className="px-5 py-3 text-[var(--mc-muted)] text-xs">{h}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-white mb-4">What Determines Balayage Price?</h2>
            <p>
              On the Upper East Side, balayage can cost anywhere from $120 to $450+. The variance isn&apos;t
              arbitrary — here&apos;s what drives price:
            </p>
            <ul className="mt-4 space-y-3 pl-0">
              {[
                { title: "Hair length and density", body: "Longer, thicker hair requires significantly more product and time. Expect add-ons for hair past the shoulder or very dense hair types." },
                { title: "Technique complexity", body: "A simple money-piece balayage costs less than a full-head multi-tonal balayage with toning. \"AirTouch\" and other specialty techniques command premiums of $350–$450 at boutique salons." },
                { title: "Stylist experience level", body: "Senior colorists and owners typically charge more. Some salons in the area charge $120–$145 for a director-level colorist vs. $210+ for an owner or master." },
                { title: "Toning and glossing", body: "A toner after the lightening process refines the final color and adds shine. This is often a separate add-on charge ($30–$60) but is strongly recommended for a polished result." },
                { title: "Salon positioning", body: "A side-street salon like MC Hair Salon & Spa, which focuses on high-volume luxury and accessible pricing, typically charges less than avenue-facing boutique salons without sacrificing quality." },
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-[var(--mc-accent)] text-xs mt-1.5 shrink-0">◆</span>
                  <span><strong className="text-white">{item.title}:</strong> {item.body}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-white mb-4">What to Look for in an Upper East Side Balayage Salon</h2>
            <p>
              The Upper East Side has a high density of salons marketing "balayage" — the quality varies
              significantly. Here&apos;s what to evaluate before booking:
            </p>
            <ul className="mt-4 space-y-3 pl-0">
              {[
                { title: "Portfolio of actual client work", body: "Ask to see before-and-after photos from current clients, not stock imagery. Look for consistent softness at the root, clean blending at the mid-lengths, and no brassiness at the ends." },
                { title: "A proper consultation", body: "A reputable salon will ask about your hair history, current condition, and lifestyle before touching color. If a salon skips the consultation, be cautious." },
                { title: "Color line transparency", body: "Ask what brand of lightener and toner they use. Professional-grade products from brands like L'Oréal, Wella, or Redken produce more consistent and lasting results than generic formulations." },
                { title: "Experience with your hair type", body: "Balayage on fine hair looks very different from balayage on coarse or curly hair. Ask specifically whether your stylist has experience with your hair type." },
                { title: "Aftercare guidance", body: "A good colorist will advise you on at-home maintenance: which shampoo to use, how often to wash, and when to return for a refresh. If they don&apos;t mention aftercare, ask." },
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-[var(--mc-accent)] text-xs mt-1.5 shrink-0">◆</span>
                  <span><strong className="text-white">{item.title}:</strong> {item.body}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-white mb-4">Balayage at MC Hair Salon & Spa</h2>
            <p>
              At MC Hair Salon & Spa, balayage starts at <strong className="text-white">$120</strong> — competitive
              with the upper end of the neighborhood average while reflecting real expertise rather than
              a price-based positioning strategy.
            </p>
            <p className="mt-4">
              Our colorists, led by <strong className="text-white">Kato</strong> (Master Stylist, precision
              color specialist) and <strong className="text-white">Megan</strong> (Senior Colorist, L&apos;Oréal
              certified), use professional L&apos;Oréal Majerel and Inoa systems for their lightening
              and toning work. These are the same color lines used in some of Manhattan&apos;s most acclaimed
              salons — formulated for consistency, vibrancy, and hair health.
            </p>
            <p className="mt-4">
              Every balayage appointment at MC Hair begins with a thorough consultation. We discuss your
              hair history, the look you&apos;re after, your maintenance preferences, and set realistic
              expectations for the session. We don&apos;t skip this step.
            </p>
            <p className="mt-4">
              Our salon is located at <strong className="text-white">336 East 78th Street</strong>, between
              1st and 2nd Avenues on the Upper East Side — a short walk from the 6 train at 77th St or
              the Q train at 72nd St.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-white mb-4">Balayage Aftercare: Making Your Color Last</h2>
            <ul className="space-y-3 pl-0">
              {[
                { title: "Use sulfate-free shampoo", body: "Sulfates strip color faster than anything else. Switch to a sulfate-free or color-safe formula immediately after your balayage service." },
                { title: "Wash less frequently", body: "Aim for 2–3 washes per week if possible. Each wash fades color; dry shampoo is your best friend between wash days." },
                { title: "Use a purple or blue toning shampoo weekly", body: "Balayage can develop brassiness over time, especially if you have darker natural hair. A weekly toning shampoo counters this without a salon visit." },
                { title: "Protect from heat and sun", body: "UV exposure and heat styling both degrade color. Use a heat protectant before styling and consider UV-protective hair products for summer." },
                { title: "Book a gloss refresh at 8–10 weeks", body: "A gloss or toning service at the 8–10 week mark refreshes the color and extends the life of your balayage without a full re-application." },
              ].map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-[var(--mc-accent)] text-xs mt-1.5 shrink-0">◆</span>
                  <span><strong className="text-white">{item.title}:</strong> {item.body}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* FAQ */}
          <FaqSection faqs={FAQS} title="Balayage FAQ" className="mt-6" />

          {/* CTA */}
          <div className="border border-[var(--mc-accent)]/30 bg-[#0a0800] p-8 text-center mt-8">
            <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-3">Ready to Book?</p>
            <h3 className="font-serif text-2xl font-bold text-white mb-3">Book Your Balayage Consultation</h3>
            <p className="text-[#555] text-sm mb-6 max-w-sm mx-auto">
              Available at MC Hair Salon & Spa, 336 East 78th St, Upper East Side. Starting at $120.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/book"
                className="gold-gradient-bg text-black font-bold px-8 py-3.5 uppercase tracking-widest text-xs hover:opacity-90 transition-opacity cursor-pointer">
                Book Online
              </Link>
              <a href="tel:+12129885252"
                className="border border-[#333] text-[#888] px-8 py-3.5 uppercase tracking-widest text-xs hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer">
                Call (212) 988-5252
              </a>
            </div>
          </div>

          {/* Back link */}
          <div className="pt-4">
            <Link href="/blog"
              className="inline-flex items-center gap-2 text-[#555] text-xs uppercase tracking-widest hover:text-[var(--mc-accent)] transition-colors cursor-pointer">
              <ArrowLeft size={12} /> All Articles
            </Link>
          </div>

        </div>
      </article>
    </>
  );
}
