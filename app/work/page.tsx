import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Current Work",
  description:
    "A long-form project on motherhood, identity, and the steadier place where worth is received before it is performed.",
};

const thesis =
  "Motherhood today is shaped by cultural lies that distort a woman's identity, whether by shrinking it to \"just a mom\" or inflating it into \"do it all.\" Both extremes steal joy and create pressure because they hinge identity on performance. But God tells a better story. From the very beginning, He defined women as image bearers first, and only then gave them purpose. By returning to the creation story, exposing the lies that echo from the garden into modern motherhood, and rediscovering God's pursuit and redemption, mothers can finally live from a secure identity rather than striving to earn one.";

const excerpt = [
  "I still remember the first time someone asked me what I did after my daughter was born. It was an innocent question. One I've asked a million times. The kind of small-talk line people toss out to get to know you or to fill a gap in conversation. But for me, it dropped a new weight on top of the already heavy load pressing down on my shoulders. I opened my mouth to answer and realized I wasn't entirely sure what to say.",
  "What did I do? I could have answered honestly. \"Well... today I changed about twenty diapers, battled for several naps, folded tiny clothes, cleaned spit-up off the couch, and produced enough milk to make me feel like a dairy cow.\" But that felt... weird. Not because it wasn't true, it was very true, but because it didn't feel like an answer that counted.",
];

const themes = [
  "Identity received before performance",
  "The cultural pressure to shrink or over-extend motherhood",
  "The creation story as a steadier center for modern moms",
  "Redemption from striving into quiet, durable confidence",
];

export default function WorkPage() {
  return (
    <>
      <section className="section section-warm">
        <div className="container-prose">
          <p className="text-label mb-6">Current Work</p>
          <h1 className="text-display mb-6">Just a Mom</h1>
          <p className="text-body-lg text-[var(--color-ink-soft)]">
            A long-form project on motherhood, identity, and the steadier place
            where worth is received before it is performed.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-prose space-y-10">
          <div className="space-y-4">
            <p className="text-label">Project thesis</p>
            <p className="text-body-lg text-[var(--color-ink-soft)]">{thesis}</p>
          </div>

          <div className="space-y-4">
            <p className="text-label">Selected excerpt</p>
            <p className="text-body text-[var(--color-ink-soft)]">
              Excerpt from the opening chapter.
            </p>
            <div className="border-l border-[var(--color-border-strong)] pl-6 space-y-4">
              {excerpt.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 24)}
                  className="text-body-lg text-[var(--color-ink)] leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-label">Themes</p>
            <ul className="grid gap-3 md:grid-cols-2 text-body text-[var(--color-ink-soft)]">
              {themes.map((theme) => (
                <li key={theme} className="border-l border-[var(--color-border)] pl-4">
                  {theme}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-label">For editors &amp; agents</p>
            <p className="text-body text-[var(--color-ink-soft)]">
              For proposal materials, the full manuscript, or speaking inquiries,
              email{" "}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="underline underline-offset-4"
              >
                {siteConfig.contact.email}
              </a>
              .
            </p>
            <Link className="link-arrow" href="/contact">
              Contact
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
