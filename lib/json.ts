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
