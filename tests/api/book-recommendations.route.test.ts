import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/book-recommendations/route";
import { __resetMemoryStoreForTests } from "@/lib/server/kv";

function request(fields: Record<string, string> | FormData, headers: Record<string, string> = {}) {
  const form = fields instanceof FormData ? fields : new FormData();
  if (!(fields instanceof FormData)) {
    for (const [key, value] of Object.entries(fields)) form.set(key, value);
  }
  return new NextRequest(new Request("https://lizishaw.com/api/book-recommendations", {
    method: "POST",
    headers: { origin: "https://lizishaw.com", "x-forwarded-for": "203.0.113.15", ...headers },
    body: form,
  }));
}

describe("POST /api/book-recommendations", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    __resetMemoryStoreForTests();
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.REQUIRE_REDIS;
    delete process.env.REQUIRE_REDIS_FOR_RATE_LIMITS;
    delete process.env.ALERT_WEBHOOK_URL;
    process.env.ALLOW_MISSING_ORIGIN = "false";
    // Never allow these tests to send real submissions.
    vi.spyOn(global, "fetch").mockResolvedValue(new Response("{}", { status: 200 }));
  });

  it("accepts just a recommendation and forwards no identity or arbitrary fields", async () => {
    const response = await POST(request({ recommendation: "  Gilead by Marilynne Robinson  ", email: "ignored@example.com", name: "Ignored", _subject: "Ignored" }));
    expect(response.status).toBe(200);
    expect((await response.json()).success).toBe(true);
    const forwarded = vi.mocked(fetch).mock.calls[0]?.[1]?.body as FormData;
    expect(forwarded.get("message")).toBe("Gilead by Marilynne Robinson");
    expect(forwarded.get("_subject")).toBe("New book recommendation");
    expect(forwarded.has("email")).toBe(false);
    expect(forwarded.has("name")).toBe(false);
  });

  it.each(["", "  ", "x".repeat(4001)])("rejects blank or excessive recommendations", async (recommendation) => {
    expect((await POST(request({ recommendation }))).status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("silently drops honeypot submissions", async () => {
    expect((await POST(request({ recommendation: "A book", company: "Spam" }))).status).toBe(200);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("blocks another origin before forwarding", async () => {
    expect((await POST(request({ recommendation: "A book" }, { origin: "https://example.com" }))).status).toBe(403);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("limits repeated submissions", async () => {
    for (let i = 0; i < 6; i++) expect((await POST(request({ recommendation: `Book ${i}` }))).status).toBe(200);
    const response = await POST(request({ recommendation: "One more" }));
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBeTruthy();
    expect(fetch).toHaveBeenCalledTimes(6);
  });

  it("does not forward a successful retry twice", async () => {
    const headers = { "idempotency-key": "books-test-success-0001" };
    expect((await POST(request({ recommendation: "A book" }, headers))).status).toBe(200);
    expect((await POST(request({ recommendation: "A book" }, headers))).status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("rejects a reused key when the first recommendation changes but the last duplicate does not", async () => {
    const headers = { "idempotency-key": "books-duplicate-first-0001" };
    const original = new FormData();
    original.append("recommendation", "Gilead by Marilynne Robinson");
    original.append("recommendation", "Unchanged final entry");
    const changed = new FormData();
    changed.append("recommendation", "A different recommendation");
    changed.append("recommendation", "Unchanged final entry");

    expect((await POST(request(original, headers))).status).toBe(200);
    const response = await POST(request(changed, headers));

    expect(response.status).toBe(409);
    expect((await response.json()).error).toContain("different form contents");
    expect(response.headers.get("x-idempotent-replay")).toBeNull();
    expect(fetch).toHaveBeenCalledTimes(1);
    const forwarded = vi.mocked(fetch).mock.calls[0]?.[1]?.body as FormData;
    expect(forwarded.get("message")).toBe("Gilead by Marilynne Robinson");
  });

  it("reports delivery failure and allows a retry", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response("{}", { status: 503 }));
    const headers = { "idempotency-key": "books-test-retry-0001" };
    const failed = await POST(request({ recommendation: "A book" }, headers));
    expect(failed.status).toBe(502);
    expect((await failed.json()).error).toContain("could not be sent");
    expect((await POST(request({ recommendation: "A book" }, headers))).status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(2);
  });
});
