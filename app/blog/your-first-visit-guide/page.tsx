import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FaqSection from "@/components/FaqSection";

export const metadata: Metadata = {
  title: "Your First Visit to a Luxury Hair Salon: A Complete Guide",
  description:
    "Nervous about your first appointment at a high-end salon? We cover everything — what to wear, how to communicate with your stylist, what to expect during your visit, tipping etiquette, and how to get the most from your appointment at MC Hair Salon & Spa in NYC.",
  keywords: [
    "first time luxury hair salon nyc",
    "what to expect hair salon upper east side",
    "how to prepare for hair appointment nyc",
    "luxury salon guide new york",
    "hair salon etiquette nyc",
    "first visit mc hair salon",
    "upper east side salon first time",
    "how to talk to your stylist",
  ],
  openGraph: {
    title: "Your First Visit to a Luxury Hair Salon — A Complete Guide | MC Hair Salon NYC",
    description: "Everything you need to know before your first luxury salon appointment in New York City.",
    url: "https://mchairsalon.com/blog/your-first-visit-guide",
  },
  alternates: { canonical: "https://mchairsalon.com/blog/your-first-visit-guide" },
};

const ARTICLE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Your First Visit to a Luxury Hair Salon: A Complete Guide",
  description: "A complete guide for first-time luxury salon clients in New York City.",
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
  datePublished: "2025-02-01",
  dateModified: "2025-02-01",
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://mchairsalon.com/blog/your-first-visit-guide" },
};

const FAQS = [
  {
    q: "Should I wash my hair before a salon appointment?",
    a: "For most services — cuts, blowouts, and styling — you can come with hair in any condition; the salon will wash it for you as part of the service. For color services, arrive with clean or lightly dirty hair (1–2 days unwashed is ideal). Avoid heavy product buildup. For keratin treatments, your stylist will advise you specifically.",
  },
  {
    q: "What should I wear to a hair salon appointment?",
    a: "For hair services, wear a button-down shirt or zip-up top that can be easily removed without disturbing your styled hair. Avoid turtlenecks or high-neck tops. For color appointments, avoid wearing anything you'd be upset to get a small amount of color on — salon capes protect most of your clothing, but it's a precaution worth taking.",
  },
  {
    q: "How much should I tip at a hair salon in NYC?",
    a: "The standard tip at a New York City hair salon is 15–20% of the service total, similar to restaurant tipping culture. For exceptional service or complex work (color correction, bridal, etc.), 20% or more is appreciated. It's generally expected to tip your stylist, the shampoo assistant separately ($3–$5 in cash if possible), and any additional service providers.",
  },
  {
    q: "What if I don't like my hair when it's done?",
    a: "A good salon wants you to leave happy. If you're not satisfied with your service, speak up before you leave — politely let your stylist know what isn't quite right. Reputable salons (including MC Hair Salon & Spa) will make adjustments at no additional charge. It is much harder to address concerns after you've left the salon.",
  },
  {
    q: "How early should I arrive for my appointment?",
    a: "We recommend arriving 5–10 minutes early, especially for your first visit. This gives you time to check in, review services, ask any questions, and start the consultation without feeling rushed. For color services, arriving a few minutes early allows your stylist to perform a brief strand test if needed.",
  },
  {
    q: "How do I describe what I want to my stylist?",
    a: "Bring photos — they communicate more accurately than words. A photo of the color or cut you want, along with a photo of what you specifically don't want, gives your stylist the clearest picture of your goal. Be specific about lifestyle too: how much time you spend on your hair daily, how often you wash it, whether you use heat tools, and your maintenance budget.",
  },
  {
    q: "What is a consultation and do I need one?",
    a: "A consultation is a brief conversation with your stylist before the service begins — typically 5–15 minutes for standard services, longer for color. During a consultation, your stylist will assess your hair's current condition, understand your goal, discuss realistic expectations, and recommend the right approach. For color services, first visits to a new salon, or major changes (going significantly lighter, cutting several inches), a consultation is essential. Some salons offer standalone consultation appointments for complex color work.",
  },
];

export default function FirstVisitGuidePost() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_SCHEMA) }}
      />

      <section className="pt-28 sm:pt-36 pb-12 px-6 bg-black">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog"
            className="inline-flex items-center gap-2 text-[#555] text-xs uppercase tracking-widest hover:text-[var(--mc-accent)] transition-colors cursor-pointer mb-8">
            <ArrowLeft size={12} /> Back to Journal
          </Link>
          <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-4">
            First-Timer&apos;s Guide
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Your First Visit to a Luxury Hair Salon: A Complete Guide
          </h1>
          <p className="text-[var(--mc-muted)] text-base leading-relaxed mb-6">
            Walking into a high-end salon for the first time can feel intimidating. Here&apos;s everything
            you need to know before, during, and after your appointment — so you can relax and
            enjoy the experience.
          </p>
          <div className="flex items-center gap-4 text-[#444] text-xs border-t border-[#111] pt-6">
            <span>By the MC Hair Salon & Spa Team</span>
            <span>·</span>
            <span>February 2025</span>
            <span>·</span>
            <span>5 min read</span>
          </div>
        </div>
      </section>

      <article className="py-12 px-6 bg-black">
        <div className="max-w-3xl mx-auto space-y-10 text-[var(--mc-muted)] text-base leading-relaxed">

          <section>
            <h2 className="font-serif text-2xl font-bold text-white mb-4">Before Your Appointment</h2>

            <h3 className="text-white font-semibold text-lg mb-3 mt-6">Book the right service</h3>
            <p>
              If you&apos;re unsure which service is right for you, call the salon and ask. A good salon
              will walk you through the options and help you book based on your goals and budget — not
              upsell you into the most expensive service. At MC Hair Salon & Spa, you can call us at{" "}
              <strong className="text-white">(212) 988-5252</strong> or book online and add a note
              in the comments field.
            </p>

            <h3 className="text-white font-semibold text-lg mb-3 mt-6">Gather inspiration</h3>
            <p>
              The single most helpful thing you can do before a salon appointment is collect reference
              photos. Save 3–5 images that show the look you want — cut, color, texture, finish —
              and also note which elements you specifically don&apos;t want. Be realistic: show images of
              people with similar hair texture and density to yours.
            </p>

            <h3 className="text-white font-semibold text-lg mb-3 mt-6">Know your hair history</h3>
            <p>
              Your stylist will ask. Prepare to share: your last color service and what was done,
              any previous chemical treatments (keratin, relaxer, perm), your current shampoo and
              products, and any scalp sensitivities or allergies. This information directly affects
              which products and techniques your stylist will use.
            </p>

            <h3 className="text-white font-semibold text-lg mb-3 mt-6">What to wear</h3>
            <p>
              Wear a button-down or zip-up top that you can easily remove over your styled hair.
              For color appointments specifically: avoid wearing anything precious, as color capes
              protect most clothing but not 100% of the time.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-white mb-4">What Happens When You Arrive</h2>

            <h3 className="text-white font-semibold text-lg mb-3 mt-6">The consultation</h3>
            <p>
              At a high-quality salon, your appointment begins with a consultation before any scissors
              or color touch your hair. Your stylist will ask what you&apos;re looking for, examine
              your hair&apos;s current condition, and discuss realistic expectations. This is the most
              important 5–10 minutes of your appointment — use it fully.
            </p>
            <p className="mt-4">
              This is the moment to share your reference photos, ask questions, and raise any concerns.
              If you leave the consultation unclear on what will happen to your hair, ask for
              clarification before proceeding.
            </p>

            <h3 className="text-white font-semibold text-lg mb-3 mt-6">The shampoo experience</h3>
            <p>
              A luxury salon shampoo is not just practical — it&apos;s part of the experience.
              At MC Hair Salon & Spa, every service includes a professional wash with professional-grade
              products suited to your hair type. This is a good moment to relax.
            </p>

            <h3 className="text-white font-semibold text-lg mb-3 mt-6">During the service</h3>
            <p>
              You&apos;re allowed to talk, or not. Stylists read social cues well — if you want to
              chat, they&apos;ll engage; if you want quiet, that&apos;s completely fine too.
              What is helpful: give feedback as you go. If the cut is going shorter than you intended,
              say so. A professional stylist will not take this personally — they want you to leave
              happy.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-white mb-4">Before You Leave</h2>

            <h3 className="text-white font-semibold text-lg mb-3 mt-6">Look in the mirror — really look</h3>
            <p>
              Before you pay, the salon will show you the finished result. Take a moment to actually
              assess the result — front, sides, and back. If something doesn&apos;t feel right,
              say so now. It is much easier for a stylist to make adjustments before you leave than
              to fix things later.
            </p>

            <h3 className="text-white font-semibold text-lg mb-3 mt-6">Ask for aftercare instructions</h3>
            <p>
              Your stylist should tell you how to maintain the result at home. For cuts: which products
              to use for your specific texture. For color: which shampoo is safe, when you can wash,
              and how to keep the color vibrant. For keratin: the specific 48–72 hour rules. If they
              don&apos;t mention it, ask before you leave.
            </p>

            <h3 className="text-white font-semibold text-lg mb-3 mt-6">Tipping</h3>
            <p>
              In New York City, 15–20% is standard for hair services. Cash is preferred but most
              salons also allow credit card tips. If a separate stylist assistant helped with your
              shampoo, a $3–$5 cash tip directly to them is appreciated.
            </p>

            <h3 className="text-white font-semibold text-lg mb-3 mt-6">Book your next appointment</h3>
            <p>
              If you loved your experience, book your next appointment before you leave — especially
              for popular time slots (Saturday mornings, early evening). Most salons hold appointments
              for returning clients, and it&apos;s much easier to reschedule an existing appointment
              than to fight for a new one.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-white mb-4">First Visit at MC Hair Salon & Spa</h2>
            <p>
              MC Hair Salon & Spa at <strong className="text-white">336 East 78th Street</strong> on
              the Upper East Side is a great choice for first-time luxury salon visitors because of
              what we offer under one roof: hair cuts, color, balayage, blowouts, updos, eyelash
              extensions, facials, and professional makeup. You can combine services in one visit
              or start with a single service and explore the rest over time.
            </p>
            <p className="mt-4">
              Our team has been serving the Upper East Side for over 13 years. We&apos;ve welcomed
              thousands of first-time clients who came in nervous and left as regulars. Our stylists
              — Kato, Megan, Sofia, Marcus, and Dhariana — are experienced with a wide range of
              hair types and backgrounds, and we take the consultation seriously for every guest,
              not just new ones.
            </p>
            <div className="border border-[#1a1a1a] bg-[#080808] p-5 mt-6 space-y-2">
              <p className="text-[var(--mc-accent)] text-[10px] uppercase tracking-widest font-semibold mb-3">Getting Here</p>
              <p className="text-sm text-[#555]">📍 336 East 78th St, between 1st & 2nd Ave</p>
              <p className="text-sm text-[#555]">🚇 6 train to 77th St (~2 min walk) or Q train to 72nd St (~6 min walk)</p>
              <p className="text-sm text-[#555]">📞 (212) 988-5252 · Walk-ins welcome</p>
              <Link href="/visit" className="text-[var(--mc-accent)] text-xs hover:underline inline-block mt-1">
                Full directions & transit guide →
              </Link>
            </div>
          </section>

          <FaqSection faqs={FAQS} title="First Visit FAQ" className="mt-6" />

          <div className="border border-[var(--mc-accent)]/30 bg-[#0a0800] p-8 text-center mt-8">
            <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-3">Ready for Your First Visit?</p>
            <h3 className="font-serif text-2xl font-bold text-white mb-3">Book Your Appointment</h3>
            <p className="text-[#555] text-sm mb-6 max-w-sm mx-auto">
              Online booking available 24/7. Walk-ins always welcome. 336 East 78th St · Upper East Side.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/book"
                className="gold-gradient-bg text-black font-bold px-8 py-3.5 uppercase tracking-widest text-xs hover:opacity-90 transition-opacity cursor-pointer">
                Book Online
              </Link>
              <Link href="/about"
                className="border border-[#333] text-[#888] px-8 py-3.5 uppercase tracking-widest text-xs hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer">
                About the Salon
              </Link>
            </div>
          </div>

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
