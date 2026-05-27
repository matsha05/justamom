"use client";

import Link, { type LinkProps } from "next/link";
import { track } from "@vercel/analytics";
import type { AnchorHTMLAttributes, MouseEvent } from "react";
import type {
  AnalyticsEventName,
  AnalyticsEventProperties,
} from "@/lib/analytics/events";

type TrackedLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    eventName?: AnalyticsEventName;
    eventProperties?: AnalyticsEventProperties;
  };

export function TrackedLink({
  eventName,
  eventProperties,
  onClick,
  ...props
}: TrackedLinkProps) {
  const trackLinkActivation = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (!event.defaultPrevented && eventName) {
      track(eventName, eventProperties);
    }
  };

  return <Link onClick={trackLinkActivation} {...props} />;
}
