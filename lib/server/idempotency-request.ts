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
