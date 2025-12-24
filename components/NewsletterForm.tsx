"use client";

import { useState } from "react";
import { ArrowIcon } from "@/components/icons";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

interface NewsletterFormProps {
    variant?: "default" | "compact" | "hero";
    className?: string;
}

export function NewsletterForm({
    variant = "default",
    className = "",
}: NewsletterFormProps) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<SubmitStatus>("idle");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");
        setMessage("");

        try {
            const response = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("success");
                setMessage(data.message || "You're in! Check your inbox.");
                setEmail("");
            } else {
                setStatus("error");
                setMessage(data.error || "Something went wrong. Please try again.");
            }
        } catch {
            setStatus("error");
            setMessage("Network error. Please try again.");
        }
    };

    // Success state
    if (status === "success") {
        return (
            <div className={`text-center ${className}`}>
                <div className="inline-flex items-center gap-2 text-[var(--color-success)]">
                    <svg
                        className="w-5 h-5"
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
                    <span className="text-body font-medium">{message}</span>
                </div>
            </div>
        );
    }

    // Compact variant (single line)
    if (variant === "compact" || variant === "hero") {
        return (
            <form onSubmit={handleSubmit} className={className}>
                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email"
                        required
                        className="input flex-1"
                    />
                    <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="btn btn-primary whitespace-nowrap disabled:opacity-60"
                    >
                        {status === "submitting" ? (
                            "Subscribing..."
                        ) : (
                            <>
                                {variant === "hero" ? "Get the Notes" : "Subscribe"}
                                <ArrowIcon />
                            </>
                        )}
                    </button>
                </div>
                {status === "error" && (
                    <p className="text-sm text-[var(--color-error)] mt-2">{message}</p>
                )}
            </form>
        );
    }

    // Default variant (stacked)
    return (
        <form onSubmit={handleSubmit} className={className}>
            <div className="space-y-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="input w-full"
                />
                <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="btn btn-primary w-full disabled:opacity-60"
                >
                    {status === "submitting" ? (
                        "Subscribing..."
                    ) : (
                        <>
                            Get the Notes
                            <ArrowIcon />
                        </>
                    )}
                </button>
            </div>
            {status === "error" && (
                <p className="text-sm text-[var(--color-error)] mt-3">{message}</p>
            )}
        </form>
    );
}
