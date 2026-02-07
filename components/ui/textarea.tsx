import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-[var(--color-border)] placeholder:text-[var(--color-ink-muted)] flex field-sizing-content min-h-24 w-full rounded-[var(--radius-md)] border bg-white px-3 py-3 text-base text-[var(--color-ink)] shadow-sm transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-y",
        "hover:border-[var(--color-ink-faint)]",
        "focus-visible:border-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-soft)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-paper)]",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
