import Link from "next/link";
import { format, parseISO } from "date-fns";
import type { NoteMetadata } from "@/lib/notes";
import { ArrowIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

interface NotesFeedProps {
  notes: NoteMetadata[];
  maxSupportingNotes?: number;
  className?: string;
  supportingItemClassName?: string;
}

export function NotesFeed({
  notes,
  maxSupportingNotes,
  className,
  supportingItemClassName,
}: NotesFeedProps) {
  const featuredNote = notes[0] ?? null;
  const supportingNotes =
    maxSupportingNotes === undefined
      ? notes.slice(1)
      : notes.slice(1, 1 + maxSupportingNotes);

  return (
    <div className={cn("space-y-9", className)}>
      {!featuredNote && supportingNotes.length === 0 ? (
        <p className="text-body text-[var(--color-ink-soft)]">
          Notes are on the way.
        </p>
      ) : null}

      {featuredNote ? (
        <article className="border-b border-[var(--color-border)] pb-9">
          <div className="text-caption mb-3 text-[var(--color-ink-faint)]">
            {format(parseISO(featuredNote.date), "MMMM d, yyyy")}
          </div>
          <h3 className="text-h2 mb-4">
            <Link
              href={`/notes/${featuredNote.slug}`}
              className="transition-colors hover:text-[var(--color-accent)]"
            >
              {featuredNote.title}
            </Link>
          </h3>
          <p className="text-body mb-5 max-w-[58ch]">{featuredNote.excerpt}</p>
          <Link className="link-arrow" href={`/notes/${featuredNote.slug}`}>
            Read note
            <ArrowIcon />
          </Link>
        </article>
      ) : null}

      {supportingNotes.length > 0 ? (
        <div className="divide-y divide-[var(--color-border)]">
          {supportingNotes.map((note) => {
            const formattedDate = format(parseISO(note.date), "MMMM d, yyyy");
            return (
              <article
                key={note.slug}
                className={cn("group py-8 first:pt-0", supportingItemClassName)}
              >
                <div className="text-caption mb-3 text-[var(--color-ink-faint)]">
                  {formattedDate}
                </div>
                <h3 className="text-h3 mb-3">
                  <Link
                    href={`/notes/${note.slug}`}
                    className="transition-colors group-hover:text-[var(--color-accent)]"
                  >
                    {note.title}
                  </Link>
                </h3>
                <p className="text-body mb-4">{note.excerpt}</p>
                <Link className="link-arrow" href={`/notes/${note.slug}`}>
                  Read note
                  <ArrowIcon />
                </Link>
              </article>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
