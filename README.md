# Just a Mom

Personal website for Lizi Shaw (speaker, writer, encourager). Built with Next.js App Router and MDX notes.

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS
- MDX for notes content

## Local development

```bash
npm install
npm run dev
```

Dev server runs at http://localhost:3001.

Other scripts:

```bash
npm run build
npm run start
npm run lint
```

## Environment variables

Create `.env.local` in the repo root:

```
MAILER_LITE_API_KEY=your_key_here
MAILERLITE_GROUP_ID=your_group_id_here
```

These power the newsletter signup endpoint in `app/api/newsletter/route.ts`.

## Content workflows

- Notes live in `content/notes/*.mdx` with frontmatter `title`, `date`, and `excerpt`.
- Note creation steps are documented in `.agent/workflows/add-note.md`.
- Speaking topic illustration prompts live in `docs/speaking-image-prompts.md`.
- Site images live in `public/images`.
