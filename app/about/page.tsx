import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/config";
import { ArrowIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
    title: "About Me",
    description:
        `About ${siteConfig.author.name}, Christian writer and speaker behind A Note for Moms.`,
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
                                    I&apos;m a wife and mom of three, and I know how motherhood can
                                    feel holy and disorienting in the same breath. The days are full
                                    and loud, and it&apos;s easy to feel pulled between two exhausting
                                    stories: that you&apos;re &quot;just a mom,&quot; or that you have to do it all.
                                </p>

                                <p>
                                    My heart is to help moms step out of that noise and back into
                                    God&apos;s story. Scripture gives us something steadier: identity
                                    received before performance, and purpose that does not depend on
                                    perfect kids, perfect homes, or perfect plans.
                                </p>

                                <p>
                                    Through speaking and writing, I want moms to leave with clear truth,
                                    practical encouragement, and the quiet confidence that comes from
                                    belonging to Christ.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Short Bio Section */}
            <section className="section">
                <div className="container-prose space-y-4">
                    <p className="text-label">Short bio (third-person)</p>
                    <p className="text-caption text-[var(--color-ink-muted)]">
                        For host intros, event pages, or printed programs.
                    </p>
                    <p className="text-body-lg text-[var(--color-ink-soft)]">
                        Lizi Shaw is a Christian writer and speaker who helps moms live from
                        identity received in Christ, not performance. Her teaching is grounded
                        in Scripture and shaped by the holy, ordinary work of motherhood. With
                        honest stories and practical encouragement, she helps moms find
                        steadier footing in seasons that feel loud and overwhelming. Lizi lives
                        in Niwot, Colorado, with her husband, Matt, and their three children.
                        She loves skiing, running, and baking.
                    </p>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section section-soft">
                <div className="container text-center">
                    <h2 className="text-h2 mb-4">Need a speaker for your women&apos;s event?</h2>
                    <p className="text-body-lg max-w-lg mx-auto mb-8">
                        I&apos;d love to serve your moms with grounded biblical encouragement for real motherhood.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button asChild>
                            <Link href="/speaking">
                                Invite me to speak
                                <ArrowIcon />
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <a
                                href={siteConfig.newsletter.shareUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Join A Note for Moms
                            </a>
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}
