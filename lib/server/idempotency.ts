import { deleteValue, getJson, getValue, setJson, setValueIfAbsent } from "@/lib/server/kv";

const DEFAULT_LOCK_TTL_MS = 60_000;
const DEFAULT_RESULT_TTL_MS = 10 * 60_000;

interface CachedResponse<T> {
  status: number;
  body: T;
  headers?: Record<string, string>;
}

interface BeginOptions {
  scope: string;
  key: string;
  lockTtlMs?: number;
  resultTtlMs?: number;
}

interface IdempotencyToken {
  cacheKey: string;
  lockKey: string;
  lockValue: string;
  resultTtlMs: number;
}

type BeginResult<T> =
  | {
      state: "acquired";
      token: IdempotencyToken;
    }
  | {
      state: "replay";
      cached: CachedResponse<T>;
    }
  | {
      state: "in_progress";
    };

function buildKeys(scope: string, key: string) {
  const normalizedScope = scope.toLowerCase();
  return {
    cacheKey: `idempotency:result:${normalizedScope}:${key}`,
    lockKey: `idempotency:lock:${normalizedScope}:${key}`,
  };
}

export async function beginIdempotency<T = unknown>(
  options: BeginOptions
): Promise<BeginResult<T>> {
  const { cacheKey, lockKey } = buildKeys(options.scope, options.key);
  const lockTtlMs = options.lockTtlMs ?? DEFAULT_LOCK_TTL_MS;
  const resultTtlMs = options.resultTtlMs ?? DEFAULT_RESULT_TTL_MS;

  const cached = await getJson<CachedResponse<T>>(cacheKey);
  if (cached) {
    return {
      state: "replay",
      cached,
    };
  }

  const lockValue = crypto.randomUUID();
  const acquired = await setValueIfAbsent(lockKey, lockValue, lockTtlMs);

  if (!acquired) {
    const replay = await getJson<CachedResponse<T>>(cacheKey);
    if (replay) {
      return {
        state: "replay",
        cached: replay,
      };
    }

    return {
      state: "in_progress",
    };
  }

  return {
    state: "acquired",
    token: {
      cacheKey,
      lockKey,
      lockValue,
      resultTtlMs,
    },
  };
}

async function releaseLock(lockKey: string, lockValue: string) {
  const current = await getValue(lockKey);
  if (current === lockValue) {
    await deleteValue(lockKey);
  }
}

export async function commitIdempotency<T>(
  token: IdempotencyToken,
  status: number,
  body: T,
  headers?: Record<string, string>
) {
  await setJson(
    token.cacheKey,
    {
      status,
      body,
      headers,
    } satisfies CachedResponse<T>,
    token.resultTtlMs
  );

  await releaseLock(token.lockKey, token.lockValue);
}

export async function rollbackIdempotency(token: IdempotencyToken) {
  await releaseLock(token.lockKey, token.lockValue);
}
