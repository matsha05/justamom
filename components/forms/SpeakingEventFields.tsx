import { DatePicker } from "@/components/DatePicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface SpeakingEventFieldsProps {
  eventType: string;
  audienceSize: string;
  onEventTypeChange: (value: string) => void;
  onAudienceSizeChange: (value: string) => void;
  required?: boolean;
  selectError?: string | null;
  selectErrorId?: string;
}

export function SpeakingEventFields({
  eventType,
  audienceSize,
  onEventTypeChange,
  onAudienceSizeChange,
  required = false,
  selectError,
  selectErrorId,
}: SpeakingEventFieldsProps) {
  const selectDescribedBy = selectError && selectErrorId ? selectErrorId : undefined;

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="org">
          Church / Group Name{" "}
          <span className="text-[var(--color-ink-faint)] lowercase font-normal">
            (optional)
          </span>
        </Label>
        <Input
          type="text"
          id="org"
          name="organization"
          placeholder="e.g. Grace Community Church or Monday Night Mamas"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="event_date">Event Date(s)</Label>
          <DatePicker id="event_date" name="event_date" required={required} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location (City, State)</Label>
          <Input
            type="text"
            id="location"
            name="location"
            required={required}
            placeholder="e.g. Denver, CO"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="event_type">Event Type</Label>
          <Select value={eventType} onValueChange={onEventTypeChange}>
            <SelectTrigger
              aria-invalid={Boolean(selectError)}
              aria-describedby={selectDescribedBy}
            >
              <SelectValue placeholder="Select a type..." />
            </SelectTrigger>
            <SelectContent>
              {speakingEventTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="event_type" value={eventType} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="audience_size">Approx. Group Size</Label>
          <Select value={audienceSize} onValueChange={onAudienceSizeChange}>
            <SelectTrigger
              aria-invalid={Boolean(selectError)}
              aria-describedby={selectDescribedBy}
            >
              <SelectValue placeholder="Select size..." />
            </SelectTrigger>
            <SelectContent>
              {speakingAudienceSizeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input type="hidden" name="audience_size" value={audienceSize} />
        </div>
      </div>

      {selectError && selectErrorId ? (
        <p id={selectErrorId} className="text-caption text-[var(--color-error)]">
          {selectError}
        </p>
      ) : null}
    </>
  );
}
