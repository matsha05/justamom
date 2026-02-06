"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
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
import { useSubmitState } from "@/hooks/useSubmitState";
import { fetchJson, getStringFromRecord } from "@/lib/client/http";
import { contactSubjectOptions } from "@/lib/content";

export function ContactForm() {
  const { status, setStatus, isSubmitting, isSuccess } = useSubmitState();
  const [selectedSubject, setSelectedSubject] = useState("");
  const [eventType, setEventType] = useState("");
  const [audienceSize, setAudienceSize] = useState("");
  const [subjectError, setSubjectError] = useState<string | null>(null);
  const [selectError, setSelectError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const successBannerRef = useRef<HTMLDivElement>(null);

  const isSpeakingInquiry = selectedSubject === "Speaking Inquiry";
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

    if (!selectedSubject) {
      setSubjectError("Please select a topic.");
      setFormError(null);
      return;
    }

    if (isSpeakingInquiry && (!eventType || !audienceSize)) {
      setSelectError("Please select an event type and group size.");
      setFormError(null);
      return;
    }

    setStatus("submitting");
    setSubjectError(null);
    setSelectError(null);
    setSuccessMessage(null);
    setFormError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("form_type", "contact");

    try {
      const { response, data } = await fetchJson("/api/contact", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const message =
          getStringFromRecord(data, "message") ??
          "Message sent! I will get back to you as soon as I can.";

        setStatus("success");
        setSuccessMessage(message);
        form.reset();
        setSelectedSubject("");
        setEventType("");
        setAudienceSize("");
        return;
      }

      const message =
        getStringFromRecord(data, "error") ??
        "Something went wrong. Please try again.";
      toast.error(message);
      setFormError(message);
      setStatus("error");
    } catch {
      const message = "Network error. Please check your connection and try again.";
      toast.error(message);
      setFormError(message);
      setStatus("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onChange={() => {
        if (formError) {
          setFormError(null);
        }
        if (isSuccess) {
          setStatus("idle");
          setSuccessMessage(null);
        }
      }}
      aria-busy={isSubmitting}
      className="space-y-6 animate-fade-in"
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

      {successMessage ? (
        <div
          ref={successBannerRef}
          id={successMessageId}
          className="rounded-md border border-[var(--color-accent-soft)] bg-[var(--color-paper-soft)] px-4 py-3 text-[var(--color-ink)] flex items-start gap-3"
          role="status"
          aria-live="polite"
          tabIndex={-1}
        >
          <CheckCircle className="w-5 h-5 text-[var(--color-success)] mt-0.5" />
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
            setSelectedSubject(value);
            setSubjectError(null);
          }}
        >
          <SelectTrigger
            id="subject"
            aria-invalid={Boolean(subjectError)}
            aria-describedby={subjectError ? subjectErrorId : undefined}
          >
            <SelectValue placeholder="Select a topic..." />
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
              ? "Tell me about your event theme or vision..."
              : "How can I help you?"
          }
        />
      </div>

      <Button type="submit" disabled={isSubmitting || isSuccess} className="w-full md:w-auto">
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
