"use client";

import { useEffect, useState } from "react";

export function useScrollThreshold(threshold: number) {
  const [pastThreshold, setPastThreshold] = useState(false);

  useEffect(() => {
    let frame: number | null = null;

    const updateThresholdState = () => {
      const next = window.scrollY > threshold;
      setPastThreshold((current) => (current === next ? current : next));
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
