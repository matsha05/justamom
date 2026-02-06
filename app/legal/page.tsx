import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy & Terms",
  description: `Plain-language privacy and terms for ${siteConfig.site.name}.`,
};

export default function LegalPage() {
  return (
    <>
      <section className="section section-warm">
        <div className="container-prose space-y-6">
          <p className="text-label">Legal</p>
          <h1 className="text-display">Privacy &amp; Terms</h1>
          <p className="text-body-lg text-[var(--color-ink-soft)]">
            A plain-language note on how information is handled here and the
            basic terms for using this website.
          </p>
          <p className="text-caption text-[var(--color-ink-muted)]">
            Last updated: {siteConfig.legal.lastUpdated}
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-prose">
          <div className="prose text-body text-[var(--color-ink-soft)]">
            <h2 id="privacy">Privacy</h2>
            <p>
              If you use a form on this site, information may include your
              name, email address, and message details. Speaking inquiries may
              also include event details.
            </p>
            <p>
              Information is used to respond to inquiries, manage newsletter
              subscriptions, send requested updates, and keep this site secure
              and reliable.
            </p>
            <p>
              Contact forms are processed through Formspree, and newsletter
              subscriptions are managed through MailerLite. Those services
              process submitted information according to their own policies.
            </p>
            <p>
              Personal information is not sold. It is shared only when needed
              to run this website and respond to your request.
            </p>
            <p>
              You may unsubscribe from newsletter emails at any time using the
              link in those emails. To request access, correction, or deletion
              of submitted information, email{" "}
              <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
            </p>
            <p>
              This site is not directed to children under 13, and personal
              information is not knowingly collected from children under 13.
            </p>

            <h2 id="terms">Terms</h2>
            <p>
              By using this website, you agree to use it lawfully. You may not
              attempt to interfere with site security, forms, or availability.
            </p>
            <p>
              Unless otherwise noted, website content is owned by{" "}
              {siteConfig.author.name}. You may share links and brief quotations
              with attribution. Reproduction, redistribution, or commercial use
              requires written permission.
            </p>
            <p>
              Submitting a contact or speaking form does not create a
              contractual relationship. Event details, timelines, and commitments
              are confirmed separately in writing.
            </p>
            <p>
              This website is provided on an &quot;as is&quot; basis. Care is
              taken to keep content accurate and current, but no warranty is
              made that all content is complete, error-free, or uninterrupted.
            </p>
            <p>
              Questions about this page may be sent to{" "}
              <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
