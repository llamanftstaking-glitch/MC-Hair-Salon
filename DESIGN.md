# MC Hair Salon & Spa — Design System

## Color Strategy: Committed

One saturated gold carries 30–60% of hero and accent surfaces. Black grounds everything. Strategy is "drenched in black, accented in gold" — not equal partners.

### Color Tokens

```css
/* Base */
--color-black:        oklch(10% 0.008 85);   /* near-black, gold-tinted */
--color-surface:      oklch(13% 0.006 85);   /* card/section backgrounds */
--color-surface-mid:  oklch(18% 0.007 85);   /* raised surfaces */
--color-border:       oklch(25% 0.008 85);   /* subtle dividers */

/* Gold scale */
--color-gold-deep:    oklch(55% 0.12 85);    /* #B8860B equivalent, OKLCH */
--color-gold:         oklch(72% 0.14 85);    /* mid gold */
--color-gold-light:   oklch(82% 0.13 85);    /* #FFD700 equivalent */
--color-gold-muted:   oklch(65% 0.08 85);    /* secondary text gold */

/* Text */
--color-text-primary: oklch(94% 0.005 85);   /* near-white body text */
--color-text-muted:   oklch(65% 0.006 85);   /* secondary text */
--color-text-gold:    oklch(72% 0.14 85);    /* gold text on dark */

/* Semantic */
--color-success:      oklch(65% 0.14 145);
--color-error:        oklch(55% 0.18 25);
--color-warning:      oklch(72% 0.14 85);    /* reuse gold */
```

## Typography

**Heading font:** Playfair Display (serif) — loaded via next/font  
**Body font:** Inter (sans-serif) — loaded via next/font

### Scale
```
h1: 3.5rem / 700 / Playfair Display
h2: 2.25rem / 700 / Playfair Display
h3: 1.5rem / 600 / Playfair Display
h4: 1.125rem / 600 / Inter
body: 1rem / 400 / Inter
small: 0.875rem / 400 / Inter
label: 0.75rem / 500 / Inter / tracking-widest uppercase
```

Line height: 1.6 body, 1.2 headings  
Max body line length: 65ch

## Spacing Rhythm
Multiples of 4px base. Named stops: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128

Section padding: `py-20 md:py-28`  
Container max-width: `max-w-6xl mx-auto px-4 md:px-8`

## Component Patterns

### Buttons
- **Primary:** Gold background, near-black text. `bg-[var(--color-gold)] text-[var(--color-black)]`
- **Secondary:** Transparent, gold border, gold text. Hover fills gold.
- **Ghost:** Text-only, gold color, underline on hover.
- No rounded-full pills except small badge/tag elements.
- Border radius: `rounded` (4px) for buttons, `rounded-lg` (8px) for cards.

### Cards
Used sparingly. Dark surface (`--color-surface`), 1px gold-tinted border, no drop shadows on dark backgrounds (invisible).

### Section dividers
Thin 1px lines using `--color-border`. Not decorative stripes.

### Form inputs
Dark background (`--color-surface-mid`), gold focus ring (`ring-[var(--color-gold)]`), near-white text.

## Motion Principles
- Ease-out-quart for entrances. Duration 200–350ms.
- No bounce, no elastic, no spring.
- Fade + translateY(8px) for section reveals.
- Hover: scale(1.02) on images, color transitions on buttons (150ms).

## Theme
**Dark.** Scene: A woman on the Upper East Side opens the salon site on her iPhone in the back of a taxi at 7pm. The gold and black renders beautifully against the dark ambient screen. Light mode would feel clinical and discount.

## Layout Rules
- Mobile-first. Stack everything single column below `md:`.
- Hero: full-viewport, centered, Playfair Display headline, gold accent word.
- Nav: sticky, transparent over hero, solid `--color-black` on scroll.
- Gallery: asymmetric grid, not identical cards.

## Absolute Bans (project-specific additions)
- No pink, blush, or rose tones.
- No gradient text (Impeccable global ban + reinforced here).
- No white backgrounds anywhere on public-facing pages.
- No identical card grids with icon + heading + text.
