import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)] selection:bg-[var(--color-accent-soft)] selection:text-[var(--color-ink)] border-[var(--color-border)] h-10 w-full min-w-0 rounded-[var(--radius-md)] border bg-white px-3 py-2 text-base text-[var(--color-ink)] shadow-sm transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-[var(--color-accent)] focus-visible:ring-2 focus-visible:ring-[var(--color-accent-soft)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-paper)]",
        "hover:border-[var(--color-ink-faint)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
