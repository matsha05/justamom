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
            "They say it takes a village... but are you wondering where that village is? Making friends can be hard and uncomfortable. You might be thinking, \"Why does it feel like I should know how to do this?\" I offer practical tips about how to make (and maintain) friendships during this crazy season of motherhood.",
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
            "News Flash. Life isn't easy (duh). We can spend so much energy trying to make life run smoothly. Obedient kids, clean home, everything going to plan, when the fact is that we were never promised and easy life. What Jesus does offer is an easy Yoke.",
        image: "/images/speaking-easy-yoke.png",
        alt: "Woman at rest with open book",
    },
];

export default function SpeakingPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="bg-gradient-hero py-16 md:py-20">
                <div className="container-main max-w-3xl">
                    <h1 className="text-heading text-3xl md:text-4xl mb-6">
                        Speaking Topics
                    </h1>
                    <p className="text-[var(--color-gray-dark)] text-lg leading-relaxed">
                        Motherhood is beautiful...and messy. It&apos;s full of holy moments,
                        loud questions, and days that feel both too long and too short. As a
                        speaker, I&apos;m passionate about encouraging women, especially
                        moms, to live with peace, purpose, and clarity in the midst of
                        cultural noise and daily overwhelm.
                    </p>
                    <p className="text-[var(--color-gray-dark)] mt-4 leading-relaxed">
                        I love sharing about motherhood, faith, identity, and simplifying
                        life in a way that brings joy and direction. While the topics below
                        represent some of my favorite messages, I&apos;m happy to tailor a
                        talk to fit the unique needs of your group or event.
                    </p>
                    <p className="text-[var(--color-gray-dark)] mt-4 leading-relaxed">
                        Whether your audience is full of tired moms, curious seekers, or
                        women hungry for Biblical truth in a practical way, I&apos;d be
                        honored to serve.
                    </p>
                </div>
            </section>

            {/* Topics Grid with Illustrations */}
            <section className="py-12 md:py-16">
                <div className="container-main">
                    <div className="grid md:grid-cols-3 gap-8">
                        {speakingTopics.map((topic, index) => (
                            <div
                                key={index}
                                className="bg-[var(--color-cream-light)] border border-[var(--color-gray-light)]/30 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Illustration */}
                                <div className="relative aspect-[4/3] bg-white">
                                    <Image
                                        src={topic.image}
                                        alt={topic.alt}
                                        fill
                                        className="object-contain p-4"
                                        quality={90}
                                    />
                                </div>
                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-heading text-lg mb-4">{topic.title}</h3>
                                    <p className="text-[var(--color-gray-medium)] text-sm leading-relaxed">
                                        {topic.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-[var(--color-teal-light)] py-12 md:py-16">
                <div className="container-main text-center">
                    <h2 className="text-heading text-2xl md:text-3xl mb-4">
                        Ready to Connect?
                    </h2>
                    <p className="text-[var(--color-gray-dark)] max-w-xl mx-auto mb-8">
                        If you&apos;re hosting a moms&apos; event, retreat, or group
                        gathering, I&apos;d love to be a part of it. I&apos;m happy to speak
                        in person or virtually. Let&apos;s connect and talk about what would
                        serve your women best.
                    </p>
                    <Link href="/contact" className="btn-primary">
                        Let&apos;s get in touch!
                    </Link>
                </div>
            </section>
        </>
    );
}
