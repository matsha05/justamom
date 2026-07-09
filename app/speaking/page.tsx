import type { Metadata } from "next";
import Image from "next/image";
import { ArrowIcon } from "@/components/icons/ArrowIcon";
import { PageHero } from "@/components/layout/PageHero";
import { SpeakingInquiryForm } from "@/components/SpeakingInquiryForm";
import { TrackedLink } from "@/components/TrackedLink";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
import { buildPageMetadata } from "@/lib/metadata";
import { marketingContent } from "@/content/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Speaking Topics",
  description: marketingContent.speaking.metadataDescription,
  pathname: "/speaking",
});

export default function SpeakingPage() {
  const { speaking } = marketingContent;

  return (
    <>
      <PageHero
        eyebrow={speaking.hero.eyebrow}
        title={speaking.hero.heading}
        description={speaking.hero.description}
        density="compact"
        media={
          <div className="mx-auto w-[min(270px,70vw)] lg:ml-auto lg:mr-0">
            <div className="image-editorial aspect-[4/5] relative">
              <Image
                src="/images/lizi-solo-portrait.avif"
                alt="Lizi Shaw smiling in a cream sweater"
                fill
                className="object-cover"
                priority
                sizes="(min-width: 1024px) 280px, 70vw"
              />
            </div>
          </div>
        }
      >
        <Button asChild>
          <TrackedLink
            href={speaking.hero.cta.href}
            eventName={speaking.hero.cta.eventName}
            eventProperties={speaking.hero.cta.eventProperties}
          >
            {speaking.hero.cta.label}
            <ArrowIcon />
          </TrackedLink>
        </Button>
      </PageHero>

      <section className="section section-content">
        <div className="container">
          <div className="section-split">
            <div className="space-y-4">
              <p className="text-label">{speaking.topics.eyebrow}</p>
              <h2 className="text-h2">{speaking.topics.heading}</h2>
              <p className="text-body text-[var(--color-ink-soft)]">
                {speaking.topics.description}
              </p>
            </div>
            <div className="space-y-8">
              {speaking.topics.items.map((topic) => (
                <div key={topic.title} className="topic-card">
                  <h3 className="text-h3 mb-2">{topic.title}</h3>
                  <p className="text-body">{topic.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container-prose container-prose-followup space-y-4">
          <p className="text-label">{speaking.bio.eyebrow}</p>
          <p className="text-caption text-[var(--color-ink-muted)]">
            {speaking.bio.description}
          </p>
          <p className="text-body-lg text-[var(--color-ink-soft)]">
            {speaking.bio.body}
          </p>
        </div>
      </section>

      <section className="section section-content section-soft" id="book">
        <div className="container">
          <div className="max-w-3xl mx-auto space-y-10">
            <p className="text-label">{speaking.inquiry.eyebrow}</p>
            <h2 className="text-h2">{speaking.inquiry.heading}</h2>
            <p className="text-body text-[var(--color-ink-soft)]">
              {speaking.inquiry.description}
            </p>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="inline-block text-body-lg text-[var(--color-ink)] underline underline-offset-4"
            >
              {siteConfig.contact.email}
            </a>
            <p className="text-body text-[var(--color-ink-soft)]">
              {speaking.inquiry.followUp}
            </p>
            <div className="pt-8 border-t border-[var(--color-border)]">
              <SpeakingInquiryForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
