import type { Metadata } from "next";
import { SpeakingInquiryForm } from "@/components/SpeakingInquiryForm";
import { siteConfig } from "@/lib/config";
import { marketingContent } from "@/content/site";

export const metadata: Metadata = {
    title: "Speaking Topics",
    description: marketingContent.speaking.metadataDescription,
};

export default function SpeakingPage() {
    const { speaking } = marketingContent;

    return (
        <>
            {/* Hero Section */}
            <section className="section section-warm">
                <div className="container-prose space-y-6">
                    <p className="text-label">{speaking.hero.eyebrow}</p>
                    <h1 className="text-display">{speaking.hero.heading}</h1>
                    <p className="text-body-lg text-[var(--color-ink-soft)]">
                        {speaking.hero.description}
                    </p>
                </div>
            </section>

            {/* Topics Section */}
            <section className="section">
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

            {/* Host Materials Section */}
            <section className="section">
                <div className="container-prose space-y-4">
                    <p className="text-label">{speaking.bio.eyebrow}</p>
                    <p className="text-caption text-[var(--color-ink-muted)]">
                        {speaking.bio.description}
                    </p>
                    <p className="text-body-lg text-[var(--color-ink-soft)]">
                        {speaking.bio.body}
                    </p>
                </div>
            </section>

            {/* Inquiry Form Section */}
            <section className="section section-soft" id="book">
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
