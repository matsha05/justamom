"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, X } from "lucide-react";
import { ArrowIcon } from "@/components/icons";
import { HoneypotField } from "@/components/forms/HoneypotField";
import { SpeakingEventFields } from "@/components/forms/SpeakingEventFields";
import { useSubmitState } from "@/hooks/useSubmitState";
import { fetchJson, getStringFromRecord } from "@/lib/client/http";

export function SpeakingInquiryForm() {
  const { status, setStatus, isSubmitting } = useSubmitState();
  const [isExpanded, setIsExpanded] = useState(false);
  const [eventType, setEventType] = useState("");
  const [audienceSize, setAudienceSize] = useState("");
  const [selectError, setSelectError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const selectErrorId = "speaking-select-error";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!eventType || !audienceSize) {
      setSelectError("Please select an event type and group size.");
      return;
    }

    setStatus("submitting");
    setSelectError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("subject", "New Speaking Inquiry");
    formData.set("form_type", "speaking");

    try {
      const { response, data } = await fetchJson("/api/contact", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setStatus("success");
        setSuccessMessage(getStringFromRecord(data, "message"));
        form.reset();
        setEventType("");
        setAudienceSize("");
        return;
      }

      const message =
        getStringFromRecord(data, "error") ??
        "Something went wrong. Please try again.";
      toast.error(message);
      setStatus("error");
    } catch {
      toast.error("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-white p-8 rounded-xl border border-[var(--color-border)] shadow-sm text-center animate-fade-in">
        <div className="w-16 h-16 bg-[var(--color-accent-soft)] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-[var(--color-accent)]" />
        </div>
        <h3 className="text-h3 mb-3">Inquiry Received!</h3>
        <p className="text-body mb-6 max-w-md mx-auto">
          {successMessage ||
            "Thank you so much for considering me for your event. I've received your details and will get back to you shortly."}
        </p>
        <Button variant="outline" onClick={() => setStatus("idle")}>
          Send Another Inquiry
        </Button>
      </div>
    );
  }

  if (!isExpanded) {
    return (
      <div className="text-center">
        <Button onClick={() => setIsExpanded(true)}>
          Check Availability
          <ArrowIcon />
        </Button>
        <p className="text-caption text-[var(--color-ink-muted)] mt-4">
          Takes about 2 minutes to fill out
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl border border-[var(--color-border)] shadow-sm animate-fade-in relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsExpanded(false)}
        className="absolute top-4 right-4"
        aria-label="Close form"
      >
        <X className="w-5 h-5" />
      </Button>

      <h3 className="text-h3 mb-2">Check Availability</h3>
      <p className="text-body mb-8">
        Tell me a little about your event, and let&apos;s see if we&apos;re a good fit.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6" aria-busy={isSubmitting}>
        <HoneypotField />

        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input type="text" id="name" name="name" required placeholder="Jane Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              name="email"
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

        <div className="space-y-2">
          <Label htmlFor="budget">
            Speaking Budget{" "}
            <span className="text-[var(--color-ink-faint)] lowercase font-normal">
              (optional)
            </span>
          </Label>
          <Input
            type="text"
            id="budget"
            name="budget"
            placeholder="e.g. $1,500 + travel"
          />
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Submit Inquiry
              <ArrowIcon />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
