"use client";

import { NewsletterForm } from "@/components/NewsletterForm";
import { postNoteCtaCopy } from "@/lib/content";

export function NoteNewsletterCTA() {
  return (
    <section
      aria-labelledby="note-newsletter-heading"
      className="mt-12 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-paper-soft)] px-6 py-8"
    >
      <div className="space-y-4">
        <p className="text-label">Stay Connected</p>
        <div className="space-y-2">
          <h2 id="note-newsletter-heading" className="text-h3">
            {postNoteCtaCopy.heading}
          </h2>
          <p className="text-body text-[var(--color-ink-soft)]">
            {postNoteCtaCopy.description}
          </p>
        </div>
        <div className="max-w-md">
          <NewsletterForm variant="compact" />
        </div>
        <p className="text-caption text-[var(--color-ink-muted)]">
          {postNoteCtaCopy.trust}
        </p>
      </div>
    </section>
  );
}
