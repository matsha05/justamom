import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/newsletter/route";
import { __resetMemoryStoreForTests } from "@/lib/server/kv";

function createNewsletterRequest(
  email: string,
  headers?: Record<string, string>
): NextRequest {
  const requestHeaders = new Headers({
    origin: "https://lizishaw.com",
    "content-type": "application/json",
    "user-agent": "vitest",
    "x-forwarded-for": "203.0.113.10",
    ...headers,
  });

  return new NextRequest("https://lizishaw.com/api/newsletter", {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify({ email }),
  });
}

describe("POST /api/newsletter", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    __resetMemoryStoreForTests();

    process.env.MAILER_LITE_API_KEY = "test-key";
    process.env.MAILERLITE_GROUP_ID = "test-group";
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.ALERT_WEBHOOK_URL;
    process.env.ALLOW_MISSING_ORIGIN = "false";
  });

  it("returns success when subscriber is created", async () => {
    vi.spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({}), { status: 404 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({}), { status: 200 }));

    const response = await POST(createNewsletterRequest("test@example.com"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.message).toContain("Welcome");
  });

  it("returns validation error for invalid email", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");

    const response = await POST(createNewsletterRequest("not-an-email"));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain("valid email");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("enforces fingerprint rate limiting", async () => {
    vi.spyOn(global, "fetch").mockImplementation(async (input, init) => {
      const url = String(input);
      if (init?.method === "GET" && url.includes("/subscribers/")) {
        return new Response(JSON.stringify({}), { status: 404 });
      }

      if (init?.method === "POST" && url.endsWith("/subscribers")) {
        return new Response(JSON.stringify({}), { status: 200 });
      }

      return new Response(JSON.stringify({}), { status: 500 });
    });

    let lastResponse: Response | null = null;
    for (let i = 0; i < 13; i += 1) {
      lastResponse = await POST(createNewsletterRequest(`user${i}@example.com`));
    }

    expect(lastResponse).not.toBeNull();
    expect(lastResponse?.status).toBe(429);
  });

  it("returns upstream error on timeout/fetch failure", async () => {
    vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error("timeout"));

    const response = await POST(createNewsletterRequest("timeout@example.com"));
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body.error).toContain("temporarily unavailable");
  });

  it("processes repeated requests even when idempotency key is reused", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input, init) => {
      const url = String(input);
      if (init?.method === "GET" && url.includes("/subscribers/")) {
        return new Response(JSON.stringify({}), { status: 404 });
      }

      if (init?.method === "POST" && url.endsWith("/subscribers")) {
        return new Response(JSON.stringify({}), { status: 200 });
      }

      return new Response(JSON.stringify({}), { status: 500 });
    });

    const headers = {
      "idempotency-key": "newsletter-abc",
    };

    const first = await POST(createNewsletterRequest("idempotent@example.com", headers));
    const second = await POST(createNewsletterRequest("idempotent@example.com", headers));

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(second.headers.get("x-idempotent-replay")).toBeNull();
    expect(fetchSpy).toHaveBeenCalledTimes(4);
  });
});
