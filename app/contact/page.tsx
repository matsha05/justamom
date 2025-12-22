import type { Metadata } from "next";
import Link from "next/link";

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

            {/* Contact Options */}
            <section className="section">
                <div className="container-narrow">
                    <div className="card">
                        <div className="card-body text-center py-12">
                            <div className="w-16 h-16 bg-[var(--color-accent-soft)] rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg
                                    className="w-8 h-8 text-[var(--color-accent)]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-h3 mb-3">Send me a message</h2>
                            <p className="text-body text-[var(--color-ink-muted)] mb-8 max-w-md mx-auto">
                                For speaking inquiries, collaborations, or just to say hello,
                                reach out via email and I&apos;ll respond as soon as I&apos;m able.
                            </p>
                            <Link
                                href="mailto:hello@lizishaw.com?subject=Hello from your website"
                                className="btn btn-primary"
                            >
                                Email Me
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                    />
                                </svg>
                            </Link>
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
                            <Link
                                href="https://preview.mailerlite.io/forms/1931972/171530137383208676/share"
                                className="btn btn-secondary"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Subscribe
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
