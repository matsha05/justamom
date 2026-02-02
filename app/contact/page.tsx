import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata: Metadata = {
    title: "Contact",
    description:
        "Get in touch with Lizi Shaw for speaking inquiries, questions, or just to say hello.",
};

export default function ContactPage() {
    return (
        <>
            {/* Hero Section */}
            <section className="section section-warm">
                <div className="container-prose space-y-6">
                    <p className="text-label">Contact</p>
                    <h1 className="text-display">Let's connect</h1>
                    <p className="text-body-lg text-[var(--color-ink-soft)]">
                        Whether you have a question, want to book a speaking date, or
                        simply want to say hello, I'd love to hear from you.
                    </p>
                </div>
            </section>

            {/* Contact Form */}
            <section className="section">
                <div className="container-prose space-y-10">
                    <div className="space-y-4">
                        <p className="text-label">Message</p>
                        <h2 className="text-h2">Send a message</h2>
                        <p className="text-body text-[var(--color-ink-muted)]">
                            For speaking inquiries, collaborations, or just to say hello.
                        </p>
                        <ContactForm />
                    </div>

                    <div className="space-y-4">
                        <p className="text-label">Notes by email</p>
                        <h3 className="text-h3">A Note for Moms, twice a month.</h3>
                        <p className="text-body text-[var(--color-ink-muted)]">
                            Twice a month. No spam. Just the note.
                        </p>
                        <NewsletterForm variant="compact" />
                    </div>
                </div>
            </section>
        </>
    );
}
