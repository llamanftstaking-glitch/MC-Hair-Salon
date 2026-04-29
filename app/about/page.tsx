import type { Metadata } from "next";
import Link from "next/link";
import { Star, Award, Users, Calendar, MapPin, ChevronRight, Scissors, Palette, Sparkles } from "lucide-react";
import FaqSection from "@/components/FaqSection";

export const metadata: Metadata = {
  title: "About MC Hair Salon & Spa | Upper East Side Since 2011",
  description:
    "Since 2011, MC Hair Salon & Spa has served 10,000+ clients on the Upper East Side. Learn our story and discover why we're the neighborhood's most trusted full-service salon at 336 E 78th St.",
  keywords: [
    "about MC Hair Salon Upper East Side",
    "Upper East Side hair salon history",
    "best hair salon Upper East Side NYC",
    "luxury salon Manhattan since 2011",
    "hair salon spa 78th street NYC",
    "MC Hair Salon story team",
  ],
  openGraph: {
    title: "About MC Hair Salon & Spa | Upper East Side NYC Since 2011",
    description:
      "13 years. 10,000+ clients. One address: 336 East 78th St, New York. The Upper East Side's only full-service hair, spa, and makeup destination.",
    url: "https://mchairsalon.com/about",
  },
  alternates: { canonical: "https://mchairsalon.com/about" },
};

const ABOUT_FAQ = [
  {
    q: "How long has MC Hair Salon & Spa been open?",
    a: "MC Hair Salon & Spa has been serving the Upper East Side of Manhattan since 2011 — over 13 years. We opened at our current location at 336 East 78th Street and have been a neighborhood institution ever since.",
  },
  {
    q: "How many clients does MC Hair Salon serve?",
    a: "We have proudly served over 10,000 clients throughout our 13+ years in business. Our loyal client base spans the Upper East Side, the broader Manhattan area, and visitors from across the country.",
  },
  {
    q: "What makes MC Hair Salon different from other Upper East Side salons?",
    a: "MC Hair Salon & Spa is one of the only full-service beauty destinations on the Upper East Side — combining expert hair services (cuts, color, balayage, blowouts), professional spa treatments (facials, eyelash extensions), and full makeup artistry under one roof. Most competitors specialize in only one of these areas. We offer everything, which makes us the neighborhood's go-to for bridal parties, events, and everyday luxury.",
  },
  {
    q: "Who are the stylists at MC Hair Salon?",
    a: "Our team includes Kato (Master Stylist, specializing in precision cuts and advanced color), Megan (Senior Stylist & Color Expert, L'Oréal certified), Sofia (Spa Specialist, lash extensions and facials), Marcus (Men's Grooming Expert), and Isabella (Resident Makeup Artist, specializing in bridal and airbrush). Each stylist has years of experience in their specialty.",
  },
  {
    q: "Does MC Hair Salon accept walk-ins?",
    a: "Yes! Walk-ins are always welcome at MC Hair Salon & Spa. We recommend calling ahead at (212) 988-5252 to confirm availability, especially for color services and weekend appointments. You can also book online at mchairsalon.com/book.",
  },
  {
    q: "What are MC Hair Salon's hours?",
    a: "We are open Monday 10AM–5PM, Tuesday through Thursday 10:30AM–7:30PM, Friday 10AM–7PM, Saturday 10AM–7PM, and Sunday 11AM–6PM.",
  },
  {
    q: "Does MC Hair Salon offer bridal and event services?",
    a: "Yes — bridal and special event services are one of our signature offerings. We provide full bridal packages including hair styling, updos, makeup, and spa treatments for the entire wedding party. Our in-house makeup artist Isabella specializes in bridal looks, and we offer trial sessions to ensure your look is perfect on the day.",
  },
];

const MILESTONES = [
  { year: "2011", event: "MC Hair Salon & Spa opens at 336 East 78th St, Upper East Side" },
  { year: "2013", event: "Expanded spa services; added eyelash extensions and facials" },
  { year: "2016", event: "Surpassed 3,000 loyal clients in the Upper East Side community" },
  { year: "2019", event: "Launched bridal & special event packages; became a top wedding venue partner" },
  { year: "2021", event: "10-year anniversary; celebrated 7,000+ clients served" },
  { year: "2023", event: "Introduced online booking, MC Rewards loyalty program, and gift cards" },
  { year: "2024+", event: "Serving 10,000+ clients and growing — still at 336 East 78th St" },
];

const ADVANTAGES = [
  {
    icon: <Scissors size={20} />,
    title: "Full-Service Under One Roof",
    body: "Hair cuts, color, balayage, blowouts, updos, eyelash extensions, facials, and professional makeup — all at one address. No other salon on the Upper East Side offers this breadth of luxury services.",
  },
  {
    icon: <Award size={20} />,
    title: "13+ Years of Proven Excellence",
    body: "In a neighborhood where salons open and close constantly, we've maintained a 5-star reputation for over 13 years. Our longevity is our strongest endorsement.",
  },
  {
    icon: <Users size={20} />,
    title: "10,000+ Satisfied Clients",
    body: "A client base that large doesn't happen by accident. It's built visit by visit, through consistent results and a team that genuinely cares about every guest.",
  },
  {
    icon: <Palette size={20} />,
    title: "L'Oréal Color Expertise",
    body: "Our colorists are trained in L'Oréal Majerel and Inoa systems — professional-grade color lines used in the world's best salons, with formulas that prioritize hair health and vibrancy.",
  },
  {
    icon: <Sparkles size={20} />,
    title: "Beauty-as-Wellness Approach",
    body: "We treat every appointment as a moment of restoration, not just a service transaction. From the wash to the finish, the experience is designed to make you feel as good as you look.",
  },
  {
    icon: <MapPin size={20} />,
    title: "The Heart of the Upper East Side",
    body: "Located mid-block on East 78th St — three blocks from The Met, steps from the 6 train, and surrounded by one of New York's most beautiful residential neighborhoods.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-16 px-6 bg-black text-center">
        <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">
          Our Story
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 max-w-3xl mx-auto leading-tight">
          13 Years at the Heart of the{" "}
          <span className="gold-gradient">Upper East Side</span>
        </h1>
        <p className="text-[var(--mc-muted)] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Since 2011, MC Hair Salon & Spa has been the Upper East Side&apos;s most trusted destination for
          luxury hair, spa, and makeup services — all under one roof at 336 East 78th Street.
        </p>
      </section>

      {/* Stats */}
      <section className="bg-[var(--mc-surface)] border-y border-[var(--mc-border)] py-8">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "2011", label: "Year Founded" },
            { value: "10,000+", label: "Clients Served" },
            { value: "5★", label: "Average Rating" },
            { value: "13+", label: "Years in Business" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-serif text-3xl gold-gradient font-bold">{s.value}</p>
              <p className="text-[var(--mc-text-dim)] text-xs uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-3xl mx-auto">
          <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">
            The Story
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-8">
            Where We Came From
          </h2>

          <div className="space-y-6 text-[var(--mc-muted)] text-base leading-relaxed">
            <p>
              MC Hair Salon & Spa opened its doors on East 78th Street in 2011 with a simple conviction:
              that the Upper East Side deserved a salon that combined the technical precision of a high-end
              specialist with the breadth of services of a full-service destination. A place where a client
              could walk in for a haircut, book a facial, and leave with a fresh blowout — all in one visit.
            </p>
            <p>
              That vision shaped everything: the team we hired, the services we developed, the atmosphere
              we cultivated. Over 13 years, we&apos;ve grown from a small neighborhood salon into one of the
              Upper East Side&apos;s most beloved beauty institutions, serving more than{" "}
              <strong className="text-white">10,000 clients</strong> and earning a consistent{" "}
              <strong className="text-white">5-star reputation</strong> across every major review platform.
            </p>
            <p>
              What hasn&apos;t changed is the address: <strong className="text-white">336 East 78th Street</strong>.
              In a neighborhood where commercial storefronts turn over faster than seasons, we&apos;ve stayed —
              building roots, building trust, and building relationships that span years and generations of
              Upper East Side families.
            </p>
            <p>
              Today, MC Hair Salon & Spa is the Upper East Side&apos;s only full-service luxury beauty destination
              offering <strong className="text-white">hair, spa, and makeup</strong> under one roof.
              We remain committed to the same standard that defined our first day: exceptional work, genuine
              care, and an experience worthy of this extraordinary neighborhood.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-6 bg-[#050505] border-y border-[#111]">
        <div className="max-w-3xl mx-auto">
          <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4 text-center">
            Our Journey
          </p>
          <h2 className="font-serif text-3xl font-bold text-white mb-12 text-center">
            Milestones
          </h2>
          <div className="space-y-0">
            {MILESTONES.map((m, i) => (
              <div key={i} className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border-2 border-[var(--mc-accent)]/40 group-hover:border-[var(--mc-accent)] flex items-center justify-center shrink-0 transition-colors bg-[#080808]">
                    <div className="w-2 h-2 rounded-full bg-[var(--mc-accent)]" />
                  </div>
                  {i < MILESTONES.length - 1 && (
                    <div className="w-px flex-1 bg-[#1a1a1a] my-1" />
                  )}
                </div>
                <div className="pb-8">
                  <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-1">
                    {m.year}
                  </p>
                  <p className="text-[var(--mc-muted)] text-sm leading-relaxed">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">
              Why MC Hair
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              What Sets Us Apart
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ADVANTAGES.map((a, i) => (
              <div key={i} className="border border-[#1a1a1a] bg-[#080808] p-6">
                <div className="text-[var(--mc-accent)] mb-4">{a.icon}</div>
                <h3 className="text-white font-semibold text-sm mb-3">{a.title}</h3>
                <p className="text-[#555] text-sm leading-relaxed">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="py-16 px-6 bg-[#050505] border-y border-[#111]">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-2">Our People</p>
            <h2 className="font-serif text-2xl font-bold text-white mb-2">Meet the Team</h2>
            <p className="text-[#555] text-sm leading-relaxed max-w-sm">
              Kato, Megan, Sofia, Marcus, and Isabella — five specialists with one shared commitment
              to your best look.
            </p>
          </div>
          <Link href="/team"
            className="flex items-center gap-2 border border-[var(--mc-accent)]/50 text-[var(--mc-accent)] px-7 py-3.5 text-xs uppercase tracking-widest hover:border-[var(--mc-accent)] hover:bg-[var(--mc-accent)]/5 transition-all cursor-pointer whitespace-nowrap shrink-0">
            Meet the Team <ChevronRight size={13} />
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-black">
        <div className="max-w-3xl mx-auto">
          <FaqSection faqs={ABOUT_FAQ} title="About MC Hair Salon — FAQ" />
        </div>
      </section>

      {/* Book CTA */}
      <section className="py-16 px-6 bg-[var(--mc-surface)] border-t border-[var(--mc-border)] text-center">
        <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">
          Ready to Visit?
        </p>
        <h2 className="font-serif text-3xl font-bold text-white mb-6">
          Book Your Appointment
        </h2>
        <p className="text-[#555] text-sm mb-8 max-w-sm mx-auto">
          Online booking is available 24/7. Walk-ins welcome. Call us at (212) 988-5252.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/book"
            className="gold-gradient-bg text-black font-bold px-10 py-4 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity cursor-pointer">
            Book Online
          </Link>
          <Link href="/visit"
            className="border border-[#333] text-[#888] px-10 py-4 uppercase tracking-widest text-sm hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)] transition-all cursor-pointer">
            How to Get Here
          </Link>
        </div>
      </section>
    </>
  );
}
