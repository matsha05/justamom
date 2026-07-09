import Link from "next/link";
import { ArrowIcon } from "@/components/icons/ArrowIcon";
import type { NoteMetadata } from "@/lib/notes";
import { cn } from "@/lib/utils";

interface NoteNavigationProps {
  previousNote: NoteMetadata | null;
  nextNote: NoteMetadata | null;
}

export function NoteNavigation({
  previousNote,
  nextNote,
}: NoteNavigationProps) {
  if (!previousNote && !nextNote) {
    return null;
  }

  const hasSingleNote = !previousNote || !nextNote;

  return (
    <nav
      aria-label="More notes"
      className="note-adjacent-nav mt-12 border-t border-[var(--color-border)] pt-8"
    >
      <div
        className={cn(
          "note-adjacent-grid flex items-start justify-between gap-8",
          hasSingleNote && "note-adjacent-grid-single"
        )}
      >
        {previousNote ? (
          <Link
            href={`/notes/${previousNote.slug}`}
            className="note-adjacent-link group block flex-1"
          >
            <span className="note-adjacent-label mb-2 flex items-center gap-2 text-caption text-[var(--color-ink-muted)]">
              <ArrowIcon direction="left" />
              Previous
            </span>
            <span className="note-adjacent-title text-body font-medium text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)]">
              {previousNote.title}
            </span>
          </Link>
        ) : null}

        {nextNote ? (
          <Link
            href={`/notes/${nextNote.slug}`}
            className={cn(
              "note-adjacent-link group block flex-1",
              previousNote && "note-adjacent-link-end"
            )}
          >
            <span
              className={cn(
                "note-adjacent-label mb-2 flex items-center gap-2 text-caption text-[var(--color-ink-muted)]",
                previousNote && "justify-end"
              )}
            >
              Next
              <ArrowIcon />
            </span>
            <span
              className={cn(
                "note-adjacent-title text-body font-medium text-[var(--color-ink)] transition-colors group-hover:text-[var(--color-accent)]",
                previousNote && "text-right"
              )}
            >
              {nextNote.title}
            </span>
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
