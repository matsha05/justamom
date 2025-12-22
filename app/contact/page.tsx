"use client";

import { useState, FormEvent } from "react";
import type { Metadata } from "next";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setSubmitStatus("success");
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch {
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Hero Section */}
            <section className="section section-warm">
                <div className="container-prose">
                    <p className="text-label mb-6">Contact</p>
                    <h1 className="text-display mb-10">Let&apos;s Connect</h1>
                    <p className="text-body-lg text-[var(--color-ink-soft)]">
                        Whether you have a question, want to book a speaking date, or
                        simply want to say hello, I&apos;d love to hear from you. Use the
                        form below and I&apos;ll respond as soon as I&apos;m able.
                    </p>
                </div>
            </section>

            {/* Contact Form */}
            <section className="section">
                <div className="container-narrow">
                    {submitStatus === "success" ? (
                        <div className="card">
                            <div className="card-body text-center py-12">
                                <div className="w-16 h-16 bg-[var(--color-accent-soft)] rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg
                                        className="w-8 h-8 text-[var(--color-accent)]"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4.5 12.75l6 6 9-13.5"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-h3 mb-3">Thank you!</h3>
                                <p className="text-body text-[var(--color-ink-muted)]">
                                    Your message has been sent. I&apos;ll get back to you soon.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="label">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    className="input"
                                    placeholder="Your name"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="label">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({ ...formData, email: e.target.value })
                                    }
                                    className="input"
                                    placeholder="your@email.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" className="label">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    required
                                    value={formData.subject}
                                    onChange={(e) =>
                                        setFormData({ ...formData, subject: e.target.value })
                                    }
                                    className="input"
                                    placeholder="What's this about?"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="label">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={6}
                                    required
                                    value={formData.message}
                                    onChange={(e) =>
                                        setFormData({ ...formData, message: e.target.value })
                                    }
                                    className="input resize-y"
                                    placeholder="Tell me more..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg
                                            className="w-4 h-4 animate-spin"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        Send Message
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
                                    </>
                                )}
                            </button>

                            {submitStatus === "error" && (
                                <p className="text-[var(--color-error)] text-caption text-center">
                                    Something went wrong. Please try again.
                                </p>
                            )}
                        </form>
                    )}
                </div>
            </section>
        </>
    );
}
