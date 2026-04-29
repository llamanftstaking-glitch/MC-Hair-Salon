# MC Hair Salon & Spa

Luxury hair salon website for MC Hair Salon & Spa, Upper East Side, New York.

## Stack
- Next.js 16.2.4 (webpack)
- React 19
- Tailwind CSS v4
- TypeScript
- Stripe (payments — bookings card capture, gift cards, packages, no-show charges)
- Resend (transactional email)
- Flat-file JSON storage (`data/*.json` — auto-created on first run)

## Run
- Dev: `npm run dev` (configured for Replit on port 5000, host 0.0.0.0)
- Workflow: `Start application`

## Required Secrets
- `RESEND_API_KEY` — Resend API key for sending email
- `RESEND_FROM_EMAIL` — Verified sender address, e.g. `MC Hair Salon <hello@mchairsalon.com>`
- Stripe keys (when payments are used) — handled via env vars in `lib/stripe.ts`

## Email — Resend Domain Verification

**Status: VERIFIED on Resend, accepting sends from `hello@mchairsalon.com`** (confirmed 2026-04-29)

| Field | Value |
|---|---|
| Domain | `mchairsalon.com` |
| Resend domain ID | `6a079b26-6be6-4af7-a0bc-94ba50d860fb` |
| Status | `verified` |
| Region | `us-east-1` |
| Sending | `enabled` |
| Verified FROM address | `hello@mchairsalon.com` |

End-to-end verification evidence (raw API responses captured in `verification-evidence/resend-domain-verified.json`):
- `GET https://api.resend.com/domains` → `status: verified`, `capabilities.sending: enabled`
- Direct send from `hello@mchairsalon.com` → HTTP 200 with Resend message IDs accepted
- Production code path `POST /api/contact` → HTTP 201, fires `sendContactReply` via `lib/email.ts` using the verified sender

What this confirms (server-side):
- Resend has accepted the domain and DKIM/SPF/DMARC DNS records
- Resend accepts outbound sends from the verified address with a returned message ID
- The production email code path runs without errors

What still requires user-side confirmation:
- That a real client email (Gmail/Outlook/etc.) lands in the inbox, not spam — the user should send themselves a booking confirmation or contact form submission and verify placement, then optionally raise their Resend plan if needed.

## Important Files
- `lib/email.ts` — Resend integration (booking confirmations, contact replies, gift card delivery, newsletter blasts)
- `lib/staff-data.ts` — Replit-only staff data module (not on GitHub; do NOT overwrite during GitHub pulls)
- `lib/settings.ts` — Replit-only site settings module (defaults + JSON persistence)
- `lib/data.ts` — TEAM array, services, packages
- `lib/stripe.ts` — Stripe integration (env-keyed, lazy init)
- `middleware.ts` — Auth guard for admin and scan routes

## GitHub Sync Workflow
The site is pushed from GitHub repo `llamanftstaking-glitch/MC-Hair-Salon`.
On `push from github`, files are downloaded via `https://raw.githubusercontent.com/...` since direct git operations are blocked in this environment. Replit-only files (`lib/staff-data.ts`, `lib/settings.ts`, `replit.md`) are not on GitHub and must be preserved across pulls.

## Deployment
Published via Replit Deployments (autoscale).
