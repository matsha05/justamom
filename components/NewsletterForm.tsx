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
  renderMessages?: boolean;
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
  renderMessages = true,
}: EmailFieldProps) {
  const errorId = `${inputId}-error`;
  const successId = `${inputId}-success`;

  return (
    <>
      <Input
        type="email"
        value={email}
        onChange={(e) => onChange(e.target.value)}
        id={inputId}
        aria-describedby={errorMessage ? errorId : successMessage ? successId : undefined}
        aria-invalid={Boolean(errorMessage)}
        placeholder={placeholder}
        required
        disabled={isSubmitting}
        className={className}
      />
      {renderMessages && errorMessage ? (
        <p id={errorId} className="text-caption text-[var(--color-error)]">
          {errorMessage}
        </p>
      ) : null}
      {renderMessages && successMessage ? (
        <p id={successId} className="text-caption text-[var(--color-success)]">
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

  if (variant === "compact" || variant === "hero") {
    return (
      <form onSubmit={handleSubmit} className={className} aria-busy={isSubmitting}>
        <div className="space-y-2">
          <Label htmlFor={inputId} className="text-caption text-[var(--color-ink-muted)]">
            Email address
          </Label>
          <div className="flex flex-col sm:flex-row gap-3">
            <EmailField
              inputId={inputId}
              email={email}
              isSubmitting={isSubmitting}
              errorMessage={errorMessage}
              successMessage={successMessage}
              placeholder="Your email"
              className="flex-1"
              onChange={resetMessages}
              renderMessages={false}
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
            <p id={`${inputId}-error`} className="text-caption text-[var(--color-error)]">
              {errorMessage}
            </p>
          ) : null}
          {successMessage ? (
            <p id={`${inputId}-success`} className="text-caption text-[var(--color-success)]">
              {successMessage}
            </p>
          ) : null}
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className} aria-busy={isSubmitting}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={inputId} className="text-caption text-[var(--color-ink-muted)]">
            Email address
          </Label>
          <EmailField
            inputId={inputId}
            email={email}
            isSubmitting={isSubmitting}
            errorMessage={errorMessage}
            successMessage={successMessage}
            placeholder="Enter your email"
            className="w-full"
            onChange={resetMessages}
          />
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
