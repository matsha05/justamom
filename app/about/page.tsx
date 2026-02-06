import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowIcon } from "@/components/icons";

export const metadata: Metadata = {
    title: "About Me",
    description:
        "About Lizi Shaw, Christian writer and speaker behind A Note for Moms.",
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

            {/* Invitation Section */}
            <section className="section pt-10">
                <div className="container-prose">
                    <div className="border-t border-[var(--color-border)] pt-8 space-y-4">
                        <h2 className="text-h3">Need a speaker for your women&apos;s event?</h2>
                        <p className="text-body text-[var(--color-ink-soft)]">
                            I&apos;d love to serve your moms with grounded biblical encouragement for real motherhood.
                        </p>
                        <Link className="link-arrow" href="/speaking">
                            Invite me to speak
                            <ArrowIcon />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
