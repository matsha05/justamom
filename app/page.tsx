import Link from "next/link";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { getAllNotes } from "@/lib/notes";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ArrowIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { newsletterCtaCopy, speakingTopics } from "@/lib/content";

const currentWorkSummary =
  "A long-form project on motherhood, identity, and the steadier place where worth is received before it is performed.";

const currentWorkExcerpt =
  "Just a mom. It’s wild how a three-word sentence can feel both true and entirely wrong at the same time. How it can shrink something as monumental as raising a human into something that feels small and slightly apologetic. As if caring for an image-bearer of God is somehow insignificant unless you add a title or a paycheck or something more \"productive\" to go with it.";

export default function HomePage() {
  const notes = getAllNotes();
  const featuredNote = notes[0] ?? null;
  const supportingNotes = notes.slice(1, 3);

  return (
    <>
      <section className="section section-hero pt-[clamp(5.5rem,11vw,9rem)]">
        <div className="container">
          <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-7">
              <p className="text-label">Speaker · Writer · Encourager</p>
              <h1 className="text-display max-w-[12ch]">A Note for Moms.</h1>
              <p className="text-body-lg max-w-[34ch] text-[var(--color-ink-soft)]">
                A steady reminder for moms who feel stretched between
                &quot;just a mom&quot; and &quot;do it all.&quot;
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button asChild>
                  <Link href="#newsletter">
                    Join A Note for Moms
                    <ArrowIcon />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/notes">
                    Read all notes
                    <ArrowIcon />
                  </Link>
                </Button>
              </div>
              <div className="mt-1" aria-hidden="true">
                <Image
                  src="/images/signature.png"
                  alt=""
                  width={110}
                  height={100}
                  className="opacity-85"
                  sizes="110px"
                />
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="hero-portrait-shell w-[min(340px,82vw)] lg:w-[390px]">
                <div className="image-editorial aspect-[3/4] relative">
                  <Image
                    src="/images/aboutmepic.avif"
                    alt="Lizi Shaw"
                    fill
                    className="object-cover"
                    priority
                    sizes="(min-width: 1024px) 390px, 82vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="notes" className="section section-warm">
        <div className="container">
          <div className="grid gap-14 lg:grid-cols-[1fr_2fr] lg:gap-16">
            <div className="space-y-4">
              <p className="text-label">Latest Notes</p>
              <h2 className="text-h1">For the mom in the thick of it</h2>
              <p className="text-body max-w-[36ch] text-[var(--color-ink-soft)]">
                A featured note and recent reflections for moms in the thick of
                ordinary days.
              </p>
              <Link className="link-arrow" href="/notes">
                Read all notes
                <ArrowIcon />
              </Link>
            </div>
            <div className="space-y-9">
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

              <div className="divide-y divide-[var(--color-border)]">
                {supportingNotes.map((note) => {
                  const formattedDate = format(parseISO(note.date), "MMMM d, yyyy");
                  return (
                    <article key={note.slug} className="group py-8 first:pt-0">
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
            </div>
          </div>
        </div>
      </section>

      <section id="newsletter" className="section section-newsletter">
        <div className="container-prose">
          <div className="newsletter-panel text-center space-y-4">
            <p className="text-label">Newsletter</p>
            <h2 className="text-h2">{newsletterCtaCopy.heading}</h2>
            <p className="text-body mx-auto max-w-[34ch]">{newsletterCtaCopy.description}</p>
            <div className="max-w-md mx-auto">
              <NewsletterForm variant="compact" />
            </div>
            <p className="text-caption text-[var(--color-ink-faint)]">
              A small, steady rhythm for busy moms.
            </p>
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
            <div className="feature-quote">
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
              <h2 className="text-h1">Topics I often share</h2>
              <p className="text-body text-[var(--color-ink-soft)]">
                For churches, retreats, and women&apos;s gatherings. Messages rooted
                in Scripture and shaped by ordinary life.
              </p>
              <p className="text-body">
                Simple, honest, practical. No hype.
              </p>
            </div>
            <div className="space-y-8">
              {speakingTopics.map((topic) => (
                <div
                  key={topic.title}
                  className="topic-card"
                >
                  <h3 className="text-h3 mb-2">{topic.title}</h3>
                  <p className="text-body">
                    {topic.description}
                  </p>
                </div>
              ))}
              <Link className="link-arrow" href="/speaking">
                Invite me to speak
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="section section-soft">
        <div className="container">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
            <div className="contact-panel space-y-4 lg:col-span-2 lg:max-w-2xl">
              <p className="text-label">Contact</p>
              <h2 className="text-h2">Get in touch</h2>
              <p className="text-body text-[var(--color-ink-soft)]">
                For literary, editorial, or speaking inquiries, email directly:
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-body-lg text-[var(--color-ink)] underline underline-offset-4"
                >
                  {siteConfig.contact.email}
                </a>
                <Button asChild variant="outline" size="sm">
                  <Link href="/contact">Send a message</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
