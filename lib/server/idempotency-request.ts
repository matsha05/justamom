import { createHash } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

const MAX_IDEMPOTENCY_KEY_LENGTH = 120;

export interface ParsedIdempotencyKey {
  key: string | null;
  error: string | null;
}

interface CachedIdempotentResponse<T> {
  status: number;
  body: T;
  headers?: Record<string, string>;
}

type HashedFormValue =
  | { kind: "string"; value: string }
  | { kind: "file"; name: string; type: string; sha256: string };

async function describeFormValue(value: FormDataEntryValue): Promise<HashedFormValue> {
  if (typeof value === "string") return { kind: "string", value };
  return {
    kind: "file",
    name: value.name,
    type: value.type,
    sha256: createHash("sha256")
      .update(new Uint8Array(await value.arrayBuffer()))
      .digest("hex"),
  };
}

function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalJson).join(",")}]`;
  }
  if (value !== null && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

/** Hash parsed content without consuming the body needed by the route. */
export async function getRequestHash(request: NextRequest): Promise<string> {
  const contentType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  let mediaFamily: "json" | "form";
  let content: string;

  if (contentType === "application/json") {
    mediaFamily = "json";
    content = canonicalJson(await request.clone().json());
  } else if (
    contentType === "multipart/form-data" ||
    contentType === "application/x-www-form-urlencoded"
  ) {
    mediaFamily = "form";
    const formData = await request.clone().formData();
    const entries = await Promise.all(Array.from(formData.entries(), async ([key, value]) =>
      [key, await describeFormValue(value)] as const
    ));
    const fields = new Map<string, HashedFormValue[]>();
    for (const [key, value] of entries) {
      // Routes can read the first, last, or every entry. Preserve all values in order.
      const values = fields.get(key) ?? [];
      values.push(value);
      fields.set(key, values);
    }
    content = canonicalJson(Object.fromEntries(fields));
  } else {
    throw new Error("Unsupported request content type.");
  }

  return createHash("sha256").update(`${mediaFamily}\n${content}`).digest("hex");
}

export function readIdempotencyKey(request: NextRequest): ParsedIdempotencyKey {
  const raw = request.headers.get("idempotency-key");
  if (raw === null) {
    return { key: null, error: null };
  }

  const key = raw.trim();
  if (!key || key.length > MAX_IDEMPOTENCY_KEY_LENGTH) {
    return { key: null, error: "Invalid idempotency key." };
  }

  return { key, error: null };
}

export function replayCachedResponse<T>(cached: CachedIdempotentResponse<T>) {
  return NextResponse.json(cached.body, {
    status: cached.status,
    headers: {
      ...(cached.headers ?? {}),
      "x-idempotent-replay": "true",
    },
  });
}
