# MC Hair Salon & Spa

Luxury hair salon website for MC Hair Salon & Spa, Upper East Side, New York.

## Stack
- Next.js 16.2.4 (webpack)
- React 19
- Tailwind CSS v4
- TypeScript
- Stripe (payments — bookings card capture, gift cards, packages, no-show charges)
- Resend (transactional email)
- PostgreSQL via Drizzle ORM (`lib/schema.ts`, `lib/db.ts`) — all data persisted across deploys
- Replit Object Storage for uploaded files (falls back to local disk in dev)

## Run
- Dev: `npm run dev` (configured for Replit on port 5000, host 0.0.0.0)
- Workflow: `Start application`

## Database Setup (PostgreSQL + Drizzle)
1. Add `DATABASE_URL` as a Replit secret (PostgreSQL connection string from Replit Postgres or Neon).
2. Run `npm run db:push` once to create all tables.
3. Run `node scripts/import-data.js` once to migrate any existing `data/*.json` files into Postgres.
4. On every `npm start`, the following run automatically:
   - `scripts/seed-admin.js` — ensures the admin customer + admins row exists
   - `scripts/create-staff-accounts.js` — ensures all 7 staff accounts exist (idempotent)

The schema is defined in `lib/schema.ts`. All lib modules are now async and DB-backed. Rate limiting, webhook idempotency, analytics, and settings all use Postgres.

## Required Secrets
- `DATABASE_URL` — PostgreSQL connection string (e.g. from Replit Postgres addon or Neon)
- `JWT_SECRET` — Required in production (throws at startup if missing). Use a long random string.
- `RESEND_API_KEY` — Resend API key for sending email
- `RESEND_FROM_EMAIL` — Verified sender address, e.g. `MC Hair Salon <hello@mchairsalon.com>`
- `SALON_INBOX_EMAIL` (optional) — Where new contact / booking / gift-card notifications are sent. Defaults to `hello@mchairsalon.com`.
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (optional) — Google OAuth Web Client ID. Enables the "Sign in with Google" button on `/login` and `/signup`. Without it the button is hidden and email/password still works.
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

## Salon-Bound Notification Emails

When a client takes action on the website, the salon owner receives a notification email at `SALON_INBOX_EMAIL` (default `hello@mchairsalon.com`):

| Trigger | Subject pattern | Reply-To |
|---|---|---|
| New contact form submission | `New contact message from <Name>` | client's email |
| New booking | `New booking — <Name> • <Service> • <Date> <Time>` | client's email |
| New gift card sale | `New gift card sale — $<Amount> from <Sender> to <Recipient>` | buyer's email (falls back to recipient if no buyer email captured) |

Wired in:
- `app/api/contact/route.ts` → `sendNewContactNotification`
- `app/api/bookings/route.ts` → `sendNewBookingNotification`
- `app/api/gift-card/route.ts` → `sendNewGiftCardNotification`

Notifications are fire-and-forget — failures are logged to the server console and do not break the public POST flow. Smoke-test evidence: `verification-evidence/salon-notifications-smoke-test.json`.

## Important Files
- `lib/email.ts` — Resend integration (booking confirmations, contact replies, gift card delivery, newsletter blasts)
- `lib/staff-data.ts` — Replit-only staff data module (not on GitHub; do NOT overwrite during GitHub pulls)
- `lib/settings.ts` — Replit-only site settings module (defaults + JSON persistence)
- `lib/data.ts` — TEAM array, services, packages
- `lib/stripe.ts` — Stripe integration (env-keyed, lazy init)
- `lib/customers.ts` — Customer JSON store. `passwordHash` is optional (Google-only accounts have none). `googleId` is set for Google-linked accounts.
- `middleware.ts` — Auth guard for admin and scan routes

## Authentication
Customer accounts support two sign-in methods, both issuing the same `mc-session` JWT cookie (30-day, HS256 via `jose`):
1. **Email + password** — `/api/auth/signup` and `/api/auth/login` (bcrypt).
2. **Google Sign-In** — `/api/auth/google` verifies the GIS ID token with `google-auth-library` (`OAuth2Client.verifyIdToken`) against `NEXT_PUBLIC_GOOGLE_CLIENT_ID`. On first sign-in it creates a passwordless customer with full default rewards state; on subsequent sign-ins it backfills `googleId` onto the matching email account. Email/password login on a Google-only account returns a friendly "use Google" message.

Front-end button is `components/GoogleSignInButton.tsx` (loads `https://accounts.google.com/gsi/client`, renders the official Google button, posts the credential, then `router.push("/account")`). Hidden when `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is not set.

**Google Cloud setup** (one-time, done in Google Cloud Console):
1. Create / select a project, configure the OAuth consent screen (External, app name "MC Hair Salon & Spa", support email).
2. Create an OAuth Client ID of type "Web application".
3. Authorized JavaScript origins: the current Replit dev URL (`https://<repl>.replit.dev`), the deployed `.replit.app` URL, and `https://mchairsalon.com`. No redirect URIs are required (Google Identity Services uses one-tap / popup, not a redirect flow).
4. Save the Client ID into the `NEXT_PUBLIC_GOOGLE_CLIENT_ID` secret.

**⚠️ Pre-launch Google OAuth checklist (must do before Wednesday):**
- [ ] Open [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
- [ ] Click the MC Hair Salon OAuth Web Client ID
- [ ] Under "Authorized JavaScript origins", verify these URLs are listed:
  - `https://<your-repl-name>.replit.app` (the live deployed URL)
  - `https://mchairsalon.com` (if custom domain is active)
- [ ] If either is missing, click "+ Add URI", paste it, and Save
- [ ] Confirm `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set as a Replit secret
- [ ] Test: open the live URL in an incognito window → /login → "Sign in with Google" — should open Google picker without "origin not allowed" error

## GitHub Sync Workflow
The site is pushed from GitHub repo `llamanftstaking-glitch/MC-Hair-Salon`.
On `push from github`, files are downloaded via `https://raw.githubusercontent.com/...` since direct git operations are blocked in this environment. Replit-only files (`lib/staff-data.ts`, `lib/settings.ts`, `replit.md`) are not on GitHub and must be preserved across pulls.

## Deployment
Published via Replit Deployments (autoscale).

---

## Wednesday Go-Live Checklist

### Pre-deploy (do in order)
- [ ] Set all required Replit secrets: `DATABASE_URL`, `JWT_SECRET`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- [ ] Run `npm run db:push` on Replit (adds `services` jsonb column to bookings table)
- [ ] Deploy the app — startup script auto-seeds admin + 7 staff accounts
- [ ] Confirm in Replit console that startup logs show "Staff accounts: all 7 already exist" (or "created N new accounts")
- [ ] Complete Google OAuth origin checklist above

### Smoke tests (run on the live .replit.app URL)

**1. Contact form**
- [ ] Go to /contact, submit a test message with your email
- [ ] Confirm client auto-reply arrives at your inbox
- [ ] Confirm salon notification arrives at hello@mchairsalon.com
- [ ] Log: timestamp, message text → `verification-evidence/smoke-test-launch.json`

**2. Booking with Stripe card capture**
- [ ] Create a test account at /login → select a service, stylist, date, time
- [ ] Complete card capture with Stripe test card `4242 4242 4242 4242`
- [ ] Confirm booking appears in admin panel as "pending"
- [ ] Confirm client receives "Request Received" email
- [ ] Confirm salon receives new booking notification
- [ ] Admin: change status to "confirmed" → confirm client receives "Confirmed" email
- [ ] Log: booking ID, timestamps → `verification-evidence/smoke-test-launch.json`

**3. Gift card purchase**
- [ ] Go to /gift-card, purchase with Stripe test card
- [ ] Confirm recipient receives gift card email with code
- [ ] Confirm salon receives new gift card notification
- [ ] Log: gift card code, timestamps → `verification-evidence/smoke-test-launch.json`

**4. Staff portal**
- [ ] Log in as maria@mchairsalon.com (password: MCStaff2026!)
- [ ] Go to /staff — confirm schedule and analytics load
- [ ] Log: ✓ or any errors

**5. Google Sign-In**
- [ ] Open live URL in incognito → /login → click "Sign in with Google"
- [ ] Confirm no "origin not allowed" error
- [ ] Complete Google sign-in, confirm redirects to /account
- [ ] Log: ✓ or error message

### Post-smoke-test
- [ ] Update `verification-evidence/smoke-test-launch.json` with results
- [ ] Announce live to client
