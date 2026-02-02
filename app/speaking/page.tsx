import type { Metadata } from "next";
import { SpeakingInquiryForm } from "@/components/SpeakingInquiryForm";

export const metadata: Metadata = {
    title: "Speaking Topics",
    description:
        "Book Lizi Shaw to speak at your moms' event, retreat, or group gathering. Topics include motherhood, faith, identity, and simplifying life.",
};

const speakingTopics = [
    {
        title: "Identity in the Noise",
        description:
            "A steadying look at the cultural pressure points shaping modern motherhood and how to live from a secure identity instead of performance.",
    },
    {
        title: "Finding God in the Ordinary",
        description:
            "A reflective message about the sacred weight of everyday motherhood and the quiet faithfulness that carries it.",
    },
    {
        title: "A Calling, Not a Consequence",
        description:
            "A biblical reframe that restores dignity to motherhood without diminishing calling, gifts, or work outside the home.",
    },
];

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
                    <p className="text-body text-[var(--color-ink-muted)]">
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
                            <p className="text-label">Selected topics</p>
                            <h2 className="text-h2">Current messages</h2>
                            <p className="text-body text-[var(--color-ink-soft)]">
                                These are a few of the messages I most often share. Each
                                can be shaped for a retreat, church, or women's gathering.
                            </p>
                        </div>
                        <div className="space-y-8">
                            {speakingTopics.map((topic) => (
                                <div
                                    key={topic.title}
                                    className="border-l border-[var(--color-border-strong)] pl-6"
                                >
                                    <h3 className="text-h3 mb-2">{topic.title}</h3>
                                    <p className="text-body text-[var(--color-ink-muted)]">
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
                        <h2 className="text-h2">Invite Lizi to speak</h2>
                        <p className="text-body text-[var(--color-ink-soft)]">
                            For availability, dates, and event details, share a few
                            basics below or email{" "}
                            <a
                                href="mailto:hello@lizishaw.com"
                                className="underline underline-offset-4"
                            >
                                hello@lizishaw.com
                            </a>
                            .
                        </p>
                        <SpeakingInquiryForm />
                    </div>
                </div>
            </section>
        </>
    );
}
