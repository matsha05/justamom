import Link from "next/link";
import Image from "next/image";
import { NewsletterCTA } from "@/components/NewsletterCTA";

export default function HomePage() {
  return (
    <>
      {/* Hero Section with Family Image */}
      <section className="relative bg-gradient-hero">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-16 md:py-24">
            {/* Text Content */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              <h1 className="text-heading text-3xl md:text-4xl lg:text-5xl mb-6">
                Helping Moms find clarity, courage and peace in a noisy world.
              </h1>
              <p className="text-[var(--color-gray-medium)] text-lg md:text-xl mb-8">
                Real stories. Biblical truth. A lighthearted look at the everyday
                moments that shape our lives.
              </p>

              {/* Newsletter CTA */}
              <div className="bg-[var(--color-cream-light)] rounded-2xl p-6 md:p-8 shadow-sm inline-block">
                <h4 className="text-heading text-lg mb-2">Get my monthly Notes for Moms</h4>
                <p className="text-[var(--color-gray-medium)] text-sm mb-4">
                  A quiet moment of encouragement delivered to your inbox
                </p>
                <Link
                  href="https://preview.mailerlite.io/forms/1931972/171530137383208676/share"
                  className="btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join the list
                </Link>
              </div>
            </div>

            {/* Family Image */}
            <div className="order-1 lg:order-2">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg max-w-md mx-auto lg:max-w-none">
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
      </section>

      {/* About Preview Section */}
      <section className="py-16 md:py-20">
        <div className="container-main max-w-4xl">
          <h4 className="text-accent text-xl text-[var(--color-teal)] mb-4">
            About Me.
          </h4>
          <h2 className="text-heading text-xl md:text-2xl mb-6 leading-relaxed">
            Hi, I&apos;m Lizi. I&apos;m a wife, a mom of three, and a woman who is
            learning every day what it means to walk closely with Jesus in the
            middle of real life. I love helping other women find clarity and
            peace in a world that feels loud and overwhelming. Not through
            trends or quick fixes, but by returning to the steady, simple way of
            following Him.
          </h2>
          <Link href="/about" className="link-underline font-medium">
            Read more
          </Link>
        </div>
      </section>

      {/* Speaking Preview Section */}
      <section className="bg-[var(--color-teal-light)] py-16 md:py-20">
        <div className="container-main">
          <h4 className="text-accent text-xl text-[var(--color-teal)] mb-4">
            Speaking
          </h4>
          <h2 className="text-heading text-2xl md:text-3xl mb-10">
            Honest, biblical encouragement for real motherhood
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Topic 1 */}
            <div className="bg-[var(--color-cream-light)] rounded-xl p-6 shadow-sm">
              <h3 className="text-heading text-lg mb-3">
                Making Confident Decisions in a Confusing Culture
              </h3>
              <p className="text-[var(--color-gray-medium)] text-sm">
                A practical and encouraging message for moms who feel pulled in a
                thousand directions. Lizi unpacks why motherhood feels noisier
                than it used to, how cultural messages shape our confidence, and
                how to ground decisions in biblical truth.
              </p>
            </div>

            {/* Topic 2 */}
            <div className="bg-[var(--color-cream-light)] rounded-xl p-6 shadow-sm">
              <h3 className="text-heading text-lg mb-3">
                Finding God in the Small Moments of Motherhood
              </h3>
              <p className="text-[var(--color-gray-medium)] text-sm">
                A reflective, hope-filled message about recognizing God&apos;s
                presence in the mundane. Perfect for groups needing refreshment
                and encouragement.
              </p>
            </div>

            {/* Topic 3 */}
            <div className="bg-[var(--color-cream-light)] rounded-xl p-6 shadow-sm">
              <h3 className="text-heading text-lg mb-3">
                The Stories We Tell Ourselves and the Truth That Frees Us
              </h3>
              <p className="text-[var(--color-gray-medium)] text-sm">
                A talk that blends emotional honesty with biblical grounding.
                Lizi helps moms identify the quiet narratives that lead to
                anxiety, comparison, or confusion and offers truth-centered
                tools for replacing them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Newsletter CTA */}
      <NewsletterCTA />
    </>
  );
}
