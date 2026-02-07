import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/lib/config";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { getClientIp } from "@/lib/server/request";
import { logError, sendAlert } from "@/lib/server/observability";
import {
  getValidationMessage,
  newsletterRequestSchema,
} from "@/lib/server/schemas";
import {
  prepareApiRouteRequest,
  rollbackIdempotencyIfNeeded,
} from "@/lib/server/api-route";
import {
  createMailerLiteSubscriber,
  lookupMailerLiteSubscriber,
} from "@/lib/server/integrations/mailerlite";

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

export async function POST(request: NextRequest) {
  const preparedResult = await prepareApiRouteRequest<NewsletterRouteResponse>({
    request,
    route: "/api/newsletter",
    allowedContentTypes: ["application/json"],
    maxBodyBytes: NEWSLETTER_MAX_BODY_BYTES,
    idempotencyScope: NEWSLETTER_IDEMPOTENCY_SCOPE,
  });

  if ("response" in preparedResult) {
    return preparedResult.response;
  }

  const { context, idempotencyToken, respond } = preparedResult.prepared;

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

    const lookupResult = await lookupMailerLiteSubscriber(
      siteConfig.integrations.mailerLiteApiBaseUrl,
      email,
      apiKey
    );

    if (lookupResult.status === 200) {
      return respond(200, {
        success: true,
        alreadySubscribed: true,
        message: siteConfig.newsletter.alreadySubscribedMessage,
      });
    }

    if (lookupResult.status !== 404) {
      logError("newsletter.lookup_failed", context, new Error("lookup_failed"), {
        status: lookupResult.status,
        message: lookupResult.message,
      });
      await sendAlert("newsletter.lookup_failed", context, {
        status: lookupResult.status,
        message: lookupResult.message,
      });
      return respond(502, {
        error: "Newsletter signup is temporarily unavailable.",
      });
    }

    const createResult = await createMailerLiteSubscriber(
      siteConfig.integrations.mailerLiteApiBaseUrl,
      email,
      groupId,
      apiKey
    );

    if (!createResult.ok) {
      const upstreamMessage = createResult.message ?? "";
      if (
        createResult.status === 422 &&
        upstreamMessage.toLowerCase().includes("already")
      ) {
        return respond(200, {
          success: true,
          alreadySubscribed: true,
          message: siteConfig.newsletter.alreadySubscribedMessage,
        });
      }

      logError("newsletter.create_failed", context, new Error("create_failed"), {
        status: createResult.status,
        message: createResult.message,
      });
      await sendAlert("newsletter.create_failed", context, {
        status: createResult.status,
        message: createResult.message,
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
    await rollbackIdempotencyIfNeeded(idempotencyToken);

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
