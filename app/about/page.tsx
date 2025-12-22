import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
    title: "About Me",
    description:
        "Learn about Lizi Shaw - a wife, mom of three, and Christian writer and speaker passionate about helping women anchor their motherhood in God's truth.",
};

export default function AboutPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="bg-gradient-hero py-16 md:py-20">
                <div className="container-main">
                    <h1 className="text-heading text-3xl md:text-4xl mb-8">About Me</h1>
                </div>
            </section>

            {/* Main Content with Photo */}
            <section className="py-12 md:py-16">
                <div className="container-main">
                    <div className="grid lg:grid-cols-5 gap-12 items-start max-w-5xl mx-auto">
                        {/* Photo */}
                        <div className="lg:col-span-2">
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                                <Image
                                    src="/images/aboutmepic.avif"
                                    alt="Lizi Shaw"
                                    fill
                                    className="object-cover"
                                    priority
                                    quality={95}
                                />
                            </div>
                        </div>

                        {/* Bio Content */}
                        <div className="lg:col-span-3 space-y-6 text-[var(--color-gray-dark)]">
                            <p className="text-lg leading-relaxed">
                                <span className="text-heading">Hi, I&apos;m Lizi Shaw.</span>
                            </p>

                            <p className="leading-relaxed">
                                I&apos;m a wife, mom of three young kids, and someone who deeply
                                understands how overwhelming modern motherhood can feel. Between
                                cultural pressure, information overload, and the everyday demands
                                of life, it&apos;s easy to lose sight of what really matters.
                                That&apos;s why I&apos;m passionate about helping women cut through
                                the noise and live with clarity, confidence, and peace rooted in
                                Biblical truth.
                            </p>

                            <p className="leading-relaxed">
                                I don&apos;t claim to have it all figured out, but I&apos;ve
                                learned (sometimes the hard way) that small, faithful steps in the
                                right direction make a big difference. I love speaking to women in
                                every stage of life and helping them rediscover joy in the simple
                                and sacred work they&apos;re already doing.
                            </p>

                            <p className="leading-relaxed">
                                Let&apos;s walk it out together. With grace, grit, and a little
                                laughter along the way.
                            </p>
                        </div>
                    </div>

                    {/* Speaker Bio */}
                    <div className="max-w-3xl mx-auto mt-16 pt-12 border-t border-[var(--color-gray-light)]/50">
                        <p className="text-[var(--color-gray-medium)] italic leading-relaxed">
                            Lizi Shaw is a Christian writer and speaker passionate about
                            helping women anchor their motherhood in God&apos;s truth. With
                            warmth, honesty, and insight, she invites moms to notice the Lord
                            in the everyday and build homes shaped by peace, purpose, and
                            eternal perspective. She lives in Niwot, Colorado with her
                            husband, Matt, and their three children who provide endless
                            sanctification and even more material for her writing.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
