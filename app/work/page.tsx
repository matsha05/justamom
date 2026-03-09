import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { siteConfig } from "@/lib/config";
import { marketingContent } from "@/content/site";

export const metadata: Metadata = {
  title: "Current Work",
  description: marketingContent.work.metadataDescription,
};

export default function WorkPage() {
  const { work } = marketingContent;

  return (
    <>
      <section className="section section-warm">
        <div className="container-prose">
          <p className="text-label mb-6">{work.hero.eyebrow}</p>
          <h1 className="text-display mb-6">{work.hero.heading}</h1>
          <p className="text-body-lg text-[var(--color-ink-soft)]">
            {work.hero.description}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-prose space-y-10">
          <div className="space-y-4">
            <p className="text-label">{work.thesis.eyebrow}</p>
            <p className="text-body-lg text-[var(--color-ink-soft)]">{work.thesis.body}</p>
          </div>

          <div className="space-y-4">
            <p className="text-label">{work.excerpt.eyebrow}</p>
            <p className="text-body text-[var(--color-ink-soft)]">
              {work.excerpt.description}
            </p>
            <div className="border-l border-[var(--color-border-strong)] pl-6 space-y-4">
              {work.excerpt.paragraphs.map((paragraph) => (
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
            <p className="text-label">{work.themes.eyebrow}</p>
            <ul className="grid gap-3 md:grid-cols-2 text-body text-[var(--color-ink-soft)]">
              {work.themes.items.map((theme) => (
                <li key={theme} className="border-l border-[var(--color-border)] pl-4">
                  {theme}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-label">{work.contact.eyebrow}</p>
            <p className="text-body text-[var(--color-ink-soft)]">
              {work.contact.description}{" "}
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="underline underline-offset-4"
              >
                {siteConfig.contact.email}
              </a>
              .
            </p>
            <Link className="link-arrow" href={work.contact.cta.href}>
              {work.contact.cta.label}
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
