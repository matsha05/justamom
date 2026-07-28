"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle } from "lucide-react";
import {
  FormErrorMessage,
  FormSubmitButton,
  IdentityFields,
} from "@/components/forms/FormPrimitives";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { SpeakingEventFields } from "@/components/forms/SpeakingEventFields";
import { useContactFormSubmission } from "@/hooks/useContactFormSubmission";
import { useSpeakingEventDetails } from "@/hooks/useSpeakingEventDetails";
import {
  CONTACT_SUBJECT_SPEAKING_INQUIRY,
  contactSubjectOptions,
} from "@/lib/content";
import { conversionMessages, conversionSources } from "@/lib/conversions";

export function ContactForm() {
  const {
    isSubmitting,
    isSuccess,
    successMessage,
    formError,
    successBannerRef,
    submitContactForm,
    clearError,
    clearFeedbackOnInputChange,
  } = useContactFormSubmission();
  const [selectedSubject, setSelectedSubject] = useState("");
  const [subjectError, setSubjectError] = useState<string | null>(null);
  const {
    eventType,
    audienceSize,
    selectError,
    updateEventType,
    updateAudienceSize,
    validateRequiredDetails,
    clearValidationError,
    resetDetails,
  } = useSpeakingEventDetails();

  const isSpeakingInquiry = selectedSubject === CONTACT_SUBJECT_SPEAKING_INQUIRY;
  const subjectErrorId = "subject-error";
  const selectErrorId = "contact-speaking-select-error";
  const successMessageId = "contact-success-message";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();

    if (!selectedSubject) {
      setSubjectError("Please select a topic.");
      return;
    }

    if (isSpeakingInquiry && !validateRequiredDetails()) {
      return;
    }

    setSubjectError(null);
    clearValidationError();

    const form = e.currentTarget;
    const formType = isSpeakingInquiry ? "speaking" : "contact";
    const result = await submitContactForm({
      form,
      formType,
      source: conversionSources.contactPage,
      subject: selectedSubject,
      successFallbackMessage:
        formType === "speaking"
          ? conversionMessages.speakingSuccess
          : conversionMessages.contactSuccess,
    });

    if (result.ok) {
      form.reset();
      setSelectedSubject("");
      setSubjectError(null);
      resetDetails();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onChange={clearFeedbackOnInputChange}
      aria-busy={isSubmitting}
      className="space-y-6 animate-fade-in"
    >
      <HoneypotField />

      <FormErrorMessage message={formError} />

      {successMessage ? (
        <div
          ref={successBannerRef}
          id={successMessageId}
          className="delight-panel delight-panel-success"
          aria-live="polite"
          tabIndex={-1}
        >
          <CheckCircle className="delight-panel-icon size-5 text-[var(--color-success)] mt-0.5" />
          <div className="space-y-1">
            <p className="text-body font-medium">Message sent.</p>
            <p className="text-caption text-[var(--color-ink-muted)]">{successMessage}</p>
          </div>
        </div>
      ) : null}

      <IdentityFields />

      <div className="space-y-2">
        <Label htmlFor="subject">What&apos;s this about?</Label>
        <Select
          required
          value={selectedSubject}
          onValueChange={(value) => {
            setSelectedSubject(value);
            setSubjectError(null);
          }}
        >
          <SelectTrigger
            id="subject"
            aria-invalid={Boolean(subjectError)}
            aria-describedby={subjectError ? subjectErrorId : undefined}
          >
            <SelectValue placeholder="Select a topic…" />
          </SelectTrigger>
          <SelectContent>
            {contactSubjectOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" name="subject" value={selectedSubject} required />
        {subjectError ? (
          <p
            id={subjectErrorId}
            role="alert"
            aria-live="assertive"
            className="text-caption text-[var(--color-error)]"
          >
            {subjectError}
          </p>
        ) : null}
      </div>

      {isSpeakingInquiry ? (
        <div className="space-y-6 py-4 border-t border-b border-[var(--color-border)] animate-fade-in">
          <p className="text-body bg-[var(--color-paper-soft)] p-4 rounded-md">
            <strong>Great!</strong> Tell me a bit about your event so I can check
            availability.
          </p>

          <SpeakingEventFields
            required
            eventType={eventType}
            audienceSize={audienceSize}
            onEventTypeChange={updateEventType}
            onAudienceSizeChange={updateAudienceSize}
            selectError={selectError}
            selectErrorId={selectErrorId}
          />
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder={
            isSpeakingInquiry
              ? "Tell me about your event theme or vision…"
              : "How can I help you?"
          }
        />
      </div>

      <FormSubmitButton
        isSubmitting={isSubmitting}
        disabled={isSuccess}
        className="w-full md:w-auto"
      />
    </form>
  );
}
