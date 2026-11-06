import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendAlert } from "@/lib/server/observability";

const context = {
  route: "/api/contact",
  requestId: "test-request",
  ip: "203.0.113.11",
  fingerprint: "test-fingerprint",
  userAgent: "vitest",
  origin: "https://example.test",
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubEnv("ALERT_WEBHOOK_URL", "https://alerts.example.test");
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("operational alerts", () => {
  it("logs a rejected HTTP response without failing the caller", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("unavailable", { status: 503 }));
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);

    await expect(sendAlert("contact.request_failed", context, {})).resolves.toBeUndefined();

    expect(log).toHaveBeenCalledWith("[api]", expect.stringContaining('"event":"alert.send_failed"'));
    expect(log).toHaveBeenCalledWith("[api]", expect.stringContaining("HTTP 503"));
    expect(vi.getTimerCount()).toBe(0);
  });

  it("ends a stuck alert attempt after three seconds even if fetch ignores abort", async () => {
    let signal: AbortSignal | null | undefined;
    vi.spyOn(globalThis, "fetch").mockImplementation((_input, init) => {
      signal = init?.signal;
      return new Promise<Response>(() => undefined);
    });
    const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const pending = sendAlert("contact.request_failed", context, {});

    await vi.advanceTimersByTimeAsync(3_000);
    await expect(pending).resolves.toBeUndefined();

    expect(signal?.aborted).toBe(true);
    expect(log).toHaveBeenCalledWith("[api]", expect.stringContaining("TimeoutError"));
    expect(vi.getTimerCount()).toBe(0);
  });
});
