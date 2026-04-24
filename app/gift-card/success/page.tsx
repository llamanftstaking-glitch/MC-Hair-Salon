import Link from "next/link";
import { Gift, Check, Mail, MessageSquare } from "lucide-react";

export const metadata = { title: "Gift Card Sent! | MC Hair Salon & Spa" };

export default function GiftCardSuccessPage() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 bg-[var(--mc-bg)] pt-28 pb-16">
      <div className="w-full max-w-lg text-center">
        {/* Icon */}
        <div className="w-24 h-24 rounded-full gold-gradient-bg flex items-center justify-center mx-auto mb-8 shadow-2xl"
          style={{ boxShadow: "0 0 60px rgba(184,134,11,0.3)" }}>
          <Gift size={44} className="text-black" />
        </div>

        <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-3">Payment Successful</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[var(--mc-text)] mb-4">Gift Card Sent!</h1>
        <div className="mx-auto h-px w-20 bg-gradient-to-r from-transparent via-[var(--mc-accent)] to-transparent mb-6" />

        <p className="text-[var(--mc-muted)] text-lg leading-relaxed mb-10">
          Your gift card is on its way. The recipient will receive a beautiful digital card with their unique code — ready to redeem at any visit.
        </p>

        {/* Confirmation details */}
        <div className="luxury-card p-8 mb-8 text-left space-y-4">
          <div className="flex items-center gap-3">
            <Check size={18} className="text-green-400 shrink-0" />
            <p className="text-[var(--mc-text-dim)] text-sm">Gift card generated and sent instantly</p>
          </div>
          <div className="flex items-center gap-3">
            <Check size={18} className="text-green-400 shrink-0" />
            <p className="text-[var(--mc-text-dim)] text-sm">Receipt sent to your email</p>
          </div>
          <div className="flex items-center gap-3">
            <Check size={18} className="text-green-400 shrink-0" />
            <p className="text-[var(--mc-text-dim)] text-sm">Valid for all services · Never expires</p>
          </div>
          <div className="pt-2 border-t border-[var(--mc-border)]">
            <p className="text-[var(--mc-text-dim)] text-xs">
              Didn&apos;t receive it? Call us at{" "}
              <a href="tel:+12129885252" className="text-[var(--mc-accent)] hover:underline cursor-pointer">(212) 988-5252</a>
              {" "}and we&apos;ll resend it right away.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/gift-card"
            className="border border-[var(--mc-accent)] text-[var(--mc-accent)] px-8 py-3 uppercase tracking-widest text-sm hover:bg-[var(--mc-accent)] hover:text-black transition-all cursor-pointer">
            Send Another
          </Link>
          <Link href="/book"
            className="gold-gradient-bg text-black font-bold px-8 py-3 uppercase tracking-widest text-sm hover:opacity-90 transition-opacity cursor-pointer">
            Book an Appointment
          </Link>
        </div>
      </div>
    </section>
  );
}
