import { getRedisClient } from "@/lib/server/kv-redis";
import {
  memoryDeleteValue,
  memoryGetValue,
  memoryIncrementInWindow,
  memorySetValue,
  memorySetValueIfAbsent,
  resetMemoryStoreForTests,
} from "@/lib/server/kv-memory";

export async function incrementInWindow(
  key: string,
  windowMs: number
): Promise<{ count: number; ttlMs: number; source: "redis" | "memory" }> {
  const redis = getRedisClient();

  if (redis) {
    const count = Number(await redis.incr(key));

    if (count === 1) {
      await redis.pexpire(key, windowMs);
      return { count, ttlMs: windowMs, source: "redis" };
    }

    const ttl = Number(await redis.pttl(key));
    if (ttl < 0) {
      await redis.pexpire(key, windowMs);
      return { count, ttlMs: windowMs, source: "redis" };
    }

    return { count, ttlMs: ttl, source: "redis" };
  }

  const fallback = memoryIncrementInWindow(key, windowMs);
  return {
    ...fallback,
    source: "memory",
  };
}

export async function getValue(key: string): Promise<string | null> {
  const redis = getRedisClient();

  if (redis) {
    const value = await redis.get<string | null>(key);
    return typeof value === "string" ? value : null;
  }

  return memoryGetValue(key);
}

export async function setValue(key: string, value: string, ttlMs: number): Promise<void> {
  const redis = getRedisClient();

  if (redis) {
    await redis.set(key, value, {
      px: ttlMs,
    });
    return;
  }

  memorySetValue(key, value, ttlMs);
}

export async function setValueIfAbsent(
  key: string,
  value: string,
  ttlMs: number
): Promise<boolean> {
  const redis = getRedisClient();

  if (redis) {
    const result = await redis.set(key, value, {
      nx: true,
      px: ttlMs,
    });
    return result === "OK";
  }

  return memorySetValueIfAbsent(key, value, ttlMs);
}

export async function deleteValue(key: string): Promise<void> {
  const redis = getRedisClient();

  if (redis) {
    await redis.del(key);
    return;
  }

  memoryDeleteValue(key);
}

export async function getJson<T>(key: string): Promise<T | null> {
  const value = await getValue(key);
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export async function setJson(key: string, value: unknown, ttlMs: number): Promise<void> {
  await setValue(key, JSON.stringify(value), ttlMs);
}

export function __resetMemoryStoreForTests() {
  resetMemoryStoreForTests();
}
