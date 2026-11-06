import { parseJsonSafely, type JsonRecord } from "@/lib/json";
import { withRequestDeadline } from "@/lib/http-deadline";

const DEFAULT_TIMEOUT_MS = 8_000;

export { parseJsonSafely };
export type { JsonRecord };

export async function fetchAndConsumeWithTimeout<T>(
  url: string,
  init: RequestInit,
  consume: (response: Response) => Promise<T> | T,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<T> {
  return withRequestDeadline(async (signal) => {
    const response = await fetch(url, {
      ...init,
      signal,
      cache: "no-store",
    });
    signal.throwIfAborted();
    return consume(response);
  }, timeoutMs, init.signal);
}

/** For callers that only need headers. Body readers must use the consume helper. */
export async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  return fetchAndConsumeWithTimeout(url, init, (response) => response, timeoutMs);
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
