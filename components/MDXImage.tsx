import type { ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function MDXImage({
  className,
  alt = "",
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    // Using img keeps MDX image syntax flexible for unknown dimensions.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      loading="lazy"
      decoding="async"
      fetchPriority="low"
      className={cn(
        "my-8 w-full rounded-lg shadow-sm",
        className
      )}
      {...props}
    />
  );
}
