import type { Metadata } from "next";
import { SpeakingInquiryForm } from "@/components/SpeakingInquiryForm";
import { siteConfig } from "@/lib/config";
import { speakingTopics } from "@/lib/content";

export const metadata: Metadata = {
    title: "Speaking Topics",
    description:
        `Invite ${siteConfig.author.name} to encourage your women with biblical teaching on motherhood, identity, and everyday faithfulness.`,
};

export default function SpeakingPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="section section-warm">
                <div className="container-prose space-y-6">
                    <p className="text-label">Speaking</p>
                    <h1 className="text-display">Speaking</h1>
                    <p className="text-body-lg text-[var(--color-ink-soft)]">
                        I speak to women about the holy work of motherhood, the quiet
                        places where God meets us, and the steadier identity we can
                        live from when the noise gets loud.
                    </p>
                    <p className="text-body">
                        Talks are grounded in Scripture and shaped by real life. I am
                        happy to tailor a message for your group or event.
                    </p>
                </div>
            </section>

            {/* Topics Section */}
            <section className="section">
                <div className="container">
                    <div className="grid gap-14 lg:grid-cols-[1fr_2fr] lg:gap-16">
                        <div className="space-y-4">
                            <p className="text-label">Topics I share</p>
                            <h2 className="text-h2">Messages I return to</h2>
                            <p className="text-body text-[var(--color-ink-soft)]">
                                These are a few talks I come back to often. Each can be
                                shaped for your church, retreat, or women&apos;s gathering.
                            </p>
                        </div>
                        <div className="space-y-8">
                            {speakingTopics.map((topic) => (
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
                        </div>
                    </div>
                </div>
            </section>

            {/* Inquiry Form Section */}
            <section className="section section-soft" id="book">
                <div className="container">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <p className="text-label">Inquiries</p>
                        <h2 className="text-h2">Invite me to speak</h2>
                        <p className="text-body text-[var(--color-ink-soft)]">
                            For availability, dates, and event details, share a few
                            basics below, or email{" "}
                            <a
                                href={`mailto:${siteConfig.contact.email}`}
                                className="underline underline-offset-4"
                            >
                                {siteConfig.contact.email}
                            </a>
                            . I&apos;ll follow up personally.
                        </p>
                        <SpeakingInquiryForm />
                    </div>
                </div>
            </section>
        </>
    );
}
