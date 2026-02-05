import { Redis } from "@upstash/redis";

interface MemoryRecord {
  value: string;
  expiresAt: number;
}

const MEMORY_STORE_KEY = "__justamom_kv_memory_store__";
const MEMORY_COUNTER_KEY = "__justamom_kv_memory_counter__";
const CLEANUP_INTERVAL = 100;

type RootStore = typeof globalThis & {
  [MEMORY_STORE_KEY]?: Map<string, MemoryRecord>;
  [MEMORY_COUNTER_KEY]?: number;
};

let redisClient: Redis | null | undefined;

function getRedisClient(): Redis | null {
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
  });

  return redisClient;
}

function getMemoryStore(): { store: Map<string, MemoryRecord>; counter: number } {
  const root = globalThis as RootStore;

  if (!root[MEMORY_STORE_KEY]) {
    root[MEMORY_STORE_KEY] = new Map<string, MemoryRecord>();
  }

  if (!root[MEMORY_COUNTER_KEY]) {
    root[MEMORY_COUNTER_KEY] = 0;
  }

  return {
    store: root[MEMORY_STORE_KEY] as Map<string, MemoryRecord>,
    counter: root[MEMORY_COUNTER_KEY] as number,
  };
}

function setMemoryCounter(value: number) {
  const root = globalThis as RootStore;
  root[MEMORY_COUNTER_KEY] = value;
}

function cleanupMemoryStore(store: Map<string, MemoryRecord>, now: number) {
  for (const [key, record] of store.entries()) {
    if (record.expiresAt <= now) {
      store.delete(key);
    }
  }
}

function cleanupMemoryStoreIfNeeded() {
  const now = Date.now();
  const { store, counter } = getMemoryStore();
  const nextCounter = counter + 1;
  setMemoryCounter(nextCounter);

  if (nextCounter % CLEANUP_INTERVAL === 0) {
    cleanupMemoryStore(store, now);
  }
}

function getMemoryRecord(key: string): MemoryRecord | null {
  const now = Date.now();
  const { store } = getMemoryStore();
  const record = store.get(key);

  if (!record) {
    return null;
  }

  if (record.expiresAt <= now) {
    store.delete(key);
    return null;
  }

  return record;
}

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

  cleanupMemoryStoreIfNeeded();
  const now = Date.now();
  const { store } = getMemoryStore();
  const existing = getMemoryRecord(key);

  if (!existing) {
    const expiresAt = now + windowMs;
    store.set(key, { value: "1", expiresAt });
    return { count: 1, ttlMs: windowMs, source: "memory" };
  }

  const count = Number(existing.value) + 1;
  store.set(key, {
    value: String(count),
    expiresAt: existing.expiresAt,
  });

  return {
    count,
    ttlMs: Math.max(1, existing.expiresAt - now),
    source: "memory",
  };
}

export async function getValue(key: string): Promise<string | null> {
  const redis = getRedisClient();

  if (redis) {
    const value = await redis.get<string | null>(key);
    return typeof value === "string" ? value : null;
  }

  const record = getMemoryRecord(key);
  return record?.value ?? null;
}

export async function setValue(key: string, value: string, ttlMs: number): Promise<void> {
  const redis = getRedisClient();

  if (redis) {
    await redis.set(key, value, {
      px: ttlMs,
    });
    return;
  }

  cleanupMemoryStoreIfNeeded();
  const { store } = getMemoryStore();
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
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

  cleanupMemoryStoreIfNeeded();
  const existing = getMemoryRecord(key);
  if (existing) {
    return false;
  }

  const { store } = getMemoryStore();
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
  return true;
}

export async function deleteValue(key: string): Promise<void> {
  const redis = getRedisClient();

  if (redis) {
    await redis.del(key);
    return;
  }

  const { store } = getMemoryStore();
  store.delete(key);
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
  const root = globalThis as RootStore;
  root[MEMORY_STORE_KEY] = new Map<string, MemoryRecord>();
  root[MEMORY_COUNTER_KEY] = 0;
}
