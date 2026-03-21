import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-pill)] text-sm font-semibold tracking-[0.01em] transition-[transform,background-color,border-color,color,box-shadow] duration-200 disabled:pointer-events-none disabled:opacity-50 motion-safe:hover:-translate-y-px motion-safe:active:translate-y-0.5 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-soft)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-paper)]",
  {
    variants: {
      variant: {
        default:
          "border border-[var(--color-accent)] bg-[var(--color-accent)] text-white shadow-[0_10px_22px_rgba(47,96,88,0.14)] hover:bg-[var(--color-accent-hover)] hover:shadow-[0_14px_28px_rgba(47,96,88,0.18)]",
        destructive:
          "border border-[var(--color-error)] bg-[var(--color-error)] text-white hover:brightness-95",
        outline:
          "border-[1.5px] border-[var(--color-border-strong)] bg-[var(--color-paper)] text-[var(--color-ink)] shadow-[0_6px_16px_rgba(29,27,25,0.04)] hover:bg-[var(--color-paper-warm)] hover:border-[var(--color-accent-light)] hover:shadow-[0_10px_22px_rgba(29,27,25,0.06)]",
        secondary:
          "border border-[var(--color-border)] bg-[var(--color-paper-soft)] text-[var(--color-ink)] hover:bg-[var(--color-paper-warm)]",
        ghost:
          "text-[var(--color-ink-soft)] hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-accent)]",
        link: "text-[var(--color-accent)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-3.5 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "size-10",
        "icon-sm": "size-9",
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
