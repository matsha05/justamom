import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import { getAllNoteSlugs, getNoteBySlug, getAdjacentNotes } from "@/lib/notes";
import { NoteArticle } from "@/components/notes/NoteArticle";
import { absoluteUrl, siteConfig } from "@/lib/config";
import { serializeJsonLd } from "@/lib/json-ld";
import { buildArticleMetadata } from "@/lib/metadata";

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
    return buildArticleMetadata({
      title: note.metadata.title,
      description: note.metadata.excerpt,
      pathname: `/notes/${slug}`,
      publishedTime: note.metadata.date,
    });
  } catch {
    return {
      title: "Note Not Found",
    };
  }
}

export default async function NotePage({ params }: PageProps) {
  const { slug } = await params;

  let note: ReturnType<typeof getNoteBySlug> | null = null;
  try {
    note = getNoteBySlug(slug);
  } catch {
    note = null;
  }

  if (!note) {
    notFound();
  }

  const formattedDate = format(parseISO(note.metadata.date), "MMMM d, yyyy");

  const { prev, next } = getAdjacentNotes(slug);

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
      <script type="application/ld+json">{serializeJsonLd(articleJsonLd)}</script>

      <section className="section section-warm pb-10 note-detail-hero">
        <div className="container-prose note-article-shell">
          <Link
            href="/notes"
            className="note-back-link mb-6 inline-flex items-center gap-2 text-caption text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-accent)]"
          >
            <svg
              className="size-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            All Notes
          </Link>

          <header>
            <h1 className="text-display note-article-title">{note.metadata.title}</h1>
            <time className="note-article-date mt-4 block text-caption text-[var(--color-ink-muted)]">
              {formattedDate}
            </time>
          </header>
        </div>
      </section>

      <section className="section pt-12 note-detail-body">
        <div className="container-prose note-article-shell">
          <NoteArticle
            content={note.content}
            postscript={note.postscript}
            previousNote={prev}
            nextNote={next}
          />
        </div>
      </section>
    </>
  );
}
