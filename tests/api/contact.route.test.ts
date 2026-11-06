import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/contact/route";
import { conversionSources } from "@/lib/conversions";
import { __resetMemoryStoreForTests } from "@/lib/server/kv";
import * as idempotency from "@/lib/server/idempotency";

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
      "idempotency-key": crypto.randomUUID(),
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
  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    vi.restoreAllMocks();
    __resetMemoryStoreForTests();

    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.REQUIRE_REDIS;
    delete process.env.REQUIRE_REDIS_FOR_RATE_LIMITS;
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
    expect(body.message).toContain("Message sent");
  });

  it("forwards conversion attribution to Formspree", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );

    const response = await POST(
      createContactRequest(
        contactPayload({
          source: conversionSources.workPanel,
          page_path: "/work",
        })
      )
    );
    const forwardedBody = fetchSpy.mock.calls[0]?.[1]?.body as FormData;

    expect(response.status).toBe(200);
    expect(forwardedBody.get("source")).toBe(conversionSources.workPanel);
    expect(forwardedBody.get("page_path")).toBe("/work");
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
    expect(body.error).toContain("name");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("accepts a speaking inquiry with only name and email", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );

    const response = await POST(
      createContactRequest(
        contactPayload({
          form_type: "speaking",
          subject: "Speaking Inquiry",
          message: "",
          event_type: "",
          audience_size: "",
          event_date: "",
          location: "",
        })
      )
    );
    const body = await response.json();
    const forwardedBody = fetchSpy.mock.calls[0]?.[1]?.body as FormData;

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(forwardedBody.get("name")).toBe("Jane Example");
    expect(forwardedBody.get("email")).toBe("jane@example.com");
    expect(forwardedBody.get("event_date")).toBeNull();
    expect(forwardedBody.get("event_type")).toBeNull();
  });

  it("forwards any optional speaking details that are provided", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );

    const response = await POST(
      createContactRequest(
        contactPayload({
          form_type: "speaking",
          subject: "Speaking Inquiry",
          organization: "Monday Night Mamas",
          message: "A gathering about honest friendship.",
          event_type: "Retreat",
          audience_size: "20-50",
          event_date: "Oct 10, 2026",
          location: "Denver, CO",
        })
      )
    );
    const forwardedBody = fetchSpy.mock.calls[0]?.[1]?.body as FormData;

    expect(response.status).toBe(200);
    expect(forwardedBody.get("organization")).toBe("Monday Night Mamas");
    expect(forwardedBody.get("message")).toBe("A gathering about honest friendship.");
    expect(forwardedBody.get("event_type")).toBe("Retreat");
    expect(forwardedBody.get("audience_size")).toBe("20-50");
    expect(forwardedBody.get("event_date")).toBe("Oct 10, 2026");
    expect(forwardedBody.get("location")).toBe("Denver, CO");
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

  it("returns a retryable error when Formspree confirms rejection", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "submission rejected" }), { status: 422 })
    );

    const response = await POST(createContactRequest(contactPayload()));
    const body = await response.json();

    expect(response.status).toBe(502);
    expect(body.error).toContain("Unable to send your message");
  });

  it("fails closed when Redis is explicitly required but missing", async () => {
    process.env.REQUIRE_REDIS = "true";
    const fetchSpy = vi.spyOn(global, "fetch");

    const response = await POST(createContactRequest(contactPayload()));
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.error).toContain("temporarily unavailable");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("replays cached response when idempotency key is reused", async () => {
    const fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));

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

  it("allows same-key retry after a confirmed upstream rejection", async () => {
    const fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: "submission rejected" }), { status: 422 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));

    const headers = {
      "idempotency-key": "contact-retry",
    };

    const first = await POST(createContactRequest(contactPayload(), headers));
    const second = await POST(createContactRequest(contactPayload(), headers));

    expect(first.status).toBe(502);
    expect(second.status).toBe(200);
    expect(second.headers.get("x-idempotent-replay")).toBeNull();
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("requires an idempotency key before sending a contact message", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");
    const request = createContactRequest(contactPayload());
    request.headers.delete("idempotency-key");

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: "An idempotency key is required." });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it.each([500, 408])("preserves uncertain delivery after upstream HTTP %s without sending again", async (status) => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "delivery acknowledgement unavailable" }), { status })
    );
    const headers = { "idempotency-key": `contact-unknown-${status}` };

    const first = await POST(createContactRequest(contactPayload(), headers));
    const firstBody = await first.json();
    const second = await POST(createContactRequest(contactPayload(), headers));

    expect(first.status).toBe(409);
    expect(firstBody.code).toBe("delivery_unknown");
    expect(firstBody.error).toContain("may have been sent");
    expect(second.status).toBe(409);
    expect(await second.json()).toEqual(firstBody);
    expect(second.headers.get("x-idempotent-replay")).toBe("true");
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("preserves uncertain delivery when the upstream connection fails", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockRejectedValueOnce(
      new TypeError("Connection lost before the acknowledgement")
    );
    const headers = { "idempotency-key": "contact-network-unknown" };

    const first = await POST(createContactRequest(contactPayload(), headers));
    const firstBody = await first.json();
    const second = await POST(createContactRequest(contactPayload(), headers));

    expect(first.status).toBe(409);
    expect(firstBody.code).toBe("delivery_unknown");
    expect(second.status).toBe(409);
    expect(await second.json()).toEqual(firstBody);
    expect(second.headers.get("x-idempotent-replay")).toBe("true");
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("rejects changed contents under an already used request key", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );
    const headers = { "idempotency-key": "contact-payload-bound" };

    const first = await POST(createContactRequest(contactPayload(), headers));
    const second = await POST(createContactRequest(
      contactPayload({ message: "A different message" }), headers
    ));

    expect(first.status).toBe(200);
    expect(second.status).toBe(409);
    expect((await second.json()).error).toContain("different form contents");
    expect(second.headers.get("x-idempotent-replay")).toBeNull();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("does not send without first persisting the conservative delivery result", async () => {
    vi.spyOn(idempotency, "reserveIdempotencyResponse").mockRejectedValueOnce(
      new Error("Result store unavailable")
    );
    const fetchSpy = vi.spyOn(global, "fetch");

    const response = await POST(createContactRequest(contactPayload()));

    expect(response.status).toBe(503);
    expect((await response.json()).error).toContain("Unable to send your message");
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("cleans up an unacknowledged reservation before allowing a safe retry", async () => {
    const reserve = idempotency.reserveIdempotencyResponse;
    const reserveSpy = vi.spyOn(idempotency, "reserveIdempotencyResponse")
      .mockImplementationOnce(async (...args) => {
        await reserve(...args);
        throw new Error("Lost Redis acknowledgement after reservation write");
      });
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );
    const headers = { "idempotency-key": "contact-reservation-acknowledgement-lost" };

    const first = await POST(createContactRequest(contactPayload(), headers));

    expect(first.status).toBe(503);
    expect(fetchSpy).not.toHaveBeenCalled();
    reserveSpy.mockRestore();

    const retry = await POST(createContactRequest(contactPayload(), headers));

    expect(retry.status).toBe(200);
    expect((await retry.json()).success).toBe(true);
    expect(retry.headers.get("x-idempotent-replay")).toBeNull();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("prevents resend when cleanup after a confirmed rejection fails", async () => {
    vi.spyOn(idempotency, "rollbackIdempotency").mockRejectedValueOnce(
      new Error("Failed to discard the provisional delivery result")
    );
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "submission rejected" }), { status: 422 })
    );
    const headers = { "idempotency-key": "contact-rejection-cleanup-failed" };

    const first = await POST(createContactRequest(contactPayload(), headers));
    const retry = await POST(createContactRequest(contactPayload(), headers));

    expect(first.status).toBe(409);
    expect((await first.json()).code).toBe("delivery_unknown");
    expect(retry.status).toBe(409);
    expect((await retry.json()).code).toBe("delivery_unknown");
    expect(retry.headers.get("x-idempotent-replay")).toBe("true");
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("keeps acknowledged delivery successful and prevents resend if saving success fails", async () => {
    const now = Date.now();
    const nowSpy = vi.spyOn(Date, "now").mockReturnValue(now);
    vi.spyOn(idempotency, "commitIdempotency").mockRejectedValueOnce(
      new Error("Result store unavailable after delivery")
    );
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );
    const headers = { "idempotency-key": "contact-acknowledged-store-failure" };

    const first = await POST(createContactRequest(contactPayload(), headers));
    expect(first.status).toBe(200);
    expect((await first.json()).success).toBe(true);

    const immediateRetry = await POST(createContactRequest(contactPayload(), headers));
    expect(immediateRetry.status).toBe(409);

    // After its execution lease expires, the reserved delivery outcome remains.
    nowSpy.mockReturnValue(now + 60_001);
    const laterRetry = await POST(createContactRequest(contactPayload(), headers));
    expect(laterRetry.status).toBe(409);
    expect((await laterRetry.json()).code).toBe("delivery_unknown");
    expect(laterRetry.headers.get("x-idempotent-replay")).toBe("true");
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
