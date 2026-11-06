import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchJson } from "@/lib/client/http";
import { fetchAndConsumeWithTimeout } from "@/lib/server/http";
import {
  createMailerLiteSubscriber,
  lookupMailerLiteSubscriber,
} from "@/lib/server/integrations/mailerlite";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function mockStalledBody(status = 200) {
  let requestSignal: AbortSignal | null | undefined;
  const fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(async (_input, init) => {
    requestSignal = init?.signal;
    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('{"data":'));
        requestSignal?.addEventListener("abort", () => {
          controller.error(requestSignal?.reason);
        }, { once: true });
      },
    });
    return new Response(body, { status });
  });
  return { fetchSpy, signal: () => requestSignal };
}

describe("complete request deadlines", () => {
  it.each(["lookup", "create"])("bounds MailerLite %s error-body consumption after headers arrive", async (operation) => {
    const stalled = mockStalledBody(503);
    const pending = operation === "lookup"
      ? lookupMailerLiteSubscriber("https://mailer.example.test", "test@example.com", "test-key")
      : createMailerLiteSubscriber("https://mailer.example.test", "test@example.com", "group", "test-key");
    const rejected = expect(pending).rejects.toMatchObject({ name: "TimeoutError" });

    await vi.advanceTimersByTimeAsync(7_999);
    expect(stalled.signal()?.aborted).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    await rejected;

    expect(stalled.fetchSpy).toHaveBeenCalledTimes(1);
    expect(stalled.signal()?.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("bounds client body consumption and aborts the pending transport", async () => {
    const stalled = mockStalledBody();
    const rejected = expect(fetchJson("/api/newsletter")).rejects.toMatchObject({ name: "TimeoutError" });

    await vi.advanceTimersByTimeAsync(25_000);
    await rejected;

    expect(stalled.signal()?.aborted).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("settles the deadline even if a consumer ignores the abort signal", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ success: true }));
    const rejected = expect(fetchAndConsumeWithTimeout(
      "https://example.test",
      {},
      () => new Promise<never>(() => undefined),
      50
    )).rejects.toMatchObject({ name: "TimeoutError" });

    await vi.advanceTimersByTimeAsync(50);
    await rejected;
    expect(vi.getTimerCount()).toBe(0);
  });

  it("preserves caller cancellation during body consumption and removes its listener", async () => {
    const stalled = mockStalledBody();
    const caller = new AbortController();
    const removeListener = vi.spyOn(caller.signal, "removeEventListener");
    const reason = new DOMException("Left the page", "AbortError");
    const pending = fetchJson("/api/contact", { signal: caller.signal });
    const rejected = expect(pending).rejects.toBe(reason);

    await vi.advanceTimersByTimeAsync(0);
    caller.abort(reason);
    await rejected;

    expect(stalled.signal()?.aborted).toBe(true);
    expect(removeListener).toHaveBeenCalledWith("abort", expect.any(Function));
    expect(vi.getTimerCount()).toBe(0);
  });

  it("does not start a fetch for an already-cancelled input Request", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const caller = new AbortController();
    const request = new Request("https://example.test/api/contact", { signal: caller.signal });
    caller.abort();

    await expect(fetchJson(request)).rejects.toMatchObject({ name: "AbortError" });

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("cleans up the deadline and caller listener after a successful response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ success: true }));
    const caller = new AbortController();
    const removeListener = vi.spyOn(caller.signal, "removeEventListener");

    const result = await fetchJson("/api/contact", { signal: caller.signal });

    expect(result.data).toEqual({ success: true });
    expect(removeListener).toHaveBeenCalledWith("abort", expect.any(Function));
    expect(vi.getTimerCount()).toBe(0);
  });
});
