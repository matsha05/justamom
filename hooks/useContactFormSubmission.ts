"use client";

import { useEffect, useRef } from "react";
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
  const {
    status,
    setSubmitState,
    isSubmitting,
    isSuccess,
    successMessage,
    errorMessage: formError,
  } = useSubmitState();
  const { getKey, resetKey } = useIdempotencyKey();
  const successBannerRef = useRef<HTMLDivElement>(null);
  const submissionPendingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (status === "success") {
      successBannerRef.current?.focus();
    }
  }, [status]);

  function failSubmission(message: string): SubmitContactFormResult {
    toast.error(message);
    setSubmitState({ status: "error", message });
    return { ok: false, message };
  }

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
    if (submissionPendingRef.current) {
      return { ok: false, message: "" };
    }

    // Capture enabled fields before rendering the disabled form.
    const formData = new FormData(form);
    submissionPendingRef.current = true;
    setSubmitState({ status: "submitting" });

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
    try {
      track(
        formType === "speaking"
          ? analyticsEvents.speakingInquiryStart
          : analyticsEvents.contactInquiryStart,
        trackingProps
      );

      const { response, data } = await fetchJson("/api/contact", {
        method: "POST",
        body: formData,
        headers: {
          "idempotency-key": getKey(),
        },
      });

      if (!mountedRef.current) {
        return { ok: false, message: "" };
      }

      if (response.ok) {
        const message = getStringFromRecord(data, "message") ?? successFallbackMessage;
        setSubmitState({ status: "success", message });
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
          return failSubmission(formatRetryAfterMessage(retryAfterSeconds));
        }
      }

      const message = getStringFromRecord(data, "error") ?? errorFallbackMessage;
      return failSubmission(message);
    } catch {
      if (!mountedRef.current) {
        return { ok: false, message: "" };
      }
      return failSubmission(networkErrorMessage);
    } finally {
      submissionPendingRef.current = false;
    }
  }

  function clearError() {
    if (formError) {
      setSubmitState({ status: "idle" });
    }
  }

  function resetFeedback() {
    if (submissionPendingRef.current) {
      return;
    }

    setSubmitState({ status: "idle" });
    resetKey();
  }

  function clearFeedbackOnInputChange(event?: { isTrusted?: boolean }) {
    if (submissionPendingRef.current || event?.isTrusted === false) {
      return;
    }

    resetFeedback();
  }

  // Custom controls report intentional edits directly; native reset events do not.
  function onDraftChange() {
    if (submissionPendingRef.current) {
      return false;
    }
    resetFeedback();
    return true;
  }

  return {
    status,
    isSubmitting,
    isSuccess,
    successMessage,
    formError,
    successBannerRef,
    submitContactForm,
    clearError,
    resetFeedback,
    onDraftChange,
    clearFeedbackOnInputChange,
  };
}
