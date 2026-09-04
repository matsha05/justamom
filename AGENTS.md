# Project Instructions

## Working Method

- Treat an explicit request for action as authorization to complete reversible, repository-local work. Infer routine details from the repository and conversation; ask only when a missing choice would materially change the result.
- Before asking about an external or irreversible action, finish the inspection, implementation, and relevant local checks needed to make that decision concrete. Pushing, merging, deploying, publishing, sending, purchasing, and other external writes still require explicit authorization unless the current request clearly includes that exact action.
- Explicit user instructions take precedence over guidance in this file and repository workflows. If a workflow or skill conflicts with the request or causes work to pause, identify the exact instruction and explain the conflict.
- Use available subagents for independent work when parallelism would materially save time or improve quality. Keep overlapping edits under one owner.
- Calibrate verification to the change. Start with focused checks, broaden only when risk or failures justify it, and do not add tests that merely mirror a reversible, low-impact implementation.

## Agent Communication

- Lead with the outcome and use clear, concise paragraphs. Use lists when the information is genuinely parallel, sequential, or easier to compare.
- Prefer plain language, concrete examples, and direct statements. Avoid canned slogans, unnecessary jargon, and repetitive conclusions.
- When helping Lizi learn, handle routine technical steps and briefly explain what each step accomplishes. Ask her to make content and publishing decisions; do not make her relay commands through Matt.

## Shared Laptop Workflow

- Lizi and Matt can each operate this project from their own laptop. Do not assume access to Matt's conversation history, personal skills, account connections, or local files. Keep reusable project guidance in the repository when asked.
- For first-time setup and everyday author requests, read `docs/lizi-start-here.md`. Use the example local preview configuration without overwriting an existing environment file.
- Inspect local work and the latest shared branch before beginning a separate task branch. Preserve both people's changes. Explain any conflicting content choices instead of silently choosing one person's version.
- Show a local preview for review, and clearly distinguish local changes, uploaded changes, and verified live changes. Lizi can approve her own work; do not require Matt as an intermediary.
- Follow `README.md` for setup and checks, and `.agent/workflows/add-note.md` when creating or importing notes. Core page copy is in `content/site.ts`; images are in `public/images`. Use the existing site and hosting project.
- For a first setup, verify that this repository is the project's primary folder, confirm GitHub authentication uses the current user's account, and report which setup steps actually passed. Do not assume that a successful public clone grants publishing access.

## Author-Owned Notes

- Treat note titles, excerpts, and body text in `content/notes/` as author-owned; do not edit them unless the user explicitly asks for that specific note change.
- UI, layout, metadata, navigation, and surrounding non-note marketing copy may be updated as needed, but authored note text is off-limits by default.

## Voice Guidance

- Treat Lizi's authored note copy and long-form project/book copy as the source of truth for tone.
- Default to plain, human, slightly conversational language over polished brand slogans.
- Favor concrete, ordinary phrasing over poetic compression or elevated positioning lines.
- Let warmth come from specificity, honesty, and gentle humor rather than from abstract mood words.
- Avoid writing copy that sounds like a tagline generator, a marketing campaign, or a devotional cliché.
