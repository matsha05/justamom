"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { ArrowIcon } from "@/components/icons";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { SpeakingEventFields } from "@/components/forms/SpeakingEventFields";
import { useContactFormSubmission } from "@/hooks/useContactFormSubmission";

export function SpeakingInquiryForm() {
  const {
    status,
    isSubmitting,
    successMessage,
    formError,
    submitContactForm,
    clearError,
    resetFeedback,
    clearFeedbackOnInputChange,
  } = useContactFormSubmission();
  const [eventType, setEventType] = useState("");
  const [audienceSize, setAudienceSize] = useState("");
  const [selectError, setSelectError] = useState<string | null>(null);
  const successBannerRef = useRef<HTMLDivElement>(null);

  const selectErrorId = "speaking-select-error";
  const successMessageId = "speaking-success-message";

  useEffect(() => {
    if (status === "success") {
      successBannerRef.current?.focus();
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();

    if (!eventType || !audienceSize) {
      setSelectError("Please select an event type and group size.");
      return;
    }

    setSelectError(null);

    const form = e.currentTarget;
    const result = await submitContactForm({
      form,
      formType: "speaking",
      subject: "New Speaking Inquiry",
      successFallbackMessage: "Inquiry received! I will follow up soon.",
    });

    if (result.ok) {
      form.reset();
      setEventType("");
      setAudienceSize("");
    }
  };

  if (status === "success") {
    return (
      <div
        ref={successBannerRef}
        id={successMessageId}
        role="status"
        aria-live="polite"
        tabIndex={-1}
        className="animate-fade-in border-l border-[var(--color-border-strong)] pl-5 space-y-4"
      >
        <div className="flex items-start gap-3">
          <CheckCircle className="mt-1 h-5 w-5 text-[var(--color-success)]" />
          <div className="space-y-1">
            <h3 className="text-h4">Thanks for reaching out.</h3>
            <p className="text-body max-w-[58ch]">
              {successMessage ||
                "Thank you so much for considering me for your event. I've received your details and will get back to you shortly."}
            </p>
          </div>
        </div>
        <Button type="button" variant="outline" onClick={resetFeedback}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onChange={clearFeedbackOnInputChange}
      className="space-y-6 animate-fade-in"
      aria-busy={isSubmitting}
    >
      <HoneypotField />

      {formError ? (
        <div
          role="alert"
          aria-live="assertive"
          className="rounded-md border border-[var(--color-error)]/30 bg-[var(--color-paper-soft)] px-4 py-3 text-caption text-[var(--color-error)]"
        >
          {formError}
        </div>
      ) : null}

      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="name">Your Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            autoComplete="name"
            required
            placeholder="Jane Doe"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            required
            placeholder="jane@example.com"
          />
        </div>
      </div>

      <SpeakingEventFields
        required
        eventType={eventType}
        audienceSize={audienceSize}
        onEventTypeChange={(value) => {
          setEventType(value);
          setSelectError(null);
        }}
        onAudienceSizeChange={(value) => {
          setAudienceSize(value);
          setSelectError(null);
        }}
        selectError={selectError}
        selectErrorId={selectErrorId}
      />

      <div className="space-y-2">
        <Label htmlFor="message">Tell me about your event theme or vision</Label>
        <Textarea
          id="message"
          name="message"
          rows={4}
          placeholder="What is the heart behind this gathering?"
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send message
            <ArrowIcon />
          </>
        )}
      </Button>
    </form>
  );
}
