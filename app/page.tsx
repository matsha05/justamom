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

      <section className="section section-soft">
        <div className="container-prose space-y-8">
          <div className="space-y-3">
            <p className="text-label">{home.more.eyebrow}</p>
            <h2 className="text-h2">{home.more.heading}</h2>
          </div>

          <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            <Link
              href={home.work.cta.href}
              className="group block py-6 md:flex md:items-start md:justify-between md:gap-8"
            >
              <div className="space-y-2">
                <h3 className="text-h3">{home.work.heading}</h3>
                <p className="text-body text-[var(--color-ink-soft)] max-w-[34ch]">
                  {home.work.description}
                </p>
              </div>
              <span className="link-arrow mt-3 md:mt-1">
                {home.work.cta.label}
                <ArrowIcon />
              </span>
            </Link>

            <TrackedLink
              href={home.speaking.cta.href}
              eventName={home.speaking.cta.eventName}
              eventProperties={home.speaking.cta.eventProperties}
              className="group block py-6 md:flex md:items-start md:justify-between md:gap-8"
            >
              <div className="space-y-2">
                <h3 className="text-h3">{home.speaking.heading}</h3>
                <p className="text-body text-[var(--color-ink-soft)] max-w-[34ch]">
                  {home.speaking.description}
                </p>
              </div>
              <span className="link-arrow mt-3 md:mt-1">
                {home.speaking.cta.label}
                <ArrowIcon />
              </span>
            </TrackedLink>

            <Link
              href="/contact"
              className="group block py-6 md:flex md:items-start md:justify-between md:gap-8"
            >
              <div className="space-y-2">
                <h3 className="text-h3">{home.contact.heading}</h3>
                <p className="text-body text-[var(--color-ink-soft)] max-w-[34ch]">
                  {home.contact.description}
                </p>
              </div>
              <span className="link-arrow mt-3 md:mt-1">
                Send a message
                <ArrowIcon />
              </span>
            </Link>
          </div>

          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="inline-block text-body text-[var(--color-ink-soft)] underline underline-offset-4"
          >
            {siteConfig.contact.email}
          </a>
        </div>
      </section>
    </>
  );
}
