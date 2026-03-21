import { DownloadCard } from "@/components/DownloadCard";
import { NewsletterForm } from "@/components/NewsletterForm";
import type { NewsletterPanelContent } from "@/content/site";
import { cn } from "@/lib/utils";

interface NewsletterSignupPanelProps {
  panel: NewsletterPanelContent;
  className?: string;
  align?: "left" | "center";
}

export function NewsletterSignupPanel({
  panel,
  className,
  align = "center",
}: NewsletterSignupPanelProps) {
  const isCentered = align === "center";

  return (
    <section
      aria-labelledby={`${panel.source}-newsletter-heading`}
      className={cn(
        "rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-paper-soft)] px-6 py-8",
        className
      )}
    >
      <div className={cn("space-y-4", isCentered && "text-center")}>
        <p className="text-label">{panel.eyebrow}</p>
        <div className="space-y-2">
          <h2 id={`${panel.source}-newsletter-heading`} className="text-h3">
            {panel.heading}
          </h2>
          <p
            className={cn(
              "text-body text-[var(--color-ink-soft)]",
              isCentered && "mx-auto max-w-[34ch]"
            )}
          >
            {panel.description}
          </p>
        </div>
        <div className={cn("max-w-md", isCentered && "mx-auto")}>
          <NewsletterForm variant="compact" source={panel.source} />
        </div>
        {panel.trust ? (
          <p className="text-caption text-[var(--color-ink-muted)]">{panel.trust}</p>
        ) : null}
      </div>

      {panel.sampleDownload ? (
        <div className="mt-8">
          <DownloadCard
            title={panel.sampleDownload.title}
            description={panel.sampleDownload.description}
            href={panel.sampleDownload.href}
            filePath={panel.sampleDownload.filePath}
            ctaLabel={panel.sampleDownload.ctaLabel}
            className="my-0 border-b-0 border-t pt-6"
            openInNewTab={false}
          />
        </div>
      ) : null}
    </section>
  );
}
