"use client";

import { useId } from "react";
import { Input } from "@/components/ui/input";
import { CircleAlert, CircleCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { FormSubmitButton } from "@/components/forms/FormPrimitives";
import {
  conversionSources,
  type ConversionSource,
} from "@/lib/conversions";
import { useNewsletterSubmission } from "@/hooks/useNewsletterSubmission";

interface NewsletterFormProps {
  className?: string;
  source?: ConversionSource;
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
          className="status-inline status-inline-error"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          {errorMessage}
        </p>
      ) : null}
      {successMessage ? (
        <p
          id={`${inputId}-success`}
          role="status"
          aria-live="polite"
          className="status-inline status-inline-success"
        >
          <CircleCheck className="mt-0.5 size-4 shrink-0" />
          {successMessage}
        </p>
      ) : null}
    </>
  );
}

export function NewsletterForm({
  className = "",
  source = conversionSources.site,
}: NewsletterFormProps) {
  const inputId = useId();
  const {
    email,
    errorMessage,
    successMessage,
    isSubmitting,
    submitNewsletter,
    updateEmail,
  } = useNewsletterSubmission({ source });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitNewsletter();
  };

  return (
    <form onSubmit={handleSubmit} className={className} aria-busy={isSubmitting}>
      <div className="space-y-2">
        <Label htmlFor={inputId} className="text-caption text-[var(--color-ink-muted)]">
          Email address
        </Label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <EmailField
            inputId={inputId}
            email={email}
            isSubmitting={isSubmitting}
            errorMessage={errorMessage}
            successMessage={successMessage}
            placeholder="Your email"
            className="flex-1"
            onChange={updateEmail}
          />
          <FormSubmitButton
            isSubmitting={isSubmitting}
            submittingLabel="Joining…"
          >
            Join the notes
          </FormSubmitButton>
        </div>

        <FeedbackMessages
          inputId={inputId}
          errorMessage={errorMessage}
          successMessage={successMessage}
        />
      </div>
    </form>
  );
}
