#!/bin/bash
# Sync latest code from GitHub to Replit.
# Run from the project root in the Replit shell:
#   bash scripts/sync-from-github.sh
#
# Replit-only files are NEVER touched:
#   lib/staff-data.ts, lib/settings.ts, replit.md, data/*.json

REPO="llamanftstaking-glitch/MC-Hair-Salon"
BRANCH="main"
BASE="https://raw.githubusercontent.com/${REPO}/${BRANCH}"

REPLIT_ONLY=(
  "lib/staff-data.ts"
  "lib/settings.ts"
  "replit.md"
)

# Files to download from GitHub (everything tracked except Replit-only)
FILES=(
  "package.json"
  "tsconfig.json"
  "postcss.config.mjs"
  "eslint.config.mjs"
  "middleware.ts"
  "app/layout.tsx"
  "app/page.tsx"
  "app/globals.css"
  "app/manifest.ts"
  "app/robots.ts"
  "app/sitemap.ts"
  "app/admin/page.tsx"
  "app/api/admin/users/route.ts"
  "app/api/analytics/route.ts"
  "app/api/analytics/track/route.ts"
  "app/api/auth/google/route.ts"
  "app/api/auth/login/route.ts"
  "app/api/auth/logout/route.ts"
  "app/api/auth/me/route.ts"
  "app/api/auth/signup/route.ts"
  "app/api/auth/totp-setup/route.ts"
  "app/api/auth/verify-totp/route.ts"
  "app/api/bookings/route.ts"
  "app/api/contact/route.ts"
  "app/api/email/route.ts"
  "app/api/gift-card/route.ts"
  "app/api/newsletter/route.ts"
  "app/api/packages/route.ts"
  "app/api/rewards/route.ts"
  "app/api/scan/route.ts"
  "app/api/settings/route.ts"
  "app/api/staff/route.ts"
  "app/api/stripe/charge-noshow/route.ts"
  "app/api/stripe/checkout/route.ts"
  "app/api/stripe/setup-intent/route.ts"
  "app/api/stripe/webhook/route.ts"
  "app/api/upload/route.ts"
  "app/api/qr/[customerId]/route.ts"
  "app/book/page.tsx"
  "app/book/layout.tsx"
  "app/contact/page.tsx"
  "app/contact/layout.tsx"
  "app/gallery/page.tsx"
  "app/gallery/layout.tsx"
  "app/services/page.tsx"
  "app/services/layout.tsx"
  "app/team/page.tsx"
  "app/login/page.tsx"
  "app/signup/page.tsx"
  "app/account/page.tsx"
  "app/account/layout.tsx"
  "app/account/appointments/page.tsx"
  "app/account/packages/page.tsx"
  "app/account/rewards/page.tsx"
  "app/about/page.tsx"
  "app/blog/page.tsx"
  "app/gift-card/page.tsx"
  "app/makeup/page.tsx"
  "app/packages/page.tsx"
  "app/packages/layout.tsx"
  "app/rewards/page.tsx"
  "app/scan/page.tsx"
  "app/terms/page.tsx"
  "app/visit/page.tsx"
  "app/weddings/page.tsx"
  "components/AnalyticsTracker.tsx"
  "components/CurlyBot.tsx"
  "components/FadeIn.tsx"
  "components/FaqSection.tsx"
  "components/Footer.tsx"
  "components/GoogleSignInButton.tsx"
  "components/HeroLogo.tsx"
  "components/JsonLd.tsx"
  "components/MarqueeStrip.tsx"
  "components/MobileBookBar.tsx"
  "components/Navbar.tsx"
  "components/NewsletterStrip.tsx"
  "components/SectionDivider.tsx"
  "components/SplashScreen.tsx"
  "components/TestimonialsCarousel.tsx"
  "lib/admin-totp.ts"
  "lib/admins.ts"
  "lib/analytics.ts"
  "lib/auth.ts"
  "lib/bookings.ts"
  "lib/customers.ts"
  "lib/data.ts"
  "lib/email.ts"
  "lib/gift-cards.ts"
  "lib/messages.ts"
  "lib/newsletter.ts"
  "lib/rate-limit.ts"
  "lib/stripe.ts"
  "lib/theme.ts"
  "lib/totp.ts"
  "lib/webhook-events.ts"
  "scripts/seed-admin.js"
  "scripts/sync-from-github.sh"
)

echo "Syncing from GitHub: ${REPO}@${BRANCH}"
echo ""

SUCCESS=0
FAILED=0

for FILE in "${FILES[@]}"; do
  DIR=$(dirname "$FILE")
  mkdir -p "$DIR"
  URL="${BASE}/${FILE}"
  HTTP_CODE=$(curl -s -o "$FILE" -w "%{http_code}" "$URL")
  if [ "$HTTP_CODE" = "200" ]; then
    echo "  ✓ $FILE"
    SUCCESS=$((SUCCESS + 1))
  else
    echo "  ✗ $FILE (HTTP $HTTP_CODE)"
    FAILED=$((FAILED + 1))
  fi
done

echo ""
echo "Done: ${SUCCESS} updated, ${FAILED} failed."
echo ""
echo "Replit-only files preserved (not touched):"
for F in "${REPLIT_ONLY[@]}"; do
  echo "  • $F"
done
echo ""
echo "Next: redeploy the app to apply changes."
