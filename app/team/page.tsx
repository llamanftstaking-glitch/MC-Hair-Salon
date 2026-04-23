"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { TEAM } from "@/lib/data";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.15, ease: "easeOut" } }),
};

export default function TeamPage() {
  return (
    <>
      <section className="pt-32 pb-16 px-6 bg-black text-center">
        <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={0}
          className="text-[#C9A84C] uppercase tracking-[0.4em] text-xs font-semibold mb-4">
          The Experts
        </motion.p>
        <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="font-serif text-5xl md:text-6xl font-bold text-white mb-6">
          Our Team
        </motion.h1>
        <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
          className="text-[#a89070] max-w-xl mx-auto leading-relaxed">
          A talented team of stylists and spa specialists who have been crafting beauty together for over a decade.
        </motion.p>
      </section>

      <section className="py-20 px-6 bg-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {TEAM.map((member, i) => (
            <motion.div key={member.name}
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
              className="luxury-card overflow-hidden group">
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={member.image} alt={member.name} fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <p className="font-serif text-2xl font-bold text-white">{member.name}</p>
                  <p className="text-[#C9A84C] text-sm uppercase tracking-widest mt-1">{member.role}</p>
                </div>
              </div>
              <div className="p-8">
                <p className="text-[#a89070] text-sm leading-relaxed mb-6">{member.bio}</p>
                <div>
                  <p className="text-[#C9A84C] text-xs uppercase tracking-widest font-semibold mb-3">Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    {member.specialties.map((spec) => (
                      <span key={spec}
                        className="border border-[#2a2a2a] text-[#666] text-xs px-3 py-1.5 uppercase tracking-wider">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
                <Link href="/book"
                  className="mt-8 inline-block gold-gradient-bg text-black text-xs font-bold px-8 py-3 uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer">
                  Book with {member.name}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
