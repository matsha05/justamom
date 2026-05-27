"use client";

import { useEffect, useReducer, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Loader2 } from "lucide-react";
import { ArrowIcon } from "@/components/icons";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { SpeakingEventFields } from "@/components/forms/SpeakingEventFields";
import { useContactFormSubmission } from "@/hooks/useContactFormSubmission";
import {
  CONTACT_SUBJECT_SPEAKING_INQUIRY,
  contactSubjectOptions,
} from "@/lib/content";
import { conversionMessages, conversionSources } from "@/lib/conversions";

interface ContactFormState {
  selectedSubject: string;
  eventType: string;
  audienceSize: string;
  subjectError: string | null;
  selectError: string | null;
}

type ContactFormAction =
  | { type: "subjectChanged"; value: string }
  | { type: "eventTypeChanged"; value: string }
  | { type: "audienceSizeChanged"; value: string }
  | { type: "subjectError"; message: string | null }
  | { type: "selectError"; message: string | null }
  | { type: "clearErrors" }
  | { type: "reset" };

const initialContactFormState: ContactFormState = {
  selectedSubject: "",
  eventType: "",
  audienceSize: "",
  subjectError: null,
  selectError: null,
};

function contactFormReducer(
  state: ContactFormState,
  action: ContactFormAction
): ContactFormState {
  switch (action.type) {
    case "subjectChanged":
      return { ...state, selectedSubject: action.value, subjectError: null };
    case "eventTypeChanged":
      return { ...state, eventType: action.value, selectError: null };
    case "audienceSizeChanged":
      return { ...state, audienceSize: action.value, selectError: null };
    case "subjectError":
      return { ...state, subjectError: action.message };
    case "selectError":
      return { ...state, selectError: action.message };
    case "clearErrors":
      return { ...state, subjectError: null, selectError: null };
    case "reset":
      return initialContactFormState;
  }
}

export function ContactForm() {
  const {
    status,
    isSubmitting,
    isSuccess,
    successMessage,
    formError,
    submitContactForm,
    clearError,
    clearFeedbackOnInputChange,
  } = useContactFormSubmission();
  const [
    { selectedSubject, eventType, audienceSize, subjectError, selectError },
    dispatch,
  ] = useReducer(contactFormReducer, initialContactFormState);
  const successBannerRef = useRef<HTMLDivElement>(null);

  const isSpeakingInquiry = selectedSubject === CONTACT_SUBJECT_SPEAKING_INQUIRY;
  const subjectErrorId = "subject-error";
  const selectErrorId = "contact-speaking-select-error";
  const successMessageId = "contact-success-message";

  useEffect(() => {
    if (status === "success") {
      successBannerRef.current?.focus();
    }
  }, [status]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();

    if (!selectedSubject) {
      dispatch({ type: "subjectError", message: "Please select a topic." });
      return;
    }

    if (isSpeakingInquiry && (!eventType || !audienceSize)) {
      dispatch({
        type: "selectError",
        message: "Please select an event type and group size.",
      });
      return;
    }

    dispatch({ type: "clearErrors" });

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
      dispatch({ type: "reset" });
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

      {formError ? (
        <div
          role="alert"
          aria-live="assertive"
          className="delight-panel delight-panel-error"
        >
          {formError}
        </div>
      ) : null}

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

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            autoComplete="name"
            required
            placeholder="Your name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">What&apos;s this about?</Label>
        <Select
          required
          value={selectedSubject}
          onValueChange={(value) => {
            dispatch({ type: "subjectChanged", value });
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
            onEventTypeChange={(value) => {
              dispatch({ type: "eventTypeChanged", value });
            }}
            onAudienceSizeChange={(value) => {
              dispatch({ type: "audienceSizeChanged", value });
            }}
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

      <Button type="submit" disabled={isSubmitting || isSuccess} className="w-full md:w-auto">
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending…
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
