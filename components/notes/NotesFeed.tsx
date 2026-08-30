import Link from "next/link";
import { format, parseISO } from "date-fns";
import { getWritingHref, type NoteMetadata } from "@/lib/notes";
import { ArrowIcon } from "@/components/icons/ArrowIcon";
import { cn } from "@/lib/utils";

interface NotesFeedProps {
  notes: NoteMetadata[];
  maxSupportingNotes?: number;
  className?: string;
  supportingItemClassName?: string;
  emptyMessage?: string;
}

export function NotesFeed({
  notes,
  maxSupportingNotes,
  className,
  supportingItemClassName,
  emptyMessage = "Writing is on the way.",
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
          {emptyMessage}
        </p>
      ) : null}

      {featuredNote ? (
        <article className="note-feed-article note-feed-article-featured group border-b border-[var(--color-border)] pb-9">
          <time
            dateTime={featuredNote.date}
            className="text-caption mb-3 block text-[var(--color-ink-muted)]"
          >
            {format(parseISO(featuredNote.date), "MMMM d, yyyy")}
          </time>
          <h3 className="text-h2 mb-4">
            <Link
              href={getWritingHref(featuredNote)}
              className="note-feed-title-link"
            >
              {featuredNote.title}
            </Link>
          </h3>
          <p className="note-feed-excerpt text-body mb-5 max-w-[58ch]">{featuredNote.excerpt}</p>
          <Link
            className="link-arrow"
            href={getWritingHref(featuredNote)}
            aria-label={`Read post: ${featuredNote.title}`}
          >
            Read post
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
                className={cn("note-feed-article group py-8 first:pt-0", supportingItemClassName)}
              >
                <time
                  dateTime={note.date}
                  className="text-caption mb-3 block text-[var(--color-ink-muted)]"
                >
                  {formattedDate}
                </time>
                <h3 className="text-h3 mb-3">
                  <Link
                    href={getWritingHref(note)}
                    className="note-feed-title-link"
                  >
                    {note.title}
                  </Link>
                </h3>
                <p className="note-feed-excerpt text-body mb-4">{note.excerpt}</p>
                <Link
                  className="link-arrow"
                  href={getWritingHref(note)}
                  aria-label={`Read post: ${note.title}`}
                >
                  Read post
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
