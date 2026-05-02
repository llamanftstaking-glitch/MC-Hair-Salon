"use client";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#f5f0e8",
      fontFamily: "Inter, sans-serif",
      fontSize: "15px",
      "::placeholder": { color: "#444" },
    },
    invalid: { color: "#ef4444" },
  },
};

interface BookingInfo {
  id: string;
  name: string;
  service: string;
  stylist: string;
  date: string;
  time: string;
  servicePrice: number;
  paymentStatus: "unpaid" | "paid";
  tipAmount?: number;
}

const TIP_PRESETS = [
  { label: "15%", value: 0.15 },
  { label: "20%", value: 0.20 },
  { label: "25%", value: 0.25 },
];

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function PayForm({ booking }: { booking: BookingInfo }) {
  const stripe = useStripe();
  const elements = useElements();

  const [tipPreset, setTipPreset]     = useState<number | "custom" | "none">(0.20);
  const [customTip, setCustomTip]     = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [paid, setPaid]               = useState(booking.paymentStatus === "paid");

  const tipDollars = tipPreset === "none" ? 0
    : tipPreset === "custom" ? (parseFloat(customTip) || 0)
    : booking.servicePrice * (tipPreset as number);

  const total = booking.servicePrice + tipDollars;

  async function handlePay() {
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");

    try {
      // 1. Create PaymentIntent
      const res = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.id, tipAmount: tipDollars }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Payment setup failed"); setLoading(false); return; }

      // 2. Confirm with Stripe
      const card = elements.getElement(CardNumberElement);
      if (!card) { setError("Card element not found"); setLoading(false); return; }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card },
      });

      if (stripeError) {
        setError(stripeError.message ?? "Payment failed");
        setLoading(false);
        return;
      }

      // 3. Mark booking as paid
      await fetch("/api/pay", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId:       booking.id,
          tipAmount:       tipDollars,
          paymentIntentId: paymentIntent!.id,
        }),
      });

      setPaid(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (paid) {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 rounded-full border-2 border-[#C9A84C] flex items-center justify-center mx-auto mb-6">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="font-serif text-2xl font-bold text-white mb-2">Payment Received</h2>
        <p className="text-[#a89070] mb-6">Thank you, {booking.name.split(" ")[0]}! We&apos;ll see you on {booking.date} at {booking.time}.</p>
        <div className="bg-[#0f0f0f] border border-[#2a2a2a] p-5 text-left max-w-xs mx-auto">
          <p className="text-[#666] text-xs uppercase tracking-widest mb-3">Payment Summary</p>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-[#888]">Service</span>
            <span className="text-white">{fmt(booking.servicePrice)}</span>
          </div>
          {tipDollars > 0 && (
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[#888]">Gratuity</span>
              <span className="text-white">{fmt(tipDollars)}</span>
            </div>
          )}
          <div className="border-t border-[#2a2a2a] mt-3 pt-3 flex justify-between font-bold">
            <span className="text-[#C9A84C]">Total</span>
            <span className="text-[#C9A84C]">{fmt(booking.servicePrice + tipDollars)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Appointment summary */}
      <div className="bg-[#0f0f0f] border border-[#2a2a2a] p-5 mb-6">
        <p className="text-[#666] text-xs uppercase tracking-widest mb-3">Your Appointment</p>
        <p className="text-white font-semibold mb-1">{booking.service}</p>
        <p className="text-[#888] text-sm">{booking.stylist || "Any Stylist"} &middot; {booking.date} at {booking.time}</p>
        <div className="border-t border-[#1a1a1a] mt-4 pt-4 flex justify-between items-center">
          <span className="text-[#666] text-sm">Service total</span>
          <span className="text-[#C9A84C] text-lg font-bold">{fmt(booking.servicePrice)}</span>
        </div>
      </div>

      {/* Tip selector */}
      <div className="mb-6">
        <p className="text-[#666] text-xs uppercase tracking-widest mb-3">Add Gratuity</p>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {TIP_PRESETS.map(p => (
            <button key={p.label} onClick={() => setTipPreset(p.value)}
              className={`py-2.5 text-sm font-semibold border transition-all cursor-pointer ${
                tipPreset === p.value
                  ? "border-[#C9A84C] bg-[#0a0800] text-[#C9A84C]"
                  : "border-[#2a2a2a] text-[#555] hover:border-[#444]"
              }`}>
              {p.label}
              <span className="block text-[10px] font-normal mt-0.5 opacity-70">
                {fmt(booking.servicePrice * p.value)}
              </span>
            </button>
          ))}
          <button onClick={() => setTipPreset("none")}
            className={`py-2.5 text-sm font-semibold border transition-all cursor-pointer ${
              tipPreset === "none"
                ? "border-[#C9A84C] bg-[#0a0800] text-[#C9A84C]"
                : "border-[#2a2a2a] text-[#555] hover:border-[#444]"
            }`}>
            No Tip
          </button>
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555] text-sm">$</span>
          <input
            type="number"
            min="0"
            step="1"
            placeholder="Custom amount"
            value={tipPreset === "custom" ? customTip : ""}
            onFocus={() => setTipPreset("custom")}
            onChange={e => { setTipPreset("custom"); setCustomTip(e.target.value); }}
            className="w-full bg-[#0f0f0f] border border-[#2a2a2a] text-white pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C] transition-colors placeholder-[#333]"
          />
        </div>
      </div>

      {/* Total */}
      <div className="bg-[#0a0800] border border-[#C9A84C]/20 p-4 mb-6 flex justify-between items-center">
        <span className="text-[#a89070] text-sm">Total due today</span>
        <span className="text-[#C9A84C] text-xl font-bold">{fmt(total)}</span>
      </div>

      {/* Card inputs */}
      <div className="space-y-3 mb-6">
        <div>
          <label className="block text-[#666] text-xs uppercase tracking-widest mb-1.5">Card Number</label>
          <div className="bg-[#0f0f0f] border border-[#2a2a2a] px-4 py-3 focus-within:border-[#C9A84C] transition-colors">
            <CardNumberElement options={ELEMENT_OPTIONS} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[#666] text-xs uppercase tracking-widest mb-1.5">Expiry</label>
            <div className="bg-[#0f0f0f] border border-[#2a2a2a] px-4 py-3 focus-within:border-[#C9A84C] transition-colors">
              <CardExpiryElement options={ELEMENT_OPTIONS} />
            </div>
          </div>
          <div>
            <label className="block text-[#666] text-xs uppercase tracking-widest mb-1.5">CVC</label>
            <div className="bg-[#0f0f0f] border border-[#2a2a2a] px-4 py-3 focus-within:border-[#C9A84C] transition-colors">
              <CardCvcElement options={ELEMENT_OPTIONS} />
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <button onClick={handlePay} disabled={loading || !stripe}
        className="w-full py-4 bg-gradient-to-r from-[#B8860B] to-[#FFD700] text-black font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2">
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
              <path fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" className="opacity-75" />
            </svg>
            Processing…
          </>
        ) : (
          `Pay ${fmt(total)}`
        )}
      </button>

      <p className="text-[#333] text-xs text-center mt-4">Secured by Stripe · MC Hair Salon & Spa</p>
    </div>
  );
}

export default function PayClient({ booking }: { booking: BookingInfo }) {
  return (
    <div className="min-h-screen bg-black flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl font-bold text-[#C9A84C] tracking-wide mb-1">MC Hair Salon & Spa</h1>
          <p className="text-[#555] text-xs uppercase tracking-widest">Upper East Side · New York</p>
          <div className="w-10 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent mx-auto mt-4" />
        </div>

        <h2 className="font-serif text-xl text-white text-center mb-6">
          {booking.paymentStatus === "paid" ? "Payment Confirmed" : "Pay for Your Appointment"}
        </h2>

        <Elements stripe={stripePromise}>
          <PayForm booking={booking} />
        </Elements>
      </div>
    </div>
  );
}
