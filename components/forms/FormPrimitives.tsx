import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { ArrowIcon } from "@/components/icons/ArrowIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface IdentityFieldsProps {
  nameLabel?: string;
  emailLabel?: string;
  namePlaceholder?: string;
  emailPlaceholder?: string;
  className?: string;
}

export function IdentityFields({
  nameLabel = "Name",
  emailLabel = "Email",
  namePlaceholder = "Your name",
  emailPlaceholder = "you@example.com",
  className,
}: IdentityFieldsProps) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2", className)}>
      <div className="space-y-2">
        <Label htmlFor="name">{nameLabel}</Label>
        <Input
          type="text"
          id="name"
          name="name"
          autoComplete="name"
          required
          placeholder={namePlaceholder}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{emailLabel}</Label>
        <Input
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          required
          placeholder={emailPlaceholder}
        />
      </div>
    </div>
  );
}

export function FormErrorMessage({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="delight-panel delight-panel-error"
    >
      {message}
    </div>
  );
}

interface FormSubmitButtonProps {
  isSubmitting: boolean;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

export function FormSubmitButton({
  isSubmitting,
  disabled = false,
  className,
  children = "Send message",
}: FormSubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isSubmitting || disabled}
      className={className}
    >
      {isSubmitting ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Sending…
        </>
      ) : (
        <>
          {children}
          <ArrowIcon />
        </>
      )}
    </Button>
  );
}
