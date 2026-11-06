import {
  acquireIdempotencyLease,
  releaseOwnedIdempotencyLease,
  writeOwnedIdempotencyResult,
} from "@/lib/server/kv-idempotency";

const DEFAULT_LOCK_TTL_MS = 60_000;
const DEFAULT_RESULT_TTL_MS = 10 * 60_000;
const DEFAULT_RESERVED_RESULT_TTL_MS = 24 * 60 * 60_000;

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
  requestHash?: string;
}

interface IdempotencyToken {
  cacheKey: string;
  lockKey: string;
  lockValue: string;
  resultTtlMs: number;
  requestHash?: string;
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
    }
  | { state: "conflict" };

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

  const lockValue = JSON.stringify({
    owner: crypto.randomUUID(),
    requestHash: options.requestHash ?? "",
  });
  const result = await acquireIdempotencyLease({
    cacheKey,
    lockKey,
    lockValue,
    requestHash: options.requestHash ?? "",
    lockTtlMs,
  });
  if (result.state === "replay") {
    const { status, body, headers } = JSON.parse(result.value) as CachedResponse<T>;
    return { state: "replay", cached: { status, body, ...(headers ? { headers } : {}) } };
  }
  if (result.state !== "acquired") return { state: result.state };

  return {
    state: "acquired",
    token: {
      cacheKey,
      lockKey,
      lockValue,
      resultTtlMs,
      requestHash: options.requestHash,
    },
  };
}

export class IdempotencyLeaseLostError extends Error {
  constructor() {
    super("The idempotency lease expired or changed owners.");
    this.name = "IdempotencyLeaseLostError";
  }
}

export async function commitIdempotency<T>(
  token: IdempotencyToken,
  status: number,
  body: T,
  headers?: Record<string, string>
) {
  await writeResult(token, status, body, headers, token.resultTtlMs, false);
}

export async function reserveIdempotencyResponse<T>(
  token: IdempotencyToken,
  status: number,
  body: T,
  headers?: Record<string, string>,
  ttlMs = DEFAULT_RESERVED_RESULT_TTL_MS
) {
  await writeResult(token, status, body, headers, ttlMs, true);
}

async function writeResult<T>(
  token: IdempotencyToken,
  status: number,
  body: T,
  headers: Record<string, string> | undefined,
  ttlMs: number,
  provisional: boolean
) {
  const written = await writeOwnedIdempotencyResult({
    cacheKey: token.cacheKey,
    lockKey: token.lockKey,
    lockValue: token.lockValue,
    value: JSON.stringify({
      status,
      body,
      headers,
      requestHash: token.requestHash ?? "",
      provisional,
    }),
    ttlMs,
    release: !provisional,
  });
  if (!written) throw new IdempotencyLeaseLostError();
}

export async function rollbackIdempotency(token: IdempotencyToken, discardReserved = false) {
  await releaseOwnedIdempotencyLease(token.cacheKey, token.lockKey, token.lockValue, discardReserved);
}
