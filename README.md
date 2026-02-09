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
npm run test
npm run test:design-system
```

## Environment variables

Create `.env.local` in the repo root:

```
MAILER_LITE_API_KEY=your_key_here
MAILERLITE_GROUP_ID=your_group_id_here
FORMSPREE_ENDPOINT=https://formspree.io/f/your_form_id
NEXT_PUBLIC_SITE_URL=https://lizishaw.com
ALLOWED_ORIGINS=https://lizishaw.com
ALLOW_MISSING_ORIGIN=false
TRUST_PROXY=true
UPSTASH_REDIS_REST_URL=https://your-upstash-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-token
REQUIRE_REDIS=true
ALERT_WEBHOOK_URL=https://hooks.slack.com/services/...
```

These power:
- Newsletter signup in `app/api/newsletter/route.ts`
- Contact + speaking inquiry forwarding in `app/api/contact/route.ts`
- Canonical/metadata URL generation from `lib/config.ts`
- Durable rate limiting + idempotency (`lib/server/kv.ts`)
- Trusted proxy IP detection for rate limiting (`lib/server/request.ts`)
- API alert notifications for upstream failures (`lib/server/observability.ts`)

Notes:
- Set `TRUST_PROXY=true` behind a trusted proxy/CDN (for correct client IPs and origin validation).
- Set `REQUIRE_REDIS=true` to fail closed if Redis is missing (prevents silent in-memory rate limiting).

## Content workflows

- Notes live in `content/notes/*.mdx` with frontmatter `title`, `date`, and `excerpt`.
- Note creation steps are documented in `.agent/workflows/add-note.md`.
- Speaking topic illustration prompts live in `docs/speaking-image-prompts.md`.
- Site images live in `public/images`.

## Design system

- Production spec: `docs/design-system-production.md`
- Typography research + decision record: `docs/typography-system-research.md`
- Source-of-truth tokens: `app/styles/theme.css` and `app/styles/typography.css`

Run `npm run test:design-system` before merges that change typography, color, spacing, radius, or component states.
