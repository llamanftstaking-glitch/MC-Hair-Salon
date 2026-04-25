"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, ChevronLeft, ShieldCheck, CreditCard, AlertTriangle,
  Scissors, Wind, Sparkles, Palette, Star, Calendar, Clock, User,
} from "lucide-react";
import { SERVICES, TEAM } from "@/lib/data";

// ── Stripe initialization ─────────────────────────────────────────────────────
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : Promise.resolve(null);

// ── Time slot generation ──────────────────────────────────────────────────────
const SALON_HOURS: Record<number, { open: string; close: string }> = {
  0: { open: "11:00", close: "18:00" },
  1: { open: "10:00", close: "17:00" },
  2: { open: "10:30", close: "19:30" },
  3: { open: "10:30", close: "19:30" },
  4: { open: "10:30", close: "19:30" },
  5: { open: "10:00", close: "19:00" },
  6: { open: "10:00", close: "19:00" },
};

function generateTimeSlots(dateStr: string): string[] {
  if (!dateStr) return [];
  const date = new Date(dateStr + "T00:00:00");
  const dow = date.getDay();
  const hours = SALON_HOURS[dow];
  if (!hours) return [];

  const [openH, openM] = hours.open.split(":").map(Number);
  const [closeH, closeM] = hours.close.split(":").map(Number);

  const slots: string[] = [];
  let h = openH, m = openM;

  while (h * 60 + m <= closeH * 60 + closeM - 30) {
    const period = h < 12 ? "AM" : "PM";
    const dH = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const dM = m === 0 ? "00" : String(m);
    slots.push(`${dH}:${dM} ${period}`);
    m += 30;
    if (m >= 60) { m -= 60; h += 1; }
  }
  return slots;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Haircuts":          <Scissors  size={20} />,
  "Blowouts & Styling":<Wind      size={20} />,
  "Color":             <Palette   size={20} />,
  "Spa Services":      <Sparkles  size={20} />,
  "Makeup":            <Star      size={20} />,
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface BookingForm {
  service: string;
  servicePrice: number;
  stylist: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
}

// ── Step progress indicator ───────────────────────────────────────────────────
const STEPS = ["Service", "Schedule", "Details", "Payment"];

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center mb-12 px-4">
      {STEPS.map((label, i) => {
        const num = i + 1;
        const done = current > num;
        const active = current === num;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${
                done   ? "bg-[var(--mc-accent)] border-[var(--mc-accent)] text-black" :
                active ? "border-[var(--mc-accent)] text-[var(--mc-accent)] bg-transparent" :
                         "border-[#2a2a2a] text-[#444] bg-transparent"
              }`}>
                {done ? <Check size={15} strokeWidth={3} /> : num}
              </div>
              <span className={`text-[10px] mt-1.5 uppercase tracking-widest font-semibold ${
                active || done ? "text-[var(--mc-accent)]" : "text-[#333]"
              }`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-10 sm:w-16 mx-1 mb-5 transition-all duration-500 ${
                done ? "bg-[var(--mc-accent)]" : "bg-[#1f1f1f]"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Step 1 — Service Selection ────────────────────────────────────────────────
function Step1Service({
  onSelect,
}: {
  onSelect: (service: string, price: number) => void;
}) {
  const [activeCategory, setActiveCategory] = useState(SERVICES[0].category);

  const active = SERVICES.find((c) => c.category === activeCategory);

  return (
    <div>
      <p className="text-[var(--mc-muted)] text-center mb-8 text-sm">
        Select the service you&apos;d like to book
      </p>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide justify-center flex-wrap">
        {SERVICES.map((cat) => (
          <button
            key={cat.category}
            onClick={() => setActiveCategory(cat.category)}
            className={`flex items-center gap-2 px-4 py-2.5 border text-xs uppercase tracking-widest font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat.category
                ? "border-[var(--mc-accent)] text-black bg-[var(--mc-accent)]"
                : "border-[#222] text-[var(--mc-muted)] hover:border-[var(--mc-accent)] hover:text-[var(--mc-accent)]"
            }`}
          >
            <span className="hidden sm:inline">{CATEGORY_ICONS[cat.category]}</span>
            {cat.category}
          </button>
        ))}
      </div>

      {/* Service cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {active?.items.map((item) => (
          <button
            key={item.name}
            onClick={() => onSelect(item.name, item.price)}
            className="group text-left border border-[#1a1a1a] hover:border-[var(--mc-accent)] bg-[#080808] hover:bg-[#0f0f0f] p-5 transition-all duration-200 cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-serif font-bold text-white text-base leading-tight group-hover:text-[var(--mc-accent)] transition-colors">
                {item.name}
              </span>
              <span className="text-[var(--mc-accent)] font-bold text-sm ml-3 shrink-0">
                from ${item.price}
              </span>
            </div>
            <p className="text-[var(--mc-muted)] text-xs leading-relaxed">{item.description}</p>
            <div className="mt-3 flex items-center gap-1 text-[#333] group-hover:text-[var(--mc-accent)] transition-colors text-xs uppercase tracking-widest font-semibold">
              Select <Check size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Step 2 — Schedule ─────────────────────────────────────────────────────────
function Step2Schedule({
  form,
  onChange,
  onNext,
  onBack,
}: {
  form: BookingForm;
  onChange: (key: keyof BookingForm, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const timeSlots = generateTimeSlots(form.date);
  const today = new Date().toISOString().split("T")[0];
  const can = form.date && form.time;

  return (
    <div>
      {/* Selected service callout */}
      <div className="border border-[#1a1a1a] bg-[#080808] p-4 mb-8 flex items-center justify-between">
        <div>
          <p className="text-[var(--mc-muted)] text-xs uppercase tracking-widest mb-1">Selected Service</p>
          <p className="text-white font-serif font-bold">{form.service}</p>
        </div>
        <span className="text-[var(--mc-accent)] font-bold">from ${form.servicePrice}</span>
      </div>

      {/* Stylist selection */}
      <div className="mb-8">
        <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-4">
          Choose Your Stylist
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* No preference option */}
          <button
            onClick={() => onChange("stylist", "")}
            className={`p-4 border text-center transition-all duration-200 cursor-pointer ${
              form.stylist === ""
                ? "border-[var(--mc-accent)] bg-[#0f0f0f]"
                : "border-[#1a1a1a] bg-[#080808] hover:border-[#333]"
            }`}
          >
            <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center border-2 ${
              form.stylist === "" ? "border-[var(--mc-accent)]" : "border-[#222]"
            }`}>
              <User size={20} className={form.stylist === "" ? "text-[var(--mc-accent)]" : "text-[#444]"} />
            </div>
            <p className={`text-xs font-bold uppercase tracking-wider ${form.stylist === "" ? "text-[var(--mc-accent)]" : "text-[#555]"}`}>
              Any Stylist
            </p>
            <p className="text-[10px] text-[#333] mt-0.5">First available</p>
          </button>

          {TEAM.map((member) => (
            <button
              key={member.name}
              onClick={() => onChange("stylist", member.name)}
              className={`p-4 border text-center transition-all duration-200 cursor-pointer ${
                form.stylist === member.name
                  ? "border-[var(--mc-accent)] bg-[#0f0f0f]"
                  : "border-[#1a1a1a] bg-[#080808] hover:border-[#333]"
              }`}
            >
              <div className="relative w-12 h-12 rounded-full mx-auto mb-2 overflow-hidden bg-[#111]">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-xl font-serif font-bold text-[var(--mc-accent)]">
                      {member.name[0]}
                    </span>
                  </div>
                )}
                {form.stylist === member.name && (
                  <div className="absolute inset-0 bg-[var(--mc-accent)]/20 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-[var(--mc-accent)] flex items-center justify-center">
                      <Check size={10} strokeWidth={3} className="text-black" />
                    </div>
                  </div>
                )}
              </div>
              <p className={`text-xs font-bold uppercase tracking-wider ${
                form.stylist === member.name ? "text-[var(--mc-accent)]" : "text-white"
              }`}>{member.name}</p>
              <p className="text-[10px] text-[#555] mt-0.5 truncate">{member.role}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Date picker */}
      <div className="mb-8">
        <label className="flex items-center gap-2 text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-3">
          <Calendar size={14} /> Select Date
        </label>
        <input
          type="date"
          value={form.date}
          min={today}
          onChange={(e) => { onChange("date", e.target.value); onChange("time", ""); }}
          className="w-full bg-[#080808] border border-[#1a1a1a] text-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors cursor-pointer"
          style={{ colorScheme: "dark" }}
        />
        {form.date && (
          <p className="text-[#555] text-xs mt-2 uppercase tracking-wider">
            {new Date(form.date + "T00:00:00").toLocaleDateString("en-US", {
              weekday: "long", month: "long", day: "numeric",
            })}
          </p>
        )}
      </div>

      {/* Time slots */}
      {form.date && (
        <div className="mb-8">
          <label className="flex items-center gap-2 text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-3">
            <Clock size={14} /> Select Time
          </label>
          {timeSlots.length === 0 ? (
            <p className="text-[var(--mc-muted)] text-sm">We&apos;re closed on this day. Please choose another date.</p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => onChange("time", slot)}
                  className={`py-2.5 text-xs border font-semibold transition-all duration-150 cursor-pointer ${
                    form.time === slot
                      ? "bg-[var(--mc-accent)] border-[var(--mc-accent)] text-black"
                      : "border-[#1a1a1a] text-[#888] hover:border-[var(--mc-accent)] hover:text-white"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-2">
        <button onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 border border-[#222] text-[var(--mc-muted)] text-xs uppercase tracking-widest hover:border-[#444] transition-colors cursor-pointer">
          <ChevronLeft size={14} /> Back
        </button>
        <button
          onClick={onNext}
          disabled={!can}
          className="flex-1 gold-gradient-bg text-black font-bold py-3 uppercase tracking-widest text-xs hover:opacity-90 transition-opacity disabled:opacity-30 cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

// ── Step 3 — Personal Details ─────────────────────────────────────────────────
function Step3Details({
  form,
  onChange,
  onNext,
  onBack,
}: {
  form: BookingForm;
  onChange: (key: keyof BookingForm, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const can = form.name && form.email && form.phone;
  const inputCls = "w-full bg-[#080808] border border-[#1a1a1a] text-white px-4 py-3 text-sm focus:outline-none focus:border-[var(--mc-accent)] transition-colors placeholder-[#333]";
  const labelCls = "block text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-2";

  return (
    <div className="space-y-6">
      {/* Appointment summary strip */}
      <div className="border border-[#1a1a1a] bg-[#080808] p-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-[#444] text-[10px] uppercase tracking-widest mb-1">Service</p>
          <p className="text-white text-xs font-semibold truncate">{form.service}</p>
        </div>
        <div>
          <p className="text-[#444] text-[10px] uppercase tracking-widest mb-1">Date</p>
          <p className="text-white text-xs font-semibold">
            {new Date(form.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </p>
        </div>
        <div>
          <p className="text-[#444] text-[10px] uppercase tracking-widest mb-1">Time</p>
          <p className="text-white text-xs font-semibold">{form.time}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className={labelCls}>Full Name *</label>
          <input
            type="text"
            required
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Phone *</label>
          <input
            type="tel"
            required
            placeholder="(212) 000-0000"
            value={form.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Email *</label>
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={form.email}
          onChange={(e) => onChange("email", e.target.value)}
          className={inputCls}
        />
      </div>

      <div>
        <label className={labelCls}>Additional Notes</label>
        <textarea
          rows={3}
          placeholder="Allergies, reference photos, special requests..."
          value={form.notes}
          onChange={(e) => onChange("notes", e.target.value)}
          className={`${inputCls} resize-none`}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 border border-[#222] text-[var(--mc-muted)] text-xs uppercase tracking-widest hover:border-[#444] transition-colors cursor-pointer">
          <ChevronLeft size={14} /> Back
        </button>
        <button
          onClick={onNext}
          disabled={!can}
          className="flex-1 gold-gradient-bg text-black font-bold py-3 uppercase tracking-widest text-xs hover:opacity-90 transition-opacity disabled:opacity-30 cursor-pointer"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}

// ── Step 4 — Cancellation Policy + Stripe Card ────────────────────────────────
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

function CardFormStep({
  form,
  onSuccess,
  onBack,
}: {
  form: BookingForm;
  onSuccess: (bookingId: string) => void;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [intentReady, setIntentReady] = useState(false);
  const [intentError, setIntentError] = useState("");

  useEffect(() => {
    fetch("/api/stripe/setup-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, name: form.name }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
          setCustomerId(data.customerId);
          setIntentReady(true);
        } else {
          setIntentError(data.error ?? "Unable to initialize payment");
        }
      })
      .catch(() => setIntentError("Unable to connect to payment system"));
  }, [form.email, form.name]);

  const handleSubmit = useCallback(async () => {
    if (!agreed) { setError("Please agree to the cancellation policy to continue."); return; }
    if (!stripe || !elements || !clientSecret) { setError("Payment system not ready. Please wait."); return; }

    const card = elements.getElement(CardElement);
    if (!card) { setError("Card input not found."); return; }

    setLoading(true);
    setError("");

    const { setupIntent, error: stripeErr } = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card,
        billing_details: { name: form.name, email: form.email, phone: form.phone },
      },
    });

    if (stripeErr) {
      setError(stripeErr.message ?? "Card verification failed. Please check your details.");
      setLoading(false);
      return;
    }

    const paymentMethodId = setupIntent?.payment_method as string;

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          service: form.service,
          stylist: form.stylist,
          date: form.date,
          time: form.time,
          notes: form.notes,
          stripeCustomerId: customerId,
          stripePaymentMethodId: paymentMethodId,
        }),
      });
      const booking = await res.json();
      if (!res.ok) throw new Error(booking.error ?? "Booking failed");
      onSuccess(booking.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking submission failed. Please try again.");
      setLoading(false);
    }
  }, [agreed, stripe, elements, clientSecret, customerId, form, onSuccess]);

  return (
    <div className="space-y-6">
      {/* Appointment summary strip */}
      <div className="border border-[#1a1a1a] bg-[#080808] p-4">
        <p className="text-[#444] text-[10px] uppercase tracking-widest mb-3">Booking Summary</p>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <span className="text-[#555]">Service</span>
          <span className="text-white font-medium">{form.service}</span>
          <span className="text-[#555]">Stylist</span>
          <span className="text-white font-medium">{form.stylist || "Any available"}</span>
          <span className="text-[#555]">Date</span>
          <span className="text-white font-medium">
            {new Date(form.date + "T00:00:00").toLocaleDateString("en-US", {
              weekday: "short", month: "long", day: "numeric",
            })}
          </span>
          <span className="text-[#555]">Time</span>
          <span className="text-white font-medium">{form.time}</span>
          <span className="text-[#555]">Client</span>
          <span className="text-white font-medium">{form.name}</span>
        </div>
      </div>

      {/* Cancellation policy card */}
      <div className="border border-[#B8860B]/40 bg-[#0a0800] p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="mt-0.5">
            <AlertTriangle size={20} className="text-[var(--mc-accent)]" />
          </div>
          <div>
            <p className="text-[var(--mc-accent)] font-bold text-sm uppercase tracking-widest mb-1">
              Cancellation Policy
            </p>
            <p className="text-[#B8860B]/70 text-xs leading-relaxed">
              $20 no-show fee
            </p>
          </div>
        </div>
        <ul className="space-y-2.5 text-sm text-[var(--mc-muted)]">
          <li className="flex items-start gap-2.5">
            <Check size={14} className="text-[var(--mc-accent)] mt-0.5 shrink-0" />
            <span>Cancel <strong className="text-white">24+ hours in advance</strong> — no charge, no questions asked.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <Check size={14} className="text-[var(--mc-accent)] mt-0.5 shrink-0" />
            <span>Cancel <strong className="text-white">less than 24 hours</strong> before, or no-show — a <strong className="text-white">$20 fee</strong> will be applied to the card on file.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <ShieldCheck size={14} className="text-[var(--mc-accent)] mt-0.5 shrink-0" />
            <span><strong className="text-white">Your card is not charged today.</strong> It is securely stored via Stripe to hold your appointment.</span>
          </li>
        </ul>
      </div>

      {/* Agreement checkbox */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className={`mt-0.5 w-5 h-5 shrink-0 border-2 flex items-center justify-center transition-all ${
          agreed ? "bg-[var(--mc-accent)] border-[var(--mc-accent)]" : "border-[#333] group-hover:border-[var(--mc-accent)]"
        }`}>
          {agreed && <Check size={12} strokeWidth={3} className="text-black" />}
        </div>
        <input
          type="checkbox"
          className="sr-only"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        <span className="text-[var(--mc-muted)] text-sm leading-relaxed">
          I understand and agree to the MC Hair Salon &amp; Spa{" "}
          <a href="/terms#cancellation" target="_blank" className="text-[var(--mc-accent)] hover:underline">cancellation policy</a>.
          {" "}A $20 fee may be charged if I no-show or cancel with less than 24 hours notice.
        </span>
      </label>

      {/* Stripe card element */}
      <div>
        <label className="flex items-center gap-2 text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-3">
          <CreditCard size={14} /> Card on File
        </label>
        <div className={`border p-4 transition-colors ${intentReady ? "border-[#1a1a1a] bg-[#080808]" : "border-[#111] bg-[#050505] opacity-60"}`}>
          {intentError ? (
            <p className="text-red-400 text-sm">{intentError}</p>
          ) : !intentReady ? (
            <div className="flex items-center gap-2 text-[#444] text-sm">
              <div className="w-4 h-4 border-2 border-[#333] border-t-[var(--mc-accent)] rounded-full animate-spin" />
              Connecting to secure payment system...
            </div>
          ) : (
            <CardElement options={CARD_STYLE} />
          )}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <ShieldCheck size={13} className="text-[#444]" />
          <p className="text-[#444] text-xs">
            Secured by <span className="text-[#666]">Stripe</span> · 256-bit SSL encryption · PCI compliant
          </p>
        </div>
      </div>

      {error && (
        <div className="border border-red-900/50 bg-red-950/20 p-3 text-red-400 text-sm flex items-start gap-2">
          <AlertTriangle size={15} className="shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 border border-[#222] text-[var(--mc-muted)] text-xs uppercase tracking-widest hover:border-[#444] transition-colors cursor-pointer disabled:opacity-40"
        >
          <ChevronLeft size={14} /> Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading || !intentReady || !!intentError}
          className="flex-1 gold-gradient-bg text-black font-bold py-4 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity disabled:opacity-30 cursor-pointer flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Securing Appointment...
            </>
          ) : (
            <>
              <ShieldCheck size={16} />
              Complete Booking
            </>
          )}
        </button>
      </div>

      <p className="text-[#333] text-xs text-center">
        $0 charged today &nbsp;·&nbsp; Card securely held via Stripe &nbsp;·&nbsp; $20 only if you no-show
      </p>
    </div>
  );
}

// ── Success screen ────────────────────────────────────────────────────────────
function SuccessScreen({
  bookingId,
  form,
  onReset,
}: {
  bookingId: string;
  form: BookingForm;
  onReset: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="w-20 h-20 rounded-full gold-gradient-bg flex items-center justify-center mx-auto mb-6"
      >
        <Check size={36} strokeWidth={3} className="text-black" />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <p className="text-[var(--mc-accent)] text-xs uppercase tracking-[0.4em] font-semibold mb-3">
          Appointment Confirmed
        </p>
        <h2 className="font-serif text-4xl font-bold text-white mb-2">You&apos;re all set!</h2>
        <p className="text-[var(--mc-muted)] text-sm mb-2">
          Confirmation <span className="text-white font-mono">{bookingId}</span>
        </p>
        <p className="text-[var(--mc-muted)] text-sm mb-8">
          We&apos;ll confirm your appointment via email within a few hours.
        </p>

        {/* Summary card */}
        <div className="border border-[#1a1a1a] bg-[#080808] p-6 text-left max-w-sm mx-auto mb-6">
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <span className="text-[#555]">Service</span>
            <span className="text-white font-medium">{form.service}</span>
            {form.stylist && (
              <>
                <span className="text-[#555]">Stylist</span>
                <span className="text-white font-medium">{form.stylist}</span>
              </>
            )}
            <span className="text-[#555]">Date</span>
            <span className="text-white font-medium">
              {new Date(form.date + "T00:00:00").toLocaleDateString("en-US", {
                weekday: "long", month: "long", day: "numeric",
              })}
            </span>
            <span className="text-[#555]">Time</span>
            <span className="text-white font-medium">{form.time}</span>
          </div>
        </div>

        {/* Card hold notice */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <ShieldCheck size={15} className="text-[var(--mc-accent)]" />
          <p className="text-[var(--mc-muted)] text-xs">
            Card secured on file &nbsp;·&nbsp; $0 charged today &nbsp;·&nbsp; $20 applies only if you no-show
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onReset}
            className="gold-gradient-bg text-black font-bold px-10 py-3 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity cursor-pointer"
          >
            Book Another
          </button>
          <a
            href="tel:(212)988-5252"
            className="border border-[#222] text-[var(--mc-muted)] px-10 py-3 text-xs uppercase tracking-widest hover:border-[#444] transition-colors"
          >
            Call the Salon
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main booking wizard ───────────────────────────────────────────────────────
const initialForm: BookingForm = {
  service: "", servicePrice: 0, stylist: "",
  date: "", time: "", name: "", email: "", phone: "", notes: "",
};

function BookingWizard() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [form, setForm] = useState<BookingForm>(initialForm);
  const [bookingId, setBookingId] = useState("");
  const [done, setDone] = useState(false);

  const change = useCallback(
    (key: keyof BookingForm, value: string | number) =>
      setForm((f) => ({ ...f, [key]: value })),
    []
  );

  const reset = () => {
    setStep(1);
    setForm(initialForm);
    setBookingId("");
    setDone(false);
  };

  const variants = {
    enter:  { opacity: 0, x: 24  },
    center: { opacity: 1, x: 0   },
    exit:   { opacity: 0, x: -24 },
  };

  return (
    <>
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
        {!done && <StepBar current={step} />}
      </section>

      <section className="pb-24 px-6 bg-black">
        <div className="max-w-2xl mx-auto">
          {done ? (
            <SuccessScreen bookingId={bookingId} form={form} onReset={reset} />
          ) : (
            <div className="luxury-card p-8 md:p-10 overflow-hidden">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.22 }}>
                    <Step1Service
                      onSelect={(svc, price) => {
                        setForm((f) => ({ ...f, service: svc, servicePrice: price }));
                        setStep(2);
                      }}
                    />
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div key="step2" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.22 }}>
                    <Step2Schedule
                      form={form}
                      onChange={change}
                      onNext={() => setStep(3)}
                      onBack={() => setStep(1)}
                    />
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div key="step3" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.22 }}>
                    <Step3Details
                      form={form}
                      onChange={change}
                      onNext={() => setStep(4)}
                      onBack={() => setStep(2)}
                    />
                  </motion.div>
                )}
                {step === 4 && (
                  <motion.div key="step4" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.22 }}>
                    <CardFormStep
                      form={form}
                      onSuccess={(id) => { setBookingId(id); setDone(true); }}
                      onBack={() => setStep(3)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {!done && (
            <p className="text-center text-[#333] text-xs mt-8">
              Need help?{" "}
              <a href="tel:(212)988-5252" className="text-[var(--mc-accent)] hover:underline cursor-pointer">
                (212) 988-5252
              </a>
            </p>
          )}
        </div>
      </section>
    </>
  );
}

// ── Page export — wraps with Stripe Elements ──────────────────────────────────
export default function BookPage() {
  return (
    <Elements stripe={stripePromise}>
      <BookingWizard />
    </Elements>
  );
}
