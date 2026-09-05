"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormErrorMessage, FormSubmitButton } from "@/components/forms/FormPrimitives";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { useIdempotencyKey } from "@/hooks/useIdempotencyKey";
import { fetchJson, formatRetryAfterMessage, getRetryAfterSeconds, getStringFromRecord } from "@/lib/client/http";

export function BookRecommendations() {
  const id = useId();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const successRef = useRef<HTMLParagraphElement>(null);
  const submittingRef = useRef(false);
  const { getKey, resetKey } = useIdempotencyKey();

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    const form = event.currentTarget;
    setStatus("submitting");
    setError(null);
    try {
      const { response, data } = await fetchJson("/api/book-recommendations", {
        method: "POST",
        body: new FormData(form),
        headers: { "idempotency-key": getKey() },
      });
      if (!response.ok) {
        const retry = response.status === 429 ? getRetryAfterSeconds(response) : null;
        throw new Error(retry ? formatRetryAfterMessage(retry) : getStringFromRecord(data, "error") ?? "Your recommendation could not be sent. Please try again.");
      }
      form.reset();
      resetKey();
      setStatus("success");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Your recommendation could not be sent. Please try again.");
      setStatus("error");
    } finally {
      submittingRef.current = false;
    }
  }

  return (
    <section className="book-recommendations not-prose" aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`}>What should I read next?</h2>
      <p id={`${id}-help`}>Leave me a book recommendation. It goes straight to my inbox, and you don&apos;t need to include your name or email.</p>
      <form onSubmit={handleSubmit} aria-busy={status === "submitting"} className="space-y-4" onChange={() => {
        if (submittingRef.current) return;
        resetKey();
        setError(null);
        setStatus("idle");
      }}>
        <HoneypotField id={`${id}-company`} />
        <FormErrorMessage message={error} />
        {status === "success" ? <p ref={successRef} role="status" tabIndex={-1} className="delight-panel delight-panel-success">Thank you! Your recommendation has been sent privately to Lizi.</p> : null}
        <div className="space-y-2">
          <Label htmlFor={`${id}-recommendation`}>Your book recommendation</Label>
          <Textarea id={`${id}-recommendation`} name="recommendation" required maxLength={4000} rows={4} placeholder="Book title, author, and anything you want to add…" aria-describedby={`${id}-help`} disabled={status === "submitting"} />
        </div>
        <FormSubmitButton isSubmitting={status === "submitting"} disabled={status === "success"} className="w-full sm:w-auto">Send recommendation</FormSubmitButton>
      </form>
    </section>
  );
}
