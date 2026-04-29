import "server-only";
import { Resend } from "resend";
import type { Booking } from "./bookings";
import type { GiftCard } from "./gift-cards";
import type { ContactMessage } from "./messages";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Lazy singleton — throws only at send time, not at import/build time
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not set. Add it to your .env file.");
  }
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

// Set RESEND_FROM_EMAIL to your verified domain address once you verify in Resend dashboard.
// Until then, use onboarding@resend.dev for testing (Resend's default test sender).
const FROM = process.env.RESEND_FROM_EMAIL || "MC Hair Salon <hello@mchairsalon.com>";

// Salon-bound notifications (new contact, new booking, new gift card) are routed here.
// Override with SALON_INBOX_EMAIL env var if the owner wants a different address.
const SALON_INBOX = process.env.SALON_INBOX_EMAIL || "hello@mchairsalon.com";

// ── Shared HTML snippets ───────────────────────────────────────────────────────
const baseStyle = `font-family:'Georgia',serif;background:#000;color:#f5f0e8;max-width:600px;margin:0 auto;padding:40px 32px;`;
const goldLine  = `<div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,#C9A84C,transparent);margin:24px auto;"></div>`;
const header    = `
  <div style="text-align:center;margin-bottom:32px;">
    <h1 style="font-size:28px;color:#C9A84C;margin:0;letter-spacing:2px;">MC Hair Salon & Spa</h1>
    <p style="color:#666;font-size:12px;letter-spacing:4px;text-transform:uppercase;margin:8px 0 0;">Upper East Side &middot; New York</p>
    ${goldLine}
  </div>`;
const footer = (year = new Date().getFullYear()) => `
  <p style="color:#555;font-size:12px;text-align:center;">336 East 78th St, New York, NY 10075 &middot; <a href="tel:2129885252" style="color:#C9A84C;">(212) 988-5252</a></p>
  ${goldLine}
  <p style="color:#333;font-size:11px;text-align:center;">&copy; ${year} MC Hair Salon &amp; Spa. All rights reserved.</p>`;

// ── Booking Confirmation ───────────────────────────────────────────────────────
export async function sendBookingConfirmation(booking: Booking): Promise<void> {
  const html = `
    <div style="${baseStyle}">
      ${header}
      <h2 style="font-size:22px;color:#fff;text-align:center;margin-bottom:8px;">Booking Confirmed</h2>
      <p style="color:#a89070;text-align:center;margin-bottom:32px;">Your appointment has been confirmed. We look forward to seeing you!</p>
      <div style="background:#0f0f0f;border:1px solid #2a2a2a;padding:24px;margin-bottom:24px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="color:#666;font-size:12px;letter-spacing:2px;text-transform:uppercase;padding:8px 0;border-bottom:1px solid #1a1a1a;">Client</td><td style="color:#fff;text-align:right;padding:8px 0;border-bottom:1px solid #1a1a1a;">${booking.name}</td></tr>
          <tr><td style="color:#666;font-size:12px;letter-spacing:2px;text-transform:uppercase;padding:8px 0;border-bottom:1px solid #1a1a1a;">Service</td><td style="color:#fff;text-align:right;padding:8px 0;border-bottom:1px solid #1a1a1a;">${booking.service}</td></tr>
          <tr><td style="color:#666;font-size:12px;letter-spacing:2px;text-transform:uppercase;padding:8px 0;border-bottom:1px solid #1a1a1a;">Stylist</td><td style="color:#fff;text-align:right;padding:8px 0;border-bottom:1px solid #1a1a1a;">${booking.stylist || "No preference"}</td></tr>
          <tr><td style="color:#666;font-size:12px;letter-spacing:2px;text-transform:uppercase;padding:8px 0;border-bottom:1px solid #1a1a1a;">Date</td><td style="color:#C9A84C;text-align:right;padding:8px 0;border-bottom:1px solid #1a1a1a;font-weight:bold;">${booking.date}</td></tr>
          <tr><td style="color:#666;font-size:12px;letter-spacing:2px;text-transform:uppercase;padding:8px 0;">Time</td><td style="color:#C9A84C;text-align:right;padding:8px 0;font-weight:bold;">${booking.time}</td></tr>
        </table>
      </div>
      <p style="color:#555;font-size:13px;text-align:center;">Need to reschedule? Call <a href="tel:2129885252" style="color:#C9A84C;">(212) 988-5252</a></p>
      ${footer()}
    </div>`;

  await getResend().emails.send({
    from:    FROM,
    to:      booking.email,
    subject: `Appointment Confirmed — ${booking.date} at ${booking.time}`,
    html,
  });
}

// ── Newsletter Blast ───────────────────────────────────────────────────────────
export async function sendNewsletterEmail(
  to: string[],
  subject: string,
  body: string,
): Promise<{ sent: number; failed: number }> {
  if (to.length === 0) return { sent: 0, failed: 0 };

  const html = `
    <div style="${baseStyle}">
      ${header}
      <div style="color:#f5f0e8;font-size:15px;line-height:1.8;">
        ${escapeHtml(body).replace(/\n/g, "<br/>")}
      </div>
      ${footer()}
    </div>`;

  const resend = getResend();
  let sent = 0;
  let failed = 0;

  // Resend batch API supports up to 100 emails per call
  const CHUNK = 100;
  for (let i = 0; i < to.length; i += CHUNK) {
    const chunk = to.slice(i, i + CHUNK);
    const batch = chunk.map(email => ({ from: FROM, to: email, subject, html }));
    try {
      const result = await resend.batch.send(batch);
      const data = Array.isArray(result.data) ? result.data : [];
      for (const r of data) {
        if ((r as { id?: string }).id) sent++; else failed++;
      }
    } catch {
      failed += chunk.length;
    }
  }

  return { sent, failed };
}

// ── Gift Card Email ────────────────────────────────────────────────────────────
export async function sendGiftCardEmail(card: GiftCard): Promise<void> {
  const toEmail = card.recipientEmail;
  if (!toEmail?.includes("@")) return;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const html = `
    <div style="${baseStyle}">
      ${header}
      <p style="color:#a89070;font-size:16px;text-align:center;margin:-16px 0 24px;">You&apos;ve received a gift card! &#10024;</p>

      <!-- Gift Card Visual -->
      <div style="background:linear-gradient(135deg,#0a0a0a 0%,#1a1200 50%,#0a0a0a 100%);border:1px solid #C9A84C;border-radius:12px;padding:32px 28px;margin:0 auto 32px;max-width:420px;text-align:center;">
        <p style="color:#C9A84C;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:0 0 16px;">Gift Card</p>
        <p style="font-size:52px;color:#FFD700;margin:0;font-weight:bold;">$${card.amount}</p>
        <div style="width:40px;height:1px;background:#C9A84C;margin:16px auto;"></div>
        <p style="color:#f5f0e8;font-size:16px;margin:0 0 4px;">To: <strong>${card.recipientName}</strong></p>
        <p style="color:#a89070;font-size:13px;margin:0 0 16px;">From: ${card.senderName}</p>
        ${card.message ? `<p style="color:#888;font-size:13px;font-style:italic;margin:0 0 20px;">&ldquo;${card.message}&rdquo;</p>` : ""}
        <div style="background:#111;border:1px solid #333;border-radius:6px;padding:12px 20px;display:inline-block;">
          <p style="color:#555;font-size:10px;letter-spacing:3px;text-transform:uppercase;margin:0 0 4px;">Redemption Code</p>
          <p style="color:#C9A84C;font-size:18px;font-family:monospace;letter-spacing:3px;margin:0;font-weight:bold;">${card.code}</p>
        </div>
      </div>

      <div style="background:#0f0f0f;border:1px solid #2a2a2a;padding:24px;margin-bottom:24px;">
        <h3 style="color:#C9A84C;font-size:13px;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px;">How to Redeem</h3>
        <ol style="color:#a89070;font-size:14px;line-height:2;margin:0;padding-left:20px;">
          <li>Book at <a href="${siteUrl}/book" style="color:#C9A84C;">our website</a> or call <a href="tel:2129885252" style="color:#C9A84C;">(212) 988-5252</a></li>
          <li>Present this code at the salon &mdash; in person or by phone</li>
          <li>Enjoy your luxury experience &#10024;</li>
        </ol>
      </div>

      <p style="color:#555;font-size:12px;text-align:center;">Gift cards are valid until expiry and can be used for any service.</p>
      ${footer()}
    </div>`;

  await getResend().emails.send({
    from:    FROM,
    to:      toEmail,
    subject: `You've received a $${card.amount} MC Hair Salon Gift Card from ${card.senderName}!`,
    html,
  });
}

// ── Contact Auto-Reply ─────────────────────────────────────────────────────────
export async function sendContactReply(to: string, name: string, message: string): Promise<void> {
  const html = `
    <div style="${baseStyle}">
      ${header}
      <h2 style="color:#fff;font-size:20px;">Thank you, ${name}!</h2>
      <p style="color:#a89070;line-height:1.8;">We received your message and will get back to you within 24 hours.</p>
      <div style="background:#0f0f0f;border:1px solid #2a2a2a;padding:20px;margin:24px 0;border-left:3px solid #C9A84C;">
        <p style="color:#666;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Your message:</p>
        <p style="color:#a89070;margin:0;">${escapeHtml(message)}</p>
      </div>
      <p style="color:#555;font-size:13px;">Call us: <a href="tel:2129885252" style="color:#C9A84C;">(212) 988-5252</a></p>
      ${footer()}
    </div>`;

  await getResend().emails.send({
    from:    FROM,
    to,
    subject: "We received your message — MC Hair Salon & Spa",
    html,
  });
}

// ── Salon-Bound Notifications (to hello@mchairsalon.com) ───────────────────────
//
// These emails alert the salon owner the moment a client takes action on the
// site. They are sent to SALON_INBOX (default hello@mchairsalon.com) and the
// reply-to is set to the client's email so the owner can hit "Reply" and write
// back to the client directly from their inbox.

const notifyHeader = (badge: string) => `
  <div style="text-align:center;margin-bottom:24px;">
    <p style="display:inline-block;background:#C9A84C;color:#000;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:bold;padding:6px 14px;border-radius:2px;margin:0 0 16px;">${badge}</p>
    <h1 style="font-size:24px;color:#C9A84C;margin:0;letter-spacing:2px;">MC Hair Salon & Spa</h1>
    ${goldLine}
  </div>`;

const notifyFooter = `
  ${goldLine}
  <p style="color:#666;font-size:11px;text-align:center;margin:0;">
    This is an automated notification from your website. Reply to this email to respond directly to the client.
  </p>`;

function detailsTable(rows: Array<[string, string]>): string {
  return `
    <div style="background:#0f0f0f;border:1px solid #2a2a2a;padding:24px;margin-bottom:24px;">
      <table style="width:100%;border-collapse:collapse;">
        ${rows.map(([label, value], i) => `
          <tr>
            <td style="color:#666;font-size:12px;letter-spacing:2px;text-transform:uppercase;padding:10px 0;${i < rows.length - 1 ? 'border-bottom:1px solid #1a1a1a;' : ''}vertical-align:top;width:40%;">${escapeHtml(label)}</td>
            <td style="color:#f5f0e8;text-align:right;padding:10px 0;${i < rows.length - 1 ? 'border-bottom:1px solid #1a1a1a;' : ''}word-break:break-word;">${value}</td>
          </tr>`).join("")}
      </table>
    </div>`;
}

// New contact form submission → salon inbox
export async function sendNewContactNotification(msg: ContactMessage): Promise<void> {
  const html = `
    <div style="${baseStyle}">
      ${notifyHeader("New Contact Message")}
      <h2 style="font-size:20px;color:#fff;text-align:center;margin:0 0 24px;">A client just sent you a message</h2>
      ${detailsTable([
        ["From",  escapeHtml(msg.name)],
        ["Email", `<a href="mailto:${escapeHtml(msg.email)}" style="color:#C9A84C;">${escapeHtml(msg.email)}</a>`],
        ["Received", new Date(msg.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })],
      ])}
      <div style="background:#0f0f0f;border:1px solid #2a2a2a;border-left:3px solid #C9A84C;padding:20px;margin-bottom:24px;">
        <p style="color:#666;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 10px;">Message</p>
        <p style="color:#f5f0e8;margin:0;line-height:1.7;white-space:pre-wrap;">${escapeHtml(msg.message)}</p>
      </div>
      ${notifyFooter}
    </div>`;

  await getResend().emails.send({
    from:    FROM,
    to:      SALON_INBOX,
    replyTo: msg.email,
    subject: `New contact message from ${msg.name}`,
    html,
  });
}

// New booking → salon inbox
export async function sendNewBookingNotification(booking: Booking): Promise<void> {
  const rows: Array<[string, string]> = [
    ["Client",  escapeHtml(booking.name)],
    ["Phone",   `<a href="tel:${escapeHtml(booking.phone)}" style="color:#C9A84C;">${escapeHtml(booking.phone)}</a>`],
    ["Email",   `<a href="mailto:${escapeHtml(booking.email)}" style="color:#C9A84C;">${escapeHtml(booking.email)}</a>`],
    ["Service", escapeHtml(booking.service)],
    ["Stylist", escapeHtml(booking.stylist || "No preference")],
    ["Date",    `<span style="color:#C9A84C;font-weight:bold;">${escapeHtml(booking.date)}</span>`],
    ["Time",    `<span style="color:#C9A84C;font-weight:bold;">${escapeHtml(booking.time)}</span>`],
  ];
  if (booking.cardBrand && booking.cardLast4) {
    rows.push(["Card on file", `${escapeHtml(booking.cardBrand)} •••• ${escapeHtml(booking.cardLast4)}`]);
  }

  const notesBlock = booking.notes && booking.notes.trim().length > 0 ? `
    <div style="background:#0f0f0f;border:1px solid #2a2a2a;border-left:3px solid #C9A84C;padding:20px;margin-bottom:24px;">
      <p style="color:#666;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 10px;">Client Notes</p>
      <p style="color:#f5f0e8;margin:0;line-height:1.7;white-space:pre-wrap;">${escapeHtml(booking.notes)}</p>
    </div>` : "";

  const html = `
    <div style="${baseStyle}">
      ${notifyHeader("New Booking")}
      <h2 style="font-size:20px;color:#fff;text-align:center;margin:0 0 24px;">A new appointment was just booked</h2>
      ${detailsTable(rows)}
      ${notesBlock}
      ${notifyFooter}
    </div>`;

  await getResend().emails.send({
    from:    FROM,
    to:      SALON_INBOX,
    replyTo: booking.email,
    subject: `New booking — ${booking.name} • ${booking.service} • ${booking.date} ${booking.time}`,
    html,
  });
}

// New gift card purchase → salon inbox
export async function sendNewGiftCardNotification(card: GiftCard): Promise<void> {
  const rows: Array<[string, string]> = [
    ["Amount",       `<span style="color:#C9A84C;font-weight:bold;">$${card.amount}</span>`],
    ["Code",         `<span style="font-family:monospace;color:#C9A84C;">${escapeHtml(card.code)}</span>`],
    ["Purchased by", escapeHtml(card.senderName)],
  ];
  if (card.senderEmail) {
    rows.push(["Buyer email", `<a href="mailto:${escapeHtml(card.senderEmail)}" style="color:#C9A84C;">${escapeHtml(card.senderEmail)}</a>`]);
  }
  rows.push(["Recipient", escapeHtml(card.recipientName)]);
  if (card.recipientEmail) {
    rows.push(["Recipient email", `<a href="mailto:${escapeHtml(card.recipientEmail)}" style="color:#C9A84C;">${escapeHtml(card.recipientEmail)}</a>`]);
  }
  if (card.recipientPhone) {
    rows.push(["Recipient phone", `<a href="tel:${escapeHtml(card.recipientPhone)}" style="color:#C9A84C;">${escapeHtml(card.recipientPhone)}</a>`]);
  }
  rows.push(["Delivery",  escapeHtml(card.deliveryMethod)]);
  rows.push(["Purchased", new Date(card.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })]);

  const messageBlock = card.message && card.message.trim().length > 0 ? `
    <div style="background:#0f0f0f;border:1px solid #2a2a2a;border-left:3px solid #C9A84C;padding:20px;margin-bottom:24px;">
      <p style="color:#666;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 10px;">Personal Message</p>
      <p style="color:#f5f0e8;margin:0;line-height:1.7;font-style:italic;white-space:pre-wrap;">${escapeHtml(card.message)}</p>
    </div>` : "";

  const html = `
    <div style="${baseStyle}">
      ${notifyHeader("New Gift Card Sale")}
      <h2 style="font-size:20px;color:#fff;text-align:center;margin:0 0 24px;">A $${card.amount} gift card was just purchased</h2>
      ${detailsTable(rows)}
      ${messageBlock}
      ${notifyFooter}
    </div>`;

  // Reply-To is the buyer (the customer who paid), falling back to the recipient
  // if no buyer email was captured. Empty strings are omitted — Resend rejects them.
  const replyTo = card.senderEmail || card.recipientEmail;

  await getResend().emails.send({
    from:    FROM,
    to:      SALON_INBOX,
    ...(replyTo ? { replyTo } : {}),
    subject: `New gift card sale — $${card.amount} from ${card.senderName} to ${card.recipientName}`,
    html,
  });
}
