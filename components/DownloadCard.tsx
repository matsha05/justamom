import "server-only";
import fs from "fs";
import path from "path";
import { ArrowIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DownloadCardProps {
  title: string;
  description?: string;
  href: string;
  filePath?: string;
  fileType?: string;
  ctaLabel?: string;
  className?: string;
  openInNewTab?: boolean;
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  const precision = unitIndex === 0 ? 0 : size < 10 ? 1 : 0;
  return `${size.toFixed(precision)} ${units[unitIndex]}`;
}

function getFileSizeLabel(filePath?: string): string | null {
  if (!filePath) return null;
  const publicRoot = path.join(process.cwd(), "public");
  const normalized = filePath.startsWith("/") ? filePath.slice(1) : filePath;
  const resolvedPath = path.join(publicRoot, normalized);
  if (!resolvedPath.startsWith(publicRoot)) return null;
  if (!fs.existsSync(resolvedPath)) return null;
  const stat = fs.statSync(resolvedPath);
  return formatBytes(stat.size) || null;
}

export function DownloadCard({
  title,
  description,
  href,
  filePath,
  fileType,
  ctaLabel = "Download PDF",
  className,
  openInNewTab = true,
}: DownloadCardProps) {
  const sizeLabel = getFileSizeLabel(filePath);
  const typeLabel = fileType ?? (filePath?.toLowerCase().endsWith(".pdf") ? "PDF" : undefined);

  return (
    <div
      className={cn(
        "my-12 border-y border-[var(--color-border)] py-8",
        className,
      )}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <p className="text-label text-[var(--color-ink-faint)] tracking-widest uppercase">
            Free Download
          </p>
          <div>
            <h3 className="text-h3 mb-2">{title}</h3>
            {description ? (
              <p className="text-body">{description}</p>
            ) : null}
          </div>
          {(typeLabel || sizeLabel) && (
            <div className="text-caption text-[var(--color-ink-faint)]">
              {typeLabel}
              {typeLabel && sizeLabel ? " | " : ""}
              {sizeLabel}
            </div>
          )}
        </div>

        <Button asChild className="w-full sm:w-auto whitespace-nowrap">
          <a
            href={href}
            target={openInNewTab ? "_blank" : undefined}
            rel={openInNewTab ? "noopener noreferrer" : undefined}
            aria-label={`${ctaLabel}: ${title}`}
          >
            {ctaLabel}
            <ArrowIcon />
          </a>
        </Button>
      </div>
    </div>
  );
}
