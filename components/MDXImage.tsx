import type { ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function MDXImage({
  className,
  alt = "",
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  return (
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
