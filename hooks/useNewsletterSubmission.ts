"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { toast } from "sonner";
import { useIdempotencyKey } from "@/hooks/useIdempotencyKey";
import { useSubmitState } from "@/hooks/useSubmitState";
import { analyticsEvents } from "@/lib/analytics/events";
import {
  fetchJson,
  formatRetryAfterMessage,
  getRetryAfterSeconds,
  getStringFromRecord,
} from "@/lib/client/http";
import {
  getCurrentPagePath,
  type ConversionSource,
  type NewsletterVariant,
} from "@/lib/conversions";

const NEWSLETTER_VARIANT: NewsletterVariant = "compact";
const SUCCESS_FALLBACK = "You're in! Check your inbox.";
const ERROR_FALLBACK = "Something went wrong. Please try again.";
const NETWORK_ERROR = "Network error. Please try again.";

interface UseNewsletterSubmissionOptions {
  source: ConversionSource;
}

export function useNewsletterSubmission({
  source,
}: UseNewsletterSubmissionOptions) {
  const [email, setEmail] = useState("");
  const { status, setStatus, isSubmitting } = useSubmitState();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { getKey, resetKey } = useIdempotencyKey();

  function showError(message: string) {
    setStatus("error");
    setErrorMessage(message);
    toast.error(message);
  }

  async function submitNewsletter() {
    setStatus("submitting");
    setErrorMessage(null);
    setSuccessMessage(null);

    const pagePath = getCurrentPagePath();
    const trackingProps = {
      source,
      variant: NEWSLETTER_VARIANT,
      page_path: pagePath,
    };
    track(analyticsEvents.newsletterSignupStart, trackingProps);

    try {
      const { response, data } = await fetchJson("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "idempotency-key": getKey(),
        },
        body: JSON.stringify({
          email,
          source,
          variant: NEWSLETTER_VARIANT,
          page_path: pagePath,
        }),
      });

      if (response.ok) {
        const message = getStringFromRecord(data, "message") ?? SUCCESS_FALLBACK;
        setStatus("success");
        setEmail("");
        setSuccessMessage(message);
        track(analyticsEvents.newsletterSignupSuccess, trackingProps);
        toast.success(message);
        resetKey();
        return;
      }

      if (response.status === 429) {
        const retryAfterSeconds = getRetryAfterSeconds(response);
        if (retryAfterSeconds) {
          showError(formatRetryAfterMessage(retryAfterSeconds));
          return;
        }
      }

      showError(getStringFromRecord(data, "error") ?? ERROR_FALLBACK);
    } catch {
      showError(NETWORK_ERROR);
    }
  }

  function updateEmail(value: string) {
    setEmail(value);
    resetKey();

    if (errorMessage) {
      setErrorMessage(null);
    }
    if (successMessage) {
      setSuccessMessage(null);
    }
    if (status !== "idle") {
      setStatus("idle");
    }
  }

  return {
    email,
    errorMessage,
    successMessage,
    isSubmitting,
    submitNewsletter,
    updateEmail,
  };
}
