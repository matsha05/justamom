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

## 4. Deploy
// turbo
```bash
cd /Users/matsha05/Desktop/dev/justamom && git add . && git commit -m "Add note: [title]" && git push
```

## 5. Remind User
Tell user:
1. Note is live at lizishaw.com/notes/[slug]
2. Copy content to MailerLite when ready to send
