import type { Metadata } from "next";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { getAllNotes } from "@/lib/notes";
import { NewsletterCTA } from "@/components/NewsletterCTA";

export const metadata: Metadata = {
    title: "Notes for Moms",
    description:
        "A Note for Moms—short reflections on faith, motherhood, and the quiet work of ordinary days.",
};

export default function NotesPage() {
    const notes = getAllNotes();

    return (
        <>
            <section className="section bg-[var(--color-paper-warm)]">
                <div className="container-prose">
                    <div className="space-y-6">
                        <p className="text-label">Notes for Moms</p>
                        <h1 className="text-display">A Note for Moms</h1>
                        <p className="text-body-lg text-[var(--color-ink-soft)]">
                            Short notes for moms, sent twice a month.
                        </p>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container-prose">
                    <div className="space-y-14">
                        {notes.map((note) => {
                            const formattedDate = format(parseISO(note.date), "MMMM d, yyyy");

                            return (
                                <article
                                    key={note.slug}
                                    className="pb-10 border-b border-[var(--color-border)] last:border-b-0 last:pb-0"
                                >
                                    <time className="text-caption text-[var(--color-ink-muted)] tracking-wide">
                                        {formattedDate}
                                    </time>
                                    <h2 className="text-h3 mt-3 mb-4">
                                        <Link
                                            href={`/notes/${note.slug}`}
                                            className="transition-colors hover:text-[var(--color-accent)]"
                                        >
                                            {note.title}
                                        </Link>
                                    </h2>
                                    <p className="text-body text-[var(--color-ink-soft)] leading-relaxed">
                                        {note.excerpt}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="section section-warm">
                <div className="container-prose">
                    <NewsletterCTA variant="compact" />
                </div>
            </section>
        </>
    );
}
