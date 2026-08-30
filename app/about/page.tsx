import type { Metadata } from "next";
import Image from "next/image";
import { Fragment } from "react";
import { ArrowIcon } from "@/components/icons/ArrowIcon";
import { buildPageMetadata } from "@/lib/metadata";
import { marketingContent } from "@/content/site";
import { TrackedLink } from "@/components/TrackedLink";

export const metadata: Metadata = buildPageMetadata({
    title: "About Me",
    description: marketingContent.about.metadataDescription,
    pathname: "/about",
});

export default function AboutPage() {
    const { about } = marketingContent;

    return (
        <section className="section section-warm about-editorial-section">
            <div className="container">
                <div className="about-editorial-grid">
                    <div className="about-copy-column">
                        <p className="text-label mb-6">{about.hero.eyebrow}</p>
                        <h1 className="text-display mb-10">{about.hero.heading}</h1>

                        <div className="prose text-body-lg text-[var(--color-ink-soft)]">
                            {about.hero.paragraphs.map((paragraph, index) => (
                                <Fragment key={paragraph.slice(0, 32)}>
                                    <p>{paragraph}</p>
                                    {index === 0 ? (
                                        <div
                                            className="about-photo-frame about-photo-frame-lead about-photo-frame-lead-flow"
                                            data-about-lead-photo="responsive"
                                        >
                                            <Image
                                                src="/images/about-lizi-three-kids.avif"
                                                alt="Lizi smiling outdoors with her three children"
                                                fill
                                                priority
                                                className="object-cover"
                                                sizes="(min-width: 1280px) 360px, (min-width: 960px) 34vw, calc(100vw - 3rem)"
                                            />
                                        </div>
                                    ) : null}
                                </Fragment>
                            ))}
                        </div>

                        <div className="about-facts">
                            <h2 className="text-h3 mb-5">{about.facts.heading}</h2>
                            <ul className="space-y-3 pl-5 text-body text-[var(--color-ink-soft)] marker:text-[var(--color-accent)] list-disc">
                                {about.facts.items.map((fact) => (
                                    <li key={fact}>{fact}</li>
                                ))}
                            </ul>
                        </div>

                    </div>

                    <aside className="about-photo-rail" aria-label="Photos from Lizi's life">
                        <div className="about-photo-pair">
                            <div className="about-photo-frame about-photo-frame-portrait">
                                <Image
                                    src="/images/about-lizi-kids-hug.avif"
                                    alt="Lizi laughing as two of her children hug her outside"
                                    fill
                                    className="object-cover"
                                    sizes="(min-width: 960px) 165px, 44vw"
                                />
                            </div>

                            <div className="about-photo-frame about-photo-frame-portrait">
                                <Image
                                    src="/images/about-lizi-rainbow.avif"
                                    alt="Lizi and Matt smiling together beneath a rainbow"
                                    fill
                                    className="object-cover"
                                    sizes="(min-width: 960px) 165px, 44vw"
                                />
                            </div>
                        </div>

                        <div className="about-photo-frame about-photo-frame-landscape">
                            <Image
                                src="/images/about-lizi-kids-picnic.avif"
                                alt="Lizi sitting on a picnic blanket with her three children at an outdoor concert"
                                fill
                                className="object-cover"
                                sizes="(min-width: 960px) 340px, 92vw"
                            />
                        </div>
                    </aside>

                    <div className="about-invitation">
                        <div className="space-y-2">
                            <h2 className="text-h3">{about.invitation.heading}</h2>
                            <p className="text-body text-[var(--color-ink-soft)]">
                                {about.invitation.description}
                            </p>
                        </div>
                        <TrackedLink
                            className="link-arrow"
                            href={about.invitation.cta.href}
                            eventName={about.invitation.cta.eventName}
                            eventProperties={about.invitation.cta.eventProperties}
                        >
                            {about.invitation.cta.label}
                            <ArrowIcon />
                        </TrackedLink>
                    </div>
                </div>
            </div>
        </section>
    );
}
