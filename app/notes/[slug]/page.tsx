import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import { getAllNoteSlugs, getNoteBySlug, getAdjacentNotes } from "@/lib/notes";
import { DownloadCard } from "@/components/DownloadCard";
import { NoteSignOff } from "@/components/NoteSignOff";
import { MDXImage } from "@/components/MDXImage";
import { ArrowIcon } from "@/components/icons";
import { MDXRemote } from "next-mdx-remote/rsc";
import { absoluteUrl, siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

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
            className="my-10 pl-6 border-l-2 border-[var(--color-border-strong)] [&_p]:mb-0"
            {...props}
        >
            <div className="text-body-lg italic text-[var(--color-ink-soft)] leading-relaxed">
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
            name: siteConfig.author.name,
            url: absoluteUrl("/about"),
        },
        publisher: {
            "@type": "Person",
            name: siteConfig.author.name,
            url: siteConfig.site.url,
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": absoluteUrl(`/notes/${slug}`),
        },
    };

    return (
        <>
            {/* Article Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
            />

            <section className="section section-warm pb-10 note-detail-hero">
                <div className="container-prose note-article-shell">
                    <div>
                        {/* Back link */}
                        <Link
                            href="/notes"
                            className="text-caption text-[var(--color-ink-muted)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-2 mb-6 note-back-link"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            All Notes
                        </Link>

                        <header>
                            <h1 className="text-display note-article-title">
                                {note.metadata.title}
                            </h1>
                            <time className="text-caption text-[var(--color-ink-muted)] mt-4 block note-article-date">
                                {formattedDate}
                            </time>
                        </header>
                    </div>
                </div>
            </section>

            <section className="section pt-12 note-detail-body">
                <div className="container-prose note-article-shell">
                    <article>
                        <div className="text-body-lg note-article-content">
                            <MDXRemote source={note.content} components={mdxComponents} />
                        </div>

                        <NoteSignOff className="note-signoff" />

                        {(prev || next) && (
                            <nav className="mt-12 pt-8 border-t border-[var(--color-border)] note-adjacent-nav">
                                <div
                                    className={cn(
                                        "flex justify-between items-start gap-8 note-adjacent-grid",
                                        ((prev && !next) || (!prev && next)) && "note-adjacent-grid-single"
                                    )}
                                >
                                    {prev && (
                                        <Link
                                            href={`/notes/${prev.slug}`}
                                            className="group block flex-1 note-adjacent-card"
                                        >
                                            <span className="text-caption text-[var(--color-ink-muted)] flex items-center gap-2 mb-2 note-adjacent-label">
                                                <ArrowIcon direction="left" />
                                                Previous
                                            </span>
                                            <span className="text-body font-medium text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors note-adjacent-title">
                                                {prev.title}
                                            </span>
                                        </Link>
                                    )}

                                    {next && (
                                        <Link
                                            href={`/notes/${next.slug}`}
                                            className={cn(
                                                "group block flex-1 note-adjacent-card",
                                                prev ? "note-adjacent-card-end" : ""
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    "text-caption text-[var(--color-ink-muted)] flex items-center gap-2 mb-2",
                                                    prev ? "justify-end" : "",
                                                    "note-adjacent-label"
                                                )}
                                            >
                                                Next
                                                <ArrowIcon />
                                            </span>
                                            <span
                                                className={cn(
                                                    "text-body font-medium text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors",
                                                    prev ? "text-right" : "",
                                                    "note-adjacent-title"
                                                )}
                                            >
                                                {next.title}
                                            </span>
                                        </Link>
                                    )}
                                </div>
                            </nav>
                        )}
                    </article>
                </div>
            </section>
        </>
    );
}
