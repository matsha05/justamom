import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllNoteSlugs, getNoteBySlug } from "@/lib/notes";
import { NewsletterCTA } from "@/components/NewsletterCTA";
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
            className="my-10 py-8 px-8 bg-[var(--color-paper-warm)] border-l-4 border-[var(--color-accent)] rounded-r-lg"
            {...props}
        >
            <div className="text-h4 italic text-[var(--color-ink-soft)] leading-relaxed">
                {children}
            </div>
        </blockquote>
    ),
};

export default async function NotePage({ params }: PageProps) {
    const { slug } = await params;

    let note;
    try {
        note = getNoteBySlug(slug);
    } catch {
        notFound();
    }

    const formattedDate = new Date(note.metadata.date).toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
        }
    );

    return (
        <>
            {/* Hero */}
            <section className="section bg-[var(--color-paper-warm)]">
                <div className="container">
                    <div className="max-w-2xl mx-auto">
                        {/* Back link */}
                        <Link
                            href="/notes"
                            className="text-caption text-[var(--color-ink-muted)] hover:text-[var(--color-accent)] transition-colors inline-flex items-center gap-2 mb-10 animate-fade-in"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                            All Notes
                        </Link>

                        {/* Header */}
                        <header className="animate-fade-in" style={{ animationDelay: "75ms" }}>
                            <time className="text-label block mb-4">
                                {formattedDate}
                            </time>
                            <h1 className="text-display">{note.metadata.title}</h1>
                        </header>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="section">
                <div className="container">
                    <article className="max-w-2xl mx-auto">
                        {/* Article body */}
                        <div className="text-body-lg text-[var(--color-ink)] animate-fade-in" style={{ animationDelay: "150ms" }}>
                            <MDXRemote source={note.content} components={mdxComponents} />
                        </div>

                        {/* Sign-off */}
                        <footer className="mt-16 pt-8 border-t border-[var(--color-border)] animate-fade-in" style={{ animationDelay: "225ms" }}>
                            <p className="text-h4 italic text-[var(--color-ink-soft)]">
                                In it with you,
                            </p>
                            <p className="text-h3 mt-2 font-medium">
                                Lizi
                            </p>
                        </footer>
                    </article>
                </div>
            </section>

            {/* Newsletter CTA */}
            <NewsletterCTA />
        </>
    );
}
