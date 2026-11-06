import { getRedisClient } from "@/lib/server/kv-redis";
import {
  memoryDeleteValue,
  memoryGetValue,
  memorySetValue,
} from "@/lib/server/kv-memory";

// Keep the result check and lease acquisition in one operation. A result can
// otherwise be committed between a caller's cache read and lock acquisition.
const ACQUIRE_SCRIPT = `
local cached = redis.call('GET', KEYS[1])
local lock = redis.call('GET', KEYS[2])
if cached then
  local result = cjson.decode(cached)
  if result.requestHash ~= nil and result.requestHash ~= ARGV[1] then return {'conflict'} end
  if result.provisional and lock then return {'in_progress'} end
  return {'replay', cached}
end
if lock then
  local ok, lease = pcall(cjson.decode, lock)
  local requestHash = nil
  if ok and type(lease) == 'table' then requestHash = lease.requestHash end
  if requestHash ~= nil and requestHash ~= ARGV[1] then return {'conflict'} end
  return {'in_progress'}
end
redis.call('SET', KEYS[2], ARGV[2], 'PX', ARGV[3])
return {'acquired'}
`;

const WRITE_OWNED_SCRIPT = `
if redis.call('GET', KEYS[2]) ~= ARGV[1] then return 0 end
redis.call('SET', KEYS[1], ARGV[2], 'PX', ARGV[3])
if ARGV[4] == '1' then redis.call('DEL', KEYS[2]) end
return 1
`;

const RELEASE_OWNED_SCRIPT = `
if redis.call('GET', KEYS[1]) ~= ARGV[1] then return 0 end
if ARGV[2] == '1' then
  local cached = redis.call('GET', KEYS[2])
  if cached and cjson.decode(cached).provisional then redis.call('DEL', KEYS[2]) end
end
redis.call('DEL', KEYS[1])
return 1
`;

type Acquisition =
  | { state: "acquired" | "in_progress" | "conflict" }
  | { state: "replay"; value: string };

interface StoredMetadata {
  requestHash?: string;
  provisional?: boolean;
}

function lockRequestHash(value: string): string | undefined {
  try {
    return (JSON.parse(value) as StoredMetadata).requestHash;
  } catch {
    // Locks created before payload binding contained only an owner UUID.
    return undefined;
  }
}

export async function acquireIdempotencyLease(options: {
  cacheKey: string;
  lockKey: string;
  lockValue: string;
  requestHash: string;
  lockTtlMs: number;
}): Promise<Acquisition> {
  const { cacheKey, lockKey, lockValue, requestHash, lockTtlMs } = options;
  const redis = getRedisClient();
  if (redis) {
    const [state, value] = await redis.eval<unknown[], string[]>(
      ACQUIRE_SCRIPT,
      [cacheKey, lockKey],
      [requestHash, lockValue, lockTtlMs]
    );
    if (state === "replay" && typeof value === "string") return { state, value };
    if (state === "acquired" || state === "in_progress" || state === "conflict") {
      return { state };
    }
    throw new Error("Invalid idempotency acquisition result.");
  }

  // These synchronous operations execute without yielding, matching the Lua
  // transaction within this process (memory is not shared across instances).
  const cached = memoryGetValue(cacheKey);
  const lock = memoryGetValue(lockKey);
  if (cached) {
    const result = JSON.parse(cached) as StoredMetadata;
    // Preserve pre-deployment deduplication even though old results cannot prove
    // payload identity. Only records written with a hash enforce that binding.
    if (result.requestHash !== undefined && result.requestHash !== requestHash) {
      return { state: "conflict" };
    }
    if (result.provisional && lock) return { state: "in_progress" };
    return { state: "replay", value: cached };
  }
  if (lock) {
    const existingHash = lockRequestHash(lock);
    return {
      state: existingHash === undefined || existingHash === requestHash ? "in_progress" : "conflict",
    };
  }
  memorySetValue(lockKey, lockValue, lockTtlMs);
  return { state: "acquired" };
}

export async function writeOwnedIdempotencyResult(options: {
  cacheKey: string;
  lockKey: string;
  lockValue: string;
  value: string;
  ttlMs: number;
  release: boolean;
}): Promise<boolean> {
  const { cacheKey, lockKey, lockValue, value, ttlMs, release } = options;
  const redis = getRedisClient();
  if (redis) {
    return Number(await redis.eval<unknown[], number>(
      WRITE_OWNED_SCRIPT,
      [cacheKey, lockKey],
      [lockValue, value, ttlMs, release ? "1" : "0"]
    )) === 1;
  }
  if (memoryGetValue(lockKey) !== lockValue) return false;
  memorySetValue(cacheKey, value, ttlMs);
  if (release) memoryDeleteValue(lockKey);
  return true;
}

export async function releaseOwnedIdempotencyLease(
  cacheKey: string,
  lockKey: string,
  lockValue: string,
  discardReserved = false
): Promise<void> {
  const redis = getRedisClient();
  if (redis) {
    await redis.eval(RELEASE_OWNED_SCRIPT, [lockKey, cacheKey], [lockValue, discardReserved ? "1" : "0"]);
    return;
  }
  if (memoryGetValue(lockKey) !== lockValue) return;
  if (discardReserved) {
    const cached = memoryGetValue(cacheKey);
    if (cached && (JSON.parse(cached) as StoredMetadata).provisional) memoryDeleteValue(cacheKey);
  }
  memoryDeleteValue(lockKey);
}
