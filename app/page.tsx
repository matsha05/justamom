import Link from "next/link";
import Image from "next/image";
import { getAllNotes } from "@/lib/notes";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ArrowIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { newsletterCtaCopy, speakingTopics } from "@/lib/content";
import { NotesFeed } from "@/components/notes/NotesFeed";

const currentWorkExcerpt =
  "Just a mom. It’s wild how a three-word sentence can feel both true and entirely wrong at the same time. How it can shrink something as monumental as raising a human into something that feels small and slightly apologetic. As if caring for an image-bearer of God is somehow insignificant unless you add a title or a paycheck or something more \"productive\" to go with it.";

export default function HomePage() {
  const notes = getAllNotes();

  return (
    <>
      <section className="section section-hero pt-[clamp(3.75rem,8vw,6.75rem)]">
        <div className="container">
          <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-7">
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
                  className="w-[110px] h-[100px] opacity-85"
                  sizes="110px"
                />
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="hero-portrait-shell w-[min(340px,82vw)] lg:w-[390px]">
                <div className="image-editorial aspect-[3/4] relative">
                  <Image
                    src="/images/aboutmepic.avif"
                    alt="Lizi Shaw standing outdoors with her husband"
                    fill
                    className="object-cover"
                    priority
                    sizes="(min-width: 1280px) 390px, (min-width: 1024px) 34vw, (min-width: 640px) 44vw, 82vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="work" className="section section-soft">
        <div className="container-prose space-y-8">
          <p className="text-label">Current Work</p>
          <h2 className="text-h1">Just a Mom</h2>
          <div className="feature-quote">
            <p className="text-body-lg text-[var(--color-ink)] leading-relaxed">
              {currentWorkExcerpt}
            </p>
          </div>
          <Link className="link-arrow" href="/work">
            Read about the project
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <section id="notes" className="section section-warm">
        <div className="container">
          <div className="section-split">
            <div className="space-y-4">
              <p className="text-label">Latest Notes</p>
              <h2 className="text-h1">For the mom in the thick of it</h2>
              <Link className="link-arrow" href="/notes">
                Read all notes
                <ArrowIcon />
              </Link>
            </div>
            <NotesFeed notes={notes} maxSupportingNotes={2} />
          </div>
        </div>
      </section>

      <section id="speaking" className="section">
        <div className="container">
          <div className="section-split">
            <div className="space-y-4">
              <p className="text-label">Speaking</p>
              <h2 className="text-h1">Topics I often share</h2>
              <p className="text-body text-[var(--color-ink-soft)]">
                For churches, retreats, and women&apos;s gatherings. Messages rooted
                in Scripture and shaped by ordinary life.
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

      <section id="newsletter" className="section section-newsletter">
        <div className="container-prose">
          <div className="newsletter-panel text-center space-y-4">
            <p className="text-label">Newsletter</p>
            <h2 className="text-h2">{newsletterCtaCopy.heading}</h2>
            <p className="text-body mx-auto max-w-[34ch]">{newsletterCtaCopy.description}</p>
            <div className="max-w-md mx-auto">
              <NewsletterForm variant="compact" />
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="section section-soft">
        <div className="container-prose space-y-4">
          <p className="text-label">Contact</p>
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
      </section>
    </>
  );
}
