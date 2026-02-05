import { incrementInWindow } from "@/lib/server/kv";

interface RateLimitOptions {
  key: string;
  limit: number;
  windowMs: number;
}

interface RateLimitResult {
  limited: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export async function checkRateLimit({
  key,
  limit,
  windowMs,
}: RateLimitOptions): Promise<RateLimitResult> {
  const { count, ttlMs } = await incrementInWindow(key, windowMs);

  const limited = count > limit;
  const remaining = Math.max(0, limit - count);
  const retryAfterSeconds = Math.max(1, Math.ceil(ttlMs / 1000));

  return {
    limited,
    remaining,
    retryAfterSeconds,
  };
}
