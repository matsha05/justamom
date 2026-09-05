# Just a Mom

Personal website for Lizi Shaw (speaker, writer, encourager). Built with Next.js App Router and MDX notes.

Lizi and first-time contributors: start with [Managing your site with Codex](docs/lizi-start-here.md) for Mac setup, everyday prompts, and how both laptops share changes.

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS
- MDX for notes content

## Local development

Use Node.js 24 LTS (the version in `.nvmrc`). CI and the production package configuration use the same major version.

```bash
npm ci
# Create .env.local from .env.local.example only if no local config exists.
npm run dev
```

Dev server runs at http://localhost:3001.

Other scripts:

```bash
npm run build
npm run start
npm run lint
npm run test
npm run test:smoke
npm run test:design-system
```

For browser checks, install Chromium once with `npx playwright install chromium`. Use the safe local preview configuration below. The browser suite uses a development server on port 3001 and can reuse a running server, so confirm it belongs to this checkout and uses the intended preview configuration before testing.

`npm run start` serves a production build and requires production configuration. Use `npm run dev` for the disabled-delivery visual preview.

## Environment variables

For local visual previews, copy `.env.local.example` to `.env.local` only if no local environment file exists. This disables newsletter and contact delivery; it does not contain production credentials. Do not overwrite an existing configuration. A contact or newsletter delivery error is expected in this preview.

For real integrations and production, use the configuration below and keep values outside Git:

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
- In production runtime, `NEXT_PUBLIC_SITE_URL`, `FORMSPREE_ENDPOINT`, `MAILER_LITE_API_KEY`, and `MAILERLITE_GROUP_ID` are validated at startup.

## Content workflows

- Core page copy lives in `content/site.ts`.
- Notes live in `content/notes/*.mdx` with frontmatter `title`, `date`, and `excerpt`.
- Note creation steps are documented in `.agent/workflows/add-note.md`.
- Speaking topic illustration prompts live in `docs/speaking-image-prompts.md`.
- Site images live in `public/images`.

## Design system

- Production spec: `docs/design-system-production.md`
- Typography research + decision record: `docs/typography-system-research.md`
- Source-of-truth tokens: `app/styles/theme.css` and `app/styles/typography.css`

Run `npm run test:design-system` before merges that change typography, color, spacing, radius, or component states.
