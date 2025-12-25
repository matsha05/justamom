"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { ArrowIcon } from "@/components/icons";

type SubmitStatus = "idle" | "submitting" | "success";

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");

        try {
            const response = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("success");
                setEmail("");
                toast.success(data.message || "You're in! Check your inbox.");
            } else {
                setStatus("idle");
                toast.error(data.error || "Something went wrong. Please try again.");
            }
        } catch {
            setStatus("idle");
            toast.error("Network error. Please try again.");
        }
    };

    // Success state
    if (status === "success") {
        return (
            <div className={`flex justify-center ${className}`}>
                <div className="flex items-center gap-2 text-[var(--color-success)]">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-body font-medium">You&apos;re on the list!</span>
                </div>
            </div>
        );
    }

    const isSubmitting = status === "submitting";
    const buttonText = variant === "hero" ? "Get the Notes" : "Subscribe";

    // Compact variant (single line)
    if (variant === "compact" || variant === "hero") {
        return (
            <form onSubmit={handleSubmit} className={className}>
                <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email"
                        required
                        disabled={isSubmitting}
                        className="flex-1"
                    />
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Subscribing...
                            </>
                        ) : (
                            <>
                                {buttonText}
                                <ArrowIcon />
                            </>
                        )}
                    </Button>
                </div>
            </form>
        );
    }

    // Default variant (stacked)
    return (
        <form onSubmit={handleSubmit} className={className}>
            <div className="space-y-4">
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={isSubmitting}
                    className="w-full"
                />
                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Subscribing...
                        </>
                    ) : (
                        <>
                            Get the Notes
                            <ArrowIcon />
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
