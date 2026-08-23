import Link from "next/link";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import { NoteArticle } from "@/components/notes/NoteArticle";
import { absoluteUrl, siteConfig } from "@/lib/config";
import { serializeJsonLd } from "@/lib/json-ld";
import {
  getAdjacentWriting,
  getNoteBySlug,
  getWritingBasePath,
  getWritingHref,
  type WritingKind,
} from "@/lib/notes";

interface WritingDetailPageProps {
  slug: string;
  kind: WritingKind;
}

export function WritingDetailPage({ slug, kind }: WritingDetailPageProps) {
  let writing: ReturnType<typeof getNoteBySlug> | null = null;

  try {
    const entry = getNoteBySlug(slug);
    writing = entry.metadata.kind === kind ? entry : null;
  } catch {
    writing = null;
  }

  if (!writing) {
    notFound();
  }

  const formattedDate = format(parseISO(writing.metadata.date), "MMMM d, yyyy");
  const { prev, next } = getAdjacentWriting(slug, kind);
  const pathname = getWritingHref({ slug, kind });
  const archiveLabel = kind === "note" ? "All notes" : "All blog posts";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: writing.metadata.title,
    description: writing.metadata.excerpt,
    datePublished: writing.metadata.date,
    dateModified: writing.metadata.date,
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
      "@id": absoluteUrl(pathname),
    },
  };

  return (
    <>
      <script type="application/ld+json">{serializeJsonLd(articleJsonLd)}</script>

      <section className="section section-warm pb-10 note-detail-hero">
        <div className="container-prose note-article-shell">
          <Link
            href={getWritingBasePath(kind)}
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
            {archiveLabel}
          </Link>

          <header>
            <h1 className="text-display note-article-title">{writing.metadata.title}</h1>
            <time className="note-article-date mt-4 block text-caption text-[var(--color-ink-muted)]">
              {formattedDate}
            </time>
          </header>
        </div>
      </section>

      <section className="section pt-12 note-detail-body">
        <div className="container-prose note-article-shell">
          <NoteArticle
            content={writing.content}
            postscript={writing.postscript}
            kind={writing.metadata.kind}
            previousNote={prev}
            nextNote={next}
          />
        </div>
      </section>
    </>
  );
}
