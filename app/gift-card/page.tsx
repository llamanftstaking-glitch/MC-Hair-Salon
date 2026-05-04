"use client";
import { useState } from "react";
import Link from "next/link";
import { Gift, Mail, MessageSquare, Check, Loader, ChevronRight } from "lucide-react";

const AMOUNTS = [25, 50, 100, 200];

interface GiftCardForm {
  amount: number | null;
  customAmount: string;
  recipientName: string;
  recipientEmail: string;
  recipientPhone: string;
  senderName: string;
  message: string;
  deliveryMethod: "email" | "sms" | "both";
  yourEmail: string;
}

const EMPTY: GiftCardForm = {
  amount: 100, customAmount: "", recipientName: "", recipientEmail: "",
  recipientPhone: "", senderName: "", message: "", deliveryMethod: "email", yourEmail: "",
};

export default function GiftCardPage() {
  const [form, setForm] = useState<GiftCardForm>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const finalAmount = form.amount ?? (form.customAmount ? parseInt(form.customAmount) : 0);

  const inputClass = "w-full bg-[var(--mc-surface)] border border-[var(--mc-border)] text-[var(--mc-text)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[var(--mc-text-dim)]";
  const labelClass = "block text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-2";

  async function handleCheckout() {
    if (!finalAmount || finalAmount < 10) { setError("Please select or enter a valid amount."); return; }
    if (!form.recipientName) { setError("Recipient name is required."); return; }
    if (form.deliveryMethod !== "sms" && !form.recipientEmail) { setError("Recipient email is required."); return; }
    if (form.deliveryMethod !== "email" && !form.recipientPhone) { setError("Recipient phone is required for SMS delivery."); return; }
    if (!form.senderName) { setError("Your name is required."); return; }
    if (!form.yourEmail) { setError("Your email is required for the receipt."); return; }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "gift_card",
          giftCardAmount: finalAmount,
          recipientName: form.recipientName,
          recipientEmail: form.recipientEmail,
          recipientPhone: form.recipientPhone,
          senderName: form.senderName,
          message: form.message,
          deliveryMethod: form.deliveryMethod,
          customerEmail: form.yourEmail,
          customerName: form.senderName,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      {/* ── Hero ── */}
      <section className="pt-28 sm:pt-36 pb-16 px-6 bg-black text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(184,134,11,0.15) 0%, transparent 70%)" }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">The Perfect Present</p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">Gift Cards</h1>
          <div className="mx-auto h-px w-20 bg-gradient-to-r from-transparent via-[var(--mc-accent)] to-transparent mb-6" />
          <p className="text-[var(--mc-muted)] leading-relaxed text-lg">
            Give someone the gift of luxury. Delivered instantly by email or text — redeemable for any service at MC Hair Salon & Spa.
          </p>
        </div>
      </section>

      {/* ── Main Split Layout ── */}
      <section className="py-16 px-6 bg-[var(--mc-bg)]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

            {/* ── LEFT: Form ── */}
            <div className="space-y-8">

              {/* Step 1: Amount */}
              <div className="luxury-card p-8">
                <h2 className="font-serif text-xl font-bold text-[var(--mc-text)] mb-6 flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full gold-gradient-bg text-black text-xs font-bold flex items-center justify-center shrink-0">1</span>
                  Choose Amount
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {AMOUNTS.map(a => (
                    <button key={a} onClick={() => setForm(f => ({ ...f, amount: a, customAmount: "" }))}
                      className={`py-4 font-serif text-xl font-bold cursor-pointer transition-all duration-200 border ${
                        form.amount === a && !form.customAmount
                          ? "gold-gradient-bg text-black border-transparent"
                          : "border-[var(--mc-border)] text-[var(--mc-text)] hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)]"
                      }`}>
                      ${a}
                    </button>
                  ))}
                </div>
                <div>
                  <label className={labelClass}>Custom Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--mc-text-dim)] text-sm">$</span>
                    <input
                      type="number" min="10" max="1000"
                      value={form.customAmount}
                      onChange={e => setForm(f => ({ ...f, customAmount: e.target.value, amount: null }))}
                      placeholder="Enter amount (min $10)"
                      className={`${inputClass} pl-8`}
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Recipient */}
              <div className="luxury-card p-8">
                <h2 className="font-serif text-xl font-bold text-[var(--mc-text)] mb-6 flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full gold-gradient-bg text-black text-xs font-bold flex items-center justify-center shrink-0">2</span>
                  Personalize It
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Recipient&apos;s Name *</label>
                    <input type="text" value={form.recipientName}
                      onChange={e => setForm(f => ({ ...f, recipientName: e.target.value }))}
                      placeholder="Who is this for?" className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}>Your Name *</label>
                    <input type="text" value={form.senderName}
                      onChange={e => setForm(f => ({ ...f, senderName: e.target.value }))}
                      placeholder="Your name" className={inputClass} />
                  </div>

                  <div>
                    <label className={labelClass}>Personal Message</label>
                    <textarea rows={3} value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Write something special... (optional)"
                      className={`${inputClass} resize-none`} maxLength={200} />
                    <p className="text-[var(--mc-text-dim)] text-xs mt-1 text-right">{form.message.length}/200</p>
                  </div>
                </div>
              </div>

              {/* Step 3: Delivery */}
              <div className="luxury-card p-8">
                <h2 className="font-serif text-xl font-bold text-[var(--mc-text)] mb-6 flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full gold-gradient-bg text-black text-xs font-bold flex items-center justify-center shrink-0">3</span>
                  How to Send It
                </h2>

                {/* Delivery method toggle */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { id: "email" as const, icon: <Mail size={16} />, label: "Email" },
                    { id: "sms" as const, icon: <MessageSquare size={16} />, label: "Text" },
                    { id: "both" as const, icon: <Gift size={16} />, label: "Both" },
                  ].map(opt => (
                    <button key={opt.id} onClick={() => setForm(f => ({ ...f, deliveryMethod: opt.id }))}
                      className={`flex flex-col items-center gap-2 py-4 cursor-pointer transition-all border ${
                        form.deliveryMethod === opt.id
                          ? "border-[var(--mc-accent)] text-[var(--mc-accent)] bg-[var(--mc-accent)]/5"
                          : "border-[var(--mc-border)] text-[var(--mc-text-dim)] hover:border-[var(--mc-accent)]/50"
                      }`}>
                      {opt.icon}
                      <span className="text-xs uppercase tracking-widest font-semibold">{opt.label}</span>
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  {(form.deliveryMethod === "email" || form.deliveryMethod === "both") && (
                    <div>
                      <label className={labelClass}>Recipient&apos;s Email *</label>
                      <input type="email" value={form.recipientEmail}
                        onChange={e => setForm(f => ({ ...f, recipientEmail: e.target.value }))}
                        placeholder="their@email.com" className={inputClass} />
                    </div>
                  )}
                  {(form.deliveryMethod === "sms" || form.deliveryMethod === "both") && (
                    <div>
                      <label className={labelClass}>Recipient&apos;s Phone *</label>
                      <input type="tel" value={form.recipientPhone}
                        onChange={e => setForm(f => ({ ...f, recipientPhone: e.target.value }))}
                        placeholder="(212) 000-0000" className={inputClass} />
                    </div>
                  )}
                  <div>
                    <label className={labelClass}>Your Email (for receipt) *</label>
                    <input type="email" value={form.yourEmail}
                      onChange={e => setForm(f => ({ ...f, yourEmail: e.target.value }))}
                      placeholder="your@email.com" className={inputClass} />
                  </div>
                </div>
              </div>

              {error && <p className="text-red-400 text-sm px-1">{error}</p>}

              <button onClick={handleCheckout} disabled={loading || !finalAmount}
                className="w-full gold-gradient-bg text-black font-bold py-5 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer flex items-center justify-center gap-3">
                {loading
                  ? <><Loader size={18} className="animate-spin" /> Preparing checkout...</>
                  : <><Gift size={18} /> Purchase ${finalAmount || "—"} Gift Card</>}
              </button>

              <p className="text-center text-[var(--mc-text-dim)] text-xs">
                Secure checkout powered by Stripe · Gift cards never expire
              </p>
            </div>

            {/* ── RIGHT: Live Card Preview ── */}
            <div className="lg:sticky lg:top-28">
              <p className="text-[var(--mc-accent)] text-xs uppercase tracking-[0.3em] font-semibold mb-5 text-center">Live Preview</p>

              {/* Gift Card */}
              <div className="relative mx-auto max-w-sm">
                <div className="relative w-full rounded-2xl overflow-hidden"
                  style={{
                    aspectRatio: "1.586/1",
                    background: "linear-gradient(135deg, #0a0a0a 0%, #1c1400 40%, #0f0a00 70%, #0a0a0a 100%)",
                    boxShadow: "0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(184,134,11,0.4), inset 0 1px 0 rgba(255,215,0,0.1)",
                  }}>
                  {/* Glow */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse 80% 60% at 30% 30%, rgba(184,134,11,0.08) 0%, transparent 60%)" }} />

                  <div className="relative z-10 flex flex-col justify-between h-full p-7">
                    {/* Top row */}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-serif text-white text-sm font-bold tracking-widest">MC</p>
                        <p className="text-[#C9A84C] text-[9px] tracking-[0.25em] uppercase leading-tight">Hair Salon & Spa</p>
                      </div>
                      <p className="text-[#C9A84C] text-[9px] tracking-[0.2em] uppercase">Gift Card</p>
                    </div>

                    {/* Amount */}
                    <div className="text-center">
                      <p className="font-serif font-bold leading-none"
                        style={{ fontSize: "clamp(2.5rem, 8vw, 3.5rem)", background: "linear-gradient(135deg, #B8860B 0%, #FFD700 50%, #B8860B 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        {finalAmount ? `$${finalAmount}` : "$—"}
                      </p>
                    </div>

                    {/* Bottom */}
                    <div>
                      <div className="h-px w-full mb-4" style={{ background: "linear-gradient(90deg, transparent, rgba(184,134,11,0.4), transparent)" }} />
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[#555] text-[8px] tracking-[0.2em] uppercase mb-0.5">To</p>
                          <p className="text-white text-sm font-semibold">{form.recipientName || "—"}</p>
                          {form.message && (
                            <p className="text-[#888] text-[10px] italic mt-1 max-w-[160px] leading-tight truncate">&ldquo;{form.message}&rdquo;</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-[#555] text-[8px] tracking-[0.2em] uppercase mb-0.5">From</p>
                          <p className="text-[#a89070] text-sm">{form.senderName || "—"}</p>
                        </div>
                      </div>
                      <div className="mt-4 bg-black/40 rounded px-3 py-2 text-center border border-[#C9A84C]/20">
                        <p className="text-[#C9A84C] font-mono text-xs tracking-[0.3em]">•••• •••• •••• ••••</p>
                        <p className="text-[#444] text-[8px] tracking-widest uppercase mt-0.5">Code revealed after purchase</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shine effect */}
                <div className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)" }} />
              </div>

              {/* Delivery preview */}
              <div className="mt-6 luxury-card p-5 space-y-3">
                <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold">Delivery Details</p>
                <div className="flex items-center gap-3 text-sm">
                  {form.deliveryMethod === "email" && <><Mail size={14} className="text-[var(--mc-accent)] shrink-0" /><span className="text-[var(--mc-text-dim)]">{form.recipientEmail || "Recipient email"}</span></>}
                  {form.deliveryMethod === "sms" && <><MessageSquare size={14} className="text-[var(--mc-accent)] shrink-0" /><span className="text-[var(--mc-text-dim)]">{form.recipientPhone || "Recipient phone"}</span></>}
                  {form.deliveryMethod === "both" && (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2"><Mail size={13} className="text-[var(--mc-accent)]" /><span className="text-[var(--mc-text-dim)]">{form.recipientEmail || "Email"}</span></div>
                      <div className="flex items-center gap-2"><MessageSquare size={13} className="text-[var(--mc-accent)]" /><span className="text-[var(--mc-text-dim)]">{form.recipientPhone || "Phone"}</span></div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--mc-text-dim)]">
                  <Check size={12} className="text-green-400" /> Delivered instantly after payment
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--mc-text-dim)]">
                  <Check size={12} className="text-green-400" /> Never expires
                </div>
                <div className="flex items-center gap-2 text-xs text-[var(--mc-text-dim)]">
                  <Check size={12} className="text-green-400" /> Valid for all services
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 px-6 bg-[var(--mc-surface-dark)]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl font-bold text-[var(--mc-text)] mb-12">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Choose & Personalize", body: "Pick an amount, write a message, and choose email or text delivery." },
              { step: "02", title: "Secure Checkout", body: "Pay safely via Stripe. Your gift card is generated instantly upon payment." },
              { step: "03", title: "They Receive It", body: "A beautiful digital gift card lands in their inbox or as a text — ready to redeem at any visit." },
            ].map(s => (
              <div key={s.step} className="luxury-card p-8 text-center">
                <p className="font-serif text-4xl gold-gradient font-bold mb-4">{s.step}</p>
                <h3 className="text-[var(--mc-text)] font-semibold mb-3">{s.title}</h3>
                <p className="text-[var(--mc-text-dim)] text-sm leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-6 bg-[var(--mc-bg)]">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-[var(--mc-text)] mb-10 text-center">Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Do gift cards expire?", a: "Never. MC gift cards have no expiration date." },
              { q: "Can I use it for any service?", a: "Yes — haircuts, color, spa treatments, makeup, everything on our menu." },
              { q: "What if I send it to the wrong address?", a: "Contact us at (212) 988-5252 and we'll reissue it to the correct address." },
              { q: "Can I buy multiple gift cards?", a: "Absolutely. Complete one purchase per card, or call us to arrange bulk orders." },
              { q: "How does SMS delivery work?", a: "We send a text message with your gift card code and redemption instructions directly to the recipient's phone." },
            ].map(faq => (
              <div key={faq.q} className="luxury-card p-6">
                <div className="flex gap-3">
                  <ChevronRight size={16} className="text-[var(--mc-accent)] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[var(--mc-text)] font-semibold mb-1">{faq.q}</p>
                    <p className="text-[var(--mc-text-dim)] text-sm leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-6 bg-[var(--mc-surface-dark)] text-center">
        <div className="max-w-xl mx-auto">
          <Gift size={40} className="text-[var(--mc-accent)] mx-auto mb-6" />
          <h2 className="font-serif text-3xl font-bold text-[var(--mc-text)] mb-4">Questions? Call Us.</h2>
          <p className="text-[var(--mc-text-dim)] mb-8">We can arrange gift cards by phone for custom amounts or bulk orders.</p>
          <a href="tel:+12129885252"
            className="gold-gradient-bg text-black font-bold px-12 py-4 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity cursor-pointer inline-block">
            (212) 988-5252
          </a>
        </div>
      </section>
    </>
  );
}
