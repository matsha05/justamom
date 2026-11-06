import { parseJsonSafely, type JsonRecord } from "@/lib/json";
import { withRequestDeadline } from "@/lib/http-deadline";

export type { JsonRecord };

export async function fetchJson(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<{ response: Response; data: JsonRecord | null }> {
  const callerSignal = init?.signal !== undefined
    ? init.signal
    : input instanceof Request ? input.signal : undefined;
  return withRequestDeadline(async (signal) => {
    const response = await fetch(input, { ...init, signal });
    signal.throwIfAborted();
    const data = await parseJsonSafely(response);
    return { response, data };
  }, 25_000, callerSignal);
}

export function getStringFromRecord(data: JsonRecord | null, key: string): string | null {
  if (!data) return null;
  const value = data[key];
  return typeof value === "string" ? value : null;
}

export function getRetryAfterSeconds(response: Response): number | null {
  const raw = response.headers.get("retry-after");
  if (!raw) {
    return null;
  }

  const seconds = Number(raw);
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return null;
  }

  return Math.ceil(seconds);
}

export function formatRetryAfterMessage(seconds: number): string {
  if (seconds < 60) {
    return `Too many requests. Please wait ${seconds} seconds and try again.`;
  }

  const minutes = Math.ceil(seconds / 60);
  return `Too many requests. Please wait about ${minutes} minute${minutes === 1 ? "" : "s"} and try again.`;
}
