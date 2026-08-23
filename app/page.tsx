import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllNotes } from "@/lib/notes";
import { ArrowIcon } from "@/components/icons/ArrowIcon";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { buildPageMetadata } from "@/lib/metadata";
import { marketingContent } from "@/content/site";
import { NotesFeed } from "@/components/notes/NotesFeed";
import { TrackedLink } from "@/components/TrackedLink";
import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata: Metadata = buildPageMetadata({
  title: siteConfig.site.name,
  description: siteConfig.content.seoDescription,
  pathname: "/",
});

export default function HomePage() {
  const notes = getAllNotes();
  const { home, newsletter } = marketingContent;

  return (
    <>
      <section className="section section-hero py-[clamp(3.25rem,7vw,5.75rem)]">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,24rem)] lg:gap-[clamp(4rem,8vw,7rem)]">
            <div className="max-w-[39rem] space-y-7">
              <p className="text-label">Welcome</p>
              <h1 className="text-display max-w-[12ch]">{home.hero.heading}</h1>
              <p className="text-body-lg max-w-[37ch] text-[var(--color-ink-soft)]">
                {home.hero.description}
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button asChild>
                  <Link href={home.hero.primaryCta.href}>
                    {home.hero.primaryCta.label}
                    <ArrowIcon />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href={home.hero.secondaryCta.href}>
                    {home.hero.secondaryCta.label}
                    <ArrowIcon />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hero-portrait-shell mx-auto w-[min(100%,24rem)] lg:ml-auto lg:mr-0">
              <div className="image-editorial relative aspect-[4/5] sm:aspect-[3/4]">
                <Image
                  src="/images/home-lizi-poles.avif"
                  alt="Lizi Shaw smiling on a mountain trail and holding up her hiking poles"
                  fill
                  className="object-cover"
                  priority
                  sizes="(min-width: 1024px) 384px, (min-width: 640px) 384px, 88vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="notes" className="section section-compact section-warm">
        <div className="container">
          <div className="section-split">
            <div className="space-y-4">
              <p className="text-label">{home.notes.eyebrow}</p>
              <h2 className="text-h1">{home.notes.heading}</h2>
              <p className="text-body text-[var(--color-ink-soft)] max-w-[28ch]">
                {home.notes.description}
              </p>
            </div>
            <div className="space-y-8">
              <NotesFeed notes={notes} maxSupportingNotes={2} />
              <Link className="link-arrow" href={home.notes.cta.href}>
                {home.notes.cta.label}
                <ArrowIcon />
              </Link>
            </div>
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
              <NewsletterForm source={newsletter.homePanel.source} />
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
        <div className="container">
          <div className="grid border-y border-[var(--color-border-strong)] lg:grid-cols-[1.2fr_0.8fr]">
            <TrackedLink
              href={home.speaking.cta.href}
              eventName={home.speaking.cta.eventName}
              eventProperties={home.speaking.cta.eventProperties}
              className="group block py-9 pr-0 lg:py-11 lg:pr-14"
            >
              <div className="space-y-3">
                <p className="text-label">Speaking</p>
                <h2 className="text-h2">{home.speaking.heading}</h2>
                <p className="text-body text-[var(--color-ink-soft)] max-w-[34ch]">
                  {home.speaking.description}
                </p>
              </div>
              <span className="link-arrow mt-5">
                {home.speaking.cta.label}
                <ArrowIcon />
              </span>
            </TrackedLink>

            <div className="border-t border-[var(--color-border)] py-9 lg:border-l lg:border-t-0 lg:py-11 lg:pl-14">
              <div className="space-y-3">
                <p className="text-label">Contact</p>
                <h2 className="text-h3">{home.contact.heading}</h2>
                <p className="text-body text-[var(--color-ink-soft)] max-w-[34ch]">
                  {home.contact.description}
                </p>
              </div>
              <Link href="/contact" className="link-arrow mt-5">
                Send a message
                <ArrowIcon />
              </Link>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="mt-4 block text-caption text-[var(--color-ink-muted)] underline underline-offset-4"
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
