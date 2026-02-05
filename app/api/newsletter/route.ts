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
  getValidationMessage,
  newsletterRequestSchema,
} from "@/lib/server/schemas";

const ROUTE_ID = "/api/newsletter";
const REQUEST_TIMEOUT_MS = 8_000;
const MAX_BODY_BYTES = 4_096;
const IDEMPOTENCY_TTL_MS = 10 * 60_000;
const FINGERPRINT_RATE_LIMIT = { limit: 12, windowMs: 60_000 };
const EMAIL_RATE_LIMIT = { limit: 4, windowMs: 60_000 };

type NewsletterSuccessData = {
  message: string;
  alreadySubscribed?: boolean;
};

type NewsletterEnvelope =
  | ApiSuccessEnvelope<NewsletterSuccessData>
  | ApiErrorEnvelope;

function buildHeaders(requestId: string, extra?: HeadersInit): Headers {
  const headers = new Headers(extra);
  headers.set("x-request-id", requestId);
  headers.set("cache-control", "no-store");
  return headers;
}

function jsonResponse(body: NewsletterEnvelope, status: number, requestId: string, extra?: HeadersInit) {
  return NextResponse.json(body, {
    status,
    headers: buildHeaders(requestId, extra),
  });
}

function parseIdempotencyKey(request: NextRequest, fingerprint: string, email: string): string {
  const fromHeader = request.headers.get("idempotency-key")?.trim();
  if (fromHeader) {
    return fromHeader.slice(0, 200);
  }

  return `${fingerprint}:${email}`;
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
  if (!payload) {
    return null;
  }

  if (typeof payload.message === "string") {
    return payload.message;
  }

  if (payload.error && typeof payload.error === "object") {
    const nested = (payload.error as Record<string, unknown>).message;
    if (typeof nested === "string") {
      return nested;
    }
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

function validationError(
  requestId: string,
  status: number,
  code: ApiErrorEnvelope["error"]["code"],
  message: string,
  headers?: HeadersInit
) {
  return jsonResponse(errorEnvelope(requestId, code, message), status, requestId, headers);
}

function success(
  requestId: string,
  data: NewsletterSuccessData,
  status = 200,
  headers?: HeadersInit
) {
  return jsonResponse(successEnvelope(requestId, data), status, requestId, headers);
}

export async function POST(request: NextRequest) {
  const context = createRequestContext(request, ROUTE_ID);

  if (!isAllowedOrigin(request, { requireOriginHeader: true })) {
    logWarn("newsletter.origin_blocked", context);
    return validationError(context.requestId, 403, "invalid_origin", "Invalid request origin.");
  }

  if (!hasAllowedContentType(request, ["application/json"])) {
    return validationError(
      context.requestId,
      415,
      "invalid_content_type",
      "Invalid content type. Expected application/json."
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
    key: `newsletter:fingerprint:${context.fingerprint}`,
    ...FINGERPRINT_RATE_LIMIT,
  });

  if (fingerprintLimit.limited) {
    return validationError(
      context.requestId,
      429,
      "rate_limited",
      "Too many requests. Please wait a minute and try again.",
      { "Retry-After": String(fingerprintLimit.retryAfterSeconds) }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return validationError(context.requestId, 400, "invalid_request", "Invalid request body.");
  }

  const parsed = newsletterRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return validationError(
      context.requestId,
      400,
      "invalid_request",
      getValidationMessage(parsed.error)
    );
  }

  const input = parsed.data;

  const emailLimit = await checkRateLimit({
    key: `newsletter:email:${input.email}`,
    ...EMAIL_RATE_LIMIT,
  });

  if (emailLimit.limited) {
    return validationError(
      context.requestId,
      429,
      "rate_limited",
      "Too many requests. Please wait a minute and try again.",
      { "Retry-After": String(emailLimit.retryAfterSeconds) }
    );
  }

  const idempotencyResult = await beginIdempotency<NewsletterEnvelope>({
    scope: "newsletter",
    key: parseIdempotencyKey(request, context.fingerprint, input.email),
    resultTtlMs: IDEMPOTENCY_TTL_MS,
  });

  if (idempotencyResult.state === "replay") {
    logInfo("newsletter.idempotency_replay", context);
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
  const apiKey = process.env.MAILER_LITE_API_KEY;
  const groupId = process.env.MAILERLITE_GROUP_ID;

  if (!apiKey || !groupId) {
    await rollbackIdempotency(token);
    logError("newsletter.config_missing", context, new Error("Missing MailerLite configuration"));
    return validationError(
      context.requestId,
      500,
      "server_error",
      "Newsletter signup is temporarily unavailable."
    );
  }

  const authorizationHeaders = {
    Accept: "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  try {
    const lookupResponse = await fetchWithTimeout(
      `${siteConfig.integrations.mailerLiteApiBaseUrl}/subscribers/${encodeURIComponent(input.email)}`,
      {
        method: "GET",
        headers: authorizationHeaders,
      }
    );

    if (lookupResponse.status === 200) {
      const payload = successEnvelope(context.requestId, {
        message: siteConfig.newsletter.alreadySubscribedMessage,
        alreadySubscribed: true,
      });
      await commitIdempotency(token, 200, payload, {
        "x-request-id": context.requestId,
      });
      return success(context.requestId, {
        message: siteConfig.newsletter.alreadySubscribedMessage,
        alreadySubscribed: true,
      });
    }

    if (lookupResponse.status !== 404) {
      const lookupPayload = await parseJsonSafely(lookupResponse);
      const upstreamMessage = getUpstreamMessage(lookupPayload);
      await rollbackIdempotency(token);
      logWarn("newsletter.lookup_failed", context, {
        status: lookupResponse.status,
        upstreamMessage,
      });
      await sendAlert("newsletter.lookup_failed", context, {
        status: lookupResponse.status,
        upstreamMessage,
      });
      return validationError(
        context.requestId,
        502,
        "upstream_error",
        "Newsletter signup is temporarily unavailable."
      );
    }

    const createResponse = await fetchWithTimeout(
      `${siteConfig.integrations.mailerLiteApiBaseUrl}/subscribers`,
      {
        method: "POST",
        headers: {
          ...authorizationHeaders,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: input.email,
          groups: [groupId],
        }),
      }
    );

    const createPayload = await parseJsonSafely(createResponse);

    if (!createResponse.ok) {
      const upstreamMessage = getUpstreamMessage(createPayload) ?? "";

      if (
        createResponse.status === 422 &&
        upstreamMessage.toLowerCase().includes("already")
      ) {
        const payload = successEnvelope(context.requestId, {
          message: siteConfig.newsletter.alreadySubscribedMessage,
          alreadySubscribed: true,
        });
        await commitIdempotency(token, 200, payload, {
          "x-request-id": context.requestId,
        });
        return success(context.requestId, {
          message: siteConfig.newsletter.alreadySubscribedMessage,
          alreadySubscribed: true,
        });
      }

      await rollbackIdempotency(token);
      logWarn("newsletter.create_failed", context, {
        status: createResponse.status,
        upstreamMessage,
      });
      await sendAlert("newsletter.create_failed", context, {
        status: createResponse.status,
        upstreamMessage,
      });
      return validationError(
        context.requestId,
        502,
        "upstream_error",
        "Newsletter signup is temporarily unavailable."
      );
    }

    const payload = successEnvelope(context.requestId, {
      message: siteConfig.newsletter.welcomeMessage,
    });

    await commitIdempotency(token, 200, payload, {
      "x-request-id": context.requestId,
    });

    logInfo("newsletter.subscribed", context);
    return success(context.requestId, {
      message: siteConfig.newsletter.welcomeMessage,
    });
  } catch (error) {
    await rollbackIdempotency(token);
    logError("newsletter.unhandled_error", context, error);
    await sendAlert("newsletter.unhandled_error", context, {
      message: "Unhandled exception during newsletter signup.",
    });
    return validationError(
      context.requestId,
      502,
      "upstream_error",
      "Newsletter signup is temporarily unavailable."
    );
  }
}
