"use client";

import { useCallback, useRef } from "react";

function createIdempotencyKey(): string {
  if (typeof crypto !== "undefined") {
    if ("randomUUID" in crypto) {
      return crypto.randomUUID();
    }

    if ("getRandomValues" in crypto) {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      return Array.from(bytes)
        .map((value) => value.toString(16).padStart(2, "0"))
        .join("");
    }
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function useIdempotencyKey() {
  const keyRef = useRef<string | null>(null);

  const getKey = useCallback(() => {
    if (!keyRef.current) {
      keyRef.current = createIdempotencyKey();
    }
    return keyRef.current;
  }, []);

  const resetKey = useCallback(() => {
    keyRef.current = null;
  }, []);

  return { getKey, resetKey };
}
