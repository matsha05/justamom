import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "border border-white/20 bg-[var(--color-accent)] text-white shadow-[0_10px_24px_rgba(63,108,103,0.26)] hover:bg-[var(--color-accent-hover)] hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(53,90,86,0.3)] active:translate-y-0 active:shadow-[0_8px_18px_rgba(53,90,86,0.26)] [&_svg]:transition-transform [&:hover_svg]:translate-x-0.5",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 shadow-sm hover:shadow-md",
        outline:
          "border-[1.5px] border-[var(--color-accent)] bg-transparent text-[var(--color-accent)] hover:-translate-y-0.5 hover:bg-[var(--color-accent)] hover:text-white hover:shadow-md active:translate-y-0",
        secondary:
          "border border-[var(--color-border)] bg-[var(--color-paper-soft)] text-[var(--color-ink)] hover:-translate-y-0.5 hover:bg-[var(--color-paper-warm)]",
        ghost:
          "text-[var(--color-ink-soft)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-accent)]",
        link: "text-[var(--color-accent)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 rounded px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
