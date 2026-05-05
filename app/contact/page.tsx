"use client";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Globe, Share2, CheckCircle } from "lucide-react";
import { SALON_INFO } from "@/lib/data";


export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSent(true);
      setForm({ name: "", email: "", message: "" });
    } finally {
      setSending(false);
    }
  };

  const inputClass = "w-full bg-[var(--mc-surface)] border border-[var(--mc-border)] text-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[#444]";
  const labelClass = "block text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-2";

  return (
    <>
      <section className="pt-20 sm:pt-26 pb-6 sm:pb-8 px-6 bg-[var(--mc-bg)] text-center">
        <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-3">Get in Touch</p>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-0">Contact Us</h1>
      </section>

      <section className="py-16 px-6 bg-[var(--mc-bg)]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
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
          </div>

          {/* Form */}
          <div>
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
                <button type="submit" disabled={sending}
                  className="w-full gold-gradient-bg text-black font-bold py-4 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer">
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="h-80 relative">
        <iframe
          src="https://maps.google.com/maps?q=336+East+78th+St,+New+York,+NY+10075&z=17&output=embed"
          width="100%" height="100%" style={{ border: 0, filter: "grayscale(100%) invert(90%) contrast(80%)" }}
          allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
          title="MC Hair Salon & Spa Location"
        />
      </section>
    </>
  );
}
