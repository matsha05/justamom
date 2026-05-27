import type { ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/* eslint-disable @next/next/no-img-element */

export function MDXImage({
  className,
  alt = "",
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    // Using img keeps MDX image syntax flexible for unknown author-supplied dimensions.
    // react-doctor-disable-next-line react-doctor/nextjs-no-img-element
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
