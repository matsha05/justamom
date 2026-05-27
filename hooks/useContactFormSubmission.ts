"use client";

import { useState } from "react";
import { toast } from "sonner";
import { track } from "@vercel/analytics";
import { analyticsEvents } from "@/lib/analytics/events";
import { useSubmitState } from "@/hooks/useSubmitState";
import { useIdempotencyKey } from "@/hooks/useIdempotencyKey";
import {
  conversionMessages,
  conversionSources,
  getCurrentPagePath,
  type ConversionSource,
} from "@/lib/conversions";
import {
  fetchJson,
  formatRetryAfterMessage,
  getRetryAfterSeconds,
  getStringFromRecord,
} from "@/lib/client/http";

interface SubmitContactFormOptions {
  form: HTMLFormElement;
  formType: "contact" | "speaking";
  subject?: string;
  source?: ConversionSource;
  successFallbackMessage: string;
  errorFallbackMessage?: string;
  networkErrorMessage?: string;
}

interface SubmitContactFormResult {
  ok: boolean;
  message: string;
}

export function useContactFormSubmission() {
  const { status, setStatus, isSubmitting, isSuccess } = useSubmitState();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const { getKey, resetKey } = useIdempotencyKey();

  async function submitContactForm({
    form,
    formType,
    subject,
    source = formType === "speaking"
      ? conversionSources.speakingPage
      : conversionSources.contactPage,
    successFallbackMessage,
    errorFallbackMessage = conversionMessages.contactError,
    networkErrorMessage = conversionMessages.networkError,
  }: SubmitContactFormOptions): Promise<SubmitContactFormResult> {
    setStatus("submitting");
    setSuccessMessage(null);
    setFormError(null);

    const formData = new FormData(form);
    const pagePath = getCurrentPagePath();
    formData.set("form_type", formType);
    formData.set("source", source);

    if (pagePath) {
      formData.set("page_path", pagePath);
    }

    if (subject) {
      formData.set("subject", subject);
    }

    const trackingProps = {
      source,
      form_type: formType,
      page_path: pagePath,
    };
    track(
      formType === "speaking"
        ? analyticsEvents.speakingInquiryStart
        : analyticsEvents.contactInquiryStart,
      trackingProps
    );

    try {
      const { response, data } = await fetchJson("/api/contact", {
        method: "POST",
        body: formData,
        headers: {
          "idempotency-key": getKey(),
        },
      });

      if (response.ok) {
        const message = getStringFromRecord(data, "message") ?? successFallbackMessage;
        setStatus("success");
        setSuccessMessage(message);
        track(
          formType === "speaking"
            ? analyticsEvents.speakingInquirySuccess
            : analyticsEvents.contactInquirySuccess,
          trackingProps
        );
        resetKey();
        return { ok: true, message };
      }

      if (response.status === 429) {
        const retryAfterSeconds = getRetryAfterSeconds(response);
        if (retryAfterSeconds) {
          const message = formatRetryAfterMessage(retryAfterSeconds);
          toast.error(message);
          setFormError(message);
          setStatus("error");
          return { ok: false, message };
        }
      }

      const message = getStringFromRecord(data, "error") ?? errorFallbackMessage;
      toast.error(message);
      setFormError(message);
      setStatus("error");
      return { ok: false, message };
    } catch {
      toast.error(networkErrorMessage);
      setFormError(networkErrorMessage);
      setStatus("error");
      return { ok: false, message: networkErrorMessage };
    }
  }

  function clearError() {
    if (formError) {
      setFormError(null);
    }
  }

  function resetFeedback() {
    if (status !== "idle") {
      setStatus("idle");
    }

    if (successMessage) {
      setSuccessMessage(null);
    }

    if (formError) {
      setFormError(null);
    }

    resetKey();
  }

  function clearFeedbackOnInputChange(event?: { isTrusted?: boolean }) {
    if (event?.isTrusted === false) {
      return;
    }

    resetKey();
    clearError();

    if (status !== "idle") {
      setStatus("idle");
    }

    if (isSuccess) {
      setSuccessMessage(null);
    }
  }

  return {
    status,
    isSubmitting,
    isSuccess,
    successMessage,
    formError,
    submitContactForm,
    clearError,
    resetFeedback,
    clearFeedbackOnInputChange,
  };
}
