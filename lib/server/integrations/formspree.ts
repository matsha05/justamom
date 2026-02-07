import {
  fetchWithTimeout,
  getErrorMessage,
  parseJsonSafely,
} from "@/lib/server/http";

export interface FormspreeForwardSuccess {
  ok: true;
}

export interface FormspreeForwardFailure {
  ok: false;
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
  const response = await fetchWithTimeout(endpoint, {
    method: "POST",
    body,
    headers: {
      Accept: "application/json",
    },
  });

  if (response.ok) {
    return { ok: true };
  }

  const payload = await parseJsonSafely(response);
  return {
    ok: false,
    status: response.status,
    message: getErrorMessage(payload),
  };
}
