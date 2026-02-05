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
import { CheckCircle, Loader2, X } from "lucide-react";
import { ArrowIcon } from "@/components/icons";

type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function SpeakingInquiryForm() {
    const [status, setStatus] = useState<SubmitStatus>("idle");
    const [isExpanded, setIsExpanded] = useState(false);
    const [eventType, setEventType] = useState("");
    const [audienceSize, setAudienceSize] = useState("");
    const [selectError, setSelectError] = useState<string | null>(null);

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
        const company = String(formData.get("company") ?? "").trim();

        if (company) {
            setStatus("success");
            form.reset();
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
                form.reset();
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

    if (status === "success") {
        return (
            <div className="bg-white p-8 rounded-xl border border-[var(--color-border)] shadow-sm text-center animate-fade-in">
                <div className="w-16 h-16 bg-[var(--color-accent-soft)] rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-[var(--color-accent)]" />
                </div>
                <h3 className="text-h3 mb-3">Inquiry Received!</h3>
                <p className="text-body mb-6 max-w-md mx-auto">
                    Thank you so much for considering me for your event. I&apos;ve received your details and will get back to you shortly.
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

    const isSubmitting = status === "submitting";
    const selectErrorId = "speaking-select-error";

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

            <form onSubmit={handleSubmit} className="space-y-6">
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
                {/* Contact Info Group */}
                <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                            type="text"
                            id="name"
                            name="name"
                            required
                            placeholder="Jane Doe"
                        />
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

                {/* Event Details Group */}
                <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <Label htmlFor="event_date">Event Date(s)</Label>
                        <DatePicker id="event_date" name="event_date" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location">Location (City, State)</Label>
                        <Input
                            type="text"
                            id="location"
                            name="location"
                            required
                            placeholder="e.g. Denver, CO"
                        />
                    </div>
                </div>

                {/* Event Context Group */}
                <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <Label htmlFor="event_type">Event Type</Label>
                        <Select
                            value={eventType}
                            onValueChange={(value) => {
                                setEventType(value);
                                setSelectError(null);
                            }}
                        >
                            <SelectTrigger aria-invalid={Boolean(selectError)} aria-describedby={selectError ? selectErrorId : undefined}>
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
                        <input type="hidden" name="event_type" value={eventType} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="audience_size">Approx. Group Size</Label>
                        <Select
                            value={audienceSize}
                            onValueChange={(value) => {
                                setAudienceSize(value);
                                setSelectError(null);
                            }}
                        >
                            <SelectTrigger aria-invalid={Boolean(selectError)} aria-describedby={selectError ? selectErrorId : undefined}>
                                <SelectValue placeholder="Select size..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Small Group (< 20)">Small Group (&lt; 20)</SelectItem>
                                <SelectItem value="20-50">20 - 50</SelectItem>
                                <SelectItem value="50-150">50 - 150</SelectItem>
                                <SelectItem value="150+">150+</SelectItem>
                            </SelectContent>
                        </Select>
                        <input type="hidden" name="audience_size" value={audienceSize} required />
                    </div>
                </div>
                {selectError ? (
                    <p id={selectErrorId} className="text-caption text-[var(--color-error)]">
                        {selectError}
                    </p>
                ) : null}

                {/* Message */}
                <div className="space-y-2">
                    <Label htmlFor="message">Tell me about your event theme or vision</Label>
                    <Textarea
                        id="message"
                        name="message"
                        rows={4}
                        placeholder="What is the heart behind this gathering?"
                    />
                </div>

                {/* Budget (Optional) */}
                <div className="space-y-2">
                    <Label htmlFor="budget">
                        Speaking Budget <span className="text-[var(--color-ink-faint)] lowercase font-normal">(optional)</span>
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
