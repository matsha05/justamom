import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-[var(--color-ink-muted)] selection:bg-[var(--color-accent-soft)] selection:text-[var(--color-ink)] border-[var(--color-border)] h-10 w-full min-w-0 rounded border bg-white px-3 py-2 text-sm text-[var(--color-ink)] shadow-sm transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-soft)]",
        "hover:border-[var(--color-ink-faint)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
