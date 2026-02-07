# Typography System Research (February 7, 2026)

This document captures the source inputs and design decisions behind the typography direction for the Just a Mom landing experience.

## What We Optimized For

- Editorial warmth without feeling dated.
- Distinct personality that does not look like generic AI landing pages.
- Long-form readability for notes/devotionals.
- Strong hierarchy and spacing consistency on mobile and desktop.
- Fast loading and low layout shift in Next.js.

## Research Signals

- r/vibecoding discussions repeatedly call out that AI pages feel generic when spacing, hierarchy, and typography are not intentional.
- r/vibecoding threads also emphasize that an explicit style system produces better outcomes than vague prompts.
- r/FigmaDesign critique threads consistently point to hierarchy, spacing rhythm, and button consistency as the top improvements.
- Figma's text guidance confirms that line-height and letter-spacing decisions directly impact readability and should be systematized.
- web.dev and Next.js docs recommend variable fonts and careful loading for performance/flexibility.

## Primary References

- [r/vibecoding: "Vibecoded landing pages are ugly af..."](https://www.reddit.com/r/vibecoding/comments/1nkdvwr/vibecoded_landing_pages_are_ugly_af_this_is_how_i/)
- [r/vibecoding: "Let's be honest... AI UI all looks the same"](https://www.reddit.com/r/vibecoding/comments/1oxutwy/lets_be_honest_ai_ui_all_looks_the_same/)
- [r/vibecoding: "I suck at UI design, but I love to vibe..."](https://www.reddit.com/r/vibecoding/comments/1pivt4w/i_suck_at_ui_design_but_i_love_to_vibe_so_i/)
- [r/FigmaDesign: "Everything here seems so off..."](https://www.reddit.com/r/FigmaDesign/comments/1iv00h4)
- [r/FigmaDesign: "Something feels off with my design"](https://www.reddit.com/r/FigmaDesign/comments/1dxqti1)
- [Figma Help: Explore text properties](https://help.figma.com/hc/en-us/articles/360039956634-Explore-text-properties)
- [Figma Help: Create and apply text styles](https://help.figma.com/hc/en-us/articles/360039957034-Create-and-apply-text-styles)
- [web.dev: Optimize web fonts](https://web.dev/learn/performance/optimize-web-fonts)
- [web.dev: Introduction to variable fonts](https://web.dev/articles/variable-fonts)
- [Next.js docs: Font optimization](https://nextjs.org/docs/app/getting-started/fonts)

## Font Family Evidence

- [Newsreader](https://github.com/productiontype/Newsreader) and [about page](https://productiontype.com/font/newsreader/newsreader-display)
- [Source Sans 3](https://fonts.adobe.com/fonts/source-sans-3)
- [Fraunces](https://github.com/undercasetype/Fraunces)
- [Manrope](https://github.com/davelab6/manrope)
- [Literata](https://github.com/googlefonts/literata)
- [Plus Jakarta Sans](https://github.com/tokotype/PlusJakartaSans)

## Explored Systems

- Concept A: Newsreader + Source Sans 3
- Concept B: Fraunces + Manrope
- Concept C: Literata + Plus Jakarta Sans

Each concept was evaluated with explicit display/body weights, line-height behavior, spacing rhythm, and CTA treatment.

## Final Production Direction

Adopted direction:
- Base: Concept C (Literata + Plus Jakarta Sans)
- Trust refinement: Concept A tone for CTA calmness and pastoral clarity

Production source-of-truth now lives in:
- `/app/styles/theme.css`
- `/app/styles/typography.css`
- `/docs/design-system-production.md`

## Current Handoff Sources

- `/app/styles/theme.css`
- `/app/styles/typography.css`
- `/docs/design-system-production.md`
