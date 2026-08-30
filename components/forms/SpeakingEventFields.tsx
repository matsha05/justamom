import { DatePicker } from "@/components/DatePicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  speakingAudienceSizeOptions,
  speakingEventTypeOptions,
} from "@/lib/content";
import type {
  SpeakingEventDetail,
  SpeakingEventDetails,
} from "@/hooks/useSpeakingEventDetails";

interface SpeakingEventFieldsProps {
  details: SpeakingEventDetails;
  onDetailChange: (field: SpeakingEventDetail, value: string) => void;
}

export function SpeakingEventFields({
  details,
  onDetailChange,
}: SpeakingEventFieldsProps) {
  const optionalHint = (
    <span className="text-[var(--color-ink-muted)] font-normal normal-case">
      (optional)
    </span>
  );

  return (
    <fieldset className="space-y-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-paper-soft)]/45 p-5 sm:p-6">
      <legend className="px-2 text-h4">Event details, if known</legend>
      <p className="text-body text-[var(--color-ink-soft)]">
        Share whatever you already know. Every field in this section is optional.
      </p>

      <div className="space-y-2">
        <Label htmlFor="org">
          Church / Group Name {optionalHint}
        </Label>
        <Input
          type="text"
          id="org"
          name="organization"
          value={details.organization}
          onChange={(event) => onDetailChange("organization", event.target.value)}
          aria-required={false}
          autoComplete="organization"
          placeholder="e.g. Grace Community Church or Monday Night Mamas"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="event_date">Event Date(s) {optionalHint}</Label>
          <DatePicker
            id="event_date"
            name="event_date"
            ariaLabel="Event Date(s) (optional)"
            value={details.eventDate}
            onValueChange={(value) => onDetailChange("eventDate", value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">
            Location (City, State) {optionalHint}
          </Label>
          <Input
            type="text"
            id="location"
            name="location"
            value={details.location}
            onChange={(event) => onDetailChange("location", event.target.value)}
            aria-required={false}
            autoComplete="address-level2"
            placeholder="e.g. Denver, CO"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="event_type">Event Type {optionalHint}</Label>
          <Select
            value={details.eventType}
            onValueChange={(value) => onDetailChange("eventType", value)}
          >
            <SelectTrigger
              id="event_type"
              aria-required={false}
            >
              <SelectValue placeholder="Select a type…" />
            </SelectTrigger>
            <SelectContent>
              {speakingEventTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="event_type" value={details.eventType} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="audience_size">
            Approx. Group Size {optionalHint}
          </Label>
          <Select
            value={details.audienceSize}
            onValueChange={(value) => onDetailChange("audienceSize", value)}
          >
            <SelectTrigger
              id="audience_size"
              aria-required={false}
            >
              <SelectValue placeholder="Select size…" />
            </SelectTrigger>
            <SelectContent>
              {speakingAudienceSizeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="audience_size" value={details.audienceSize} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Event theme or vision {optionalHint}</Label>
        <Textarea
          id="message"
          name="message"
          value={details.message}
          onChange={(event) => onDetailChange("message", event.target.value)}
          aria-required={false}
          rows={4}
          placeholder="What is the heart behind this gathering?"
        />
      </div>
    </fieldset>
  );
}
