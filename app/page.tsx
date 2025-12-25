import Link from "next/link";
import Image from "next/image";
import { NewsletterCTA } from "@/components/NewsletterCTA";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ArrowIcon } from "@/components/icons";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="section bg-[var(--color-paper-warm)]">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Content */}
            <div className="order-2 lg:order-1">
              {/* Eyebrow */}
              <p className="text-label mb-6 animate-fade-in">
                Speaker · Writer · Encourager
              </p>

              {/* Main Headline */}
              <h1
                className="text-display mb-8 animate-fade-in"
                style={{ animationDelay: "75ms" }}
              >
                Helping Moms find clarity, courage and peace in a noisy world.
              </h1>

              {/* Subheadline */}
              <p
                className="text-body-lg text-[var(--color-ink-muted)] mb-10 max-w-xl animate-fade-in"
                style={{ animationDelay: "150ms" }}
              >
                Real stories. Biblical truth. A lighthearted look at the everyday
                moments that shape our lives.
              </p>

              {/* CTAs */}
              <div
                className="animate-fade-in delay-3 max-w-lg"
              >
                <NewsletterForm variant="hero" className="mb-4" />
                <div className="flex items-center justify-center sm:justify-start gap-4">
                  <span className="text-caption text-[var(--color-ink-faint)]">or</span>
                  <Link href="/speaking" className="btn btn-secondary">
                    Book Me to Speak
                    <ArrowIcon />
                  </Link>
                </div>
              </div>
            </div>

            {/* Photo */}
            <div
              className="order-1 lg:order-2 animate-fade-in"
              style={{ animationDelay: "150ms" }}
            >
              <div className="relative max-w-md mx-auto lg:max-w-none">
                {/* Decorative Offset Border */}
                <div className="absolute top-4 -right-4 w-full h-full border border-[var(--color-ink-faint)] rounded-lg -z-10 hidden lg:block" />

                <div className="image-editorial aspect-[3/4] relative">
                  <Image
                    src="/images/landingpagefamily.avif"
                    alt="Lizi Shaw with her family"
                    fill
                    className="object-cover object-top"
                    priority
                    quality={95}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="section">
        <div className="container-prose">
          <p className="text-label mb-6">About Me</p>
          <p className="text-h2 leading-relaxed">
            Hi, I&apos;m Lizi. I&apos;m a wife, a mom of three, and a woman who is
            learning every day what it means to walk closely with Jesus in the
            middle of real life. I love helping other women find clarity and
            peace in a world that feels loud and overwhelming. Not through
            trends or quick fixes, but by returning to the steady, simple way of
            following Him.
          </p>
          <div className="mt-8">
            <Link href="/about" className="link-arrow">
              Read more about me
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* Speaking Preview Section */}
      <section className="section section-soft">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-label mb-4">Speaking</p>
            <h2 className="text-h2">
              Honest, biblical encouragement for real motherhood
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 stagger-children">
            {/* Topic 1 */}
            <div className="space-y-4">
              <span className="text-[var(--color-accent)] font-medium text-xs tracking-widest uppercase border-b border-[var(--color-accent-soft)] pb-2 inline-block">Confidence</span>
              <h3 className="text-h4 mb-4">
                Making Confident Decisions in a Confusing Culture
              </h3>
              <p className="text-body text-[var(--color-ink-muted)]">
                A practical and encouraging message for moms who feel pulled in a
                thousand directions. Lizi unpacks why motherhood feels noisier
                than it used to, how cultural messages shape our confidence, and
                how to ground decisions in biblical truth.
              </p>
            </div>

            {/* Topic 2 */}
            <div className="space-y-4">
              <span className="text-[var(--color-accent)] font-medium text-xs tracking-widest uppercase border-b border-[var(--color-accent-soft)] pb-2 inline-block">Perspective</span>
              <h3 className="text-h4 mb-4">
                Finding God in the Small Moments of Motherhood
              </h3>
              <p className="text-body text-[var(--color-ink-muted)]">
                A reflective, hope-filled message about recognizing God&apos;s
                presence in the mundane. Perfect for groups needing refreshment
                and encouragement.
              </p>
            </div>

            {/* Topic 3 */}
            <div className="space-y-4">
              <span className="text-[var(--color-accent)] font-medium text-xs tracking-widest uppercase border-b border-[var(--color-accent-soft)] pb-2 inline-block">Identity</span>
              <h3 className="text-h4 mb-4">
                The Stories We Tell Ourselves and the Truth That Frees Us
              </h3>
              <p className="text-body text-[var(--color-ink-muted)]">
                A talk that blends emotional honesty with biblical grounding.
                Lizi helps moms identify the quiet narratives that lead to
                anxiety, comparison, or confusion and offers truth-centered
                tools for replacing them.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/speaking" className="link-arrow">
              View all speaking topics
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Newsletter CTA */}
      <NewsletterCTA />
    </>
  );
}
