import {
  fetchWithTimeout,
  getErrorMessage,
  parseJsonSafely,
} from "@/lib/server/http";

function createAuthorizationHeaders(apiKey: string): Record<string, string> {
  return {
    Accept: "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
}

export interface MailerLiteLookupResult {
  status: number;
  message: string | null;
}

export interface MailerLiteCreateResult {
  status: number;
  ok: boolean;
  message: string | null;
}

export async function lookupMailerLiteSubscriber(
  baseUrl: string,
  email: string,
  apiKey: string
): Promise<MailerLiteLookupResult> {
  const response = await fetchWithTimeout(
    `${baseUrl}/subscribers/${encodeURIComponent(email)}`,
    {
      method: "GET",
      headers: createAuthorizationHeaders(apiKey),
    }
  );

  if (response.status === 200 || response.status === 404) {
    return {
      status: response.status,
      message: null,
    };
  }

  const payload = await parseJsonSafely(response);
  return {
    status: response.status,
    message: getErrorMessage(payload),
  };
}

export async function createMailerLiteSubscriber(
  baseUrl: string,
  email: string,
  groupId: string,
  apiKey: string
): Promise<MailerLiteCreateResult> {
  const response = await fetchWithTimeout(`${baseUrl}/subscribers`, {
    method: "POST",
    headers: {
      ...createAuthorizationHeaders(apiKey),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      groups: [groupId],
    }),
  });

  if (response.ok) {
    return {
      ok: true,
      status: response.status,
      message: null,
    };
  }

  const payload = await parseJsonSafely(response);

  return {
    ok: false,
    status: response.status,
    message: getErrorMessage(payload),
  };
}
