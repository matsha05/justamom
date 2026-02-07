"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { ArrowIcon } from "@/components/icons";
import { Label } from "@/components/ui/label";
import { useSubmitState } from "@/hooks/useSubmitState";
import { fetchJson, getStringFromRecord } from "@/lib/client/http";
import { newsletterCtaCopy } from "@/lib/content";

interface NewsletterFormProps {
  variant?: "default" | "compact" | "hero";
  className?: string;
}

interface EmailFieldProps {
  inputId: string;
  email: string;
  isSubmitting: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  placeholder: string;
  className: string;
  onChange: (value: string) => void;
}

interface FeedbackMessagesProps {
  inputId: string;
  errorMessage: string | null;
  successMessage: string | null;
}

function EmailField({
  inputId,
  email,
  isSubmitting,
  errorMessage,
  successMessage,
  placeholder,
  className,
  onChange,
}: EmailFieldProps) {
  const errorId = `${inputId}-error`;
  const successId = `${inputId}-success`;

  return (
    <Input
      type="email"
      value={email}
      onChange={(e) => onChange(e.target.value)}
      id={inputId}
      autoComplete="email"
      aria-describedby={errorMessage ? errorId : successMessage ? successId : undefined}
      aria-invalid={Boolean(errorMessage)}
      placeholder={placeholder}
      required
      disabled={isSubmitting}
      className={className}
    />
  );
}

function FeedbackMessages({
  inputId,
  errorMessage,
  successMessage,
}: FeedbackMessagesProps) {
  if (!errorMessage && !successMessage) {
    return null;
  }

  return (
    <>
      {errorMessage ? (
        <p
          id={`${inputId}-error`}
          role="alert"
          aria-live="assertive"
          className="text-caption text-[var(--color-error)]"
        >
          {errorMessage}
        </p>
      ) : null}
      {successMessage ? (
        <p
          id={`${inputId}-success`}
          role="status"
          aria-live="polite"
          className="text-caption text-[var(--color-success)]"
        >
          {successMessage}
        </p>
      ) : null}
    </>
  );
}

export function NewsletterForm({
  variant = "default",
  className = "",
}: NewsletterFormProps) {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const { status, setStatus, isSubmitting } = useSubmitState();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const buttonText = newsletterCtaCopy.button;
  const isInlineVariant = variant === "compact" || variant === "hero";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const { response, data } = await fetchJson("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const message =
          getStringFromRecord(data, "message") ?? "You're in! Check your inbox.";
        setStatus("success");
        setEmail("");
        setSuccessMessage(message);
        toast.success(message);
        return;
      }

      const message =
        getStringFromRecord(data, "error") ?? "Something went wrong. Please try again.";
      setStatus("error");
      setErrorMessage(message);
      toast.error(message);
    } catch {
      const message = "Network error. Please try again.";
      setStatus("error");
      setErrorMessage(message);
      toast.error(message);
    }
  };

  const resetMessages = (value: string) => {
    setEmail(value);
    if (errorMessage) setErrorMessage(null);
    if (successMessage) setSuccessMessage(null);
    if (status !== "idle") setStatus("idle");
  };

  return (
    <form onSubmit={handleSubmit} className={className} aria-busy={isSubmitting}>
      <div className={isInlineVariant ? "space-y-2" : "space-y-4"}>
        <Label htmlFor={inputId} className="text-caption text-[var(--color-ink-muted)]">
          Email address
        </Label>

        <div className={isInlineVariant ? "flex flex-col sm:flex-row gap-3" : "space-y-2"}>
          <EmailField
            inputId={inputId}
            email={email}
            isSubmitting={isSubmitting}
            errorMessage={errorMessage}
            successMessage={successMessage}
            placeholder={isInlineVariant ? "Your email" : "Enter your email"}
            className={isInlineVariant ? "flex-1" : "w-full"}
            onChange={resetMessages}
          />
          {isInlineVariant ? (
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
          ) : null}
        </div>

        <FeedbackMessages
          inputId={inputId}
          errorMessage={errorMessage}
          successMessage={successMessage}
        />

        {!isInlineVariant ? (
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
        ) : null}
      </div>
    </form>
  );
}
