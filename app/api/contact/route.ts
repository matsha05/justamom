import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/lib/config";
import {
  ApiErrorEnvelope,
  ApiSuccessEnvelope,
  errorEnvelope,
  successEnvelope,
} from "@/lib/server/api-response";
import {
  beginIdempotency,
  commitIdempotency,
  rollbackIdempotency,
} from "@/lib/server/idempotency";
import {
  createRequestContext,
  logError,
  logInfo,
  logWarn,
  sendAlert,
} from "@/lib/server/observability";
import { checkRateLimit } from "@/lib/server/rate-limit";
import {
  exceedsContentLength,
  hasAllowedContentType,
  isAllowedOrigin,
} from "@/lib/server/request";
import {
  contactFormSchema,
  ContactFormRequest,
  getValidationMessage,
} from "@/lib/server/schemas";

const ROUTE_ID = "/api/contact";
const REQUEST_TIMEOUT_MS = 8_000;
const MAX_BODY_BYTES = 64_000;
const IDEMPOTENCY_TTL_MS = 10 * 60_000;
const CONTACT_RATE_LIMIT = { limit: 12, windowMs: 5 * 60_000 };

type ContactSuccessData = {
  message: string;
};

type ContactEnvelope = ApiSuccessEnvelope<ContactSuccessData> | ApiErrorEnvelope;

function buildHeaders(requestId: string, extra?: HeadersInit): Headers {
  const headers = new Headers(extra);
  headers.set("x-request-id", requestId);
  headers.set("cache-control", "no-store");
  return headers;
}

function jsonResponse(body: ContactEnvelope, status: number, requestId: string, extra?: HeadersInit) {
  return NextResponse.json(body, {
    status,
    headers: buildHeaders(requestId, extra),
  });
}

function validationError(
  requestId: string,
  status: number,
  code: ApiErrorEnvelope["error"]["code"],
  message: string,
  headers?: HeadersInit
) {
  return jsonResponse(errorEnvelope(requestId, code, message), status, requestId, headers);
}

function success(requestId: string, message: string) {
  return jsonResponse(successEnvelope(requestId, { message }), 200, requestId);
}

function getSuccessMessage(formType: ContactFormRequest["form_type"]) {
  return formType === "speaking"
    ? "Inquiry received! I will follow up soon."
    : "Message sent! I will get back to you as soon as I can.";
}

function parseIdempotencyKey(request: NextRequest, fingerprint: string, input: ContactFormRequest): string {
  const fromHeader = request.headers.get("idempotency-key")?.trim();
  if (fromHeader) {
    return fromHeader.slice(0, 200);
  }

  const messageSignature = input.message.slice(0, 120);
  return `${fingerprint}:${input.form_type}:${input.email}:${input.subject}:${messageSignature}`.slice(
    0,
    240
  );
}

async function parseJsonSafely(response: Response): Promise<Record<string, unknown> | null> {
  try {
    const value = await response.json();
    if (value && typeof value === "object") {
      return value as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
}

function getUpstreamMessage(payload: Record<string, unknown> | null): string | null {
  if (!payload) return null;

  if (typeof payload.error === "string") {
    return payload.error;
  }

  if (Array.isArray(payload.errors)) {
    const first = payload.errors[0];
    if (typeof first === "string") {
      return first;
    }

    if (first && typeof first === "object") {
      const nestedMessage = (first as Record<string, unknown>).message;
      if (typeof nestedMessage === "string") {
        return nestedMessage;
      }
    }
  }

  if (typeof payload.message === "string") {
    return payload.message;
  }

  return null;
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, {
      ...init,
      cache: "no-store",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function buildForwardedFormData(input: ContactFormRequest): FormData {
  const forwarded = new FormData();

  forwarded.set("form_type", input.form_type);
  forwarded.set("name", input.name);
  forwarded.set("email", input.email);
  forwarded.set("organization", input.organization);
  forwarded.set("event_date", input.event_date);
  forwarded.set("location", input.location);
  forwarded.set("event_type", input.event_type);
  forwarded.set("audience_size", input.audience_size);
  forwarded.set("message", input.message);
  forwarded.set("budget", input.budget);

  const resolvedSubject =
    input.subject ||
    (input.form_type === "speaking" ? "New Speaking Inquiry" : "New Contact Message");

  forwarded.set("subject", resolvedSubject);
  forwarded.set("_subject", resolvedSubject);

  return forwarded;
}

export async function POST(request: NextRequest) {
  const context = createRequestContext(request, ROUTE_ID);

  if (!isAllowedOrigin(request, { requireOriginHeader: true })) {
    logWarn("contact.origin_blocked", context);
    return validationError(context.requestId, 403, "invalid_origin", "Invalid request origin.");
  }

  if (
    !hasAllowedContentType(request, ["multipart/form-data", "application/x-www-form-urlencoded"])
  ) {
    return validationError(
      context.requestId,
      415,
      "invalid_content_type",
      "Invalid content type. Expected form data."
    );
  }

  if (exceedsContentLength(request, MAX_BODY_BYTES)) {
    return validationError(
      context.requestId,
      413,
      "payload_too_large",
      "Request body is too large."
    );
  }

  const fingerprintLimit = await checkRateLimit({
    key: `contact:fingerprint:${context.fingerprint}`,
    ...CONTACT_RATE_LIMIT,
  });

  if (fingerprintLimit.limited) {
    return validationError(
      context.requestId,
      429,
      "rate_limited",
      "Too many requests. Please wait a few minutes and try again.",
      { "Retry-After": String(fingerprintLimit.retryAfterSeconds) }
    );
  }

  let rawFormData: FormData;
  try {
    rawFormData = await request.formData();
  } catch {
    return validationError(context.requestId, 400, "invalid_request", "Invalid form data.");
  }

  const rawInput: Record<string, string> = {};

  for (const [key, value] of rawFormData.entries()) {
    if (typeof value !== "string") {
      return validationError(
        context.requestId,
        400,
        "invalid_request",
        "File uploads are not supported."
      );
    }

    rawInput[key] = value.trim();
  }

  const formType = rawInput.form_type === "speaking" ? "speaking" : "contact";
  const successMessage = getSuccessMessage(formType);

  if (rawInput.company) {
    logInfo("contact.honeypot_triggered", context, { formType });
    return success(context.requestId, successMessage);
  }

  const parsed = contactFormSchema.safeParse({
    ...rawInput,
    form_type: formType,
  });

  if (!parsed.success) {
    return validationError(
      context.requestId,
      400,
      "invalid_request",
      getValidationMessage(parsed.error)
    );
  }

  const input = parsed.data;

  const idempotencyResult = await beginIdempotency<ContactEnvelope>({
    scope: "contact",
    key: parseIdempotencyKey(request, context.fingerprint, input),
    resultTtlMs: IDEMPOTENCY_TTL_MS,
  });

  if (idempotencyResult.state === "replay") {
    logInfo("contact.idempotency_replay", context, { formType: input.form_type });
    const headers = buildHeaders(context.requestId, idempotencyResult.cached.headers);
    headers.set("x-idempotent-replay", "true");
    return NextResponse.json(idempotencyResult.cached.body, {
      status: idempotencyResult.cached.status,
      headers,
    });
  }

  if (idempotencyResult.state === "in_progress") {
    return validationError(
      context.requestId,
      409,
      "request_in_progress",
      "A matching request is already in progress."
    );
  }

  const token = idempotencyResult.token;

  if (!siteConfig.contact.formspreeEndpoint.startsWith("https://formspree.io/")) {
    await rollbackIdempotency(token);
    logError("contact.invalid_formspree_endpoint", context, new Error("Invalid endpoint"), {
      endpoint: siteConfig.contact.formspreeEndpoint,
    });
    return validationError(
      context.requestId,
      500,
      "server_error",
      "Contact form is temporarily unavailable."
    );
  }

  try {
    const upstreamResponse = await fetchWithTimeout(siteConfig.contact.formspreeEndpoint, {
      method: "POST",
      body: buildForwardedFormData(input),
      headers: {
        Accept: "application/json",
      },
    });

    if (!upstreamResponse.ok) {
      const payload = await parseJsonSafely(upstreamResponse);
      const upstreamMessage = getUpstreamMessage(payload);
      await rollbackIdempotency(token);

      logWarn("contact.upstream_failed", context, {
        status: upstreamResponse.status,
        upstreamMessage,
        formType: input.form_type,
      });

      await sendAlert("contact.upstream_failed", context, {
        status: upstreamResponse.status,
        upstreamMessage,
        formType: input.form_type,
      });

      return validationError(
        context.requestId,
        502,
        "upstream_error",
        "Unable to send your message right now. Please try again."
      );
    }

    const payload = successEnvelope(context.requestId, {
      message: successMessage,
    });

    await commitIdempotency(token, 200, payload, {
      "x-request-id": context.requestId,
    });

    logInfo("contact.sent", context, { formType: input.form_type });
    return success(context.requestId, successMessage);
  } catch (error) {
    await rollbackIdempotency(token);
    logError("contact.unhandled_error", context, error, {
      formType: input.form_type,
    });

    await sendAlert("contact.unhandled_error", context, {
      message: "Unhandled exception during contact submission.",
      formType: input.form_type,
    });

    return validationError(
      context.requestId,
      502,
      "upstream_error",
      "Unable to send your message right now. Please try again."
    );
  }
}
