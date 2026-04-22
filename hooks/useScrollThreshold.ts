"use client";

import { useEffect, useState } from "react";

export function useScrollThreshold(threshold: number) {
  const [pastThreshold, setPastThreshold] = useState(false);

  useEffect(() => {
    let frame: number | null = null;
    const hysteresis = Math.max(6, Math.round(threshold * 0.35));

    const updateThresholdState = () => {
      setPastThreshold((current) => {
        const enterThreshold = threshold + hysteresis;
        const exitThreshold = Math.max(0, threshold - hysteresis);
        const next = current
          ? window.scrollY > exitThreshold
          : window.scrollY > enterThreshold;

        return current === next ? current : next;
      });
    };

    const handleScroll = () => {
      if (frame !== null) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        frame = null;
        updateThresholdState();
      });
    };

    updateThresholdState();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return pastThreshold;
}
