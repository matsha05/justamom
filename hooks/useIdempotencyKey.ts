"use client";

import { useCallback, useRef } from "react";

function createIdempotencyKey(): string {
  const webCrypto = globalThis.crypto;

  if (typeof webCrypto !== "undefined") {
    if (typeof webCrypto.randomUUID === "function") {
      return webCrypto.randomUUID();
    }

    if (typeof webCrypto.getRandomValues === "function") {
      const bytes = new Uint8Array(16);
      webCrypto.getRandomValues(bytes);
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
