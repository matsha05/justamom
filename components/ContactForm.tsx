"use client";

import { useState } from "react";
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
import { DatePicker } from "./DatePicker";
import { CheckCircle, Loader2 } from "lucide-react";
import { ArrowIcon } from "@/components/icons";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
    const [status, setStatus] = useState<SubmitStatus>("idle");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [subjectError, setSubjectError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedSubject) {
            setSubjectError("Please select a topic.");
            return;
        }

        setStatus("submitting");
        setSubjectError(null);
        setSuccessMessage(null);

        const form = e.currentTarget;
        const formData = new FormData(form);
        const company = String(formData.get("company") ?? "").trim();

        if (company) {
            setStatus("success");
            setSuccessMessage("Message sent! I will get back to you as soon as I can.");
            form.reset();
            setSelectedSubject("");
            return;
        }

        try {
            const response = await fetch("https://formspree.io/f/mqezoggn", {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json",
                },
            });

            if (response.ok) {
                setStatus("success");
                setSuccessMessage("Message sent! I will get back to you as soon as I can.");
                form.reset();
                setSelectedSubject("");
            } else {
                const data = await response.json();
                toast.error(data.error || "Something went wrong. Please try again.");
                setStatus("error");
            }
        } catch {
            toast.error("Network error. Please check your connection and try again.");
            setStatus("error");
        }
    };

    const subjectOptions = [
        { value: "Speaking Inquiry", label: "Speaking Inquiry" },
        { value: "Collaboration", label: "Collaboration" },
        { value: "Just Saying Hello", label: "Just Saying Hello" },
        { value: "Something Else", label: "Something Else" },
    ];

    const isSpeakingInquiry = selectedSubject === "Speaking Inquiry";
    const isSubmitting = status === "submitting";
    const isSuccess = status === "success";
    const subjectErrorId = "subject-error";
    const successMessageId = "contact-success-message";

    return (
        <form
            onSubmit={handleSubmit}
            onChange={() => {
                if (isSuccess) {
                    setStatus("idle");
                    setSuccessMessage(null);
                }
            }}
            className="space-y-6 animate-fade-in"
        >
            <div className="sr-only" aria-hidden="true">
                <Label htmlFor="company">Company</Label>
                <Input
                    type="text"
                    id="company"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                />
            </div>
            {successMessage ? (
                <div
                    id={successMessageId}
                    className="rounded-md border border-[var(--color-accent-soft)] bg-[var(--color-paper-soft)] px-4 py-3 text-[var(--color-ink)] flex items-start gap-3"
                    role="status"
                    aria-live="polite"
                >
                    <CheckCircle className="w-5 h-5 text-[var(--color-success)] mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-body font-medium">Message sent.</p>
                        <p className="text-caption text-[var(--color-ink-muted)]">
                            Thank you for reaching out. I&apos;ll get back to you as soon as I can.
                        </p>
                    </div>
                </div>
            ) : null}
            {/* Name & Email Row */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        type="text"
                        id="name"
                        name="name"
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
                        required
                        placeholder="you@example.com"
                    />
                </div>
            </div>

            {/* Subject */}
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
                    <SelectTrigger aria-invalid={Boolean(subjectError)} aria-describedby={subjectError ? subjectErrorId : undefined}>
                        <SelectValue placeholder="Select a topic..." />
                    </SelectTrigger>
                    <SelectContent>
                        {subjectOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <input type="hidden" name="subject" value={selectedSubject} required />
                {subjectError ? (
                    <p id={subjectErrorId} className="text-caption text-[var(--color-error)]">
                        {subjectError}
                    </p>
                ) : null}
            </div>

            {/* Conditional Speaking Fields */}
            {isSpeakingInquiry && (
                <div className="space-y-6 py-4 border-t border-b border-[var(--color-border)] animate-fade-in">
                    <p className="text-body bg-[var(--color-paper-soft)] p-4 rounded-md">
                        <strong>Great!</strong> Tell me a bit about your event so I can check availability.
                    </p>

                    {/* Organization */}
                    <div className="space-y-2">
                        <Label htmlFor="org">
                            Church / Group Name <span className="text-[var(--color-ink-faint)] lowercase font-normal">(optional)</span>
                        </Label>
                        <Input
                            type="text"
                            id="org"
                            name="organization"
                            placeholder="e.g. Grace Community Church or Monday Night Mamas"
                        />
                    </div>

                    {/* Event Details Row */}
                    <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label htmlFor="event_date">Event Date(s)</Label>
                            <DatePicker id="event_date" name="event_date" required={isSpeakingInquiry} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location (City, State)</Label>
                            <Input
                                type="text"
                                id="location"
                                name="location"
                                required={isSpeakingInquiry}
                                placeholder="e.g. Denver, CO"
                            />
                        </div>
                    </div>

                    {/* Event Context Row */}
                    <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <Label htmlFor="event_type">Event Type</Label>
                            <Select name="event_type">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a type..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Bible Study / Small Group">Bible Study / Small Group</SelectItem>
                                    <SelectItem value="Retreat">Retreat</SelectItem>
                                    <SelectItem value="MomCo">MomCo</SelectItem>
                                    <SelectItem value="Conference">Conference</SelectItem>
                                    <SelectItem value="Sunday Service">Sunday Service</SelectItem>
                                    <SelectItem value="Workshop">Workshop</SelectItem>
                                    <SelectItem value="Virtual Event">Virtual Event</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="audience_size">Approx. Group Size</Label>
                            <Select name="audience_size">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select size..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Small Group (< 20)">Small Group (&lt; 20)</SelectItem>
                                    <SelectItem value="20-50">20 - 50</SelectItem>
                                    <SelectItem value="50-150">50 - 150</SelectItem>
                                    <SelectItem value="150+">150+</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            )}

            {/* Message */}
            <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder={isSpeakingInquiry ? "Tell me about your event theme or vision..." : "How can I help you?"}
                />
            </div>

            {/* Submit */}
            <Button type="submit" disabled={isSubmitting || isSuccess} className="w-full md:w-auto">
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                    </>
                ) : (
                    <>
                        Send Message
                        <ArrowIcon />
                    </>
                )}
            </Button>
        </form>
    );
}
