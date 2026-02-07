import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/lib/config";
import { checkRateLimit } from "@/lib/server/rate-limit";
import {
  exceedsContentLength,
  getClientIp,
  hasAllowedContentType,
  isAllowedOrigin,
} from "@/lib/server/request";
import {
  fetchWithTimeout,
  getErrorMessage,
  parseJsonSafely,
} from "@/lib/server/http";
import {
  beginIdempotency,
  commitIdempotency,
  rollbackIdempotency,
} from "@/lib/server/idempotency";
import {
  readIdempotencyKey,
  replayCachedResponse,
} from "@/lib/server/idempotency-request";
import {
  createRequestContext,
  logError,
  sendAlert,
} from "@/lib/server/observability";
import {
  getValidationMessage,
  newsletterRequestSchema,
} from "@/lib/server/schemas";

const IP_RATE_LIMIT = { limit: 10, windowMs: 60_000 };
const EMAIL_RATE_LIMIT = { limit: 4, windowMs: 60_000 };
const NEWSLETTER_MAX_BODY_BYTES = 8 * 1024;
const NEWSLETTER_IDEMPOTENCY_SCOPE = "newsletter";

interface NewsletterSuccess {
  success: true;
  message: string;
  alreadySubscribed?: true;
}

interface NewsletterError {
  error: string;
}

type NewsletterRouteResponse = NewsletterSuccess | NewsletterError;
type IdempotencyToken = Parameters<typeof commitIdempotency<NewsletterRouteResponse>>[0];

export async function POST(request: NextRequest) {
  const context = createRequestContext(request, "/api/newsletter");

  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  if (!hasAllowedContentType(request, ["application/json"])) {
    return NextResponse.json({ error: "Invalid content type." }, { status: 415 });
  }

  if (exceedsContentLength(request, NEWSLETTER_MAX_BODY_BYTES)) {
    return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
  }

  const { key: idempotencyKey, error: idempotencyError } = readIdempotencyKey(request);
  if (idempotencyError) {
    return NextResponse.json({ error: idempotencyError }, { status: 400 });
  }

  let idempotencyToken: IdempotencyToken | null = null;

  const respond = async (
    status: number,
    body: NewsletterRouteResponse,
    headers?: HeadersInit
  ) => {
    if (idempotencyToken) {
      const headerRecord = headers
        ? Object.fromEntries(new Headers(headers).entries())
        : undefined;
      await commitIdempotency(idempotencyToken, status, body, headerRecord);
    }

    return NextResponse.json(body, { status, headers });
  };

  if (idempotencyKey) {
    const idempotencyState = await beginIdempotency<NewsletterRouteResponse>({
      scope: NEWSLETTER_IDEMPOTENCY_SCOPE,
      key: idempotencyKey,
    });

    if (idempotencyState.state === "replay") {
      return replayCachedResponse(idempotencyState.cached);
    }

    if (idempotencyState.state === "in_progress") {
      return NextResponse.json(
        {
          error: "A matching request is already in progress. Please retry shortly.",
        },
        { status: 409 }
      );
    }

    idempotencyToken = idempotencyState.token;
  }

  try {
    const ip = getClientIp(request);
    const ipLimit = await checkRateLimit({
      key: `newsletter:ip:${ip}`,
      ...IP_RATE_LIMIT,
    });

    if (ipLimit.limited) {
      return respond(
        429,
        { error: "Too many requests. Please wait a minute and try again." },
        { "Retry-After": String(ipLimit.retryAfterSeconds) }
      );
    }

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return respond(400, { error: "Invalid request body." });
    }

    const parsed = newsletterRequestSchema.safeParse(payload);
    if (!parsed.success) {
      return respond(400, { error: getValidationMessage(parsed.error) });
    }

    const email = parsed.data.email;
    const emailLimit = await checkRateLimit({
      key: `newsletter:email:${email}`,
      ...EMAIL_RATE_LIMIT,
    });

    if (emailLimit.limited) {
      return respond(
        429,
        { error: "Too many requests. Please wait a minute and try again." },
        { "Retry-After": String(emailLimit.retryAfterSeconds) }
      );
    }

    const apiKey = process.env.MAILER_LITE_API_KEY;
    const groupId = process.env.MAILERLITE_GROUP_ID;

    if (!apiKey || !groupId) {
      logError(
        "newsletter.config_missing",
        context,
        new Error("missing_mailerlite_config")
      );
      return respond(500, {
        error: "Newsletter signup is temporarily unavailable.",
      });
    }

    const authorizationHeaders = {
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    };

    const lookupResponse = await fetchWithTimeout(
      `${siteConfig.integrations.mailerLiteApiBaseUrl}/subscribers/${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: authorizationHeaders,
      }
    );

    if (lookupResponse.status === 200) {
      return respond(200, {
        success: true,
        alreadySubscribed: true,
        message: siteConfig.newsletter.alreadySubscribedMessage,
      });
    }

    if (lookupResponse.status !== 404) {
      const lookupPayload = await parseJsonSafely(lookupResponse);
      const upstreamMessage = getErrorMessage(lookupPayload);
      logError("newsletter.lookup_failed", context, new Error("lookup_failed"), {
        status: lookupResponse.status,
        message: upstreamMessage,
      });
      await sendAlert("newsletter.lookup_failed", context, {
        status: lookupResponse.status,
        message: upstreamMessage,
      });
      return respond(502, {
        error: "Newsletter signup is temporarily unavailable.",
      });
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
          email,
          groups: [groupId],
        }),
      }
    );

    const createPayload = await parseJsonSafely(createResponse);

    if (!createResponse.ok) {
      const upstreamMessage = getErrorMessage(createPayload) ?? "";
      if (
        createResponse.status === 422 &&
        upstreamMessage.toLowerCase().includes("already")
      ) {
        return respond(200, {
          success: true,
          alreadySubscribed: true,
          message: siteConfig.newsletter.alreadySubscribedMessage,
        });
      }

      logError("newsletter.create_failed", context, new Error("create_failed"), {
        status: createResponse.status,
        message: upstreamMessage || null,
      });
      await sendAlert("newsletter.create_failed", context, {
        status: createResponse.status,
        message: upstreamMessage || null,
      });
      return respond(502, {
        error: "Newsletter signup is temporarily unavailable.",
      });
    }

    return respond(200, {
      success: true,
      message: siteConfig.newsletter.welcomeMessage,
    });
  } catch (error) {
    if (idempotencyToken) {
      await rollbackIdempotency(idempotencyToken);
    }

    logError("newsletter.request_failed", context, error, {
      reason: "unexpected_error",
    });
    await sendAlert("newsletter.request_failed", context, {
      reason: "unexpected_error",
    });

    return NextResponse.json(
      { error: "Newsletter signup is temporarily unavailable." },
      { status: 502 }
    );
  }
}
