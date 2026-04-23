"use client";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function NewsletterStrip() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [focused, setFocused] = useState<"email" | "name" | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "subscribe", email, name }),
      });
      const data = await res.json();
      if (res.ok || res.status === 409) {
        setStatus("ok");
        setMsg(data.message || "You're on the list!");
      } else {
        setStatus("err");
        setMsg(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("err");
      setMsg("Connection error. Please try again.");
    }
  }

  return (
    <section ref={ref} className="relative py-20 px-6 overflow-hidden bg-[var(--mc-surface-dark)]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--mc-accent)]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--mc-accent)]/10 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[200px] rounded-full bg-[var(--mc-accent)/4] blur-[100px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="w-12 h-12 border border-[var(--mc-accent)]/30 flex items-center justify-center mx-auto mb-6">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--mc-accent)" strokeWidth="1.5" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>

          <p className="text-[var(--mc-accent)] text-[11px] tracking-[0.4em] uppercase mb-3">Stay in the Know</p>
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-3">
            The MC <span className="italic gold-gradient">Inner Circle</span>
          </h2>
          <p className="text-[var(--mc-text-dim)] text-sm max-w-md mx-auto mb-8 leading-relaxed">
            Exclusive offers, seasonal promotions, new services, and style tips — delivered straight to your inbox.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {status === "ok" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-3 px-8 py-4 border border-[var(--mc-accent)]/30 bg-[var(--mc-accent)/8]"
            >
              <div className="w-6 h-6 border border-[var(--mc-accent)]/40 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--mc-accent)" strokeWidth="2.5" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <p className="text-sm text-white">{msg}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused(null)}
                className="flex-1 bg-[var(--mc-surface-dark)] px-5 py-3.5 text-sm text-white placeholder-[#333] focus:outline-none transition-colors"
                style={{ border: `1px solid ${focused === "name" ? "var(--mc-accent)" : "#1a1a1a"}` }}
              />
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                className="flex-1 bg-[var(--mc-surface-dark)] px-5 py-3.5 text-sm text-white placeholder-[#333] focus:outline-none transition-colors"
                style={{ border: `1px solid ${focused === "email" ? "var(--mc-accent)" : "#1a1a1a"}` }}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="cursor-pointer px-8 py-3.5 bg-[var(--mc-accent)] text-black font-semibold text-xs uppercase tracking-widest hover:bg-[var(--mc-accent-2)] transition-all duration-200 disabled:opacity-50 whitespace-nowrap"
              >
                {status === "loading" ? "..." : "Subscribe"}
              </button>
            </form>
          )}
          {status === "err" && <p className="text-red-400 text-xs mt-3">{msg}</p>}
          <p className="text-[#333] text-[10px] mt-4">No spam, ever. Unsubscribe anytime.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8"
        >
          {["Exclusive offers", "New service alerts", "Style tips", "Seasonal promotions"].map((perk) => (
            <div key={perk} className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-[var(--mc-accent)/50]" />
              <span className="text-[11px] text-[var(--mc-text-dim)]">{perk}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
