export type JsonRecord = Record<string, unknown>;

export async function parseJsonSafely(response: Response): Promise<JsonRecord | null> {
  try {
    const value = await response.json();
    if (value && typeof value === "object") {
      return value as JsonRecord;
    }
    return null;
  } catch {
    return null;
  }
}

export async function fetchJson(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<{ response: Response; data: JsonRecord | null }> {
  const response = await fetch(input, init);
  const data = await parseJsonSafely(response);
  return { response, data };
}

export function getStringFromRecord(data: JsonRecord | null, key: string): string | null {
  if (!data) return null;
  const value = data[key];
  return typeof value === "string" ? value : null;
}
