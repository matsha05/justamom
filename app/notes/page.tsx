import type { Metadata } from "next";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { getAllNotes } from "@/lib/notes";
import { ArrowIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "Notes for Moms",
    description:
        "A Note for Moms—short reflections on faith, motherhood, and the quiet work of ordinary days.",
};

export default function NotesPage() {
    const notes = getAllNotes();
    const featuredNote = notes[0] ?? null;
    const supportingNotes = notes.slice(1);

    return (
        <>
            <section className="section section-warm pt-[clamp(3.75rem,8vw,6rem)] pb-10">
                <div className="container-prose space-y-6">
                    <p className="text-label">Notes for Moms</p>
                    <h1 className="text-display">A Note for Moms</h1>
                    <p className="text-body-lg text-[var(--color-ink-soft)]">
                        Short notes for moms, sent twice a month.
                    </p>
                </div>
            </section>

            <section className="section pt-8">
                <div className="container">
                    <div className="section-split">
                        <div className="space-y-5 lg:pt-1">
                            <p className="text-label">Recent Notes</p>
                            <h2 className="text-h1">For the mom in the thick of it</h2>
                            <Button asChild>
                                <Link href="/#newsletter">
                                    Join A Note for Moms
                                    <ArrowIcon />
                                </Link>
                            </Button>
                        </div>

                        <div className="space-y-10 max-w-[43rem]">
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
                                            <article key={note.slug} className="group py-9 first:pt-0">
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
                    </div>
                </div>
            </section>

        </>
    );
}
