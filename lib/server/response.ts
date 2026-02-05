import { NextResponse } from "next/server";

export function rateLimitResponse(message: string, retryAfterSeconds: number) {
  return NextResponse.json(
    { error: message },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSeconds) },
    }
  );
}
