import nodemailer from "nodemailer";
import type { Booking } from "./bookings";

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  });
}

const FROM = `"MC Hair Salon & Spa" <${process.env.SMTP_USER || "noreply@mchairsalon.com"}>`;

const baseStyle = `
  font-family: 'Georgia', serif;
  background: #000;
  color: #f5f0e8;
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 32px;
`;

const goldLine = `<div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,#C9A84C,transparent);margin:24px auto;"></div>`;

export async function sendBookingConfirmation(booking: Booking): Promise<void> {
  const html = `
    <div style="${baseStyle}">
      <div style="text-align:center;margin-bottom:32px;">
        <h1 style="font-size:28px;color:#C9A84C;margin:0;letter-spacing:2px;">MC Hair Salon & Spa</h1>
        <p style="color:#666;font-size:12px;letter-spacing:4px;text-transform:uppercase;margin:8px 0 0;">Upper East Side · New York</p>
        ${goldLine}
      </div>
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
      <p style="color:#555;font-size:13px;text-align:center;">Need to reschedule? Call us at <a href="tel:2129885252" style="color:#C9A84C;">(212) 988-5252</a></p>
      <p style="color:#555;font-size:13px;text-align:center;">336 East 78th St, New York, NY 10075</p>
      ${goldLine}
      <p style="color:#333;font-size:11px;text-align:center;">© ${new Date().getFullYear()} MC Hair Salon & Spa. All rights reserved.</p>
    </div>
  `;
  await getTransporter().sendMail({
    from: FROM, to: booking.email,
    subject: `✓ Appointment Confirmed — ${booking.date} at ${booking.time}`,
    html,
  });
}

export async function sendNewsletterEmail(
  to: string[],
  subject: string,
  body: string
): Promise<{ sent: number; failed: number }> {
  const transporter = getTransporter();
  let sent = 0;
  let failed = 0;
  const html = `
    <div style="${baseStyle}">
      <div style="text-align:center;margin-bottom:32px;">
        <h1 style="font-size:28px;color:#C9A84C;margin:0;letter-spacing:2px;">MC Hair Salon & Spa</h1>
        <p style="color:#666;font-size:12px;letter-spacing:4px;text-transform:uppercase;margin:8px 0 0;">Upper East Side · New York</p>
        ${goldLine}
      </div>
      <div style="color:#f5f0e8;font-size:15px;line-height:1.8;">
        ${body.replace(/\n/g, "<br/>")}
      </div>
      ${goldLine}
      <p style="color:#555;font-size:11px;text-align:center;">
        MC Hair Salon & Spa · 336 East 78th St, New York, NY 10075<br/>
        <a href="tel:2129885252" style="color:#C9A84C;">(212) 988-5252</a>
      </p>
    </div>
  `;
  for (const email of to) {
    try {
      await transporter.sendMail({ from: FROM, to: email, subject, html });
      sent++;
    } catch {
      failed++;
    }
  }
  return { sent, failed };
}

export async function sendContactReply(to: string, name: string, message: string): Promise<void> {
  const html = `
    <div style="${baseStyle}">
      <div style="text-align:center;margin-bottom:32px;">
        <h1 style="font-size:28px;color:#C9A84C;margin:0;letter-spacing:2px;">MC Hair Salon & Spa</h1>
        ${goldLine}
      </div>
      <h2 style="color:#fff;font-size:20px;">Thank you, ${name}!</h2>
      <p style="color:#a89070;line-height:1.8;">We received your message and will get back to you within 24 hours.</p>
      <div style="background:#0f0f0f;border:1px solid #2a2a2a;padding:20px;margin:24px 0;border-left:3px solid #C9A84C;">
        <p style="color:#666;font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">Your message:</p>
        <p style="color:#a89070;margin:0;">${message}</p>
      </div>
      <p style="color:#555;font-size:13px;">Call us: <a href="tel:2129885252" style="color:#C9A84C;">(212) 988-5252</a></p>
    </div>
  `;
  await getTransporter().sendMail({
    from: FROM, to,
    subject: "We received your message — MC Hair Salon & Spa",
    html,
  });
}
