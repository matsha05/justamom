import Link from "next/link";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { getAllNotes } from "@/lib/notes";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ArrowIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";

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

export default function HomePage() {
  const notes = getAllNotes();
  const highlightSlugs = [
    "dog-encounters",
    "the-better-thing",
    "a-different-kind-of-new-year",
  ];
  const selectedNotes = highlightSlugs
    .map((slug) => notes.find((note) => note.slug === slug))
    .filter((note): note is (typeof notes)[number] => Boolean(note));
  const fallbackNotes = notes.slice(0, 3);
  const writingNotes = selectedNotes.length > 0 ? selectedNotes : fallbackNotes;

  return (
    <>
      <section className="section">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-label">Speaker · Writer · Encourager</p>
              <h1 className="text-display">A Note for Moms.</h1>
              <p className="text-body-lg text-[var(--color-ink-soft)]">
                A small, steady reminder for mothers who feel the noise.
              </p>
              <div className="flex flex-wrap gap-6 pt-2">
                <Button asChild>
                  <Link href="#newsletter">
                    Join A Note for Moms
                    <ArrowIcon />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="image-editorial aspect-[3/4] relative w-[min(320px,80vw)] lg:w-[360px]">
                <Image
                  src="/images/aboutmepic.avif"
                  alt="Lizi Shaw"
                  fill
                  className="object-cover"
                  priority
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
              <p className="text-label">Notes for Moms</p>
              <h2 className="text-h1">A Note for Moms</h2>
              <p className="text-body text-[var(--color-ink-soft)]">
                Short notes for mothers, sent twice a month.
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
                    <h2 className="text-h3 mb-3">
                      <Link
                        href={`/notes/${note.slug}`}
                        className="hover:text-[var(--color-accent)] transition-colors"
                      >
                        {note.title}
                      </Link>
                    </h2>
                    <p className="text-body mb-4">
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

      <section id="newsletter" className="section">
        <div className="container-prose text-center space-y-4">
          <p className="text-label">Join the notes</p>
          <h2 className="text-h2">A Note for Moms, twice a month.</h2>
          <p className="text-body">
            Twice a month. No spam. Just the note.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterForm variant="compact" />
          </div>
        </div>
      </section>

      <section id="work" className="section section-soft">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="space-y-6">
              <p className="text-label">Current Work</p>
              <h2 className="text-h1">Just a Mom</h2>
              <p className="text-body-lg text-[var(--color-ink-soft)]">
                {currentWorkSummary}
              </p>
              <div className="flex flex-wrap gap-6">
                <Link className="link-arrow" href="/work">
                  Read about the project
                  <ArrowIcon />
                </Link>
                <Link className="link-arrow" href="/about">
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

      <section
        id="speaking"
        className="section pt-[clamp(7rem,13vw,12rem)]"
      >
        <div className="container">
          <div className="grid gap-14 lg:grid-cols-[1fr_2fr] lg:gap-16">
            <div className="space-y-4">
              <p className="text-label">Speaking</p>
              <h2 className="text-h1">Selected topics</h2>
              <p className="text-body text-[var(--color-ink-soft)]">
                For churches, retreats, and women’s gatherings seeking biblical
                encouragement with clear, grounded theology and practical care.
              </p>
              <p className="text-body">
                This is for leaders who want thoughtful, grounded teaching rather than
                hype.
              </p>
            </div>
            <div className="space-y-8">
              {speakingHighlights.map((topic) => (
                <div
                  key={topic.title}
                  className="border-l border-[var(--color-border-strong)] pl-6"
                >
                  <h3 className="text-h3 mb-2">{topic.title}</h3>
                  <p className="text-body">
                    {topic.description}
                  </p>
                </div>
              ))}
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
            <div className="space-y-4 lg:col-span-2 lg:max-w-2xl">
              <p className="text-label">Contact</p>
              <h2 className="text-h2">Inquiries</h2>
              <p className="text-body text-[var(--color-ink-soft)]">
                For literary, editorial, or speaking inquiries, email directly:
              </p>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-body-lg text-[var(--color-ink)] underline underline-offset-4"
              >
                {siteConfig.contact.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
