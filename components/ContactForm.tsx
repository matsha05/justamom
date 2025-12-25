"use client";

import { useState } from "react";
import { ArrowIcon } from "@/components/icons";
import { DatePicker } from "./DatePicker";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
    const [status, setStatus] = useState<SubmitStatus>("idle");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("submitting");
        setErrorMessage("");

        const form = e.currentTarget;
        const formData = new FormData(form);

        // Map "Speaking Inquiry" subject to match the hidden field expected by Formspree if we want
        // or just let the subject field handle it.

        try {
            const response = await fetch("https://formspree.io/f/mqezoggn", {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json",
                },
            });

            if (response.ok) {
                setStatus("success");
                form.reset();
                setSelectedSubject("");
            } else {
                const data = await response.json();
                setErrorMessage(data.error || "Something went wrong. Please try again.");
                setStatus("error");
            }
        } catch {
            setErrorMessage("Network error. Please check your connection and try again.");
            setStatus("error");
        }
    };

    const subjectOptions = [
        { value: "", label: "What's this about?" },
        { value: "Speaking Inquiry", label: "Speaking Inquiry" },
        { value: "Collaboration", label: "Collaboration" },
        { value: "Just Saying Hello", label: "Just Saying Hello" },
        { value: "Something Else", label: "Something Else" },
    ];

    // Success state
    if (status === "success") {
        return (
            <div className="text-center py-12 animate-fade-in">
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
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <h3 className="text-h3 mb-3">Message Sent!</h3>
                <p className="text-body text-[var(--color-ink-muted)] mb-6">
                    Thank you for reaching out. I&apos;ll get back to you as soon as I can.
                </p>
                <button
                    onClick={() => setStatus("idle")}
                    className="btn btn-secondary"
                >
                    Send Another Message
                </button>
            </div>
        );
    }

    const isSpeakingInquiry = selectedSubject === "Speaking Inquiry";

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
            {/* Error message */}
            {status === "error" && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {errorMessage}
                </div>
            )}

            {/* Name & Email Row */}
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="text-label block mb-2">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="input w-full"
                        placeholder="Your name"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="text-label block mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="input w-full"
                        placeholder="you@example.com"
                    />
                </div>
            </div>

            {/* Subject */}
            <div>
                <label htmlFor="subject" className="text-label block mb-2">
                    What&apos;s this about?
                </label>
                <select
                    id="subject"
                    name="subject"
                    required
                    className="input w-full"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                >
                    {subjectOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Conditional Speaking Fields - Animate in */}
            {isSpeakingInquiry && (
                <div className="space-y-6 py-4 border-t border-b border-[var(--color-border)] animate-fade-in">
                    <p className="text-body text-[var(--color-ink-muted)] mb-4 bg-[var(--color-paper-soft)] p-4 rounded-md">
                        <strong>Great!</strong> Tell me a bit about your event so I can check availability.
                    </p>

                    {/* Organization / Group */}
                    <div>
                        <label htmlFor="org" className="text-label block mb-2">Church / Group Name <span className="text-[var(--color-ink-faint)] lowercase font-normal">(optional)</span></label>
                        <input
                            type="text"
                            id="org"
                            name="organization"
                            className="input"
                            placeholder="e.g. Grace Community Church or Monday Night Mamas"
                        />
                    </div>

                    {/* Event Details Row */}
                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="event_date" className="text-label block mb-2">Event Date(s)</label>
                            <DatePicker id="event_date" name="event_date" required={isSpeakingInquiry} />
                        </div>
                        <div>
                            <label htmlFor="location" className="text-label block mb-2">Location (City, State)</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                required={isSpeakingInquiry}
                                className="input"
                                placeholder="e.g. Denver, CO"
                            />
                        </div>
                    </div>

                    {/* Event Context Row */}
                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="event_type" className="text-label block mb-2">Event Type</label>
                            <select
                                id="event_type"
                                name="event_type"
                                className="input"
                            >
                                <option value="">Select a type...</option>
                                <option value="Bible Study / Small Group">Bible Study / Small Group</option>
                                <option value="Retreat">Retreat</option>
                                <option value="MOPS/Moms Group">MOPS/Moms Group</option>
                                <option value="Conference">Conference</option>
                                <option value="Sunday Service">Sunday Service</option>
                                <option value="Workshop">Workshop</option>
                                <option value="Virtual Event">Virtual Event</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="audience_size" className="text-label block mb-2">Approx. Group Size</label>
                            <select
                                id="audience_size"
                                name="audience_size"
                                className="input"
                            >
                                <option value="">Select size...</option>
                                <option value="Small Group (< 20)">Small Group (&lt; 20)</option>
                                <option value="20-50">20 - 50</option>
                                <option value="50-150">50 - 150</option>
                                <option value="150+">150+</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Message */}
            <div>
                <label htmlFor="message" className="text-label block mb-2">
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="input w-full resize-none"
                    placeholder={isSpeakingInquiry ? "Tell me about your event theme or vision..." : "How can I help you?"}
                />
            </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={status === "submitting"}
                className="btn btn-primary w-full md:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {status === "submitting" ? (
                    <>
                        Sending...
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
                    </>
                ) : (
                    <>
                        Send Message
                        <ArrowIcon />
                    </>
                )}
            </button>
        </form>
    );
}
