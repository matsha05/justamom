import { Input } from "@/components/ui/input";

interface DatePickerProps {
  id: string;
  name: string;
  required?: boolean;
  defaultValue?: string;
}

export function DatePicker({ id, name, required = false, defaultValue = "" }: DatePickerProps) {
  return (
    <Input
      type="date"
      id={id}
      name={name}
      required={required}
      defaultValue={defaultValue}
      className="pr-3"
    />
  );
}
