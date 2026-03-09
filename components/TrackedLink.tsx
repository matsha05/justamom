"use client";

import Link, { type LinkProps } from "next/link";
import { track } from "@vercel/analytics";
import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from "react";
import type {
  AnalyticsEventName,
  AnalyticsEventProperties,
} from "@/lib/analytics/events";

type TrackedLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    eventName?: AnalyticsEventName;
    eventProperties?: AnalyticsEventProperties;
  };

export const TrackedLink = forwardRef<HTMLAnchorElement, TrackedLinkProps>(
  ({ eventName, eventProperties, onClick, ...props }, ref) => {
    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);

      if (!event.defaultPrevented && eventName) {
        track(eventName, eventProperties);
      }
    };

    return <Link ref={ref} onClick={handleClick} {...props} />;
  }
);

TrackedLink.displayName = "TrackedLink";
