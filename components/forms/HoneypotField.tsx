import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HoneypotFieldProps {
  id?: string;
  name?: string;
  label?: string;
}

export function HoneypotField({
  id = "company",
  name = "company",
  label = "Company",
}: HoneypotFieldProps) {
  return (
    <div className="sr-only" aria-hidden="true">
      <Label htmlFor={id}>{label}</Label>
      <Input type="text" id={id} name={name} tabIndex={-1} autoComplete="off" />
    </div>
  );
}
