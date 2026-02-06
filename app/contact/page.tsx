import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
    title: "Contact",
    description:
        `Contact ${siteConfig.author.name} for speaking, collaborations, or a personal note.`,
};

export default function ContactPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="section section-warm">
                <div className="container-prose space-y-6">
                    <p className="text-label">Contact</p>
                    <h1 className="text-display">Let&apos;s connect</h1>
                    <p className="text-body-lg text-[var(--color-ink-soft)]">
                        Whether you&apos;re planning an event, have a question, or just want
                        to say hello, I&apos;d love to hear from you.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container-prose">
                    <ContactForm />
                </div>
            </section>
        </>
    );
}
