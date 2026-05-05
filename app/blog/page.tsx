import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Clock, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Hair & Beauty Blog — Tips, Guides & Expert Advice",
  description:
    "Expert hair and beauty advice from the stylists at MC Hair Salon & Spa on the Upper East Side, NYC. Guides on balayage, blowouts, color treatments, bridal hair, and more.",
  keywords: [
    "hair salon blog Upper East Side",
    "balayage guide NYC",
    "hair color tips Manhattan",
    "blowout vs keratin treatment",
    "luxury salon blog NYC",
    "hair care advice Upper East Side",
  ],
  openGraph: {
    title: "Hair & Beauty Blog | MC Hair Salon & Spa NYC",
    description: "Expert guides from the stylists at MC Hair Salon & Spa. Upper East Side NYC.",
    url: "https://mchairsalon.com/blog",
  },
  alternates: { canonical: "https://mchairsalon.com/blog" },
};

const POSTS = [
  {
    slug: "best-balayage-upper-east-side",
    title: "Best Balayage on the Upper East Side: What to Look for in 2025",
    excerpt:
      "Balayage is the most requested color service in New York City. Here's everything you need to know before booking — including what separates a $120 balayage from a $450 one.",
    category: "Color & Highlights",
    readTime: "7 min read",
    date: "April 2025",
    featured: true,
  },
  {
    slug: "blowout-vs-keratin-treatment",
    title: "Blowout vs. Keratin Treatment: Which One Do You Actually Need?",
    excerpt:
      "Both smooth frizz and give you glossy, styled hair — but the similarities end there. We break down the differences in cost, commitment, results, and who each service is right for.",
    category: "Hair Services Guide",
    readTime: "6 min read",
    date: "March 2025",
    featured: false,
  },
  {
    slug: "your-first-visit-guide",
    title: "Your First Visit to a Luxury Hair Salon: A Complete Guide",
    excerpt:
      "Walking into a high-end salon for the first time can feel intimidating. We've put together everything you need to know — from what to wear to how to communicate with your stylist.",
    category: "First-Timer's Guide",
    readTime: "5 min read",
    date: "February 2025",
    featured: false,
  },
];

export default function BlogPage() {
  const [featured, ...rest] = POSTS;

  return (
    <>
      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-12 px-6 bg-[var(--mc-bg)] text-center">
        <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">
          Expert Advice
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
          Hair & Beauty Journal
        </h1>
        <p className="text-[var(--mc-muted)] text-sm max-w-md mx-auto leading-relaxed">
          Guides, tips, and insights from the stylists at MC Hair Salon & Spa — Upper East Side, NYC.
        </p>
      </section>

      <section className="py-16 px-6 bg-[var(--mc-bg)]">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* Featured post */}
          <Link href={`/blog/${featured.slug}`} className="block group cursor-pointer">
            <div className="border border-[#1a1a1a] bg-[#080808] p-8 sm:p-10 hover:border-[var(--mc-accent)]/40 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[10px] uppercase tracking-widest text-black font-bold gold-gradient-bg px-3 py-1">
                  Featured
                </span>
                <span className="text-[#555] text-xs">{featured.category}</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-4 group-hover:text-[var(--mc-accent)] transition-colors leading-snug">
                {featured.title}
              </h2>
              <p className="text-[#555] text-sm leading-relaxed mb-6 max-w-2xl">
                {featured.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-[#444] text-xs">
                  <span className="flex items-center gap-1.5"><Calendar size={11} /> {featured.date}</span>
                  <span className="flex items-center gap-1.5"><Clock size={11} /> {featured.readTime}</span>
                </div>
                <span className="flex items-center gap-1.5 text-[var(--mc-accent)] text-xs uppercase tracking-widest group-hover:gap-3 transition-all">
                  Read Article <ChevronRight size={12} />
                </span>
              </div>
            </div>
          </Link>

          {/* Other posts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {rest.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block group cursor-pointer">
                <div className="border border-[#1a1a1a] bg-[#080808] p-6 h-full hover:border-[var(--mc-accent)]/40 transition-colors flex flex-col">
                  <p className="text-[var(--mc-accent)] text-[10px] uppercase tracking-widest font-semibold mb-3">
                    {post.category}
                  </p>
                  <h2 className="font-serif text-lg font-bold text-white mb-3 group-hover:text-[var(--mc-accent)] transition-colors leading-snug flex-1">
                    {post.title}
                  </h2>
                  <p className="text-[#555] text-xs leading-relaxed mb-5">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3 text-[#444] text-xs">
                      <span className="flex items-center gap-1"><Clock size={10} /> {post.readTime}</span>
                    </div>
                    <span className="text-[var(--mc-accent)] text-xs uppercase tracking-widest flex items-center gap-1">
                      Read <ChevronRight size={10} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-16 px-6 bg-[#050505] border-t border-[#111] text-center">
        <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-4">
          Visit Us
        </p>
        <p className="text-white font-semibold mb-2">MC Hair Salon & Spa</p>
        <p className="text-[#555] text-sm mb-6">336 East 78th St · Upper East Side · New York, NY · (212) 988-5252</p>
        <Link href="/book"
          className="inline-flex items-center gap-2 gold-gradient-bg text-black font-bold px-10 py-4 uppercase tracking-widest text-xs hover:opacity-90 transition-opacity cursor-pointer">
          Book an Appointment <ChevronRight size={13} />
        </Link>
      </section>
    </>
  );
}
