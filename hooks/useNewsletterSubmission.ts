"use client";

import { useEffect, useRef, useState } from "react";
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
  const { setSubmitState, isSubmitting, errorMessage, successMessage } = useSubmitState();
  const { getKey, resetKey } = useIdempotencyKey();
  const submissionPendingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  function showError(message: string) {
    setSubmitState({ status: "error", message });
    toast.error(message);
  }

  async function submitNewsletter() {
    if (submissionPendingRef.current) {
      return;
    }

    submissionPendingRef.current = true;
    setSubmitState({ status: "submitting" });

    const pagePath = getCurrentPagePath();
    const trackingProps = {
      source,
      variant: NEWSLETTER_VARIANT,
      page_path: pagePath,
    };
    try {
      track(analyticsEvents.newsletterSignupStart, trackingProps);
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

      if (!mountedRef.current) {
        return;
      }

      if (response.ok) {
        const message = getStringFromRecord(data, "message") ?? SUCCESS_FALLBACK;
        setSubmitState({ status: "success", message });
        setEmail("");
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
      if (mountedRef.current) {
        showError(NETWORK_ERROR);
      }
    } finally {
      submissionPendingRef.current = false;
    }
  }

  function updateEmail(value: string) {
    if (submissionPendingRef.current || value === email) {
      return;
    }

    setEmail(value);
    resetKey();

    setSubmitState({ status: "idle" });
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
