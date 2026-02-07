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

export function memoryIncrementInWindow(
  key: string,
  windowMs: number
): { count: number; ttlMs: number } {
  cleanupMemoryStoreIfNeeded();
  const now = Date.now();
  const { store } = getMemoryStore();
  const existing = getMemoryRecord(key);

  if (!existing) {
    const expiresAt = now + windowMs;
    store.set(key, { value: "1", expiresAt });
    return { count: 1, ttlMs: windowMs };
  }

  const count = Number(existing.value) + 1;
  store.set(key, {
    value: String(count),
    expiresAt: existing.expiresAt,
  });

  return {
    count,
    ttlMs: Math.max(1, existing.expiresAt - now),
  };
}

export function memoryGetValue(key: string): string | null {
  const record = getMemoryRecord(key);
  return record?.value ?? null;
}

export function memorySetValue(key: string, value: string, ttlMs: number): void {
  cleanupMemoryStoreIfNeeded();
  const { store } = getMemoryStore();
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
}

export function memorySetValueIfAbsent(
  key: string,
  value: string,
  ttlMs: number
): boolean {
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

export function memoryDeleteValue(key: string): void {
  const { store } = getMemoryStore();
  store.delete(key);
}

export function resetMemoryStoreForTests() {
  const root = globalThis as RootStore;
  root[MEMORY_STORE_KEY] = new Map<string, MemoryRecord>();
  root[MEMORY_COUNTER_KEY] = 0;
}
