---
description: Create a new Note from raw text shared by user
---

# Add New Note Workflow

When user shares raw text for a new note, follow these steps:

## 1. Gather Info
Ask for:
- **Date** the note is being sent (or will be sent)
- **Raw text content** (user will paste it)

## 2. Create Title
Generate a short, evocative title (2-4 words) from the content's theme.

## 3. Create MDX File
Create file at `content/notes/[slug].mdx` with this format:

```mdx
---
title: "Your Title Here"
date: "YYYY-MM-DD"
excerpt: "One sentence capturing the heart of the note."
---

[Content here, with markdown formatting]

- Use **bold** for emphasis
- Use *italics* for dialogue or quotes
- Use > blockquotes for Scripture
```

**Important:**
- Do NOT keep MailerLite wrapper/footer copy, unsubscribe links, or signup boilerplate in the MDX file
- For newsletter imports, treat the email subject and any bold headline line near the top as title candidates first. If that line duplicates the chosen frontmatter title, do NOT repeat it as the first paragraph of the note body
- Keep greetings like `Hey friend,` or `Hi there,` when they are present in the authored copy, but do not invent one if the note truly begins without one
- When a Scripture passage is clearly quoted, format the quoted words and citation as a markdown blockquote so it inherits the standard note quote styling
- If a line might be either body copy or a title, or if the Scripture formatting is ambiguous, stop and flag it for review instead of auto-publishing
- If the source includes `In it with you, Lizi`, leave it in the raw import only long enough to preserve structure, then make sure the site renders the shared sign-off instead of duplicating it in the body
- If the source includes a `P.S.`, preserve that authored copy and make sure it renders after the shared sign-off
- Slug should be lowercase with hyphens (e.g., `the-quiet-yes`)
- Keep body copy exactly as provided by Lizi (no sentence rewrites)

## 4. Visual + Structure QA (Required)
Before publishing, confirm the note follows the site's note visual standard:

- Use the shared template at `app/notes/[slug]/page.tsx` (no per-note layout hacks in MDX)
- No extra H1 in MDX body (page title comes from frontmatter)
- Scripture quotes use markdown blockquote (`>`) so they render with the editorial quote style
- Keep strong emphasis in markdown (`**...**`) only where already present in source copy
- Compare the rendered note against at least one recent published note to catch duplicated title text, missing greeting rhythm, or inline Scripture that should render as a quote
- Confirm the rendered note shows only one sign-off, with any `P.S.` content below it
- Verify both desktop and mobile on `/notes/[slug]`
- All note detail pages must inherit these styles through `app/notes/[slug]/page.tsx` + `app/globals.css`

## 5. Deploy
// turbo
```bash
cd /Users/matsha05/Desktop/dev/justamom && git add . && git commit -m "Add note: [title]" && git push
```

## 6. Remind User
Tell user:
1. Note is live at lizishaw.com/notes/[slug]
2. Copy content to MailerLite when ready to send
