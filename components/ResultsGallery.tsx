import Image from "next/image";
import Link from "next/link";

const GALLERY = [
  { src: "/hope/IMG_5036.jpg",   label: "Color Correction",     span: "col-span-1 row-span-2" },
  { src: "/hope/IMG_5888.JPEG",  label: "Highlights & Blowout", span: "col-span-1 row-span-1" },
  { src: "/hope/IMG_4603.JPEG",  label: "Highlights",           span: "col-span-1 row-span-1" },
  { src: "/hope/IMG_6359.JPEG",  label: "Balayage",             span: "col-span-2 row-span-1" },
  { src: "/hope/IMG_9318.JPG",   label: "Color & Style",        span: "col-span-1 row-span-1" },
  { src: "/hope/IMG_4872.jpg",   label: "Balayage & Blowout",   span: "col-span-1 row-span-1" },
  { src: "/hope/5D4F5F4C.jpg",   label: "Balayage",             span: "col-span-1 row-span-1" },
  { src: "/hope/IMG_5544.jpg",   label: "Baby Lights",          span: "col-span-1 row-span-1" },
  { src: "/hope/F3524012.jpg",   label: "Highlights",           span: "col-span-1 row-span-1" },
];

export default function ResultsGallery() {
  return (
    <section className="py-16 sm:py-24 px-6 bg-[var(--mc-surface-dark)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">Client Transformations</p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white">The Work</h2>
          <p className="text-[var(--mc-muted)] text-sm mt-4 max-w-lg mx-auto">Every look is personal. Every result is intentional.</p>
        </div>

        {/* Asymmetric grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3" style={{ gridTemplateRows: "280px 280px 220px" }}>
          {GALLERY.map((item, i) => (
            <Link key={i} href="/book"
              className={`relative overflow-hidden group cursor-pointer ${item.span}`}>
              <Image
                src={item.src}
                alt={`${item.label} at MC Hair Salon Upper East Side NYC`}
                fill
                sizes="(max-width: 640px) 33vw, 25vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white font-serif font-bold text-base sm:text-lg leading-tight">{item.label}</p>
                <p className="text-[var(--mc-accent)] text-[10px] uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Book this look →
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link href="/gallery"
            className="border border-[var(--mc-accent)] text-[var(--mc-accent)] px-10 py-4 uppercase tracking-widest text-sm hover:bg-[var(--mc-accent)] hover:text-black transition-all duration-300 cursor-pointer">
            View Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
}
