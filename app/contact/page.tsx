"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Globe, Share2, CheckCircle } from "lucide-react";
import { SALON_INFO } from "@/lib/data";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" } }),
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  const inputClass = "w-full bg-[var(--mc-surface)] border border-[var(--mc-border)] text-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[#444]";
  const labelClass = "block text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-2";

  return (
    <>
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-16 px-6 bg-black text-center">
        <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={0}
          className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">
          Get in Touch
        </motion.p>
        <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
          Contact Us
        </motion.h1>
      </section>

      <section className="py-16 px-6 bg-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Info */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="font-serif text-3xl font-bold text-white mb-10">Visit Us</h2>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 border border-[var(--mc-accent)] flex items-center justify-center text-[var(--mc-accent)] shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-1">Address</p>
                  <p className="text-white">{SALON_INFO.address}</p>
                  <a href="https://maps.google.com/?q=336+East+78th+St+New+York+NY+10075"
                    target="_blank" rel="noopener noreferrer"
                    className="text-[var(--mc-text-dim)] text-sm hover:text-[var(--mc-accent)] transition-colors mt-1 inline-block cursor-pointer">
                    Get Directions →
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 border border-[var(--mc-accent)] flex items-center justify-center text-[var(--mc-accent)] shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-1">Phone</p>
                  <a href={`tel:${SALON_INFO.phone}`}
                    className="text-white hover:text-[var(--mc-accent)] transition-colors cursor-pointer">
                    {SALON_INFO.phone}
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 border border-[var(--mc-accent)] flex items-center justify-center text-[var(--mc-accent)] shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-1">Email</p>
                  <a href={`mailto:${SALON_INFO.email}`}
                    className="text-white hover:text-[var(--mc-accent)] transition-colors cursor-pointer">
                    {SALON_INFO.email}
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 border border-[var(--mc-accent)] flex items-center justify-center text-[var(--mc-accent)] shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-3">Hours</p>
                  <div className="space-y-1.5">
                    {SALON_INFO.hours.map((h) => (
                      <div key={h.day} className="flex justify-between gap-8 text-sm">
                        <span className="text-[var(--mc-text-dim)]">{h.day}</span>
                        <span className="text-white">{h.open} – {h.close}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <a href={SALON_INFO.instagram} target="_blank" rel="noopener noreferrer"
                  className="w-12 h-12 border border-[var(--mc-border)] flex items-center justify-center text-[var(--mc-text-dim)] hover:text-[var(--mc-accent)] hover:border-[var(--mc-accent)] transition-all cursor-pointer">
                  <Globe size={20} />
                </a>
                <a href={SALON_INFO.facebook} target="_blank" rel="noopener noreferrer"
                  className="w-12 h-12 border border-[var(--mc-border)] flex items-center justify-center text-[var(--mc-text-dim)] hover:text-[var(--mc-accent)] hover:border-[var(--mc-accent)] transition-all cursor-pointer">
                  <Share2 size={20} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
            <h2 className="font-serif text-3xl font-bold text-white mb-10">Send a Message</h2>

            {sent ? (
              <div className="luxury-card p-10 text-center">
                <CheckCircle size={48} className="text-[var(--mc-accent)] mx-auto mb-4" />
                <h3 className="font-serif text-2xl text-white mb-3">Message Sent!</h3>
                <p className="text-[var(--mc-muted)]">We&apos;ll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)}
                  className="mt-6 text-[var(--mc-accent)] text-sm underline cursor-pointer">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="luxury-card p-8 space-y-6">
                <div>
                  <label htmlFor="name" className={labelClass}>Name *</label>
                  <input id="name" name="name" type="text" required
                    value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="Your name" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>Email *</label>
                  <input id="email" name="email" type="email" required
                    value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    placeholder="your@email.com" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="message" className={labelClass}>Message *</label>
                  <textarea id="message" name="message" required rows={6}
                    value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                    placeholder="How can we help you?"
                    className={`${inputClass} resize-none`} />
                </div>
                <button type="submit"
                  className="w-full gold-gradient-bg text-black font-bold py-4 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity cursor-pointer">
                  Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* Map */}
      <section className="h-80 relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.4826707!2d-73.9533!3d40.7726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c258b38f3aaaab%3A0x1234!2s336+E+78th+St%2C+New+York%2C+NY+10075!5e0!3m2!1sen!2sus!4v1234567890"
          width="100%" height="100%" style={{ border: 0, filter: "grayscale(100%) invert(90%) contrast(80%)" }}
          allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
          title="MC Hair Salon & Spa Location"
        />
      </section>
    </>
  );
}
