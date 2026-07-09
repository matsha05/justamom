import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { PageHero } from "@/components/layout/PageHero";
import { siteConfig } from "@/lib/config";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description: `Contact ${siteConfig.author.name} for speaking, collaborations, or a personal note.`,
  pathname: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Send a note"
        description={
          <>
            Whether you&apos;re planning an event, have a question, or just want
            to say hello, I&apos;d love to hear from you.
          </>
        }
        density="compact"
      />

      <section className="section section-compact">
        <div className="container-prose">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
