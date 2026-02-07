import { parseJsonSafely, type JsonRecord } from "@/lib/json";

export { parseJsonSafely };
export type { JsonRecord };

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
