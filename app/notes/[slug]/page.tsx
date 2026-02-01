import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import { getAllNoteSlugs, getNoteBySlug, getAdjacentNotes } from "@/lib/notes";
import { NewsletterCTA } from "@/components/NewsletterCTA";
import { DownloadCard } from "@/components/DownloadCard";
import { NoteSignOff } from "@/components/NoteSignOff";
import { MDXImage } from "@/components/MDXImage";
import { ArrowIcon } from "@/components/icons";
import { MDXRemote } from "next-mdx-remote/rsc";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const slugs = getAllNoteSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    try {
        const note = getNoteBySlug(slug);
        return {
            title: note.metadata.title,
            description: note.metadata.excerpt,
        };
    } catch {
        return {
            title: "Note Not Found",
        };
    }
}

// Custom MDX components with premium styling
const mdxComponents = {
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
        <p className="mb-6 leading-relaxed" {...props}>{children}</p>
    ),
    strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
        <strong className="font-semibold text-[var(--color-ink)]" {...props}>{children}</strong>
    ),
    em: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
        <em className="italic" {...props}>{children}</em>
    ),
    blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
        <blockquote
            className="my-10 py-8 px-8 bg-[var(--color-paper-warm)] rounded-lg text-center [&_p]:text-[var(--color-accent)] [&_p]:mb-0"
            {...props}
        >
            <div className="text-h4 italic text-[var(--color-accent)] leading-relaxed">
                {children}
            </div>
        </blockquote>
    ),
    img: MDXImage,
    DownloadCard,
};

export default async function NotePage({ params }: PageProps) {
    const { slug } = await params;

    let note;
    try {
        note = getNoteBySlug(slug);
    } catch {
        notFound();
    }

    const formattedDate = format(
        parseISO(note.metadata.date),
        "MMMM d, yyyy"
    );

    const { prev, next } = getAdjacentNotes(slug);

    // Article JSON-LD for rich search results
    const articleJsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: note.metadata.title,
        description: note.metadata.excerpt,
        datePublished: note.metadata.date,
        dateModified: note.metadata.date,
        author: {
            "@type": "Person",
            name: "Lizi Shaw",
            url: "https://lizishaw.com/about",
        },
        publisher: {
            "@type": "Person",
            name: "Lizi Shaw",
            url: "https://lizishaw.com",
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://lizishaw.com/notes/${slug}`,
        },
    };

    return (
        <>
            {/* Article Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />

            {/* Hero */}
            <section className="pt-12 pb-6 bg-[var(--color-paper-warm)]">
                <div className="container">
                    <div className="max-w-2xl mx-auto">
                        {/* Back link */}
                        <Link
                            href="/notes"
                            className="text-caption text-[var(--color-ink-muted)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-2 mb-6 animate-fade-in"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            All Notes
                        </Link>

                        {/* Header */}
                        <header className="animate-fade-in" style={{ animationDelay: "75ms" }}>
                            <h1 className="text-display">{note.metadata.title}</h1>
                            <time className="text-caption text-[var(--color-ink-muted)] mt-4 block">
                                {formattedDate}
                            </time>
                        </header>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="pt-10 pb-16">
                <div className="container">
                    <article className="max-w-2xl mx-auto">
                        {/* Article body */}
                        <div className="text-body-lg text-[var(--color-ink)] animate-fade-in" style={{ animationDelay: "150ms" }}>
                            <MDXRemote source={note.content} components={mdxComponents} />
                        </div>

                        {/* Sign-off */}
                        <NoteSignOff />

                        {/* Prev/Next Navigation */}
                        {(prev || next) && (
                            <nav className="mt-12 pt-8 border-t border-[var(--color-border)] animate-fade-in" style={{ animationDelay: "300ms" }}>
                                <div className="flex justify-between items-start gap-8">
                                    {/* Previous (newer) */}
                                    <div className="flex-1">
                                        {prev && (
                                            <Link
                                                href={`/notes/${prev.slug}`}
                                                className="group block"
                                            >
                                                <span className="text-caption text-[var(--color-ink-muted)] flex items-center gap-2 mb-2">
                                                    <ArrowIcon direction="left" />
                                                    Previous
                                                </span>
                                                <span className="text-body font-medium text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors">
                                                    {prev.title}
                                                </span>
                                            </Link>
                                        )}
                                    </div>

                                    {/* Next (older) */}
                                    <div className="flex-1 text-right">
                                        {next && (
                                            <Link
                                                href={`/notes/${next.slug}`}
                                                className="group block"
                                            >
                                                <span className="text-caption text-[var(--color-ink-muted)] flex items-center justify-end gap-2 mb-2">
                                                    Next
                                                    <ArrowIcon />
                                                </span>
                                                <span className="text-body font-medium text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors">
                                                    {next.title}
                                                </span>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </nav>
                        )}
                    </article>
                </div>
            </section>

            {/* Newsletter CTA */}
            <NewsletterCTA />
        </>
    );
}
