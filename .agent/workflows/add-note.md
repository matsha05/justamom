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
- Do NOT include "In it with you, Lizi" - the template adds this automatically
- Slug should be lowercase with hyphens (e.g., `the-quiet-yes`)
- Keep body copy exactly as provided by Lizi (no sentence rewrites)

## 4. Visual + Structure QA (Required)
Before publishing, confirm the note follows the site's note visual standard:

- Use the shared template at `app/notes/[slug]/page.tsx` (no per-note layout hacks in MDX)
- No extra H1 in MDX body (page title comes from frontmatter)
- Scripture quotes use markdown blockquote (`>`) so they render with the editorial quote style
- Keep strong emphasis in markdown (`**...**`) only where already present in source copy
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
