import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  beginIdempotency,
  commitIdempotency,
  IdempotencyLeaseLostError,
  reserveIdempotencyResponse,
  rollbackIdempotency,
} from "@/lib/server/idempotency";
import { __resetMemoryStoreForTests } from "@/lib/server/kv";
import { memorySetValue } from "@/lib/server/kv-memory";

vi.mock("@/lib/server/kv-redis", () => ({ getRedisClient: () => null }));

const options = { scope: "contact", key: "same-request", requestHash: "payload-a" };

async function acquire(overrides = {}) {
  const result = await beginIdempotency({ ...options, ...overrides });
  expect(result.state).toBe("acquired");
  if (result.state !== "acquired") throw new Error("Expected an acquired lease");
  return result.token;
}

beforeEach(() => {
  __resetMemoryStoreForTests();
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
});

afterEach(() => vi.useRealTimers());

describe("idempotency ownership and result transitions", () => {
  it("replays a legacy result without payload metadata after deployment", async () => {
    const body = { success: true, message: "Already delivered before deployment" };
    memorySetValue("idempotency:result:contact:same-request", JSON.stringify({ status: 200, body }), 60_000);
    await expect(beginIdempotency(options)).resolves.toEqual({
      state: "replay", cached: { status: 200, body },
    });
  });

  it("waits for a legacy UUID lease instead of treating it as a payload conflict", async () => {
    memorySetValue("idempotency:lock:contact:same-request", crypto.randomUUID(), 60_000);
    await expect(beginIdempotency(options)).resolves.toEqual({ state: "in_progress" });
  });

  it("gives one owner to concurrent callers", async () => {
    const results = await Promise.all(Array.from({ length: 20 }, () => beginIdempotency(options)));
    expect(results.filter((result) => result.state === "acquired")).toHaveLength(1);
    expect(results.filter((result) => result.state === "in_progress")).toHaveLength(19);
  });

  it("cannot acquire between another owner's result commit and release", async () => {
    const token = await acquire();
    const [, contender] = await Promise.all([
      commitIdempotency(token, 200, { success: true }),
      beginIdempotency(options),
    ]);
    expect(contender).toEqual({
      state: "replay",
      cached: { status: 200, body: { success: true } },
    });
  });

  it("does not let an expired owner release or overwrite a replacement owner", async () => {
    const stale = await acquire({ lockTtlMs: 10 });
    vi.advanceTimersByTime(11);
    const current = await acquire();
    await rollbackIdempotency(stale);
    await expect(beginIdempotency(options)).resolves.toEqual({ state: "in_progress" });
    await expect(commitIdempotency(stale, 200, { old: true }))
      .rejects.toBeInstanceOf(IdempotencyLeaseLostError);
    await expect(reserveIdempotencyResponse(stale, 409, { old: true }))
      .rejects.toBeInstanceOf(IdempotencyLeaseLostError);
    await commitIdempotency(current, 200, { current: true });
    await expect(beginIdempotency(options)).resolves.toEqual({
      state: "replay", cached: { status: 200, body: { current: true } },
    });
  });

  it("rejects a changed payload while processing and after completion", async () => {
    const token = await acquire();
    const changed = { ...options, requestHash: "payload-b" };
    await expect(beginIdempotency(changed)).resolves.toEqual({ state: "conflict" });
    await commitIdempotency(token, 400, { error: "Invalid original payload" });
    await expect(beginIdempotency(changed)).resolves.toEqual({ state: "conflict" });
  });

  it("retains an unknown outcome after its owner's lease expires", async () => {
    const token = await acquire({ lockTtlMs: 10 });
    const body = { error: "Delivery could not be confirmed." };
    await reserveIdempotencyResponse(token, 409, body);
    await expect(beginIdempotency(options)).resolves.toEqual({ state: "in_progress" });
    vi.advanceTimersByTime(11);
    await expect(beginIdempotency(options)).resolves.toEqual({
      state: "replay", cached: { status: 409, body },
    });
    await expect(commitIdempotency(token, 200, { success: true }))
      .rejects.toBeInstanceOf(IdempotencyLeaseLostError);
    vi.advanceTimersByTime(24 * 60 * 60_000);
    await expect(beginIdempotency(options)).resolves.toMatchObject({ state: "acquired" });
  });

  it("replaces a reservation with the definitive result and its normal TTL", async () => {
    const token = await acquire({ resultTtlMs: 100 });
    await reserveIdempotencyResponse(token, 409, { error: "Unknown" }, undefined, 10_000);
    await commitIdempotency(token, 200, { success: true });
    await expect(beginIdempotency(options)).resolves.toEqual({
      state: "replay", cached: { status: 200, body: { success: true } },
    });
    vi.advanceTimersByTime(101);
    await expect(beginIdempotency(options)).resolves.toMatchObject({ state: "acquired" });
  });

  it("keeps a reservation when the owner releases after an ambiguous failure", async () => {
    const token = await acquire();
    await reserveIdempotencyResponse(token, 409, { error: "Unknown" });
    await rollbackIdempotency(token);
    await expect(beginIdempotency(options)).resolves.toEqual({
      state: "replay", cached: { status: 409, body: { error: "Unknown" } },
    });
  });

  it("discards a reservation after a confirmed rejection so a retry can acquire", async () => {
    const token = await acquire();
    await reserveIdempotencyResponse(token, 409, { error: "Unknown" });
    await rollbackIdempotency(token, true);
    await expect(beginIdempotency(options)).resolves.toMatchObject({ state: "acquired" });
  });

  it("does not let a stale owner discard another owner's reservation", async () => {
    const stale = await acquire({ lockTtlMs: 10 });
    vi.advanceTimersByTime(11);
    const current = await acquire();
    await reserveIdempotencyResponse(current, 409, { error: "Current unknown outcome" });
    await rollbackIdempotency(stale, true);
    await expect(beginIdempotency(options)).resolves.toEqual({ state: "in_progress" });
    await rollbackIdempotency(current);
    await expect(beginIdempotency(options)).resolves.toEqual({
      state: "replay", cached: { status: 409, body: { error: "Current unknown outcome" } },
    });
  });
});
