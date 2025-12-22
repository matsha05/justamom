"use client";

import { useState, FormEvent } from "react";
import type { Metadata } from "next";

// Note: metadata export doesn't work in client components, so we'll use generateMetadata or move to a server component wrapper if needed

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

        // For now, we'll just simulate a submission
        // In production, this would connect to a form backend like Formspree, Netlify Forms, etc.
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
            <section className="bg-gradient-hero py-16 md:py-20">
                <div className="container-main max-w-3xl">
                    <h1 className="text-heading text-3xl md:text-4xl mb-6">Contact Me</h1>
                    <p className="text-[var(--color-gray-dark)] text-lg leading-relaxed">
                        Whether you have a question, want to book a speaking date, or
                        simply want to say hello, I&apos;d love to hear from you. Use the
                        form below and I&apos;ll respond as soon as I&apos;m able.
                    </p>
                </div>
            </section>

            {/* Contact Form */}
            <section className="py-12 md:py-16">
                <div className="container-main max-w-xl">
                    <h2 className="text-heading text-2xl mb-8">Let&apos;s Chat</h2>

                    {submitStatus === "success" ? (
                        <div className="bg-[var(--color-teal-light)] rounded-xl p-8 text-center">
                            <h3 className="text-heading text-xl mb-2">Thank you!</h3>
                            <p className="text-[var(--color-gray-dark)]">
                                Your message has been sent. I&apos;ll get back to you soon.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-[var(--color-gray-dark)] mb-2"
                                >
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
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--color-gray-light)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent transition-shadow"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-[var(--color-gray-dark)] mb-2"
                                >
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
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--color-gray-light)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent transition-shadow"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="subject"
                                    className="block text-sm font-medium text-[var(--color-gray-dark)] mb-2"
                                >
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
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--color-gray-light)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent transition-shadow"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="message"
                                    className="block text-sm font-medium text-[var(--color-gray-dark)] mb-2"
                                >
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    required
                                    value={formData.message}
                                    onChange={(e) =>
                                        setFormData({ ...formData, message: e.target.value })
                                    }
                                    className="w-full px-4 py-3 rounded-lg border border-[var(--color-gray-light)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent transition-shadow resize-vertical"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Sending..." : "Send Message"}
                            </button>

                            {submitStatus === "error" && (
                                <p className="text-red-600 text-sm text-center">
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
