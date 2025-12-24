import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllNotes } from "@/lib/notes";
import { NewsletterCTA } from "@/components/NewsletterCTA";
import { ArrowIcon } from "@/components/icons";

export const metadata: Metadata = {
    title: "Notes for Moms",
    description:
        "A quiet note from one mom to another. Reflections on faith, motherhood, and finding God in the everyday moments.",
};

export default function NotesPage() {
    const notes = getAllNotes();

    return (
        <>
            {/* Hero Section */}
            <section className="section bg-[var(--color-paper-warm)]">
                <div className="container">
                    <div className="max-w-2xl mx-auto text-center">
                        <p className="text-label mb-6 animate-fade-in">
                            Notes for Moms
                        </p>
                        <h1
                            className="text-display mb-8 animate-fade-in"
                            style={{ animationDelay: "75ms" }}
                        >
                            A quiet note from one mom to another
                        </h1>
                        <p
                            className="text-body-lg text-[var(--color-ink-muted)] animate-fade-in"
                            style={{ animationDelay: "150ms" }}
                        >
                            Twice each month, I send a short reflection for moms who want
                            wisdom, honesty, and encouragement rooted in Scripture.
                        </p>
                        <Image
                            src="/images/signature.png"
                            alt="Lizi"
                            width={80}
                            height={74}
                            className="mx-auto mt-8 opacity-70 animate-fade-in"
                            style={{ animationDelay: "225ms" }}
                        />
                    </div>
                </div>
            </section>

            {/* Notes Section */}
            <section className="section">
                <div className="container">
                    <div className="max-w-3xl mx-auto">
                        <div className="space-y-0">
                            {notes.map((note, index) => {
                                const formattedDate = new Date(note.date).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                });

                                return (
                                    <article
                                        key={note.slug}
                                        className="group py-10 border-b border-[var(--color-border)] first:pt-0 last:border-b-0 animate-fade-in"
                                        style={{ animationDelay: `${index * 75}ms` }}
                                    >
                                        <Link href={`/notes/${note.slug}`} className="block">
                                            <div className="flex flex-col md:flex-row md:items-start md:gap-12">
                                                {/* Date Column */}
                                                <div className="md:w-36 flex-shrink-0 mb-3 md:mb-0">
                                                    <time className="text-caption text-[var(--color-ink-muted)] tracking-wide">
                                                        {formattedDate}
                                                    </time>
                                                </div>

                                                {/* Content Column */}
                                                <div className="flex-1">
                                                    <h2 className="text-h3 mb-3 group-hover:text-[var(--color-accent)] transition-colors">
                                                        {note.title}
                                                    </h2>
                                                    <p className="text-body text-[var(--color-ink-muted)] leading-relaxed mb-4">
                                                        {note.excerpt}
                                                    </p>
                                                    <span className="text-caption font-medium text-[var(--color-accent)] inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                                                        Read this note
                                                        <ArrowIcon />
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <NewsletterCTA />
        </>
    );
}
