import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow: ReactNode;
  title: ReactNode;
  description: ReactNode;
  media?: ReactNode;
  children?: ReactNode;
  density?: "default" | "compact";
  className?: string;
}

export function PageHero({
  eyebrow,
  title,
  description,
  media,
  children,
  density = "default",
  className,
}: PageHeroProps) {
  const introduction = (
    <div className="space-y-6">
      <p className="text-label">{eyebrow}</p>
      <h1 className="text-display">{title}</h1>
      <p className="text-body-lg text-[var(--color-ink-soft)]">{description}</p>
      {children}
    </div>
  );

  return (
    <section
      className={cn(
        "section section-warm",
        density === "compact" ? "section-page-hero-compact" : "section-page-hero",
        className
      )}
    >
      {media ? (
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(240px,320px)] lg:items-center">
            <div className="max-w-2xl">{introduction}</div>
            {media}
          </div>
        </div>
      ) : (
        <div className="container-prose">{introduction}</div>
      )}
    </section>
  );
}
