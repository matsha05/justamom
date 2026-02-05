"use client";

import { useEffect, useState } from "react";

export function useScrollThreshold(threshold: number) {
  const [pastThreshold, setPastThreshold] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setPastThreshold(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return pastThreshold;
}
