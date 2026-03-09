import type { Metadata } from "next";
import Image from "next/image";
import { ArrowIcon } from "@/components/icons";
import { marketingContent } from "@/content/site";
import { TrackedLink } from "@/components/TrackedLink";

export const metadata: Metadata = {
    title: "About Me",
    description: marketingContent.about.metadataDescription,
};

export default function AboutPage() {
    const { about } = marketingContent;

    return (
        <>
            {/* Hero Section */}
            <section className="section section-warm">
                <div className="container">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
                        {/* Photo */}
                        <div className="lg:col-span-5">
                            <div className="sticky top-32">
                                <div className="image-editorial aspect-[3/4] relative">
                                    <Image
                                        src="/images/aboutmepic.avif"
                                        alt="Lizi Shaw standing outdoors with her husband"
                                        fill
                                        className="object-cover"
                                        priority
                                        sizes="(min-width: 1024px) 40vw, 90vw"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Bio Content */}
                        <div className="lg:col-span-7">
                            <p className="text-label mb-6">{about.hero.eyebrow}</p>
                            <h1 className="text-display mb-10">{about.hero.heading}</h1>

                            <div className="prose text-body-lg text-[var(--color-ink-soft)]">
                                {about.hero.paragraphs.map((paragraph) => (
                                    <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Invitation Section */}
            <section className="section pt-10">
                <div className="container-prose">
                    <div className="border-t border-[var(--color-border)] pt-8 space-y-4">
                        <h2 className="text-h3">{about.invitation.heading}</h2>
                        <p className="text-body text-[var(--color-ink-soft)]">
                            {about.invitation.description}
                        </p>
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
            </section>
        </>
    );
}
