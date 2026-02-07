import { parseJsonSafely, type JsonRecord } from "@/lib/json";

const DEFAULT_TIMEOUT_MS = 8_000;

export { parseJsonSafely };
export type { JsonRecord };

export async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      cache: "no-store",
    });
  } finally {
    clearTimeout(timeout);
  }
}

export function getErrorMessage(payload: JsonRecord | null): string | null {
  if (!payload) return null;

  if (typeof payload.error === "string") {
    return payload.error;
  }

  if (payload.error && typeof payload.error === "object") {
    const nested = (payload.error as JsonRecord).message;
    if (typeof nested === "string") return nested;
  }

  if (payload.errors && Array.isArray(payload.errors)) {
    const firstError = payload.errors[0];
    if (typeof firstError === "string") {
      return firstError;
    }
    if (firstError && typeof firstError === "object") {
      const nested = (firstError as JsonRecord).message;
      if (typeof nested === "string") return nested;
    }
  }

  if (typeof payload.message === "string") {
    return payload.message;
  }

  return null;
}
