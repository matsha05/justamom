import { Redis } from "@upstash/redis";

let redisClient: Redis | null | undefined;

export function getRedisClient(): Redis | null {
  if (redisClient !== undefined) {
    return redisClient;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    redisClient = null;
    return redisClient;
  }

  redisClient = new Redis({
    url,
    token,
    // The shared KV layer owns JSON parsing and also reads plain lock values.
    automaticDeserialization: false,
    // A new deadline per command covers response-body reads as well as headers.
    // Do not retry an ambiguous mutation after a lost acknowledgement.
    signal: () => AbortSignal.timeout(5_000),
    retry: { retries: 0 },
  });

  return redisClient;
}
