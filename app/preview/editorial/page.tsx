import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { getAllNotes } from "@/lib/notes";
import { PreviewShell } from "@/components/PreviewShell";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ArrowIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Editorial Preview",
  robots: {
    index: false,
    follow: false,
  },
};

const currentWorkSummary =
  "A long-form project on motherhood, identity, and the steadier place where worth is received before it is performed.";

const currentWorkExcerpt =
  "Just a mom. It’s wild how a three-word sentence can feel both true and entirely wrong at the same time. How it can shrink something as monumental as raising a human into something that feels small and slightly apologetic. As if caring for an image-bearer of God is somehow insignificant unless you add a title or a paycheck or something more \"productive\" to go with it.";

const speakingHighlights = [
  {
    title: "Identity in the Noise",
    description:
      "A steadying look at the cultural pressure points shaping modern motherhood—and how to live from a secure identity instead of performance.",
  },
  {
    title: "Finding God in the Ordinary",
    description:
      "A reflective message about the sacred weight of everyday motherhood and the quiet faithfulness that carries it.",
  },
  {
    title: "A Calling, Not a Consequence",
    description:
      "A biblical reframe that restores dignity to motherhood without diminishing calling, gifts, or work outside the home.",
  },
];

export default function EditorialPreviewPage() {
  const notes = getAllNotes();
  const highlightSlugs = [
    "the-better-thing",
    "a-different-kind-of-new-year",
    "praise-is-the-work",
  ];
  const selectedNotes = highlightSlugs
    .map((slug) => notes.find((note) => note.slug === slug))
    .filter((note): note is (typeof notes)[number] => Boolean(note));
  const fallbackNotes = notes.slice(0, 3);
  const writingNotes = selectedNotes.length > 0 ? selectedNotes : fallbackNotes;

  return (
    <PreviewShell>
      <div className="preview-editorial min-h-screen text-[var(--color-ink)] bg-[var(--color-paper)]">
        <header className="border-b border-[var(--color-border)]">
          <div className="container py-12 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <p className="text-label text-[var(--color-ink-muted)]">Lizi Shaw</p>
              <p className="text-caption text-[var(--color-ink-muted)]">
                Speaker · Writer · Encourager
              </p>
            </div>
            <nav className="flex flex-wrap gap-5 md:gap-8 text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-muted)] md:text-[11px] md:tracking-[0.2em]">
              <a className="hover:text-[var(--color-ink)]" href="#notes">
                Notes
              </a>
              <a className="hover:text-[var(--color-ink)]" href="#work">
                Work
              </a>
              <a className="hover:text-[var(--color-ink)]" href="#about">
                About
              </a>
              <a className="hover:text-[var(--color-ink)]" href="#speaking">
                Speaking
              </a>
              <a className="hover:text-[var(--color-ink)]" href="#contact">
                Contact
              </a>
            </nav>
          </div>
        </header>

        <main>
          <section className="section">
            <div className="container">
              <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                <div className="space-y-6">
                  <p className="text-label text-[var(--color-ink-muted)]">
                    Speaker · Writer · Encourager
                  </p>
                  <h1 className="text-display">A Note for Moms.</h1>
                  <p className="text-body-lg text-[var(--color-ink-soft)]">
                    A small, steady reminder for mothers who feel the noise. Twice a
                    month. No spam. Just the note.
                  </p>
                  <div className="flex flex-wrap gap-6">
                    <Link
                      className="inline-flex items-center gap-2 border border-[var(--color-ink)] bg-[var(--color-paper-warm)] px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)]"
                      href="#contact"
                    >
                      Join A Note for Moms
                      <ArrowIcon />
                    </Link>
                    <Link className="link-arrow" href="#notes">
                      Read a note
                      <ArrowIcon />
                    </Link>
                  </div>
                </div>
                <div className="flex justify-center lg:justify-end">
                  <div className="image-editorial aspect-[3/4] relative w-[min(320px,80vw)] lg:w-[360px]">
                    <Image
                      src="/images/aboutmepic.avif"
                      alt="Lizi Shaw"
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 360px, 80vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="notes" className="section section-warm">
            <div className="container">
              <div className="grid gap-14 lg:grid-cols-[1fr_2fr] lg:gap-16">
                <div className="space-y-4">
                  <p className="text-label text-[var(--color-ink-muted)]">
                    Notes for Moms
                  </p>
                  <h1 className="text-h1">A Note for Moms</h1>
                  <p className="text-body text-[var(--color-ink-soft)]">
                    A small, steady reminder for mothers who feel the noise. Twice a
                    month. No spam. Just the note.
                  </p>
                </div>
                <div className="divide-y divide-[var(--color-border)]">
                  {writingNotes.map((note) => {
                    const formattedDate = format(
                      parseISO(note.date),
                      "MMMM d, yyyy"
                    );
                    return (
                      <article key={note.slug} className="py-10 first:pt-0">
                        <div className="text-caption text-[var(--color-ink-faint)] mb-3">
                          {formattedDate}
                        </div>
                        <h3 className="text-h3 mb-3">
                          <Link
                            href={`/notes/${note.slug}`}
                            className="hover:text-[var(--color-accent)] transition-colors"
                          >
                            {note.title}
                          </Link>
                        </h3>
                        <p className="text-body text-[var(--color-ink-muted)] mb-4">
                          {note.excerpt}
                        </p>
                        <Link className="link-arrow" href={`/notes/${note.slug}`}>
                          Read
                          <ArrowIcon />
                        </Link>
                      </article>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section id="work" className="section section-soft">
            <div className="container">
              <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
                <div className="space-y-6">
                  <p className="text-label text-[var(--color-ink-muted)]">
                    Current Work
                  </p>
                  <h2 className="text-h1">Just a Mom</h2>
                  <p className="text-body-lg text-[var(--color-ink-soft)]">
                    {currentWorkSummary}
                  </p>
                  <div className="flex flex-wrap gap-6">
                    <Link className="link-arrow" href="/work">
                      Read about the project
                      <ArrowIcon />
                    </Link>
                    <Link className="link-arrow" href="#about">
                      About Lizi
                      <ArrowIcon />
                    </Link>
                  </div>
                </div>
                <div className="border-l border-[var(--color-border-strong)] pl-6 lg:pl-10">
                  <p className="text-body-lg text-[var(--color-ink)] leading-relaxed">
                    {currentWorkExcerpt}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="about" className="section">
            <div className="container-prose space-y-4">
              <p className="text-label text-[var(--color-ink-muted)]">About</p>
              <h2 className="text-h2">Lizi Shaw</h2>
              <p className="text-body text-[var(--color-ink-soft)]">
                Lizi writes about the quiet work of motherhood and the steadier
                identity God offers when performance wears us thin. She lives in
                Niwot, Colorado with her husband and three children.
              </p>
              <Link className="link-arrow" href="/about">
                Read more
                <ArrowIcon />
              </Link>
            </div>
          </section>

          <section
            id="speaking"
            className="section pt-[clamp(7rem,13vw,12rem)]"
          >
            <div className="container">
              <div className="grid gap-14 lg:grid-cols-[1fr_2fr] lg:gap-16">
                <div className="space-y-4">
                  <p className="text-label text-[var(--color-ink-muted)]">
                    Speaking
                  </p>
                  <h2 className="text-h1">Selected topics</h2>
                  <p className="text-body text-[var(--color-ink-soft)]">
                    For churches, retreats, and women’s gatherings seeking biblical
                    encouragement with clear, grounded theology and practical care.
                  </p>
                  <p className="text-body text-[var(--color-ink-muted)]">
                    This is for leaders who want thoughtful, grounded teaching rather
                    than hype.
                  </p>
                </div>
                <div className="space-y-8">
                  {speakingHighlights.map((topic) => (
                    <div
                      key={topic.title}
                      className="border-l border-[var(--color-border-strong)] pl-6"
                    >
                      <h3 className="text-h3 mb-2">{topic.title}</h3>
                      <p className="text-body text-[var(--color-ink-muted)]">
                        {topic.description}
                      </p>
                    </div>
                  ))}
                  <div className="preview-rule" />
                  <Link className="link-arrow" href="/speaking">
                    View speaking page
                    <ArrowIcon />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section id="contact" className="section section-soft">
            <div className="container">
              <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
                <div className="space-y-4">
                  <p className="text-label text-[var(--color-ink-muted)]">Contact</p>
                  <h2 className="text-h2">Inquiries</h2>
                  <p className="text-body text-[var(--color-ink-soft)]">
                    For literary, editorial, or speaking inquiries, email directly:
                  </p>
                  <a
                    href="mailto:hello@lizishaw.com"
                    className="text-body-lg text-[var(--color-ink)] underline underline-offset-4"
                  >
                    hello@lizishaw.com
                  </a>
                </div>
                <div className="space-y-4 lg:border-l lg:border-[var(--color-border)] lg:pl-10">
              <p className="text-label text-[var(--color-ink-muted)]">
                Notes by email
              </p>
              <h3 className="text-h3">A Note for Moms, twice a month.</h3>
                  <p className="text-body text-[var(--color-ink-muted)]">
                    A small, steady reminder for mothers who feel the noise. Twice a
                    month. No spam. Just the note.
                  </p>
                  <NewsletterForm variant="compact" />
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </PreviewShell>
  );
}
