import { afterEach, beforeEach, expect, it, vi } from "vitest";

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://redis.example.test");
  vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.useRealTimers();
});

it("replays the saved response and releases its lock through the real Redis SDK", async () => {
  const values = new Map<string, string>();

  // Emulate the REST wire format, including base64 responses. Keep the SDK's
  // serialization intact so this exercises the production cache boundary.
  vi.spyOn(global, "fetch").mockImplementation(async (input, init) => {
    expect(String(input)).toMatch(/^https:\/\/redis\.example\.test\//);
    const body = JSON.parse(String(init?.body)) as unknown[];
    const isPipeline = Array.isArray(body[0]);
    const commands = (isPipeline ? body : [body]) as Array<Array<string | number>>;
    const responses = commands.map(([command, scriptValue, keyCount, ...arguments_]) => {
      expect(String(command).toLowerCase()).toBe("eval");
      const script = String(scriptValue);
      const keys = arguments_.slice(0, Number(keyCount)).map(String);
      const args = arguments_.slice(Number(keyCount)).map(String);
      let result: string[] | number;
      // This mock exercises the actual SDK's EVAL argument/response encoding.
      // Transition and expiry behavior are covered separately against memory.
      if (script.includes("return {'acquired'}")) {
        const cached = values.get(keys[0]);
        const lock = values.get(keys[1]);
        let stored: { requestHash?: string; provisional?: boolean } | null = null;
        try { stored = cached ? JSON.parse(cached) : lock ? JSON.parse(lock) : null; } catch { /* Legacy UUID lock. */ }
        if (stored?.requestHash !== undefined && stored.requestHash !== args[0]) result = ["conflict"];
        else if (cached && !(stored?.provisional && lock)) result = ["replay", cached];
        else if (lock) result = ["in_progress"];
        else {
          values.set(keys[1], args[1]);
          result = ["acquired"];
        }
      } else if (script.includes("redis.call('SET'")) {
        if (values.get(keys[1]) !== args[0]) result = 0;
        else {
          values.set(keys[0], args[1]);
          if (args[3] === "1") values.delete(keys[1]);
          result = 1;
        }
      } else {
        if (values.get(keys[0]) !== args[0]) result = 0;
        else {
          const cached = values.get(keys[1]);
          if (args[1] === "1" && cached && JSON.parse(cached).provisional) values.delete(keys[1]);
          values.delete(keys[0]);
          result = 1;
        }
      }
      return {
        result: Array.isArray(result)
          ? result.map((value) => Buffer.from(value).toString("base64"))
          : result,
      };
    });
    return Response.json(isPipeline ? responses : responses[0]);
  });

  const { beginIdempotency, commitIdempotency, reserveIdempotencyResponse, rollbackIdempotency } =
    await import("@/lib/server/idempotency");
  const options = { scope: "contact", key: "retry-after-lost-response", requestHash: "payload-a" };
  const first = await beginIdempotency(options);
  expect(first.state).toBe("acquired");
  if (first.state !== "acquired") throw new Error("Expected a new submission lock");

  const responseBody = { success: true, message: "Message sent." };
  await reserveIdempotencyResponse(first.token, 409, { error: "Unknown outcome" });
  await expect(beginIdempotency(options)).resolves.toEqual({ state: "in_progress" });
  await expect(beginIdempotency({ ...options, requestHash: "payload-b" }))
    .resolves.toEqual({ state: "conflict" });
  await commitIdempotency(first.token, 200, responseBody, { "x-request-id": "original" });

  expect(values.has(first.token.lockKey)).toBe(false);
  await expect(beginIdempotency(options)).resolves.toEqual({
    state: "replay",
    cached: { status: 200, body: responseBody, headers: { "x-request-id": "original" } },
  });
  await rollbackIdempotency(first.token);

  values.set("idempotency:result:contact:legacy-result", JSON.stringify({ status: 200, body: responseBody }));
  await expect(beginIdempotency({ ...options, key: "legacy-result" })).resolves.toEqual({
    state: "replay", cached: { status: 200, body: responseBody },
  });
  values.set("idempotency:lock:contact:legacy-lock", crypto.randomUUID());
  await expect(beginIdempotency({ ...options, key: "legacy-lock" }))
    .resolves.toEqual({ state: "in_progress" });
});

it.each(["headers", "body"] as const)("aborts stalled Redis %s at five seconds with a fresh signal and no retry", async (phase) => {
  vi.useFakeTimers();
  const timeout = vi.spyOn(AbortSignal, "timeout").mockImplementation((delay) => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(new DOMException("Redis request timed out", "TimeoutError")), delay);
    return controller.signal;
  });
  const signals: AbortSignal[] = [];
  const fetchSpy = vi.spyOn(global, "fetch").mockImplementation((_input, init) => {
    const signal = init?.signal;
    if (!signal) throw new Error("Expected a command deadline");
    signals.push(signal);
    if (phase === "body") {
      return Promise.resolve(new Response(new ReadableStream({
        start(controller) {
          if (signal.aborted) controller.error(signal.reason);
          else signal.addEventListener("abort", () => controller.error(signal.reason), { once: true });
        },
      }), { headers: { "Content-Type": "application/json" } }));
    }
    return new Promise<Response>((_resolve, reject) => {
      if (signal.aborted) reject(signal.reason);
      else signal.addEventListener("abort", () => reject(signal.reason), { once: true });
    });
  });
  const { getRedisClient } = await import("@/lib/server/kv-redis");
  const redis = getRedisClient();
  if (!redis) throw new Error("Expected configured Redis");

  const first = expect(redis.set("lease", "owner")).rejects.toMatchObject({ name: "TimeoutError" });
  await vi.advanceTimersByTimeAsync(5_000);
  await first;
  expect(fetchSpy).toHaveBeenCalledTimes(1);
  expect(timeout).toHaveBeenCalledWith(5_000);

  const second = expect(redis.set("lease", "next-owner")).rejects.toMatchObject({ name: "TimeoutError" });
  await vi.advanceTimersByTimeAsync(5_000);
  await second;
  expect(fetchSpy).toHaveBeenCalledTimes(2);
  expect(signals[0]).not.toBe(signals[1]);
});

it("does not retry a Redis mutation after a network acknowledgement failure", async () => {
  const fetchSpy = vi.spyOn(global, "fetch").mockRejectedValue(new Error("Connection closed"));
  const { getRedisClient } = await import("@/lib/server/kv-redis");
  const redis = getRedisClient();
  if (!redis) throw new Error("Expected configured Redis");
  await expect(redis.set("lease", "owner")).rejects.toThrow("Connection closed");
  expect(fetchSpy).toHaveBeenCalledTimes(1);
});
