import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  getRedisClient: vi.fn(),
  beginIdempotency: vi.fn(),
  commitIdempotency: vi.fn(),
  rollbackIdempotency: vi.fn(),
  checkRateLimit: vi.fn(),
  lookupMailerLiteSubscriber: vi.fn(),
  createMailerLiteSubscriber: vi.fn(),
  logError: vi.fn(),
  logWarn: vi.fn(),
  sendAlert: vi.fn(),
}));

vi.mock("@/lib/server/kv-redis", () => ({ getRedisClient: mocks.getRedisClient }));
vi.mock("@/lib/server/idempotency", () => ({
  beginIdempotency: mocks.beginIdempotency,
  commitIdempotency: mocks.commitIdempotency,
  rollbackIdempotency: mocks.rollbackIdempotency,
}));
vi.mock("@/lib/server/rate-limit", () => ({ checkRateLimit: mocks.checkRateLimit }));
vi.mock("@/lib/server/integrations/mailerlite", () => ({
  lookupMailerLiteSubscriber: mocks.lookupMailerLiteSubscriber,
  createMailerLiteSubscriber: mocks.createMailerLiteSubscriber,
}));
vi.mock("@/lib/server/observability", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/server/observability")>();
  return {
    ...actual,
    logError: mocks.logError,
    logWarn: mocks.logWarn,
    sendAlert: mocks.sendAlert,
  };
});

const token = {
  cacheKey: "test-result",
  lockKey: "test-lock",
  lockValue: "test-owner",
  resultTtlMs: 600_000,
};

function request(key = "storage-failure-test") {
  return new NextRequest("https://lizishaw.com/api/newsletter", {
    method: "POST",
    headers: {
      origin: "https://lizishaw.com",
      "content-type": "application/json",
      "idempotency-key": key,
    },
    body: JSON.stringify({ email: "test@example.com" }),
  });
}

function preparationOptions(key?: string) {
  return {
    request: request(key),
    route: "/api/newsletter",
    allowedContentTypes: ["application/json"],
    maxBodyBytes: 8_192,
    idempotencyScope: "newsletter",
  };
}

beforeEach(() => {
  vi.resetModules();
  vi.resetAllMocks();
  vi.stubEnv("ALLOWED_ORIGINS", "https://lizishaw.com");
  vi.stubEnv("ALLOW_MISSING_ORIGIN", "false");
  vi.stubEnv("REQUIRE_REDIS", "false");
  vi.stubEnv("REQUIRE_REDIS_FOR_RATE_LIMITS", "false");
  vi.stubEnv("MAILER_LITE_API_KEY", "test-key");
  vi.stubEnv("MAILERLITE_GROUP_ID", "test-group");
  mocks.getRedisClient.mockReturnValue({});
  mocks.beginIdempotency.mockResolvedValue({ state: "acquired", token });
  mocks.commitIdempotency.mockResolvedValue(undefined);
  mocks.rollbackIdempotency.mockResolvedValue(undefined);
  mocks.sendAlert.mockResolvedValue(undefined);
  mocks.checkRateLimit.mockResolvedValue({ limited: false, remaining: 10, retryAfterSeconds: 60 });
  mocks.lookupMailerLiteSubscriber.mockResolvedValue({
    status: 200,
    message: null,
  });
  vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Unexpected external request in test"));
});

afterEach(() => {
  expect(globalThis.fetch).not.toHaveBeenCalled();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("API storage failure transitions", () => {
  it.each(["client initialization", "lease acquisition"])("returns controlled JSON when storage fails during %s", async (failure) => {
    if (failure === "client initialization") {
      mocks.getRedisClient.mockImplementation(() => { throw new Error("Redis initialization failed"); });
    } else {
      mocks.beginIdempotency.mockRejectedValue(new Error("Redis acquisition failed"));
    }
    const { POST } = await import("@/app/api/newsletter/route");

    const response = await POST(request());

    expect(response.status).toBe(503);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(await response.json()).toEqual({
      error: "Service temporarily unavailable. Please try again shortly.",
    });
    expect(mocks.lookupMailerLiteSubscriber).not.toHaveBeenCalled();
    expect(mocks.createMailerLiteSubscriber).not.toHaveBeenCalled();
    expect(mocks.logError).toHaveBeenCalledWith("request.prepare_failed", expect.any(Object), expect.any(Error));
  });

  it("catches an asynchronous result-commit failure instead of rejecting the route promise", async () => {
    mocks.commitIdempotency.mockRejectedValue(new Error("Redis write failed after lookup"));
    const { POST } = await import("@/app/api/newsletter/route");

    const response = await POST(request());

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: "Newsletter signup is temporarily unavailable." });
    expect(mocks.commitIdempotency).toHaveBeenCalledWith(token, 200, expect.objectContaining({ success: true }), undefined);
    expect(mocks.rollbackIdempotency).toHaveBeenCalledWith(token, false);
    expect(mocks.logError).toHaveBeenCalledWith("newsletter.request_failed", expect.any(Object), expect.any(Error), expect.any(Object));
  });

  it("keeps a JSON error when both result finalization and cleanup fail", async () => {
    mocks.commitIdempotency.mockRejectedValue(new Error("Redis write failed"));
    mocks.rollbackIdempotency.mockRejectedValue(new Error("Redis cleanup failed"));
    const { POST } = await import("@/app/api/newsletter/route");

    const response = await POST(request());

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: "Newsletter signup is temporarily unavailable." });
    expect(mocks.logError).toHaveBeenCalledWith("idempotency.rollback_failed", expect.any(Object), expect.any(Error));
  });

  it("keeps a JSON upstream error when releasing its lease fails", async () => {
    mocks.lookupMailerLiteSubscriber.mockResolvedValue({
      status: 503,
      message: "Provider unavailable",
    });
    mocks.rollbackIdempotency.mockRejectedValue(new Error("Redis cleanup failed"));
    const { POST } = await import("@/app/api/newsletter/route");

    const response = await POST(request());

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: "Newsletter signup is temporarily unavailable." });
    expect(mocks.commitIdempotency).not.toHaveBeenCalled();
    expect(mocks.rollbackIdempotency).toHaveBeenCalledTimes(2);
    expect(mocks.logError).toHaveBeenCalledWith("idempotency.rollback_failed", expect.any(Object), expect.any(Error));
  });

  it("claims the missing-Redis warning before awaiting alert delivery", async () => {
    mocks.getRedisClient.mockReturnValue(null);
    let releaseAlert!: () => void;
    const alertPending = new Promise<void>((resolve) => { releaseAlert = resolve; });
    mocks.sendAlert.mockReturnValue(alertPending);
    const { prepareApiRouteRequest } = await import("@/lib/server/api-route");

    const first = prepareApiRouteRequest(preparationOptions("first"));
    const second = await prepareApiRouteRequest(preparationOptions("second"));

    // The second request can proceed while the first alert is still pending.
    // It must not start another alert attempt for the same process latch.
    expect(second).toHaveProperty("prepared");
    expect(mocks.logWarn).toHaveBeenCalledTimes(1);
    expect(mocks.sendAlert).toHaveBeenCalledTimes(1);
    releaseAlert();
    expect(await first).toHaveProperty("prepared");
    expect(await prepareApiRouteRequest(preparationOptions("third"))).toHaveProperty("prepared");
    expect(mocks.sendAlert).toHaveBeenCalledTimes(1);
  });
});
