import type { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@/lib/config";
import { ArrowIcon } from "@/components/icons";

export const metadata: Metadata = {
    title: "About Me",
    description:
        "Learn about Lizi Shaw - a wife, mom of three, and Christian writer and speaker passionate about helping women anchor their motherhood in God's truth.",
};

export default function AboutPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="section section-warm">
                <div className="container">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
                        {/* Photo */}
                        <div className="lg:col-span-5">
                            <div className="image-editorial aspect-[3/4] relative sticky top-32">
                                <Image
                                    src="/images/aboutmepic.avif"
                                    alt="Lizi Shaw"
                                    fill
                                    className="object-cover"
                                    priority
                                    quality={95}
                                    sizes="(min-width: 1024px) 40vw, 90vw"
                                />
                            </div>
                        </div>

                        {/* Bio Content */}
                        <div className="lg:col-span-7">
                            <p className="text-label mb-6">About Me</p>
                            <h1 className="text-display mb-10">Hi, I&apos;m Lizi Shaw.</h1>

                            <div className="prose text-body-lg text-[var(--color-ink-soft)]">
                                <p>
                                    I&apos;m a wife, mom of three young kids, and someone who deeply
                                    understands how overwhelming modern motherhood can feel. Between
                                    cultural pressure, information overload, and the everyday demands
                                    of life, it&apos;s easy to lose sight of what really matters.
                                    That&apos;s why I&apos;m passionate about helping women cut through
                                    the noise and live with clarity, confidence, and peace rooted in
                                    Biblical truth.
                                </p>

                                <p>
                                    I don&apos;t claim to have it all figured out, but I&apos;ve
                                    learned (sometimes the hard way) that small, faithful steps in the
                                    right direction make a big difference. I love speaking to women in
                                    every stage of life and helping them rediscover joy in the simple
                                    and sacred work they&apos;re already doing.
                                </p>

                                <p>
                                    Let&apos;s walk it out together. With grace, grit, and a little
                                    laughter along the way.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Speaker Bio Section */}
            <section className="section">
                <div className="container-prose">
                    <div className="divider-ornament mb-12">
                        <span className="text-[var(--color-accent)] text-2xl">✦</span>
                    </div>

                    <blockquote className="text-h3 text-center text-[var(--color-ink-muted)] italic leading-relaxed">
                        Lizi Shaw is a Christian writer and speaker passionate about
                        helping women anchor their motherhood in God&apos;s truth. With
                        warmth, honesty, and insight, she invites moms to notice the Lord
                        in the everyday and build homes shaped by peace, purpose, and
                        eternal perspective. She lives in Niwot, Colorado with her
                        husband, Matt, and their three children who provide endless
                        sanctification and even more material for her writing.
                    </blockquote>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section section-soft">
                <div className="container text-center">
                    <h2 className="text-h2 mb-4">Want to hear me speak?</h2>
                    <p className="text-body-lg text-[var(--color-ink-muted)] max-w-lg mx-auto mb-8">
                        I&apos;d love to encourage your group with biblical truth and a lighthearted perspective on real motherhood.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a href="/speaking" className="btn btn-primary">
                            View Speaking Topics
                            <ArrowIcon />
                        </a>
                        <a
                            href={siteConfig.newsletterUrl}
                            className="btn btn-secondary"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Get the Notes
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
