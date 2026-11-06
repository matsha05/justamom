import {
  fetchAndConsumeWithTimeout,
  getErrorMessage,
  parseJsonSafely,
} from "@/lib/server/http";

export interface FormspreeForwardSuccess {
  ok: true;
}

export interface FormspreeForwardFailure {
  ok: false;
  outcome: "rejected" | "unknown";
  status: number;
  message: string | null;
}

export type FormspreeForwardResult =
  | FormspreeForwardSuccess
  | FormspreeForwardFailure;

export function isValidFormspreeEndpoint(endpoint: string): boolean {
  return endpoint.startsWith("https://formspree.io/");
}

export async function forwardFormspreeSubmission(
  endpoint: string,
  body: FormData
): Promise<FormspreeForwardResult> {
  return fetchAndConsumeWithTimeout(endpoint, {
    method: "POST",
    body,
    headers: {
      Accept: "application/json",
    },
  }, async (response): Promise<FormspreeForwardResult> => {
    if (response.ok) {
      void response.body?.cancel().catch(() => undefined);
      return { ok: true };
    }

    const payload = await parseJsonSafely(response);
    return {
      ok: false,
      // A server error can follow an accepted write. Only a client rejection
      // (apart from timeout) establishes that retrying cannot repeat delivery.
      outcome: response.status >= 500 || response.status === 408 ? "unknown" : "rejected",
      status: response.status,
      message: getErrorMessage(payload),
    };
  });
}
