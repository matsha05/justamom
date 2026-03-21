import Link from "next/link";
import Image from "next/image";
import { getAllNotes } from "@/lib/notes";
import { ArrowIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { marketingContent } from "@/content/site";
import { NotesFeed } from "@/components/notes/NotesFeed";
import { TrackedLink } from "@/components/TrackedLink";
import { NewsletterForm } from "@/components/NewsletterForm";

export default function HomePage() {
  const notes = getAllNotes();
  const { home, newsletter } = marketingContent;

  return (
    <>
      <section className="section section-hero pt-[clamp(3.9rem,8.4vw,7.1rem)]">
        <div className="container">
          <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-7">
              <h1 className="text-display max-w-[11ch]">{home.hero.heading}</h1>
              <p className="text-body-lg max-w-[34ch] text-[var(--color-ink-soft)]">
                {home.hero.description}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button asChild>
                  <TrackedLink
                    href={home.hero.primaryCta.href}
                    eventName={home.hero.primaryCta.eventName}
                    eventProperties={home.hero.primaryCta.eventProperties}
                  >
                    {home.hero.primaryCta.label}
                    <ArrowIcon />
                  </TrackedLink>
                </Button>
                <Button asChild variant="outline">
                  <Link href={home.hero.secondaryCta.href}>
                    {home.hero.secondaryCta.label}
                    <ArrowIcon />
                  </Link>
                </Button>
              </div>
              <p className="text-caption text-[var(--color-ink-muted)]">
                {home.hero.trust}
              </p>
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

      <section id="notes" className="section section-warm">
        <div className="container">
          <div className="section-split">
            <div className="space-y-4">
              <p className="text-label">{home.notes.eyebrow}</p>
              <h2 className="text-h1">{home.notes.heading}</h2>
              <p className="text-body text-[var(--color-ink-soft)] max-w-[28ch]">
                {home.notes.description}
              </p>
              <Link className="link-arrow" href={home.notes.cta.href}>
                {home.notes.cta.label}
                <ArrowIcon />
              </Link>
            </div>
            <NotesFeed notes={notes} maxSupportingNotes={2} />
          </div>
        </div>
      </section>

      <section id="newsletter" className="section section-newsletter">
        <div className="container-prose">
          <div className="newsletter-panel newsletter-panel-delight text-center space-y-5">
            <p className="text-label">{newsletter.homePanel.eyebrow}</p>
            <h2 className="text-h2">{newsletter.homePanel.heading}</h2>
            <p className="text-body mx-auto max-w-[32ch]">
              {newsletter.homePanel.description}
            </p>
            <div className="max-w-md mx-auto">
              <NewsletterForm variant="compact" source={newsletter.homePanel.source} />
            </div>
            {newsletter.homePanel.trust ? (
              <p className="text-caption text-[var(--color-ink-muted)]">
                {newsletter.homePanel.trust}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section id="work" className="section section-soft">
        <div className="container-prose space-y-8">
          <p className="text-label">{home.work.eyebrow}</p>
          <h2 className="text-h1">{home.work.heading}</h2>
          <div className="feature-quote">
            <p className="text-body-lg text-[var(--color-ink)] leading-relaxed">
              {home.work.excerpt}
            </p>
          </div>
          <Link className="link-arrow" href={home.work.cta.href}>
            {home.work.cta.label}
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <section id="speaking" className="section">
        <div className="container">
          <div className="section-split">
            <div className="space-y-4">
              <p className="text-label">{home.speaking.eyebrow}</p>
              <h2 className="text-h1 max-w-[14ch]">{home.speaking.heading}</h2>
              <p className="text-body text-[var(--color-ink-soft)] max-w-[30ch]">
                {home.speaking.description}
              </p>
              <TrackedLink
                className="link-arrow"
                href={home.speaking.cta.href}
                eventName={home.speaking.cta.eventName}
                eventProperties={home.speaking.cta.eventProperties}
              >
                {home.speaking.cta.label}
                <ArrowIcon />
              </TrackedLink>
            </div>
            <div className="space-y-8">
              {marketingContent.speaking.topics.items.map((topic) => (
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
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="section section-soft">
        <div className="container-prose space-y-4">
          <p className="text-label">{home.contact.eyebrow}</p>
          <p className="text-body text-[var(--color-ink-soft)]">
            {home.contact.description}
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
