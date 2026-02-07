# Just a Mom Design System (Production)

Status: Active
Version: 1.0.0
Last updated: February 7, 2026

## 1. Product Intent

This system is built for:
- Trust-first Christian motherhood content.
- Long-form readability (notes, essays, devotionals).
- Clear conversion paths to newsletter and speaking inquiry.
- Warm editorial tone without lifestyle-blog vagueness.

## 2. Canonical Typeface Stack

Primary families:
- Heading serif: Literata
- Body sans: Plus Jakarta Sans

Implementation source:
- `/app/layout.tsx`
- Tokens: `/app/styles/theme.css`

Token contract:
- `--font-heading`
- `--font-body`

Compatibility aliases (for legacy styles during migration):
- `--font-newsreader`
- `--font-source-sans-3`

## 3. Core Tokens

### 3.1 Color Tokens

Text and surfaces:
- `--color-ink: #1a1715`
- `--color-ink-soft: #4e443f`
- `--color-ink-muted: #6f645c`
- `--color-ink-faint: #7a6e65`
- `--color-paper: #f8f4ed`
- `--color-paper-warm: #f2ece3`
- `--color-paper-soft: #ebe4d9`

Actions and semantic:
- `--color-accent: #2f6058`
- `--color-accent-hover: #274f48`
- `--color-accent-light: #5f867f`
- `--color-accent-soft: #e1ecea`
- `--color-success: #4f7456`
- `--color-error: #9e4a4a`
- `--color-border: #ddd4c8`
- `--color-border-strong: #cbbfb1`

### 3.2 Typography Tokens

Scale:
- `--text-display: clamp(2.4rem, 5.8vw, 4.85rem)`
- `--text-h1: clamp(2.05rem, 4.15vw, 3.35rem)`
- `--text-h2: clamp(1.58rem, 2.75vw, 2.2rem)`
- `--text-h3: clamp(1.2rem, 1.75vw, 1.46rem)`
- `--text-h4: clamp(1.08rem, 1.3vw, 1.22rem)`
- `--text-body-lg: clamp(1.08rem, 1.05rem + 0.45vw, 1.24rem)`
- `--text-body: 1.04rem`
- `--text-caption: 0.875rem`
- `--text-label: 0.8rem`

Rhythm defaults:
- Body copy targets 1.72 to 1.78 line-height depending on style class.
- Labels use uppercase with extended tracking for scanning.

### 3.3 Spacing and Geometry

Spacing:
- `--space-2` through `--space-24` as base rhythm tokens.
- Section cadence: `--section-padding: clamp(5rem, 10vw, 9.5rem)`

Layout:
- `--container-max: 1080px`
- `--container-prose: 640px`

Radius:
- `--radius-sm: 4px`
- `--radius-md: 8px`
- `--radius-lg: 12px`
- `--radius-xl: 16px`
- `--radius-pill: 999px`

## 4. Component Standards

### Buttons
Source: `/components/ui/button.tsx`

Rules:
- Primary uses accent fill and white text.
- Outline uses paper fill + calm border for trust tone.
- Default button corner style is pill (`--radius-pill`).
- Minimum height target: 44px+ (default now 44 via `h-11`).

### Inputs, Textareas, Select
Source:
- `/components/ui/input.tsx`
- `/components/ui/textarea.tsx`
- `/components/ui/select.tsx`

Rules:
- Border uses `--color-border` at rest.
- Hover and focus are tokenized and consistent.
- Focus-visible includes ring + offset for keyboard clarity.

### Navigation and Editorial Links
Source:
- `/app/styles/components.css`
- `/components/Header.tsx`

Rules:
- Uppercase nav labels with tracked letterforms.
- Active and hover states are visibly differentiated.
- Link-arrow interaction remains subtle (trust tone over flashy motion).

## 5. Accessibility Baseline

Required contrast floor (normal text): 4.5:1.

Current policy checks include:
- `--color-ink-soft` on `--color-paper`
- `--color-ink-muted` on `--color-paper`
- `--color-ink-faint` on `--color-paper`
- `--color-accent` on `--color-paper`
- white on accent buttons

Focus treatment:
- Global `:focus-visible` outline + component ring styles are mandatory.

## 6. Social/Meta Visual Consistency

Open Graph image stack is aligned to production fonts and palette.
Source: `/app/opengraph-image.tsx`

Local OG fonts:
- `/public/fonts/literata-latin-700-normal.ttf`
- `/public/fonts/plus-jakarta-sans-latin-500-normal.ttf`

## 7. QA Workflow (Required Before Merge)

Run all:
- `npm run lint`
- `npm run build`
- `npm test`
- `npm run test:design-system`

`test:design-system` validates:
- Required tokens exist.
- Contrast thresholds are met.
- Layout uses approved font imports/variables.
- Open Graph uses approved production fonts.

## 8. Figma Handoff References

Concept exploration + scoring board:
- `/app/preview/page.tsx`

Token exports:
- `/public/preview/figma-typography-handoff.json`
- `/public/preview/figma-typography-handoff.csv`

For final implementation, treat the production token values in `/app/styles/theme.css` as source-of-truth over exploratory concept values.

## 9. Change Management

Any change to typography, color, spacing, or radius must:
1. Update tokens in `/app/styles/theme.css`.
2. Pass `npm run test:design-system`.
3. Include a short rationale in PR notes with expected UX outcome.
4. Confirm no regression in `/preview` and homepage hero.

## 10. Manual Visual QA Matrix (Release Gate)

Check each row at 320px, 390px, 768px, 1024px, and 1440px:
- Home hero: headline wraps intentionally, CTA row spacing, portrait crop, no cramped text.
- Notes index: date metadata legibility, list rhythm, hover state clarity.
- Note detail: paragraph rhythm, blockquote treatment, adjacent navigation cards.
- Forms (newsletter/contact/speaking): field spacing, focus ring visibility, error/success contrast.
- Header/mobile menu: sticky transition, active state clarity, menu tap targets.
- Footer: metadata contrast and spacing rhythm.
- `/preview`: matrix readability, score bars, handoff tables horizontal scrolling behavior.

Definition of done:
- No text below AA contrast threshold.
- No clipped headings or overlapping controls at any required breakpoint.
- Primary CTA remains clearly dominant on Home and Newsletter sections.
- Open Graph image style matches production font and color system.
