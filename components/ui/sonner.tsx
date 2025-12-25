"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="bottom-center"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "bg-white border-[var(--color-border)] shadow-lg rounded-lg",
          title: "text-[var(--color-ink)] font-medium",
          description: "text-[var(--color-ink-muted)]",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-4 text-[var(--color-success)]" />,
        info: <InfoIcon className="size-4 text-[var(--color-accent)]" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-500" />,
        error: <OctagonXIcon className="size-4 text-[var(--color-error)]" />,
        loading: <Loader2Icon className="size-4 animate-spin text-[var(--color-accent)]" />,
      }}
      style={
        {
          "--normal-bg": "white",
          "--normal-text": "var(--color-ink)",
          "--normal-border": "var(--color-border)",
          "--border-radius": "8px",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
