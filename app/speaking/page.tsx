import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Speaking Topics",
    description:
        "Book Lizi Shaw to speak at your moms' event, retreat, or group gathering. Topics include motherhood, faith, identity, and simplifying life.",
};

const speakingTopics = [
    {
        title: "How to make Mom Friends",
        description:
            'They say it takes a village... but are you wondering where that village is? Making friends can be hard and uncomfortable. You might be thinking, "Why does it feel like I should know how to do this?" I offer practical tips about how to make (and maintain) friendships during this crazy season of motherhood.',
        image: "/images/speaking-mom-friends.png",
        alt: "Two moms connecting over coffee",
    },
    {
        title: "Hope in the Unseen",
        description:
            "Motherhood has changed. In this era of technology and media, we are being bombarded with decision overload. But it is in the unseen and hidden places of motherhood that Jesus is calling us to lift up our gaze and fix our eyes on Him.",
        image: "/images/speaking-hope-unseen.png",
        alt: "Mother and child looking toward light",
    },
    {
        title: "My Yoke is Easy",
        description:
            "News Flash. Life isn't easy (duh). We can spend so much energy trying to make life run smoothly. Obedient kids, clean home, everything going to plan, when the fact is that we were never promised an easy life. What Jesus does offer is an easy Yoke.",
        image: "/images/speaking-easy-yoke.png",
        alt: "Woman at rest with open book",
    },
];

export default function SpeakingPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="section section-warm">
                <div className="container-prose">
                    <p className="text-label mb-6">Speaking</p>
                    <h1 className="text-display mb-10">Speaking Topics</h1>

                    <div className="prose space-y-6 text-body-lg text-[var(--color-ink-soft)]">
                        <p>
                            Motherhood is beautiful...and messy. It&apos;s full of holy moments,
                            loud questions, and days that feel both too long and too short. As a
                            speaker, I&apos;m passionate about encouraging women, especially
                            moms, to live with peace, purpose, and clarity in the midst of
                            cultural noise and daily overwhelm.
                        </p>

                        <p>
                            I love sharing about motherhood, faith, identity, and simplifying
                            life in a way that brings joy and direction. While the topics below
                            represent some of my favorite messages, I&apos;m happy to tailor a
                            talk to fit the unique needs of your group or event.
                        </p>

                        <p>
                            Whether your audience is full of tired moms, curious seekers, or
                            women hungry for Biblical truth in a practical way, I&apos;d be
                            honored to serve.
                        </p>
                    </div>
                </div>
            </section>

            {/* Topics Section */}
            <section className="section">
                <div className="container">
                    <div className="space-y-16">
                        {speakingTopics.map((topic, index) => (
                            <div
                                key={index}
                                className={`grid lg:grid-cols-12 gap-8 lg:gap-16 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""
                                    }`}
                            >
                                {/* Illustration */}
                                <div
                                    className={`lg:col-span-4 ${index % 2 === 1 ? "lg:order-2" : ""
                                        }`}
                                >
                                    <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-md">
                                        <Image
                                            src={topic.image}
                                            alt={topic.alt}
                                            fill
                                            className="object-contain p-6"
                                            quality={90}
                                        />
                                    </div>
                                </div>

                                {/* Content */}
                                <div
                                    className={`lg:col-span-8 ${index % 2 === 1 ? "lg:order-1" : ""
                                        }`}
                                >
                                    <h3 className="text-h2 mb-6">{topic.title}</h3>
                                    <p className="text-body-lg text-[var(--color-ink-muted)] leading-relaxed">
                                        {topic.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section section-soft">
                <div className="container text-center">
                    <div className="divider-ornament mb-12">
                        <span className="text-[var(--color-accent)] text-2xl">✦</span>
                    </div>

                    <h2 className="text-h2 mb-6">Ready to Connect?</h2>
                    <p className="text-body-lg text-[var(--color-ink-muted)] max-w-xl mx-auto mb-10">
                        If you&apos;re hosting a moms&apos; event, retreat, or group
                        gathering, I&apos;d love to be a part of it. I&apos;m happy to speak
                        in person or virtually. Let&apos;s connect and talk about what would
                        serve your women best.
                    </p>
                    <Link href="/contact" className="btn btn-primary">
                        Let&apos;s get in touch!
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                            />
                        </svg>
                    </Link>

                    <div className="divider-ornament mt-12">
                        <span className="text-[var(--color-accent)] text-2xl">✦</span>
                    </div>
                </div>
            </section>
        </>
    );
}
