import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
    title: "Contact",
    description:
        `Get in touch with ${siteConfig.author.name} for speaking inquiries, collaborations, or personal notes.`,
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

            {/* Contact Form */}
            <section className="section">
                <div className="container-prose space-y-10">
                    <div className="space-y-4">
                        <p className="text-label">Message</p>
                        <h2 className="text-h2">Send a message</h2>
                        <p className="text-body">
                            For speaking inquiries, collaborations, or anything else on your mind.
                        </p>
                        <ContactForm />
                    </div>
                </div>
            </section>
        </>
    );
}
