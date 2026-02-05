import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/contact/route";
import { __resetMemoryStoreForTests } from "@/lib/server/kv";

function createContactRequest(
  fields: Record<string, string>,
  headers?: Record<string, string>
): NextRequest {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    form.set(key, value);
  }

  const request = new Request("https://lizishaw.com/api/contact", {
    method: "POST",
    headers: {
      origin: "https://lizishaw.com",
      "user-agent": "vitest",
      "x-forwarded-for": "203.0.113.11",
      ...headers,
    },
    body: form,
  });

  return new NextRequest(request);
}

function contactPayload(overrides?: Partial<Record<string, string>>) {
  return {
    form_type: "contact",
    company: "",
    name: "Jane Example",
    email: "jane@example.com",
    subject: "Hello",
    message: "Hello there",
    ...overrides,
  };
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    __resetMemoryStoreForTests();

    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.ALERT_WEBHOOK_URL;
    process.env.ALLOW_MISSING_ORIGIN = "false";
  });

  it("returns success when contact message is forwarded", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );

    const response = await POST(createContactRequest(contactPayload()));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.message).toContain("Message sent");
  });

  it("returns validation error for missing name", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");

    const response = await POST(
      createContactRequest(
        contactPayload({
          name: "",
        })
      )
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.success).toBe(false);
    expect(body.error.message).toContain("name");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("enforces fingerprint rate limiting", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );

    let lastResponse: Response | null = null;
    for (let i = 0; i < 13; i += 1) {
      lastResponse = await POST(
        createContactRequest(
          contactPayload({
            email: `person${i}@example.com`,
            message: `hello-${i}`,
          })
        )
      );
    }

    expect(lastResponse).not.toBeNull();
    expect(lastResponse?.status).toBe(429);
  });

  it("returns upstream error when Formspree fails", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "bad gateway" }), { status: 500 })
    );

    const response = await POST(createContactRequest(contactPayload()));
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("upstream_error");
  });

  it("replays idempotent requests", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );

    const headers = {
      "idempotency-key": "contact-abc",
    };

    const first = await POST(createContactRequest(contactPayload(), headers));
    const second = await POST(createContactRequest(contactPayload(), headers));

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(second.headers.get("x-idempotent-replay")).toBe("true");
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
