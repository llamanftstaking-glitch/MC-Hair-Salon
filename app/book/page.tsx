"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  Check, ShieldCheck, CreditCard, AlertTriangle, Loader, Scissors, CalendarDays,
} from "lucide-react";
import GoogleSignInButton, { type AuthCustomer } from "@/components/GoogleSignInButton";

// ── Stripe ────────────────────────────────────────────────────────────────────
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : Promise.resolve(null);

const CARD_STYLE = {
  style: {
    base: {
      color: "#ffffff",
      fontFamily: '"Inter", sans-serif',
      fontSize: "15px",
      fontSmoothing: "antialiased",
      "::placeholder": { color: "#444" },
      iconColor: "#B8860B",
    },
    invalid: { color: "#ff4d4d", iconColor: "#ff4d4d" },
  },
};

// ── Static data ───────────────────────────────────────────────────────────────
const SERVICES = [
  "Women's Haircut",
  "Men's Haircut",
  "Kids' Haircut",
  "Curly Cut",
  "Blowout / Blow Dry",
  "Balayage",
  "Highlights",
  "Baby Lights",
  "Hair Color",
  "Color Correction",
  "Keratin Treatment",
  "Hair Botox Treatment",
  "Relaxer",
  "Updo & Special Event Styling",
  "Bridal Makeup",
  "Makeup Application",
  "Eyebrow & Lip Wax",
  "Other (specify in notes)",
];

const STYLISTS = ["No preference", "Maria", "Meagan", "Sally", "Kato", "Juany", "Dhariana"];

const TIME_SLOTS = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "1:00 PM",  "1:30 PM",  "2:00 PM",  "2:30 PM",
  "3:00 PM",  "3:30 PM",  "4:00 PM",  "4:30 PM",
  "5:00 PM",  "5:30 PM",  "6:00 PM",  "6:30 PM",
  "7:00 PM",
];

// ── Shared styles ─────────────────────────────────────────────────────────────
const inputCls  = "w-full bg-[#080808] border border-[#1a1a1a] text-white px-5 py-4 text-base focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[#555]";
const selectCls = "w-full bg-[#080808] border border-[#1a1a1a] text-white px-5 py-4 text-base focus:outline-none focus:border-[var(--mc-accent)] transition-colors appearance-none";
const labelCls  = "block text-white text-sm font-semibold mb-2";

// ── Phase 1 — Card capture ────────────────────────────────────────────────────
interface CardData {
  name: string;
  email: string;
  phone: string;
  stripeCustomerId: string;
  stripePaymentMethodId: string;
}

function CardCaptureForm({
  onSuccess,
  prefill,
}: {
  onSuccess: (data: CardData) => void;
  prefill?: { name: string; email: string; phone: string };
}) {
  const stripe   = useStripe();
  const elements = useElements();

  const [name,  setName]  = useState(prefill?.name  ?? "");
  const [email, setEmail] = useState(prefill?.email ?? "");
  const [phone, setPhone] = useState(prefill?.phone ?? "");
  const [agreed,       setAgreed]      = useState(false);
  const [loading,      setLoading]     = useState(false);
  const [error,        setError]       = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [customerId,   setCustomerId]   = useState("");
  const [intentReady,  setIntentReady]  = useState(false);
  const [intentError,  setIntentError]  = useState("");
  const intentFetched = useRef(false);

  useEffect(() => {
    if (!name || !email || intentFetched.current) return;
    const t = setTimeout(() => {
      intentFetched.current = true;
      fetch("/api/stripe/setup-intent", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, name }),
      })
        .then(r => r.json())
        .then(data => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
            setCustomerId(data.customerId);
            setIntentReady(true);
          } else {
            setIntentError(data.error ?? "Unable to initialise payment");
          }
        })
        .catch(() => setIntentError("Unable to connect to payment system"));
    }, 600);
    return () => clearTimeout(t);
  }, [name, email]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { setError("Please agree to the cancellation policy to continue."); return; }
    if (!stripe || !elements || !clientSecret) { setError("Payment system not ready — please wait a moment."); return; }

    const card = elements.getElement(CardElement);
    if (!card) { setError("Card input not found."); return; }

    setLoading(true); setError("");

    const { setupIntent, error: stripeErr } = await stripe.confirmCardSetup(clientSecret, {
      payment_method: { card, billing_details: { name, email, phone } },
    });

    if (stripeErr) {
      setError(stripeErr.message ?? "Card verification failed. Please check your details.");
      setLoading(false);
      return;
    }

    const paymentMethodId = setupIntent?.payment_method as string;

    await fetch("/api/stripe/save-card", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ name, email, phone, stripeCustomerId: customerId, stripePaymentMethodId: paymentMethodId }),
    });

    onSuccess({ name, email, phone, stripeCustomerId: customerId, stripePaymentMethodId: paymentMethodId });
  }, [agreed, stripe, elements, clientSecret, customerId, name, email, phone, onSuccess]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Full Name *</label>
          <input type="text" required placeholder="Jane Smith" value={name}
            onChange={e => setName(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Phone *</label>
          <input type="tel" required placeholder="(212) 000-0000" value={phone}
            onChange={e => setPhone(e.target.value)} className={inputCls} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Email *</label>
        <input type="email" required placeholder="your@email.com" value={email}
          onChange={e => setEmail(e.target.value)} className={inputCls} />
      </div>

      {/* Cancellation policy */}
      <div className="border border-[#B8860B]/40 bg-[#0a0800] p-6">
        <p className="text-[var(--mc-accent)] font-bold text-base mb-4">About Your Card on File</p>
        <ul className="space-y-4 text-[var(--mc-muted)]">
          <li className="flex items-start gap-3">
            <ShieldCheck size={18} className="text-[var(--mc-accent)] mt-0.5 shrink-0" />
            <span className="text-sm leading-relaxed"><strong className="text-white">Nothing is charged today.</strong> We only store your card to hold your appointment — just like a hotel reservation.</span>
          </li>
          <li className="flex items-start gap-3">
            <Check size={18} className="text-[var(--mc-accent)] mt-0.5 shrink-0" />
            <span className="text-sm leading-relaxed">Need to cancel? No problem — <strong className="text-white">cancel at least 24 hours ahead</strong> and there is no charge at all.</span>
          </li>
          <li className="flex items-start gap-3">
            <AlertTriangle size={18} className="text-[#B8860B] mt-0.5 shrink-0" />
            <span className="text-sm leading-relaxed">If you cancel with less than 24 hours notice or do not show up, a <strong className="text-white">30% fee</strong> will be charged to protect our stylists&apos; time.</span>
          </li>
        </ul>
      </div>

      {/* Agreement */}
      <label className="flex items-start gap-4 cursor-pointer group">
        <div className={`mt-0.5 w-6 h-6 shrink-0 border-2 flex items-center justify-center transition-all ${
          agreed ? "bg-[var(--mc-accent)] border-[var(--mc-accent)]" : "border-[#444] group-hover:border-[var(--mc-accent)]"
        }`}>
          {agreed && <Check size={13} strokeWidth={3} className="text-black" />}
        </div>
        <input type="checkbox" className="sr-only" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
        <span className="text-[var(--mc-muted)] text-sm leading-relaxed">
          I understand and agree to the{" "}
          <a href="/terms#cancellation" target="_blank" className="text-[var(--mc-accent)] hover:underline">cancellation policy</a>{" "}
          above.
        </span>
      </label>

      {/* Stripe card */}
      <div>
        <label className="flex items-center gap-2 text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-3">
          <CreditCard size={13} /> Card on File
        </label>
        <div className={`border p-4 transition-colors ${intentReady ? "border-[#1a1a1a] bg-[#080808]" : "border-[#111] bg-[#050505] opacity-60"}`}>
          {intentError ? (
            <p className="text-red-400 text-sm">{intentError}</p>
          ) : !intentReady ? (
            <div className="flex items-center gap-2 text-[#444] text-sm">
              <div className="w-4 h-4 border-2 border-[#333] border-t-[var(--mc-accent)] rounded-full animate-spin" />
              {name && email ? "Connecting to secure payment..." : "Enter your name & email to continue"}
            </div>
          ) : (
            <CardElement options={CARD_STYLE} />
          )}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <ShieldCheck size={12} className="text-[#444]" />
          <p className="text-[#444] text-xs">Secured by Stripe · 256-bit SSL · PCI compliant</p>
        </div>
      </div>

      {error && (
        <div className="border border-red-900/50 bg-red-950/20 p-3 text-red-400 text-sm flex items-start gap-2">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" /> {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !intentReady || !!intentError}
        className="w-full gold-gradient-bg text-black font-bold py-5 text-base hover:opacity-90 transition-opacity disabled:opacity-30 cursor-pointer flex items-center justify-center gap-3"
      >
        {loading ? (
          <><Loader size={18} className="animate-spin" /> Securing your spot…</>
        ) : (
          <><ShieldCheck size={18} /> Continue to Choose Your Appointment</>
        )}
      </button>

      <p className="text-[#555] text-sm text-center">
        Nothing is charged today. Card on file for cancellation policy only.
      </p>
    </form>
  );
}

// ── Phase 2 — Appointment details ────────────────────────────────────────────
function AppointmentForm({
  cardData,
  onSuccess,
}: {
  cardData: CardData;
  onSuccess: () => void;
}) {
  const today = new Date().toISOString().split("T")[0];

  const [service, setService] = useState("");
  const [stylist, setStylist] = useState("No preference");
  const [date,    setDate]    = useState("");
  const [time,    setTime]    = useState("");
  const [notes,   setNotes]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || !date || !time) {
      setError("Please fill in service, date, and time.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          name:                  cardData.name,
          email:                 cardData.email,
          phone:                 cardData.phone,
          service,
          stylist:               stylist === "No preference" ? "" : stylist,
          date,
          time,
          notes,
          stripeCustomerId:      cardData.stripeCustomerId,
          stripePaymentMethodId: cardData.stripePaymentMethodId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to submit booking. Please try again.");
        setLoading(false);
        return;
      }

      onSuccess();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Network error — please check your connection and try again.");
      setLoading(false);
    }
  }, [cardData, service, stylist, date, time, notes, onSuccess]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card confirmed badge */}
      <div className="flex items-center gap-3 border border-[var(--mc-accent)]/30 bg-[#0a0800] px-5 py-4">
        <div className="w-7 h-7 rounded-full gold-gradient-bg flex items-center justify-center shrink-0">
          <Check size={14} strokeWidth={3} className="text-black" />
        </div>
        <div>
          <p className="text-[var(--mc-accent)] text-xs font-bold uppercase tracking-widest">
            Card secured{cardData.name ? `, ${cardData.name.split(" ")[0]}` : ""}!
          </p>
          <p className="text-[var(--mc-muted)] text-xs mt-0.5">$0 charged today · Card held for cancellation policy only</p>
        </div>
      </div>

      {/* Service */}
      <div>
        <label className={labelCls}>Service *</label>
        <div className="relative">
          <select required value={service} onChange={e => setService(e.target.value)} className={selectCls}>
            <option value="" disabled>Select a service…</option>
            {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--mc-accent)]">▾</div>
        </div>
      </div>

      {/* Stylist */}
      <div>
        <label className={labelCls}>Stylist</label>
        <div className="relative">
          <select value={stylist} onChange={e => setStylist(e.target.value)} className={selectCls}>
            {STYLISTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--mc-accent)]">▾</div>
        </div>
      </div>

      {/* Date + Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Date *</label>
          <input
            type="date"
            required
            min={today}
            value={date}
            onChange={e => setDate(e.target.value)}
            className={inputCls}
            style={{ colorScheme: "dark" }}
          />
        </div>
        <div>
          <label className={labelCls}>Preferred Time *</label>
          <div className="relative">
            <select required value={time} onChange={e => setTime(e.target.value)} className={selectCls}>
              <option value="" disabled>Select a time…</option>
              {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--mc-accent)]">▾</div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className={labelCls}>Notes <span className="text-[#444] normal-case tracking-normal font-normal">(optional)</span></label>
        <textarea
          placeholder="Anything we should know? (e.g. hair length, allergies, inspiration photo links)"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={3}
          className={`${inputCls} resize-none`}
        />
      </div>

      {error && (
        <div className="border border-red-900/50 bg-red-950/20 p-3 text-red-400 text-sm flex items-start gap-2">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" /> {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full gold-gradient-bg text-black font-bold py-4 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity disabled:opacity-30 cursor-pointer flex items-center justify-center gap-3"
      >
        {loading ? (
          <><Loader size={16} className="animate-spin" /> Booking your appointment…</>
        ) : (
          <><CalendarDays size={16} /> Confirm Appointment</>
        )}
      </button>

      <p className="text-[#444] text-xs text-center">
        A confirmation will be sent to {cardData.email}
      </p>
    </form>
  );
}

// ── Success screen ────────────────────────────────────────────────────────────
function SuccessScreen({ name, onReset }: { name: string; onReset: () => void }) {
  return (
    <div className="text-center py-8">
      <div className="w-20 h-20 rounded-full gold-gradient-bg flex items-center justify-center mx-auto mb-6">
        <Check size={36} strokeWidth={3} className="text-black" />
      </div>
      <p className="text-[var(--mc-accent)] text-xs uppercase tracking-[0.4em] font-semibold mb-3">All Set</p>
      <h2 className="font-serif text-4xl font-bold text-white mb-3">You&apos;re booked!</h2>
      <p className="text-[var(--mc-muted)] text-sm max-w-sm mx-auto mb-8 leading-relaxed">
        Your appointment request has been received. We&apos;ll be in touch shortly to confirm your time.
        Your card is securely on file for the cancellation policy only.
      </p>

      <div className="inline-flex items-center gap-2 border border-[#1a1a1a] bg-[#080808] px-6 py-3 text-sm text-[var(--mc-muted)] mb-8">
        <ShieldCheck size={14} className="text-[var(--mc-accent)]" />
        Card on file · $0 charged today · 30% fee only for no-show / late cancel
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onReset}
          className="gold-gradient-bg text-black font-bold px-10 py-3 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity cursor-pointer"
        >
          Book Another
        </button>
        <a
          href="tel:+12129885252"
          className="border border-[#222] text-[var(--mc-muted)] px-10 py-3 text-xs uppercase tracking-widest hover:border-[#444] transition-colors"
        >
          Call the Salon
        </a>
      </div>
    </div>
  );
}

// ── Step indicator ────────────────────────────────────────────────────────────
function StepDots({ phase }: { phase: 1 | 2 }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {(["Secure Spot", "Appointment Details"] as const).map((label, i) => {
        const num    = i + 1;
        const done   = phase > num;
        const active = phase === num;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all duration-300 ${
                done   ? "bg-[var(--mc-accent)] border-[var(--mc-accent)] text-black" :
                active ? "border-[var(--mc-accent)] text-[var(--mc-accent)]" :
                         "border-[#2a2a2a] text-[#444]"
              }`}>
                {done ? <Check size={13} strokeWidth={3} /> : num}
              </div>
              <span className={`text-[10px] mt-1.5 uppercase tracking-widest font-semibold ${active || done ? "text-[var(--mc-accent)]" : "text-[#333]"}`}>
                {label}
              </span>
            </div>
            {i === 0 && (
              <div className={`h-px w-12 sm:w-20 mb-5 mx-1 transition-all duration-500 ${done ? "bg-[var(--mc-accent)]" : "bg-[#1f1f1f]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main flow ─────────────────────────────────────────────────────────────────
function BookingFlow() {
  const [phase,        setPhase]        = useState<1 | 2>(1);
  const [done,         setDone]         = useState(false);
  const [cardData,     setCardData]     = useState<CardData | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<AuthCustomer | null>(null);
  const [prefill,      setPrefill]      = useState<{ name: string; email: string; phone: string } | null>(null);
  const [authChecked,  setAuthChecked]  = useState(false);

  // Check if user is already signed in on mount
  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && !data.error) applyAuthUser(data);
      })
      .catch(() => {})
      .finally(() => setAuthChecked(true));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyAuthUser(user: AuthCustomer) {
    setLoggedInUser(user);
    if (user.stripeCustomerId && user.stripePaymentMethodId) {
      // Has card on file → skip Step 1 entirely
      setCardData({
        name:                  user.name,
        email:                 user.email,
        phone:                 user.phone,
        stripeCustomerId:      user.stripeCustomerId,
        stripePaymentMethodId: user.stripePaymentMethodId,
      });
      setPhase(2);
    } else {
      // Signed in but no card → pre-fill Step 1
      setPrefill({ name: user.name, email: user.email, phone: user.phone ?? "" });
    }
  }

  const handleGoogleSuccess = useCallback((user: AuthCustomer) => {
    applyAuthUser(user);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCardSuccess = useCallback((data: CardData) => {
    setCardData(data);
    setPhase(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBookingSuccess = useCallback(() => {
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const reset = () => {
    setPhase(1);
    setDone(false);
    setCardData(null);
    setPrefill(null);
    setLoggedInUser(null);
  };

  // While checking auth, show nothing so there's no flash of Step 1 before jumping to Step 2
  if (!authChecked) {
    return (
      <section className="pt-40 pb-24 flex items-center justify-center bg-black">
        <div className="w-6 h-6 border-2 border-[#222] border-t-[var(--mc-accent)] rounded-full animate-spin" />
      </section>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-10 px-6 bg-black text-center">
        <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">
          Reserve Your Visit
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
          Book Appointment
        </h1>
        <p className="text-[var(--mc-muted)] max-w-md mx-auto text-sm leading-relaxed mb-10">
          A luxury experience begins with a single step.
        </p>
        {!done && <StepDots phase={phase} />}
      </section>

      {/* Content */}
      <section className="pb-24 px-6 bg-black">
        <div className="max-w-2xl mx-auto">
          {done ? (
            <div className="luxury-card p-8 md:p-10">
              <SuccessScreen name={cardData?.name ?? ""} onReset={reset} />
            </div>
          ) : phase === 1 ? (
            <div className="luxury-card p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <Scissors size={18} className="text-[var(--mc-accent)]" />
                <div>
                  <h2 className="font-serif text-xl font-bold text-white">Secure Your Spot</h2>
                  <p className="text-[var(--mc-muted)] text-xs mt-0.5">Step 1 of 2 — Your details & card on file</p>
                </div>
              </div>

              {/* Google sign-in CTA — only if not already signed in */}
              {!loggedInUser && (
                <div className="mb-8">
                  <p className="text-[var(--mc-muted)] text-sm text-center mb-4">
                    Sign in to book faster — we&apos;ll fill in your details automatically.
                  </p>
                  <GoogleSignInButton mode="signin" onSuccess={handleGoogleSuccess} />
                  <div className="flex items-center gap-3 mt-6">
                    <div className="flex-1 h-px bg-[#1a1a1a]" />
                    <span className="text-[#444] text-xs uppercase tracking-widest whitespace-nowrap">or continue as guest</span>
                    <div className="flex-1 h-px bg-[#1a1a1a]" />
                  </div>
                </div>
              )}

              {/* Signed-in banner (no card yet) */}
              {loggedInUser && (
                <div className="flex items-center gap-3 mb-6 px-4 py-3 border border-[var(--mc-accent)]/25 bg-[#0a0800]">
                  {loggedInUser.avatarUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={loggedInUser.avatarUrl} alt="" className="w-8 h-8 rounded-full shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{loggedInUser.name}</p>
                    <p className="text-[var(--mc-muted)] text-xs truncate">{loggedInUser.email}</p>
                  </div>
                  <Check size={14} className="text-[var(--mc-accent)] shrink-0" />
                </div>
              )}

              <CardCaptureForm
                key={prefill ? `signed-${prefill.email}` : "guest"}
                prefill={prefill ?? undefined}
                onSuccess={handleCardSuccess}
              />
            </div>
          ) : (
            <div className="luxury-card p-8 md:p-10">
              {/* Instant-book banner */}
              {loggedInUser && cardData && (
                <div className="flex items-center gap-3 mb-6 px-4 py-3 border border-[var(--mc-accent)]/25 bg-[#0a0800]">
                  {loggedInUser.avatarUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={loggedInUser.avatarUrl} alt="" className="w-8 h-8 rounded-full shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--mc-accent)] text-xs font-bold uppercase tracking-widest">Booking as {loggedInUser.name.split(" ")[0]}</p>
                    <p className="text-[var(--mc-muted)] text-xs">Card on file · instant booking</p>
                  </div>
                  <ShieldCheck size={15} className="text-[var(--mc-accent)] shrink-0" />
                </div>
              )}

              <div className="flex items-center gap-3 mb-8">
                <CalendarDays size={18} className="text-[var(--mc-accent)]" />
                <div>
                  <h2 className="font-serif text-xl font-bold text-white">Choose Your Service & Time</h2>
                  <p className="text-[var(--mc-muted)] text-xs mt-0.5">Step 2 of 2 — Appointment details</p>
                </div>
              </div>
              <AppointmentForm cardData={cardData!} onSuccess={handleBookingSuccess} />
            </div>
          )}

          {!done && (
            <div className="mt-8 border border-[#1a1a1a] py-5 px-6 text-center">
              <p className="text-[#666] text-sm mb-2">Prefer to speak with someone?</p>
              <a
                href="tel:+12129885252"
                className="inline-flex items-center gap-2 text-[var(--mc-accent)] font-semibold text-xl hover:opacity-80 transition-opacity"
              >
                <Scissors size={18} />
                (212) 988-5252
              </a>
              <p className="text-[#444] text-xs mt-1">Our team is happy to book your appointment by phone.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

// ── Page export ───────────────────────────────────────────────────────────────
export default function BookPage() {
  return (
    <Elements stripe={stripePromise}>
      <BookingFlow />
    </Elements>
  );
}
