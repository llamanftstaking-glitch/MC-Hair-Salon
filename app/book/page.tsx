"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Check, ShieldCheck, CreditCard, AlertTriangle, Loader,
  CalendarDays, Phone, UserCircle, ChevronLeft, Users,
} from "lucide-react";
import GoogleSignInButton, { type AuthCustomer } from "@/components/GoogleSignInButton";

// ── Stripe ────────────────────────────────────────────────────────────────────
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : Promise.resolve(null);

const STRIPE_FIELD_STYLE = {
  style: {
    base: {
      color: "#ffffff",
      fontFamily: '"Inter", sans-serif',
      fontSize: "16px",
      fontSmoothing: "antialiased",
      "::placeholder": { color: "#555" },
    },
    invalid: { color: "#ff4d4d" },
  },
};

// ── Static data ───────────────────────────────────────────────────────────────
const SERVICE_CATEGORIES = [
  {
    id: "cuts",
    label: "Haircuts",
    services: [
      { name: "Women's Haircut",  price: "from $45" },
      { name: "Men's Haircut",    price: "from $30" },
      { name: "Kids' Haircut",    price: "from $20" },
      { name: "Curly Cut",        price: "from $55" },
    ],
  },
  {
    id: "styling",
    label: "Blowout & Styling",
    services: [
      { name: "Blowout / Blow Dry",              price: "from $55" },
      { name: "Updo & Special Event Styling",    price: "from $85" },
    ],
  },
  {
    id: "color",
    label: "Color",
    services: [
      { name: "Balayage",          price: "from $120" },
      { name: "Highlights",        price: "from $100" },
      { name: "Baby Lights",       price: "from $110" },
      { name: "Hair Color",        price: "from $80"  },
      { name: "Color Correction",  price: "from $200" },
    ],
  },
  {
    id: "treatments",
    label: "Treatments",
    services: [
      { name: "Keratin Treatment",      price: "from $150" },
      { name: "Hair Botox Treatment",   price: "from $120" },
      { name: "Relaxer",                price: "from $85"  },
    ],
  },
  {
    id: "makeup",
    label: "Makeup & Beauty",
    services: [
      { name: "Bridal Makeup",        price: "from $150" },
      { name: "Makeup Application",   price: "from $75"  },
      { name: "Eyebrow & Lip Wax",    price: "from $25"  },
    ],
  },
];

const STYLISTS_DATA = [
  { name: "No preference",  role: "Any available stylist" },
  { name: "Maria",          role: "Master Stylist"        },
  { name: "Meagan",         role: "Senior Stylist"        },
  { name: "Sally",          role: "Color Specialist"      },
  { name: "Kato",           role: "Stylist"               },
  { name: "Juany",          role: "Stylist"               },
  { name: "Dhariana",       role: "Makeup Artist"         },
];

const TIME_SLOTS = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "1:00 PM",  "1:30 PM",  "2:00 PM",  "2:30 PM",
  "3:00 PM",  "3:30 PM",  "4:00 PM",  "4:30 PM",
  "5:00 PM",  "5:30 PM",  "6:00 PM",  "6:30 PM",
  "7:00 PM",
];

// ── Types ─────────────────────────────────────────────────────────────────────
type Step = 0 | 1 | 2 | 3 | 4;

interface Selection {
  service:       string;
  servicePrice?: string;
  stylist:       string;
  date:          string;
  time:          string;
  notes:         string;
}

interface CardData {
  name:                  string;
  email:                 string;
  phone:                 string;
  stripeCustomerId:      string;
  stripePaymentMethodId: string;
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const inputCls  = "w-full bg-[#080808] border border-[#1a1a1a] text-white px-5 py-4 text-base focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[#555]";
const stripeCls = "bg-[#080808] border border-[#1a1a1a] px-5 py-[17px] transition-colors focus-within:border-[var(--mc-accent)]";
const labelCls  = "block text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-2";
const backBtnCls = "flex items-center gap-1.5 text-[#555] hover:text-[var(--mc-accent)] transition-colors text-sm cursor-pointer mb-4";

// ── Step breadcrumb ───────────────────────────────────────────────────────────
const STEP_LABELS = ["Services", "Specialist", "Date & Time", "Confirm"] as const;

function StepBreadcrumb({ step }: { step: 1 | 2 | 3 | 4 }) {
  return (
    <nav className="flex items-center justify-center gap-1 sm:gap-2 mb-8 flex-wrap">
      {STEP_LABELS.map((label, i) => {
        const num    = i + 1;
        const done   = step > num;
        const active = step === num;
        return (
          <div key={label} className="flex items-center gap-1 sm:gap-2">
            <div className={`flex items-center gap-1.5 ${active || done ? "text-[var(--mc-accent)]" : "text-[#333]"}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                done   ? "bg-[var(--mc-accent)] border-[var(--mc-accent)] text-black" :
                active ? "border-[var(--mc-accent)] text-[var(--mc-accent)]" :
                         "border-[#2a2a2a] text-[#333]"
              }`}>
                {done ? <Check size={11} strokeWidth={3} /> : num}
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider hidden sm:block">{label}</span>
            </div>
            {i < 3 && (
              <div className={`h-px w-5 sm:w-8 transition-all duration-500 ${done ? "bg-[var(--mc-accent)]" : "bg-[#1f1f1f]"}`} />
            )}
          </div>
        );
      })}
    </nav>
  );
}

// ── Summary panel ─────────────────────────────────────────────────────────────
function SummaryPanel({ selection, user, cardData }: { selection: Selection; user: AuthCustomer | null; cardData: CardData | null }) {
  const formattedDate = selection.date
    ? new Date(selection.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    : null;

  return (
    <div className="luxury-card p-5 lg:sticky lg:top-28">
      {/* Salon info */}
      <div className="text-center mb-4 pb-4 border-b border-[#1a1a1a]">
        <p className="font-serif font-bold text-white text-sm">MC Hair Salon & Spa</p>
        <p className="text-[#555] text-xs mt-0.5">336 East 78th St · Upper East Side</p>
        <p className="text-[#555] text-xs">(212) 988-5252</p>
      </div>

      {/* Selections */}
      <div className="space-y-3 text-sm mb-4">
        <div className="flex justify-between items-start gap-2">
          <span className="text-[#444] text-xs uppercase tracking-widest shrink-0">Service</span>
          <span className="text-white font-medium text-right">{selection.service || "—"}</span>
        </div>
        <div className="flex justify-between items-start gap-2">
          <span className="text-[#444] text-xs uppercase tracking-widest shrink-0">Stylist</span>
          <span className="text-[var(--mc-muted)] text-right">{selection.stylist || "Any"}</span>
        </div>
        <div className="flex justify-between items-start gap-2">
          <span className="text-[#444] text-xs uppercase tracking-widest shrink-0">Date</span>
          <span className={`text-right font-medium ${formattedDate ? "text-[var(--mc-accent)]" : "text-[#333]"}`}>{formattedDate ?? "—"}</span>
        </div>
        <div className="flex justify-between items-start gap-2">
          <span className="text-[#444] text-xs uppercase tracking-widest shrink-0">Time</span>
          <span className={`text-right font-medium ${selection.time ? "text-[var(--mc-accent)]" : "text-[#333]"}`}>{selection.time || "—"}</span>
        </div>
        {selection.servicePrice && (
          <>
            <div className="h-px bg-[#1a1a1a]" />
            <div className="flex justify-between items-center">
              <span className="text-white text-xs font-semibold uppercase tracking-wider">Price</span>
              <span className="text-[var(--mc-accent)] font-bold">{selection.servicePrice}</span>
            </div>
          </>
        )}
      </div>

      {/* Client info */}
      {user && (
        <div className="pt-4 border-t border-[#1a1a1a] space-y-2">
          <div className="flex items-center gap-2">
            {user.avatarUrl
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={user.avatarUrl} alt="" className="w-5 h-5 rounded-full" />
              : <UserCircle size={14} className="text-[#444]" />}
            <span className="text-[#555] text-xs truncate">{user.name}</span>
          </div>
          {cardData ? (
            <div className="flex items-center gap-2">
              <ShieldCheck size={11} className="text-[var(--mc-accent)]" />
              <span className="text-[#555] text-xs">Card on file · $0 today</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CreditCard size={11} className="text-[#444]" />
              <span className="text-[#444] text-xs">Card required at confirm step</span>
            </div>
          )}
        </div>
      )}

      {/* Pending note */}
      <div className="mt-4 pt-4 border-t border-[#1a1a1a]">
        <p className="text-[#333] text-[10px] text-center leading-relaxed">Appointment pending confirmation. You&apos;ll receive an email within 24 hours.</p>
      </div>
    </div>
  );
}

// ── Sign-in gate ──────────────────────────────────────────────────────────────
function SignInGate({ onSignIn }: { onSignIn: (user: AuthCustomer) => void }) {
  return (
    <div className="luxury-card p-8 md:p-10">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full border border-[var(--mc-accent)]/30 flex items-center justify-center mx-auto mb-5">
          <UserCircle size={32} className="text-[var(--mc-accent)]" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-white mb-2">Sign in to Book</h2>
        <p className="text-[var(--mc-muted)] text-sm leading-relaxed max-w-sm mx-auto">
          Create an account or sign in — your card is saved once and every future booking takes less than a minute.
        </p>
      </div>

      <div className="mb-6">
        <GoogleSignInButton mode="signin" onSuccess={onSignIn} />
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-[#1a1a1a]" />
        <span className="text-[#444] text-sm">or</span>
        <div className="flex-1 h-px bg-[#1a1a1a]" />
      </div>

      <div className="space-y-3 mb-8">
        <Link href="/login?redirect=/book"
          className="flex items-center justify-center w-full py-4 border border-[#2a2a2a] text-white text-sm font-semibold hover:border-[var(--mc-accent)] transition-colors">
          Sign In with Email
        </Link>
        <Link href="/login?tab=register&redirect=/book"
          className="flex items-center justify-center w-full py-4 border border-[#2a2a2a] text-[var(--mc-muted)] text-sm hover:border-[var(--mc-accent)] hover:text-white transition-colors">
          Create a Free Account
          <span className="ml-2 text-[var(--mc-accent)] text-xs font-semibold">— 10% off first visit</span>
        </Link>
      </div>

      <div className="text-center border-t border-[#1a1a1a] pt-6">
        <p className="text-[#555] text-sm mb-3">Prefer to speak with someone?</p>
        <a href="tel:+12129885252" className="inline-flex items-center gap-2 text-[var(--mc-accent)] font-semibold text-xl hover:opacity-80 transition-opacity">
          <Phone size={20} /> (212) 988-5252
        </a>
        <p className="text-[#444] text-xs mt-1">We&apos;re happy to book for you by phone.</p>
      </div>
    </div>
  );
}

// ── Step 1 — Service ──────────────────────────────────────────────────────────
function ServiceStep({ selected, onSelect }: { selected: string; onSelect: (service: string, price?: string) => void }) {
  const [activeCategory, setActiveCategory] = useState(SERVICE_CATEGORIES[0].id);

  useEffect(() => {
    if (selected) {
      const cat = SERVICE_CATEGORIES.find(c => c.services.some(s => s.name === selected));
      if (cat) setActiveCategory(cat.id);
    }
  }, [selected]);

  const currentCategory = SERVICE_CATEGORIES.find(c => c.id === activeCategory)!;

  return (
    <div className="luxury-card p-6 md:p-8">
      <h2 className="font-serif text-2xl font-bold text-white mb-1">Choose a Service</h2>
      <p className="text-[var(--mc-muted)] text-sm mb-6">What brings you in today?</p>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {SERVICE_CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer ${
              activeCategory === cat.id
                ? "gold-gradient-bg text-black"
                : "border border-[#2a2a2a] text-[#555] hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)]"
            }`}>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Services grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {currentCategory.services.map(svc => {
          const isSelected = selected === svc.name;
          return (
            <button key={svc.name} onClick={() => onSelect(svc.name, svc.price)}
              className={`flex items-center justify-between p-4 border text-left transition-all cursor-pointer ${
                isSelected ? "border-[var(--mc-accent)] bg-[#0a0800]" : "border-[#1a1a1a] hover:border-[var(--mc-accent)]/50 bg-[#080808]"
              }`}>
              <div>
                <p className={`text-sm font-semibold ${isSelected ? "text-white" : "text-[var(--mc-muted)]"}`}>{svc.name}</p>
                <p className={`text-xs mt-0.5 ${isSelected ? "text-[var(--mc-accent)]" : "text-[#444]"}`}>{svc.price}</p>
              </div>
              {isSelected && <Check size={16} className="text-[var(--mc-accent)] shrink-0 ml-2" />}
            </button>
          );
        })}
      </div>

      {/* Other */}
      <button onClick={() => onSelect("Other (specify in notes)")}
        className={`w-full mt-2.5 flex items-center justify-between p-4 border text-left transition-all cursor-pointer ${
          selected === "Other (specify in notes)" ? "border-[var(--mc-accent)] bg-[#0a0800]" : "border-[#1a1a1a] hover:border-[var(--mc-accent)]/50 bg-[#080808]"
        }`}>
        <p className={`text-sm ${selected === "Other (specify in notes)" ? "text-white font-semibold" : "text-[#444]"}`}>Other (specify in notes)</p>
        {selected === "Other (specify in notes)" && <Check size={16} className="text-[var(--mc-accent)]" />}
      </button>
    </div>
  );
}

// ── Step 2 — Specialist ───────────────────────────────────────────────────────
function SpecialistStep({ selected, onSelect, onBack }: { selected: string; onSelect: (stylist: string) => void; onBack: () => void }) {
  return (
    <div className="luxury-card p-6 md:p-8">
      <button onClick={onBack} className={backBtnCls}><ChevronLeft size={14} /> Back to Services</button>
      <h2 className="font-serif text-2xl font-bold text-white mb-1">Choose a Stylist</h2>
      <p className="text-[var(--mc-muted)] text-sm mb-6">Who would you like to work with?</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {STYLISTS_DATA.map(stylist => {
          const isSelected = selected === stylist.name;
          return (
            <button key={stylist.name} onClick={() => onSelect(stylist.name)}
              className={`flex items-center gap-4 p-4 border text-left transition-all cursor-pointer ${
                isSelected ? "border-[var(--mc-accent)] bg-[#0a0800]" : "border-[#1a1a1a] hover:border-[var(--mc-accent)]/50 bg-[#080808]"
              }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                isSelected ? "gold-gradient-bg" : "border border-[#2a2a2a]"
              }`}>
                {stylist.name === "No preference"
                  ? <Users size={16} className={isSelected ? "text-black" : "text-[#444]"} />
                  : <span className={`text-sm font-bold ${isSelected ? "text-black" : "text-[#444]"}`}>{stylist.name[0]}</span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${isSelected ? "text-white" : "text-[var(--mc-muted)]"}`}>{stylist.name}</p>
                <p className={`text-xs ${isSelected ? "text-[var(--mc-accent)]" : "text-[#444]"}`}>{stylist.role}</p>
              </div>
              {isSelected && <Check size={16} className="text-[var(--mc-accent)] shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 3 — Date & Time ──────────────────────────────────────────────────────
function DateTimeStep({ date, time, onSelect, onBack }: { date: string; time: string; onSelect: (date: string, time: string) => void; onBack: () => void }) {
  const [selectedDate, setSelectedDate] = useState(date);
  const [selectedTime, setSelectedTime] = useState(time);
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="luxury-card p-6 md:p-8">
      <button onClick={onBack} className={backBtnCls}><ChevronLeft size={14} /> Back to Stylist</button>
      <h2 className="font-serif text-2xl font-bold text-white mb-1">Pick a Date & Time</h2>
      <p className="text-[var(--mc-muted)] text-sm mb-6">When would you like to come in?</p>

      {/* Date */}
      <div className="mb-6">
        <label className={labelCls}>Date</label>
        <input type="date" min={today} value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
          className={inputCls} style={{ colorScheme: "dark" }} />
      </div>

      {/* Time slots */}
      <div className="mb-6">
        <label className={labelCls}>Time</label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {TIME_SLOTS.map(slot => (
            <button key={slot} onClick={() => setSelectedTime(slot)}
              className={`py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                selectedTime === slot
                  ? "gold-gradient-bg text-black"
                  : "border border-[#1a1a1a] text-[#555] hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)]"
              }`}>
              {slot}
            </button>
          ))}
        </div>
      </div>

      <button onClick={() => { if (selectedDate && selectedTime) onSelect(selectedDate, selectedTime); }}
        disabled={!selectedDate || !selectedTime}
        className="w-full gold-gradient-bg text-black font-bold py-4 text-sm uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-30 cursor-pointer">
        Continue to Confirm
      </button>
    </div>
  );
}

// ── Card capture form (step 4 — new users) ────────────────────────────────────
function CardCaptureForm({ user, onSuccess }: { user: AuthCustomer; onSuccess: (data: CardData) => void }) {
  const stripe   = useStripe();
  const elements = useElements();

  const [phone,        setPhone]        = useState(user.phone ?? "");
  const [agreed,       setAgreed]       = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [customerId,   setCustomerId]   = useState("");
  const [intentReady,  setIntentReady]  = useState(false);
  const [intentError,  setIntentError]  = useState("");
  const intentFetched = useRef(false);

  useEffect(() => {
    if (intentFetched.current) return;
    intentFetched.current = true;
    fetch("/api/stripe/setup-intent", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email: user.email, name: user.name }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.clientSecret) { setClientSecret(data.clientSecret); setCustomerId(data.customerId); setIntentReady(true); }
        else setIntentError(data.error ?? "Unable to connect to payment system");
      })
      .catch(() => setIntentError("Unable to connect to payment system"));
  }, [user.email, user.name]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { setError("Please agree to the cancellation policy to continue."); return; }
    if (!stripe || !elements || !clientSecret) { setError("Payment system not ready — please wait."); return; }

    const cardNumber = elements.getElement(CardNumberElement);
    if (!cardNumber) { setError("Card fields not found."); return; }

    setLoading(true); setError("");

    const { setupIntent, error: stripeErr } = await stripe.confirmCardSetup(clientSecret, {
      payment_method: { card: cardNumber, billing_details: { name: user.name, email: user.email, phone } },
    });

    if (stripeErr) {
      setError(stripeErr.message ?? "Card verification failed.");
      setLoading(false);
      return;
    }

    const paymentMethodId = setupIntent?.payment_method as string;

    await fetch("/api/stripe/save-card", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ name: user.name, email: user.email, phone, stripeCustomerId: customerId, stripePaymentMethodId: paymentMethodId }),
    });

    onSuccess({ name: user.name, email: user.email, phone, stripeCustomerId: customerId, stripePaymentMethodId: paymentMethodId });
  }, [agreed, stripe, elements, clientSecret, customerId, user, phone, onSuccess]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Who's booking */}
      <div className="flex items-center gap-3 px-4 py-3 bg-[#0a0800] border border-[var(--mc-accent)]/20">
        {user.avatarUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatarUrl} alt="" className="w-9 h-9 rounded-full shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold truncate">{user.name}</p>
          <p className="text-[var(--mc-muted)] text-xs truncate">{user.email}</p>
        </div>
        <Check size={14} className="text-[var(--mc-accent)] shrink-0" />
      </div>

      {!user.phone && (
        <div>
          <label className={labelCls}>Phone Number *</label>
          <input type="tel" required placeholder="(212) 000-0000" value={phone}
            onChange={e => setPhone(e.target.value)} className={inputCls} />
        </div>
      )}

      {/* Policy */}
      <div className="border border-[#B8860B]/40 bg-[#0a0800] p-6">
        <p className="text-[var(--mc-accent)] font-bold text-base mb-4">About Your Card on File</p>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <ShieldCheck size={18} className="text-[var(--mc-accent)] mt-0.5 shrink-0" />
            <span className="text-[var(--mc-muted)] text-sm leading-relaxed">
              <strong className="text-white">Nothing is charged today.</strong> We store your card to hold your appointment — just like a hotel reservation.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Check size={18} className="text-[var(--mc-accent)] mt-0.5 shrink-0" />
            <span className="text-[var(--mc-muted)] text-sm leading-relaxed">
              Need to cancel? <strong className="text-white">Cancel at least 24 hours ahead</strong> — no charge, no questions asked.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <AlertTriangle size={18} className="text-[#B8860B] mt-0.5 shrink-0" />
            <span className="text-[var(--mc-muted)] text-sm leading-relaxed">
              Late cancellation (under 24 hrs) or no-show: a <strong className="text-white">30% fee</strong> protects our stylists&apos; time.
            </span>
          </li>
        </ul>
      </div>

      <label className="flex items-start gap-4 cursor-pointer group">
        <div className={`mt-0.5 w-6 h-6 shrink-0 border-2 flex items-center justify-center transition-all ${
          agreed ? "bg-[var(--mc-accent)] border-[var(--mc-accent)]" : "border-[#444] group-hover:border-[var(--mc-accent)]"
        }`}>
          {agreed && <Check size={13} strokeWidth={3} className="text-black" />}
        </div>
        <input type="checkbox" className="sr-only" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
        <span className="text-[var(--mc-muted)] text-sm leading-relaxed">
          I understand and agree to the{" "}
          <a href="/terms#cancellation" target="_blank" className="text-[var(--mc-accent)] hover:underline">cancellation policy</a>{" "}above.
        </span>
      </label>

      {/* Split card fields */}
      <div>
        <label className="flex items-center gap-2 text-white text-sm font-semibold mb-4">
          <CreditCard size={16} className="text-[var(--mc-accent)]" /> Add Your Card
          <span className="text-[#444] font-normal text-xs normal-case ml-1">— saved securely, only needed once</span>
        </label>

        {intentError ? (
          <p className="text-red-400 text-sm">{intentError}</p>
        ) : !intentReady ? (
          <div className="flex items-center gap-3 px-5 py-4 border border-[#111] bg-[#050505]">
            <div className="w-5 h-5 border-2 border-[#333] border-t-[var(--mc-accent)] rounded-full animate-spin shrink-0" />
            <span className="text-[#444] text-sm">Connecting to secure payment…</span>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-[var(--mc-muted)] text-xs uppercase tracking-widest mb-1.5">Card Number</label>
              <div className={stripeCls}><CardNumberElement options={{ ...STRIPE_FIELD_STYLE, showIcon: true }} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[var(--mc-muted)] text-xs uppercase tracking-widest mb-1.5">Expiry Date</label>
                <div className={stripeCls}><CardExpiryElement options={STRIPE_FIELD_STYLE} /></div>
              </div>
              <div>
                <label className="block text-[var(--mc-muted)] text-xs uppercase tracking-widest mb-1.5">Security Code</label>
                <div className={stripeCls}><CardCvcElement options={STRIPE_FIELD_STYLE} /></div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mt-3">
          <ShieldCheck size={12} className="text-[#444]" />
          <p className="text-[#444] text-xs">Secured by Stripe · 256-bit SSL · PCI compliant</p>
        </div>
      </div>

      {error && (
        <div className="border border-red-900/50 bg-red-950/20 p-4 text-red-400 text-sm flex items-start gap-2">
          <AlertTriangle size={15} className="shrink-0 mt-0.5" /> {error}
        </div>
      )}

      <button type="submit" disabled={loading || !intentReady || !!intentError}
        className="w-full gold-gradient-bg text-black font-bold py-5 text-base hover:opacity-90 transition-opacity disabled:opacity-30 cursor-pointer flex items-center justify-center gap-3">
        {loading
          ? <><Loader size={18} className="animate-spin" /> Securing your spot…</>
          : <><ShieldCheck size={18} /> Save Card & Continue</>}
      </button>

      <p className="text-[#555] text-sm text-center">Nothing is charged today. You only add your card once.</p>
    </form>
  );
}

// ── Step 4 — Confirm ──────────────────────────────────────────────────────────
function ConfirmStep({
  user, cardData, selection, onNotesChange, onCardCapture, onSuccess, onBack,
}: {
  user:          AuthCustomer;
  cardData:      CardData | null;
  selection:     Selection;
  onNotesChange: (notes: string) => void;
  onCardCapture: (data: CardData) => void;
  onSuccess:     () => void;
  onBack:        () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState("");

  const formattedDate = selection.date
    ? new Date(selection.date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    : "";

  const handleSubmit = useCallback(async () => {
    if (!cardData) { setError("Please add your card to continue."); return; }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          name:                  cardData.name,
          email:                 cardData.email,
          phone:                 cardData.phone,
          service:               selection.service,
          stylist:               selection.stylist === "No preference" ? "" : selection.stylist,
          date:                  selection.date,
          time:                  selection.time,
          notes:                 selection.notes,
          stripeCustomerId:      cardData.stripeCustomerId,
          stripePaymentMethodId: cardData.stripePaymentMethodId,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to submit booking.");
        setSubmitting(false);
        return;
      }
      onSuccess();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Network error — please check your connection.");
      setSubmitting(false);
    }
  }, [cardData, selection, onSuccess]);

  return (
    <div className="space-y-4">
      {/* Mobile summary */}
      <div className="luxury-card p-5 lg:hidden">
        <p className="text-[#555] text-xs uppercase tracking-widest mb-3">Your Booking</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between gap-2"><span className="text-[#444]">Service</span><span className="text-white font-medium text-right">{selection.service}</span></div>
          <div className="flex justify-between gap-2"><span className="text-[#444]">Stylist</span><span className="text-[var(--mc-muted)] text-right">{selection.stylist}</span></div>
          <div className="flex justify-between gap-2"><span className="text-[#444]">Date</span><span className="text-[var(--mc-accent)] text-right">{formattedDate}</span></div>
          <div className="flex justify-between gap-2"><span className="text-[#444]">Time</span><span className="text-[var(--mc-accent)] text-right">{selection.time}</span></div>
        </div>
      </div>

      {!cardData ? (
        /* New user — card capture */
        <div className="luxury-card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard size={18} className="text-[var(--mc-accent)]" />
            <div>
              <h2 className="font-serif text-xl font-bold text-white">Add Your Card</h2>
              <p className="text-[var(--mc-muted)] text-xs mt-0.5">Saved once — instant booking every time after</p>
            </div>
          </div>
          <CardCaptureForm user={user} onSuccess={onCardCapture} />
        </div>
      ) : (
        /* Returning user — submit form */
        <div className="luxury-card p-6 md:p-8">
          <button onClick={onBack} className={backBtnCls}><ChevronLeft size={14} /> Back to Date & Time</button>

          <div className="flex items-center gap-3 mb-6">
            <CalendarDays size={18} className="text-[var(--mc-accent)]" />
            <div>
              <h2 className="font-serif text-xl font-bold text-white">Confirm Appointment</h2>
              <p className="text-[var(--mc-muted)] text-xs mt-0.5">Review and submit your request</p>
            </div>
          </div>

          {/* Booking summary */}
          <div className="border border-[#1a1a1a] bg-[#080808] p-5 mb-6 space-y-2 text-sm">
            <div className="flex justify-between gap-2"><span className="text-[#555]">Service</span><span className="text-white font-medium text-right">{selection.service}</span></div>
            <div className="flex justify-between gap-2"><span className="text-[#555]">Stylist</span><span className="text-[var(--mc-muted)] text-right">{selection.stylist}</span></div>
            <div className="flex justify-between gap-2"><span className="text-[#555]">Date</span><span className="text-[var(--mc-accent)] font-medium text-right">{formattedDate}</span></div>
            <div className="flex justify-between gap-2"><span className="text-[#555]">Time</span><span className="text-[var(--mc-accent)] font-medium text-right">{selection.time}</span></div>
          </div>

          {/* Card badge */}
          <div className="flex items-center gap-3 border border-[var(--mc-accent)]/30 bg-[#0a0800] px-4 py-3 mb-6">
            <ShieldCheck size={14} className="text-[var(--mc-accent)] shrink-0" />
            <div>
              <p className="text-[var(--mc-accent)] text-xs font-semibold uppercase tracking-widest">Card on File</p>
              <p className="text-[var(--mc-muted)] text-xs">$0 charged today · 30% fee only for no-show or late cancel</p>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className={labelCls}>Notes <span className="text-[#444] normal-case tracking-normal font-normal">(optional)</span></label>
            <textarea placeholder="Anything we should know? (hair length, allergies, inspiration photo)"
              value={selection.notes} onChange={e => onNotesChange(e.target.value)}
              rows={3} className={`${inputCls} resize-none`} />
          </div>

          {error && (
            <div className="border border-red-900/50 bg-red-950/20 p-4 text-red-400 text-sm mb-4 flex items-start gap-2">
              <AlertTriangle size={15} className="shrink-0 mt-0.5" /> {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={submitting}
            className="w-full gold-gradient-bg text-black font-bold py-5 text-base hover:opacity-90 transition-opacity disabled:opacity-30 cursor-pointer flex items-center justify-center gap-3">
            {submitting
              ? <><Loader size={18} className="animate-spin" /> Sending request…</>
              : <><CalendarDays size={18} /> Request Appointment</>}
          </button>

          <p className="text-[#444] text-xs text-center mt-3">
            Pending confirmation — we&apos;ll email {user.email} within 24 hours
          </p>
        </div>
      )}
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
      <p className="text-[var(--mc-accent)] text-xs uppercase tracking-[0.4em] font-semibold mb-3">Request Sent</p>
      <h2 className="font-serif text-4xl font-bold text-white mb-3">You&apos;re on the list!</h2>
      <p className="text-[var(--mc-muted)] text-sm max-w-sm mx-auto mb-8 leading-relaxed">
        Your appointment request has been received, {name.split(" ")[0]}. We&apos;ll confirm your time within 24 hours.
      </p>
      <div className="inline-flex items-center gap-2 border border-[#1a1a1a] bg-[#080808] px-6 py-3 text-sm text-[var(--mc-muted)] mb-8">
        <ShieldCheck size={14} className="text-[var(--mc-accent)]" />
        $0 charged today · 30% fee only for no-show or late cancel
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button onClick={onReset}
          className="gold-gradient-bg text-black font-bold px-10 py-3 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity cursor-pointer">
          Book Another
        </button>
        <a href="tel:+12129885252" className="border border-[#222] text-[var(--mc-muted)] px-10 py-3 text-xs uppercase tracking-widest hover:border-[#444] transition-colors">
          Call the Salon
        </a>
      </div>
    </div>
  );
}

// ── Main flow ─────────────────────────────────────────────────────────────────
function BookingFlow() {
  const [step,        setStep]        = useState<Step>(0);
  const [done,        setDone]        = useState(false);
  const [user,        setUser]        = useState<AuthCustomer | null>(null);
  const [cardData,    setCardData]    = useState<CardData | null>(null);
  const [selection,   setSelection]   = useState<Selection>({
    service: "", servicePrice: undefined, stylist: "No preference", date: "", time: "", notes: "",
  });
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && !data.error) applyAuth(data);
      })
      .catch(() => {})
      .finally(() => setAuthChecked(true));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function applyAuth(u: AuthCustomer) {
    setUser(u);
    if (u.stripeCustomerId && u.stripePaymentMethodId) {
      setCardData({ name: u.name, email: u.email, phone: u.phone, stripeCustomerId: u.stripeCustomerId, stripePaymentMethodId: u.stripePaymentMethodId });
    }
    setStep(1);
  }

  const handleSignIn = useCallback((u: AuthCustomer) => applyAuth(u), []); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = () => {
    setStep(1);
    setDone(false);
    setSelection({ service: "", servicePrice: undefined, stylist: "No preference", date: "", time: "", notes: "" });
  };

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
      <section className="pt-28 sm:pt-36 pb-8 px-6 bg-black text-center">
        <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">
          Reserve Your Visit
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
          {done ? "Request Sent" : "Book Appointment"}
        </h1>
        <p className="text-[var(--mc-muted)] max-w-md mx-auto text-sm leading-relaxed mb-8">
          {step === 0
            ? "Sign in once — every future booking takes under a minute."
            : done
            ? "We'll confirm your appointment within 24 hours."
            : "A luxury experience begins with a single step."}
        </p>
        {!done && step >= 1 && step <= 4 && <StepBreadcrumb step={step as 1 | 2 | 3 | 4} />}
      </section>

      {/* Content */}
      <section className="pb-24 px-6 bg-black">
        {done ? (
          <div className="max-w-2xl mx-auto">
            <div className="luxury-card p-8 md:p-10">
              <SuccessScreen name={user?.name ?? ""} onReset={reset} />
            </div>
          </div>
        ) : step === 0 ? (
          <div className="max-w-xl mx-auto">
            <SignInGate onSignIn={handleSignIn} />
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
              {/* Step content */}
              <div>
                {step === 1 && (
                  <ServiceStep
                    selected={selection.service}
                    onSelect={(service, price) => {
                      setSelection(s => ({ ...s, service, servicePrice: price }));
                      setStep(2);
                    }}
                  />
                )}
                {step === 2 && (
                  <SpecialistStep
                    selected={selection.stylist}
                    onSelect={stylist => { setSelection(s => ({ ...s, stylist })); setStep(3); }}
                    onBack={() => setStep(1)}
                  />
                )}
                {step === 3 && (
                  <DateTimeStep
                    date={selection.date}
                    time={selection.time}
                    onSelect={(date, time) => { setSelection(s => ({ ...s, date, time })); setStep(4); }}
                    onBack={() => setStep(2)}
                  />
                )}
                {step === 4 && user && (
                  <ConfirmStep
                    user={user}
                    cardData={cardData}
                    selection={selection}
                    onNotesChange={notes => setSelection(s => ({ ...s, notes }))}
                    onCardCapture={setCardData}
                    onSuccess={() => setDone(true)}
                    onBack={() => setStep(3)}
                  />
                )}
              </div>

              {/* Summary panel */}
              <div className="hidden lg:block">
                <SummaryPanel selection={selection} user={user} cardData={cardData} />
              </div>
            </div>

            {/* Phone fallback */}
            {step < 4 && (
              <div className="max-w-5xl mt-6 border border-[#1a1a1a] py-4 px-6 text-center">
                <p className="text-[#555] text-sm mb-1.5">Prefer to speak with someone?</p>
                <a href="tel:+12129885252" className="inline-flex items-center gap-2 text-[var(--mc-accent)] font-semibold text-lg hover:opacity-80 transition-opacity">
                  <Phone size={18} /> (212) 988-5252
                </a>
              </div>
            )}
          </div>
        )}
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
