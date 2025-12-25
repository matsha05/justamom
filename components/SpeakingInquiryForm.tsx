"use client";

import { useState } from "react";
import { ArrowIcon } from "@/components/icons";
import { DatePicker } from "./DatePicker";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function SpeakingInquiryForm() {
    const [status, setStatus] = useState<SubmitStatus>("idle");
    const [isExpanded, setIsExpanded] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("submitting");
        setErrorMessage("");

        const form = e.currentTarget;
        const formData = new FormData(form);

        // Add a hidden subject field to identify this as a Speaking Inquiry in Formspree
        formData.append("subject", "New Speaking Inquiry");

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

    if (status === "success") {
        return (
            <div className="bg-white p-8 rounded-xl border border-[var(--color-border)] shadow-sm text-center animate-fade-in">
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
                <h3 className="text-h3 mb-3">Inquiry Received!</h3>
                <p className="text-body text-[var(--color-ink-muted)] mb-6 max-w-md mx-auto">
                    Thank you so much for considering me for your event. I&apos;ve received your details and will get back to you shortly.
                </p>
                <button
                    onClick={() => setStatus("idle")}
                    className="btn btn-secondary"
                >
                    Send Another Inquiry
                </button>
            </div>
        );
    }

    if (!isExpanded) {
        return (
            <div className="text-center">
                <button
                    onClick={() => setIsExpanded(true)}
                    className="btn btn-primary"
                >
                    Check Availability
                    <ArrowIcon />
                </button>
                <p className="text-caption text-[var(--color-ink-muted)] mt-4">
                    Takes about 2 minutes to fill out
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 md:p-8 rounded-xl border border-[var(--color-border)] shadow-sm animate-fade-in relative">
            <button
                onClick={() => setIsExpanded(false)}
                className="absolute top-4 right-4 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] p-2"
                aria-label="Close form"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            <h3 className="text-h3 mb-2">Check Availability</h3>
            <p className="text-body text-[var(--color-ink-muted)] mb-8">
                Tell me a little about your event, and let&apos;s see if we&apos;re a good fit.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                {status === "error" && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {errorMessage}
                    </div>
                )}

                {/* Contact Info Group */}
                <div className="grid md:grid-cols-2 gap-5">
                    <div>
                        <label htmlFor="name" className="text-label block mb-2">Your Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            className="input"
                            placeholder="Jane Doe"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="text-label block mb-2">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="input"
                            placeholder="jane@example.com"
                        />
                    </div>
                </div>

                {/* Organization */}
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

                {/* Event Details Group */}
                <div className="grid md:grid-cols-2 gap-5">
                    <div>
                        <label htmlFor="event_date" className="text-label block mb-2">Event Date(s)</label>
                        <DatePicker id="event_date" name="event_date" required />
                    </div>
                    <div>
                        <label htmlFor="location" className="text-label block mb-2">Location (City, State)</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            required
                            className="input"
                            placeholder="e.g. Denver, CO"
                        />
                    </div>
                </div>

                {/* Event Context Group */}
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

                {/* Message */}
                <div>
                    <label htmlFor="message" className="text-label block mb-2">
                        Tell me about your event theme or vision
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        rows={4}
                        className="input resize-none"
                        placeholder="What is the heart behind this gathering?"
                    />
                </div>

                {/* Budget (Optional) */}
                <div>
                    <label htmlFor="budget" className="text-label block mb-2">
                        Speaking Budget <span className="text-[var(--color-ink-faint)] lowercase font-normal">(optional)</span>
                    </label>
                    <input
                        type="text"
                        id="budget"
                        name="budget"
                        className="input"
                        placeholder="e.g. $1,500 + travel"
                    />
                </div>

                <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="btn btn-primary w-full justify-center"
                >
                    {status === "submitting" ? (
                        <>
                            Sending...
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        </>
                    ) : (
                        <>
                            Submit Inquiry
                            <ArrowIcon />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
