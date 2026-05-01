"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  Check, ShieldCheck, CreditCard, AlertTriangle, Loader, Scissors,
} from "lucide-react";

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

// ── Phase 1 — Card capture ────────────────────────────────────────────────────
interface CardData {
  name: string;
  email: string;
  phone: string;
  stripeCustomerId: string;
  stripePaymentMethodId: string;
}

function CardCaptureForm({ onSuccess }: { onSuccess: (data: CardData) => void }) {
  const stripe = useStripe();
  const elements = useElements();

  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed]           = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [customerId, setCustomerId]     = useState("");
  const [intentReady, setIntentReady]   = useState(false);
  const [intentError, setIntentError]   = useState("");
  const intentFetched = useRef(false);

  // Fetch setup intent once name + email are present
  useEffect(() => {
    if (!name || !email || intentFetched.current) return;
    const t = setTimeout(() => {
      intentFetched.current = true;
      fetch("/api/stripe/setup-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
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

    // Save card to our customer DB (linked by email for future no-show charges)
    await fetch("/api/stripe/save-card", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, stripeCustomerId: customerId, stripePaymentMethodId: paymentMethodId }),
    });

    onSuccess({ name, email, phone, stripeCustomerId: customerId, stripePaymentMethodId: paymentMethodId });
  }, [agreed, stripe, elements, clientSecret, customerId, name, email, phone, onSuccess]);

  const inputCls = "w-full bg-[#080808] border border-[#1a1a1a] text-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[#333]";
  const labelCls = "block text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Contact fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>Full Name *</label>
          <input
            type="text" required placeholder="Jane Smith" value={name}
            onChange={e => setName(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Phone *</label>
          <input
            type="tel" required placeholder="(212) 000-0000" value={phone}
            onChange={e => setPhone(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>
      <div>
        <label className={labelCls}>Email *</label>
        <input
          type="email" required placeholder="your@email.com" value={email}
          onChange={e => setEmail(e.target.value)}
          className={inputCls}
        />
      </div>

      {/* Cancellation policy */}
      <div className="border border-[#B8860B]/40 bg-[#0a0800] p-5">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle size={18} className="text-[var(--mc-accent)] shrink-0 mt-0.5" />
          <div>
            <p className="text-[var(--mc-accent)] font-bold text-sm uppercase tracking-widest mb-0.5">Cancellation Policy</p>
            <p className="text-[#B8860B]/70 text-xs">30% fee if cancelled late or no-show</p>
          </div>
        </div>
        <ul className="space-y-2.5 text-sm text-[var(--mc-muted)]">
          <li className="flex items-start gap-2.5">
            <Check size={13} className="text-[var(--mc-accent)] mt-0.5 shrink-0" />
            <span>Cancel <strong className="text-white">24+ hours in advance</strong> — no charge, no questions asked.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <Check size={13} className="text-[var(--mc-accent)] mt-0.5 shrink-0" />
            <span>Cancel <strong className="text-white">under 24 hours</strong> or no-show — a <strong className="text-white">30% cancellation fee</strong> is charged to your card on file.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <ShieldCheck size={13} className="text-[var(--mc-accent)] mt-0.5 shrink-0" />
            <span><strong className="text-white">$0 charged today.</strong> Your card is stored securely via Stripe to hold your spot.</span>
          </li>
        </ul>
      </div>

      {/* Agreement */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className={`mt-0.5 w-5 h-5 shrink-0 border-2 flex items-center justify-center transition-all ${
          agreed ? "bg-[var(--mc-accent)] border-[var(--mc-accent)]" : "border-[#333] group-hover:border-[var(--mc-accent)]"
        }`}>
          {agreed && <Check size={11} strokeWidth={3} className="text-black" />}
        </div>
        <input type="checkbox" className="sr-only" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
        <span className="text-[var(--mc-muted)] text-sm leading-relaxed">
          I agree to the MC Hair Salon &amp; Spa{" "}
          <a href="/terms#cancellation" target="_blank" className="text-[var(--mc-accent)] hover:underline">cancellation policy</a>.
          A 30% fee may apply for late cancellations or no-shows.
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
        className="w-full gold-gradient-bg text-black font-bold py-4 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity disabled:opacity-30 cursor-pointer flex items-center justify-center gap-3"
      >
        {loading ? (
          <><Loader size={16} className="animate-spin" /> Securing your spot...</>
        ) : (
          <><ShieldCheck size={16} /> Continue to Book Appointment</>
        )}
      </button>

      <p className="text-[#333] text-xs text-center">
        $0 charged today · Card held via Stripe · 30% fee only if you no-show or cancel late
      </p>
    </form>
  );
}

// ── Phase 2 — DaySmart booking widget ────────────────────────────────────────
// DaySmart blocks direct iframe embeds (X-Frame-Options). We work around this
// by using srcDoc — we own the iframe content, so the restriction doesn't apply.
// DaySmart's script runs inside our srcdoc iframe and injects its booking UI there.
const DAYSMART_SRCDOC = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #fff; font-family: sans-serif; }
  </style>
</head>
<body>
  <script type="text/javascript">
    daysmart_acc = "0a1d5a05-c4ea-4dcb-b3c7-92ff0d13bfcf";
    daysmart_iframe_width = 700;
    daysmart_iframe_height = 0;
    daysmart_website_root = "https://plugin.mysalononline.com";
    load_in_iframe = "false";
  <\/script>
  <script type="text/javascript" src="https://plugin.mysalononline.com/Scripts/external/bookingplugin.js"><\/script>
</body>
</html>`;

function DaySmartWidget({
  clientName,
  onBookingDetected,
}: {
  clientName: string;
  onBookingDetected: () => void;
}) {
  const detectedRef = useRef(false);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (detectedRef.current) return;
      const d = e.data;
      const isConfirmation =
        (typeof d === "string" && /confirm|booked|success|appointment/i.test(d)) ||
        (d && typeof d === "object" && /confirm|booked|success|appointment/i.test(JSON.stringify(d)));
      if (isConfirmation) {
        detectedRef.current = true;
        onBookingDetected();
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onBookingDetected]);

  return (
    <div>
      {/* Confirmation strip */}
      <div className="flex items-center gap-3 border border-[var(--mc-accent)]/30 bg-[#0a0800] px-5 py-4 mb-6">
        <div className="w-7 h-7 rounded-full gold-gradient-bg flex items-center justify-center shrink-0">
          <Check size={14} strokeWidth={3} className="text-black" />
        </div>
        <div>
          <p className="text-[var(--mc-accent)] text-xs font-bold uppercase tracking-widest">
            Card secured{clientName ? `, ${clientName.split(" ")[0]}` : ""}!
          </p>
          <p className="text-[var(--mc-muted)] text-xs mt-0.5">Now select your service, stylist, and time below.</p>
        </div>
      </div>

      {/* DaySmart widget — runs inside a srcdoc iframe we control */}
      <iframe
        srcDoc={DAYSMART_SRCDOC}
        title="Book Appointment — MC Hair Salon & Spa"
        width="100%"
        frameBorder="0"
        className="w-full border-0"
        style={{ height: 1100, minHeight: 1100 }}
      />

      {/* Manual confirm fallback */}
      <div className="mt-8 border-t border-[#1a1a1a] pt-6 text-center">
        <p className="text-[#444] text-xs mb-3 uppercase tracking-widest">Finished booking above?</p>
        <button
          onClick={() => { detectedRef.current = true; onBookingDetected(); }}
          className="border border-[var(--mc-accent)] text-[var(--mc-accent)] px-8 py-3 text-xs uppercase tracking-widest hover:bg-[var(--mc-accent)] hover:text-black transition-all cursor-pointer"
        >
          I completed my booking ✓
        </button>
      </div>
    </div>
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
        Your appointment is confirmed and your card is securely on file.
        You&apos;ll receive a confirmation from us shortly.
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
      {(["Secure Spot", "Book Appointment"] as const).map((label, i) => {
        const num = i + 1;
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
  const [phase, setPhase] = useState<1 | 2>(1);
  const [done, setDone]   = useState(false);
  const [cardData, setCardData] = useState<CardData | null>(null);

  const handleCardSuccess = useCallback((data: CardData) => {
    setCardData(data);
    setPhase(2);
    // Scroll to top of booking section
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBookingDetected = useCallback(() => {
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const reset = () => {
    setPhase(1);
    setDone(false);
    setCardData(null);
  };

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
        <div className={done || phase === 1 ? "max-w-2xl mx-auto" : "max-w-4xl mx-auto"}>
          {done ? (
            <div className="luxury-card p-8 md:p-10">
              <SuccessScreen name={cardData?.name ?? ""} onReset={reset} />
            </div>
          ) : phase === 1 ? (
            <>
              <div className="luxury-card p-8 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <Scissors size={18} className="text-[var(--mc-accent)]" />
                  <div>
                    <h2 className="font-serif text-xl font-bold text-white">Secure Your Spot</h2>
                    <p className="text-[var(--mc-muted)] text-xs mt-0.5">Step 1 of 2 — Your details & card on file</p>
                  </div>
                </div>
                <CardCaptureForm onSuccess={handleCardSuccess} />
              </div>
            </>
          ) : (
            <>
              <div className="luxury-card p-8 md:p-10">
                <div className="flex items-center gap-3 mb-8">
                  <Scissors size={18} className="text-[var(--mc-accent)]" />
                  <div>
                    <h2 className="font-serif text-xl font-bold text-white">Choose Your Service & Time</h2>
                    <p className="text-[var(--mc-muted)] text-xs mt-0.5">Step 2 of 2 — Powered by DaySmart</p>
                  </div>
                </div>
                <DaySmartWidget
                  clientName={cardData?.name ?? ""}
                  onBookingDetected={handleBookingDetected}
                />
              </div>
            </>
          )}

          {!done && (
            <p className="text-center text-[#333] text-xs mt-8">
              Need help?{" "}
              <a href="tel:+12129885252" className="text-[var(--mc-accent)] hover:underline">
                (212) 988-5252
              </a>
            </p>
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
