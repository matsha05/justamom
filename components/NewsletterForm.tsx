"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ArrowIcon } from "@/components/icons";
import { Label } from "@/components/ui/label";

type SubmitStatus = "idle" | "submitting" | "success";

interface NewsletterFormProps {
    variant?: "default" | "compact" | "hero";
    className?: string;
}

export function NewsletterForm({
    variant = "default",
    className = "",
}: NewsletterFormProps) {
    const inputId = useId();
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<SubmitStatus>("idle");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");
        setErrorMessage(null);
        setSuccessMessage(null);
        try {
            const response = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json().catch(() => null);

            if (response.ok) {
                setStatus("success");
                setEmail("");
                const message =
                    data?.data?.message || data?.message || "You're in! Check your inbox.";
                setSuccessMessage(message);
                toast.success(message);
            } else {
                setStatus("idle");
                const message =
                    data?.error?.message || data?.error || "Something went wrong. Please try again.";
                setErrorMessage(message);
                toast.error(message);
            }
        } catch {
            setStatus("idle");
            const message = "Network error. Please try again.";
            setErrorMessage(message);
            toast.error(message);
        }
    };

    const isSubmitting = status === "submitting";
    const errorId = `${inputId}-error`;
    const successId = `${inputId}-success`;
    const buttonText = "Join A Note for Moms";

    // Compact variant (single line)
    if (variant === "compact" || variant === "hero") {
        return (
            <form onSubmit={handleSubmit} className={className}>
                <div className="space-y-2">
                    <Label htmlFor={inputId} className="text-caption text-[var(--color-ink-muted)]">
                        Email address
                    </Label>
                    <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (errorMessage) setErrorMessage(null);
                            if (successMessage) setSuccessMessage(null);
                        }}
                        id={inputId}
                        aria-describedby={
                            errorMessage ? errorId : successMessage ? successId : undefined
                        }
                        aria-invalid={Boolean(errorMessage)}
                        placeholder="Your email"
                        required
                        disabled={isSubmitting}
                        className="flex-1"
                    />
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Joining...
                            </>
                        ) : (
                            <>
                                {buttonText}
                                <ArrowIcon />
                            </>
                        )}
                    </Button>
                    </div>
                    {errorMessage ? (
                        <p id={errorId} className="text-caption text-[var(--color-error)]">
                            {errorMessage}
                        </p>
                    ) : null}
                    {successMessage ? (
                        <p id={successId} className="text-caption text-[var(--color-success)]">
                            {successMessage}
                        </p>
                    ) : null}
                </div>
            </form>
        );
    }

    // Default variant (stacked)
    return (
        <form onSubmit={handleSubmit} className={className}>
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor={inputId} className="text-caption text-[var(--color-ink-muted)]">
                        Email address
                    </Label>
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                        if (successMessage) setSuccessMessage(null);
                    }}
                    id={inputId}
                    aria-describedby={
                        errorMessage ? errorId : successMessage ? successId : undefined
                    }
                    aria-invalid={Boolean(errorMessage)}
                    placeholder="Enter your email"
                    required
                    disabled={isSubmitting}
                    className="w-full"
                />
                {errorMessage ? (
                    <p id={errorId} className="text-caption text-[var(--color-error)]">
                        {errorMessage}
                    </p>
                ) : null}
                {successMessage ? (
                    <p id={successId} className="text-caption text-[var(--color-success)]">
                        {successMessage}
                    </p>
                ) : null}
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Joining...
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
