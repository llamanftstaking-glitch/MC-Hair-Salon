import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Terms and Conditions for MC Hair Salon & Spa. Read our policies on appointments, cancellations, payments, electronic communications, and third-party service providers.",
  alternates: { canonical: "https://mchairsalon.com/terms" },
  robots: { index: true, follow: true },
};

const EFFECTIVE_DATE = "April 24, 2026";
const SALON_NAME     = "MC Hair Salon & Spa";
const SALON_ADDRESS  = "336 East 78th St, New York, NY 10075";
const SALON_PHONE    = "(212) 988-5252";
const SALON_EMAIL    = "info@mchairsalon.com";
const SITE_URL       = "https://mchairsalon.com";

const SECTIONS = [
  { id: "introduction",        label: "1. Introduction"                   },
  { id: "definitions",         label: "2. Definitions"                    },
  { id: "bookings",            label: "3. Appointment Booking"            },
  { id: "cancellation",        label: "4. Cancellation & No-Show Policy"  },
  { id: "payments",            label: "5. Payment Processing — Stripe"    },
  { id: "email",               label: "6. Email Communications — Resend"  },
  { id: "sms",                 label: "7. SMS Communications — Twilio"    },
  { id: "gift-cards",          label: "8. Gift Cards"                     },
  { id: "packages",            label: "9. Service Packages"               },
  { id: "privacy",             label: "10. Privacy & Data"                },
  { id: "third-party",         label: "11. Third-Party Service Providers" },
  { id: "conduct",             label: "12. Conduct & Right to Refuse"     },
  { id: "liability",           label: "13. Limitation of Liability"       },
  { id: "indemnification",     label: "14. Indemnification"               },
  { id: "changes",             label: "15. Changes to These Terms"        },
  { id: "governing-law",       label: "16. Governing Law"                 },
  { id: "contact",             label: "17. Contact Us"                    },
];

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28 mb-14">
      <h2 className="font-serif text-2xl font-bold text-white mb-5 pb-3 border-b border-[#1a1a1a] flex items-baseline gap-3">
        <span className="gold-gradient text-lg font-normal font-sans tracking-widest uppercase text-xs">{title.split(".")[0]}.</span>
        <span>{title.split(". ").slice(1).join(". ")}</span>
      </h2>
      <div className="text-[var(--mc-muted)] text-sm leading-7 space-y-4">{children}</div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>;
}

function Ul({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2 pl-5 list-none">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span className="text-[var(--mc-accent)] mt-1.5 text-[8px]">◆</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-[var(--mc-accent)] pl-4 py-2 bg-[#0a0800] text-white text-sm leading-7">
      {children}
    </div>
  );
}

function ThirdPartyBadge({ name, url, description }: { name: string; url: string; description: string }) {
  return (
    <div className="border border-[#1a1a1a] bg-[#080808] p-5">
      <div className="flex items-start justify-between gap-4 mb-2">
        <p className="text-white font-semibold">{name}</p>
        <a href={url} target="_blank" rel="noopener noreferrer"
          className="text-[var(--mc-accent)] text-xs uppercase tracking-widest hover:underline shrink-0">
          Privacy Policy ↗
        </a>
      </div>
      <p className="text-[#666] text-xs leading-relaxed">{description}</p>
    </div>
  );
}

export default function TermsPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-28 sm:pt-36 pb-12 px-6 bg-black text-center border-b border-[#111]">
        <p className="text-[var(--mc-accent)] uppercase tracking-[0.4em] text-xs font-semibold mb-4">Legal</p>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">Terms & Conditions</h1>
        <p className="text-[var(--mc-muted)] max-w-xl mx-auto text-sm leading-relaxed">
          Please read these terms carefully before booking an appointment, purchasing a gift card or package, or using any services at {SALON_NAME}.
        </p>
        <p className="text-[#444] text-xs mt-6 uppercase tracking-widest">
          Effective Date: {EFFECTIVE_DATE}
        </p>
      </section>

      <div className="bg-black py-16 px-6">
        <div className="max-w-6xl mx-auto flex gap-16 items-start">

          {/* Table of Contents — sticky sidebar on desktop */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-28">
            <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-4">Table of Contents</p>
            <nav className="space-y-1">
              {SECTIONS.map((s) => (
                <a key={s.id} href={`#${s.id}`}
                  className="block text-[#555] text-xs py-1.5 hover:text-[var(--mc-accent)] transition-colors leading-snug cursor-pointer">
                  {s.label}
                </a>
              ))}
            </nav>
            <div className="mt-8 border border-[#1a1a1a] p-4">
              <p className="text-[#444] text-xs uppercase tracking-widest mb-2">Questions?</p>
              <a href={`tel:${SALON_PHONE}`} className="text-[var(--mc-accent)] text-xs hover:underline block mb-1">
                {SALON_PHONE}
              </a>
              <a href={`mailto:${SALON_EMAIL}`} className="text-[#555] text-xs hover:text-[var(--mc-accent)] transition-colors">
                {SALON_EMAIL}
              </a>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">

            {/* Mobile ToC */}
            <div className="lg:hidden mb-10 border border-[#1a1a1a] bg-[#080808] p-5">
              <p className="text-[var(--mc-accent)] text-xs uppercase tracking-widest font-semibold mb-3">Table of Contents</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {SECTIONS.map((s) => (
                  <a key={s.id} href={`#${s.id}`}
                    className="text-[#555] text-xs py-1 hover:text-[var(--mc-accent)] transition-colors">
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* ── 1. Introduction ────────────────────────────────────────────── */}
            <Section id="introduction" title="1. Introduction">
              <P>
                Welcome to {SALON_NAME} ("<strong className="text-white">MC</strong>," "<strong className="text-white">we</strong>,"
                "<strong className="text-white">our</strong>," or "<strong className="text-white">us</strong>"). These Terms and
                Conditions govern your access to and use of our website at{" "}
                <a href={SITE_URL} className="text-[var(--mc-accent)] hover:underline">{SITE_URL}</a>{" "}
                and all services offered by {SALON_NAME}, located at {SALON_ADDRESS}.
              </P>
              <P>
                By booking an appointment, purchasing a gift card or service package, subscribing to communications, or
                otherwise engaging with our services, you confirm that you have read, understood, and agree to be bound by
                these Terms. If you do not agree, please do not use our website or services.
              </P>
              <P>
                These Terms apply to all clients, visitors, and guests — whether in-salon, online, or via phone.
              </P>
            </Section>

            {/* ── 2. Definitions ─────────────────────────────────────────────── */}
            <Section id="definitions" title="2. Definitions">
              <Ul items={[
                <><strong className="text-white">"Client" / "you"</strong> — any individual who books an appointment, purchases a product or service, or otherwise interacts with MC Hair Salon & Spa.</>,
                <><strong className="text-white">"Services"</strong> — all hair, spa, makeup, and beauty services offered at our salon, as described on our website.</>,
                <><strong className="text-white">"Booking"</strong> — any appointment reserved through our website, phone, or in person.</>,
                <><strong className="text-white">"Card on File"</strong> — a payment method stored securely via Stripe for the purpose of enforcing the cancellation policy.</>,
                <><strong className="text-white">"No-Show"</strong> — failure to appear for a scheduled appointment without cancelling at least 24 hours in advance.</>,
                <><strong className="text-white">"Package"</strong> — a pre-purchased bundle of salon services.</>,
                <><strong className="text-white">"Gift Card"</strong> — a stored-value card redeemable for services at MC Hair Salon & Spa.</>,
              ]} />
            </Section>

            {/* ── 3. Appointment Booking ──────────────────────────────────────── */}
            <Section id="bookings" title="3. Appointment Booking">
              <P>
                Appointments may be made online at{" "}
                <Link href="/book" className="text-[var(--mc-accent)] hover:underline">{SITE_URL}/book</Link>,
                by phone at <a href={`tel:${SALON_PHONE}`} className="text-[var(--mc-accent)] hover:underline">{SALON_PHONE}</a>,
                or in person at our salon.
              </P>
              <P>
                Online bookings require a valid credit or debit card to be placed on file at the time of booking. This card
                is held securely and is <strong className="text-white">not charged</strong> at the time of booking unless a
                cancellation fee is triggered (see Section 4).
              </P>
              <P>
                All bookings are subject to availability and are not confirmed until you receive a confirmation message from
                us via email or SMS. We reserve the right to reschedule or cancel bookings due to stylist availability,
                emergencies, or circumstances beyond our control.
              </P>
              <P>
                Arriving more than 15 minutes late may result in a shortened service or rescheduling at our discretion, with
                no reduction in the service fee.
              </P>
            </Section>

            {/* ── 4. Cancellation & No-Show ───────────────────────────────────── */}
            <Section id="cancellation" title="4. Cancellation & No-Show Policy">
              <Highlight>
                <strong>A $20.00 USD no-show fee applies to all appointments booked through this website.</strong>
              </Highlight>
              <P>
                We understand that life happens. Our cancellation policy is designed to respect both your time and that of
                our stylists:
              </P>
              <Ul items={[
                <><strong className="text-white">24+ hours notice:</strong> Cancel with no fee. Your card will not be charged.</>,
                <><strong className="text-white">Less than 24 hours notice:</strong> A $20.00 cancellation fee will be charged to the card on file.</>,
                <><strong className="text-white">No-show (no contact):</strong> A $20.00 no-show fee will be charged to the card on file and the appointment will be marked as forfeited.</>,
                <><strong className="text-white">Repeated no-shows:</strong> Clients with two or more no-shows in a 12-month period may be required to prepay for future services in full.</>,
              ]} />
              <P>
                To cancel or reschedule, please call us at{" "}
                <a href={`tel:${SALON_PHONE}`} className="text-[var(--mc-accent)] hover:underline">{SALON_PHONE}</a> or
                email <a href={`mailto:${SALON_EMAIL}`} className="text-[var(--mc-accent)] hover:underline">{SALON_EMAIL}</a>.
              </P>
              <P>
                The $20.00 fee is non-refundable once charged and covers a portion of the stylist&apos;s reserved time.
                Cancellation fees are processed automatically via Stripe using the card you provided at booking.
              </P>
            </Section>

            {/* ── 5. Payment Processing — Stripe ─────────────────────────────── */}
            <Section id="payments" title="5. Payment Processing — Stripe">
              <P>
                All online payment processing — including card-on-file storage, service package purchases, and gift card
                transactions — is handled by{" "}
                <strong className="text-white">Stripe, Inc.</strong> ("<strong className="text-white">Stripe</strong>"),
                a leading payment infrastructure provider.
              </P>
              <Ul items={[
                <>MC Hair Salon & Spa <strong className="text-white">never stores your full card number</strong>, CVV, or sensitive payment data on our own servers. All card data is tokenized and held exclusively by Stripe.</>,
                <>Stripe is <strong className="text-white">PCI DSS Level 1 certified</strong> — the highest level of security certification available in the payments industry.</>,
                <>By entering your card details on our booking page, you authorize MC Hair Salon & Spa to instruct Stripe to store your payment method and to charge the applicable cancellation fee if the conditions in Section 4 are met.</>,
                <>All charges are processed in <strong className="text-white">USD</strong>. International cards may incur foreign transaction fees from your issuing bank; we are not responsible for those charges.</>,
                <>For service disputes or unauthorized charges, please contact us at {SALON_EMAIL} before initiating a chargeback. Most issues are resolved within 48 hours.</>,
              ]} />
              <P>
                Stripe&apos;s services are governed by the{" "}
                <a href="https://stripe.com/legal/ssa" target="_blank" rel="noopener noreferrer"
                  className="text-[var(--mc-accent)] hover:underline">Stripe Services Agreement</a>{" "}
                and{" "}
                <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer"
                  className="text-[var(--mc-accent)] hover:underline">Stripe Privacy Policy</a>.
              </P>
            </Section>

            {/* ── 6. Email Communications — Resend ────────────────────────────── */}
            <Section id="email" title="6. Email Communications — Resend">
              <P>
                MC Hair Salon & Spa uses <strong className="text-white">Resend</strong> (resend.com) as our email
                delivery platform. By providing your email address, you consent to receive the following types of messages:
              </P>
              <Ul items={[
                <><strong className="text-white">Transactional emails:</strong> Booking confirmations, appointment reminders, cancellation notices, gift card delivery, and package purchase receipts. These are sent as a necessary part of fulfilling your booking and cannot be opted out of while you have an active appointment.</>,
                <><strong className="text-white">Marketing emails:</strong> Seasonal promotions, new service announcements, and newsletter content. You may opt out at any time by clicking the unsubscribe link in any marketing email or by contacting us directly.</>,
              ]} />
              <P>
                We do not sell or share your email address with third parties for their own marketing purposes.
                Resend may retain email logs for deliverability and debugging purposes in accordance with their data
                retention policy. For details, see the{" "}
                <a href="https://resend.com/privacy" target="_blank" rel="noopener noreferrer"
                  className="text-[var(--mc-accent)] hover:underline">Resend Privacy Policy</a>.
              </P>
              <P>
                All marketing emails sent from{" "}
                <span className="text-white font-mono text-xs">@mchairsalon.com</span> comply with the
                CAN-SPAM Act and include a valid physical address and clear unsubscribe mechanism.
              </P>
            </Section>

            {/* ── 7. SMS Communications — Twilio ──────────────────────────────── */}
            <Section id="sms" title="7. SMS Communications — Twilio">
              <P>
                MC Hair Salon & Spa uses <strong className="text-white">Twilio, Inc.</strong> ("<strong className="text-white">Twilio</strong>")
                to send SMS (text message) communications, including appointment reminders and confirmations.
              </P>
              <Highlight>
                <strong>By providing your mobile phone number, you expressly consent to receive text messages from
                MC Hair Salon & Spa via Twilio.</strong> Message and data rates may apply.
              </Highlight>
              <Ul items={[
                <><strong className="text-white">Message types:</strong> Appointment confirmations, 24-hour reminders, and cancellation alerts.</>,
                <><strong className="text-white">Frequency:</strong> Typically 1–2 messages per scheduled appointment.</>,
                <><strong className="text-white">Opt-out:</strong> Reply <span className="text-white font-mono">STOP</span> to any text message at any time to unsubscribe from SMS communications. You will receive one final confirmation message that you have been removed.</>,
                <><strong className="text-white">Help:</strong> Reply <span className="text-white font-mono">HELP</span> to any message for assistance, or contact us at {SALON_PHONE}.</>,
                <>SMS consent is never required as a condition of purchasing any service or product from MC Hair Salon & Spa.</>,
              ]} />
              <P>
                Twilio&apos;s handling of your data is governed by the{" "}
                <a href="https://www.twilio.com/en-us/legal/privacy" target="_blank" rel="noopener noreferrer"
                  className="text-[var(--mc-accent)] hover:underline">Twilio Privacy Policy</a>.
                Your phone number is used solely for the purpose of appointment communications and is never sold or shared
                for third-party marketing.
              </P>
            </Section>

            {/* ── 8. Gift Cards ───────────────────────────────────────────────── */}
            <Section id="gift-cards" title="8. Gift Cards">
              <Ul items={[
                <>Gift cards are available in denominations of $25, $50, $100, and $200 USD.</>,
                <>Gift cards may be redeemed for any service offered at MC Hair Salon & Spa.</>,
                <>Gift cards are <strong className="text-white">non-refundable</strong> and have <strong className="text-white">no expiration date</strong> under New York State law.</>,
                <>Lost or stolen gift cards cannot be replaced without proof of purchase.</>,
                <>Gift cards cannot be redeemed for cash and cannot be combined with certain promotional offers.</>,
                <>Gift card purchases are processed via Stripe and are subject to Section 5 of these Terms.</>,
              ]} />
            </Section>

            {/* ── 9. Service Packages ─────────────────────────────────────────── */}
            <Section id="packages" title="9. Service Packages">
              <Ul items={[
                <>Service packages are valid for the number of sessions specified at the time of purchase.</>,
                <>Package sessions expire according to the validity period displayed at purchase (typically 6 or 12 months from date of purchase). Unused sessions forfeit upon expiration with no refund.</>,
                <>Packages are <strong className="text-white">transferable</strong> — you may gift or share unused sessions with any guest. Notify the front desk at the time of the appointment.</>,
                <>Packages are <strong className="text-white">non-refundable</strong> once purchased, except where required by New York State law.</>,
                <>Individual package sessions are subject to the cancellation policy in Section 4. A no-show or late cancellation consumes one session from your package without a refund of that session.</>,
                <>Packages cannot be applied retroactively to services already rendered.</>,
              ]} />
            </Section>

            {/* ── 10. Privacy & Data ──────────────────────────────────────────── */}
            <Section id="privacy" title="10. Privacy & Data Collection">
              <P>
                We collect the following categories of personal data when you interact with our website or services:
              </P>
              <Ul items={[
                <><strong className="text-white">Identity data:</strong> Name, as provided during booking or account creation.</>,
                <><strong className="text-white">Contact data:</strong> Email address and mobile phone number.</>,
                <><strong className="text-white">Payment data:</strong> Payment method details (tokenized and managed by Stripe — we do not see or store raw card numbers).</>,
                <><strong className="text-white">Appointment data:</strong> Service selected, stylist preference, date, time, and any notes you provide.</>,
                <><strong className="text-white">Communication preferences:</strong> Your opt-in or opt-out status for email and SMS marketing.</>,
                <><strong className="text-white">Usage data:</strong> Standard web server logs and analytics (IP address, browser type, pages visited).</>,
              ]} />
              <P>
                We use this data exclusively to operate the salon, fulfil bookings, process payments, communicate with you
                about your appointments, and improve our services. We do not sell personal data to any third party.
              </P>
              <P>
                You may request access to, correction of, or deletion of your personal data by contacting us at{" "}
                <a href={`mailto:${SALON_EMAIL}`} className="text-[var(--mc-accent)] hover:underline">{SALON_EMAIL}</a>.
                Note that deletion of payment data may require that you contact Stripe directly.
              </P>
            </Section>

            {/* ── 11. Third-Party Service Providers ───────────────────────────── */}
            <Section id="third-party" title="11. Third-Party Service Providers">
              <P>
                MC Hair Salon & Spa uses the following third-party platforms to deliver our services. Each provider is
                bound by its own privacy policy and terms. We encourage you to review them:
              </P>
              <div className="space-y-3 my-5">
                <ThirdPartyBadge
                  name="Stripe, Inc."
                  url="https://stripe.com/privacy"
                  description="Payment processing, card-on-file storage, no-show fee collection, gift card and package purchases. Stripe is PCI DSS Level 1 certified."
                />
                <ThirdPartyBadge
                  name="Resend"
                  url="https://resend.com/privacy"
                  description="Transactional and marketing email delivery. Used for booking confirmations, appointment reminders, gift card delivery, and newsletter communications."
                />
                <ThirdPartyBadge
                  name="Twilio, Inc."
                  url="https://www.twilio.com/en-us/legal/privacy"
                  description="SMS appointment reminders and confirmation messages. Used to send text notifications to your mobile number when you opt in."
                />
              </div>
              <P>
                We have entered into data processing agreements with each provider as required under applicable law.
                These providers act as data processors on our behalf and are contractually prohibited from using your
                data for their own purposes beyond what is necessary to provide their services to us.
              </P>
            </Section>

            {/* ── 12. Conduct & Right to Refuse ───────────────────────────────── */}
            <Section id="conduct" title="12. Conduct & Right to Refuse Service">
              <P>
                MC Hair Salon & Spa is committed to providing a safe, respectful, and inclusive environment for all clients
                and staff. We reserve the right to refuse service to any individual who:
              </P>
              <Ul items={[
                <>Behaves in an abusive, threatening, or harassing manner toward staff or other clients;</>,
                <>Arrives in a condition (including under the influence of substances) that poses a risk to the safety of others;</>,
                <>Has an open wound, active skin condition, or medical contraindication that prevents the safe delivery of a service;</>,
                <>Has a history of chronic no-shows or unpaid cancellation fees;</>,
                <>Violates any posted salon policy.</>,
              ]} />
              <P>
                In the event that service is refused for safety or conduct reasons, any prepaid amounts will be refunded
                at our discretion. Refusal of service due to a repeated pattern of no-shows will not result in a refund
                of unused package sessions.
              </P>
            </Section>

            {/* ── 13. Limitation of Liability ─────────────────────────────────── */}
            <Section id="liability" title="13. Limitation of Liability">
              <P>
                To the maximum extent permitted by applicable law, MC Hair Salon & Spa, its owners, employees, and
                contractors shall not be liable for any indirect, incidental, special, consequential, or punitive
                damages arising out of or related to your use of our services or website.
              </P>
              <P>
                Our total aggregate liability to you for any claim arising out of or related to these Terms or our
                services shall not exceed the amount you paid to us in the 30 days immediately preceding the event giving
                rise to the claim.
              </P>
              <P>
                We are not responsible for any adverse reactions to products or services where you failed to disclose
                known allergies, sensitivities, or medical conditions. It is your responsibility to inform your stylist of
                any such conditions prior to service.
              </P>
              <P>
                Our website and online booking system are provided on an &ldquo;as-is&rdquo; and &ldquo;as-available&rdquo;
                basis. We do not warrant uninterrupted availability and are not liable for any loss resulting from system
                downtime or technical errors.
              </P>
            </Section>

            {/* ── 14. Indemnification ─────────────────────────────────────────── */}
            <Section id="indemnification" title="14. Indemnification">
              <P>
                You agree to indemnify, defend, and hold harmless MC Hair Salon & Spa and its officers, directors,
                employees, and agents from and against any and all claims, damages, losses, costs, and expenses
                (including reasonable attorneys&apos; fees) arising from:
              </P>
              <Ul items={[
                <>Your use of or access to our website or services;</>,
                <>Your violation of these Terms;</>,
                <>Your violation of any applicable law or third-party right;</>,
                <>Any inaccurate or incomplete information you provided to us.</>,
              ]} />
            </Section>

            {/* ── 15. Changes to These Terms ──────────────────────────────────── */}
            <Section id="changes" title="15. Changes to These Terms">
              <P>
                We reserve the right to update or modify these Terms at any time. When we make material changes, we will
                update the &ldquo;Effective Date&rdquo; at the top of this page and, where appropriate, notify you by email
                or SMS.
              </P>
              <P>
                Your continued use of our website or services after any changes constitutes your acceptance of the revised
                Terms. If you disagree with the updated Terms, you may discontinue use of our services.
              </P>
              <P>
                We encourage you to review this page periodically. The most current version is always available at{" "}
                <Link href="/terms" className="text-[var(--mc-accent)] hover:underline">{SITE_URL}/terms</Link>.
              </P>
            </Section>

            {/* ── 16. Governing Law ───────────────────────────────────────────── */}
            <Section id="governing-law" title="16. Governing Law">
              <P>
                These Terms shall be governed by and construed in accordance with the laws of the
                <strong className="text-white"> State of New York</strong>, without regard to its conflict of law provisions.
              </P>
              <P>
                Any dispute, claim, or controversy arising out of or relating to these Terms or the breach thereof shall
                be subject to the exclusive jurisdiction of the state and federal courts located in
                <strong className="text-white"> New York County, New York</strong>.
              </P>
              <P>
                You waive any objection to the laying of venue in such courts and irrevocably submit to personal
                jurisdiction in those courts for the resolution of any such dispute.
              </P>
            </Section>

            {/* ── 17. Contact Us ───────────────────────────────────────────────── */}
            <Section id="contact" title="17. Contact Us">
              <P>
                If you have questions about these Terms, our privacy practices, or any of our third-party integrations,
                please contact us:
              </P>
              <div className="border border-[#1a1a1a] bg-[#080808] p-6 space-y-3 text-sm">
                <div>
                  <p className="text-[#444] text-xs uppercase tracking-widest mb-1">Business Name</p>
                  <p className="text-white">{SALON_NAME}</p>
                </div>
                <div>
                  <p className="text-[#444] text-xs uppercase tracking-widest mb-1">Address</p>
                  <p className="text-white">{SALON_ADDRESS}</p>
                </div>
                <div>
                  <p className="text-[#444] text-xs uppercase tracking-widest mb-1">Phone</p>
                  <a href={`tel:${SALON_PHONE}`} className="text-[var(--mc-accent)] hover:underline">{SALON_PHONE}</a>
                </div>
                <div>
                  <p className="text-[#444] text-xs uppercase tracking-widest mb-1">Email</p>
                  <a href={`mailto:${SALON_EMAIL}`} className="text-[var(--mc-accent)] hover:underline">{SALON_EMAIL}</a>
                </div>
              </div>
              <P>
                We aim to respond to all inquiries within 2 business days.
              </P>
            </Section>

            {/* Bottom acknowledgment */}
            <div className="border-t border-[#1a1a1a] pt-10 mt-6">
              <p className="text-[#333] text-xs text-center leading-relaxed">
                By booking an appointment or using our services, you acknowledge that you have read and agree to these Terms.<br />
                Last updated: {EFFECTIVE_DATE} &nbsp;·&nbsp; MC Hair Salon & Spa &nbsp;·&nbsp; {SALON_ADDRESS}
              </p>
            </div>

          </main>
        </div>
      </div>
    </>
  );
}
