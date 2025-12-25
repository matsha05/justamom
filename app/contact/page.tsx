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
                <div className="container-prose">
                    <p className="text-label mb-6">Contact</p>
                    <h1 className="text-display mb-10">Let&apos;s Connect</h1>
                    <p className="text-body-lg text-[var(--color-ink-soft)]">
                        Whether you have a question, want to book a speaking date, or
                        simply want to say hello, I&apos;d love to hear from you.
                    </p>
                </div>
            </section>

            {/* Contact Form */}
            <section className="py-12">
                <div className="container-narrow">
                    <div className="card">
                        <div className="card-body p-8 md:p-10">
                            <div className="mb-8">
                                <h2 className="text-h3 mb-2">Send me a message</h2>
                                <p className="text-body text-[var(--color-ink-muted)]">
                                    For speaking inquiries, collaborations, or just to say hello.
                                </p>
                            </div>
                            <ContactForm />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="divider-ornament my-12">
                        <span className="text-[var(--color-accent)] text-lg">or</span>
                    </div>

                    {/* Notes Option */}
                    <div className="card">
                        <div className="card-body text-center py-12">
                            <h3 className="text-h4 mb-3">Get the Notes</h3>
                            <p className="text-body text-[var(--color-ink-muted)] mb-6 max-w-md mx-auto">
                                A quiet note from one mom to another, delivered twice a month.
                            </p>
                            <NewsletterForm variant="compact" className="max-w-sm mx-auto" />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

