import { NextRequest, NextResponse } from "next/server";
import { beginIdempotency, commitIdempotency, rollbackIdempotency } from "@/lib/server/idempotency";
import { getRequestHash, readIdempotencyKey, replayCachedResponse } from "@/lib/server/idempotency-request";
import { createRequestContext, logError, logWarn, sendAlert } from "@/lib/server/observability";
import { getRedisClient } from "@/lib/server/kv-redis";
import {
  exceedsMaxBodyBytes,
  hasAllowedContentType,
  isAllowedOrigin,
} from "@/lib/server/request";

type IdempotencyToken<TResponse> = Parameters<typeof commitIdempotency<TResponse>>[0];

type RouteResponder<TResponse> = (
  status: number,
  body: TResponse,
  headers?: HeadersInit
) => Promise<NextResponse<TResponse>>;

export interface PreparedApiRouteRequest<TResponse> {
  context: ReturnType<typeof createRequestContext>;
  idempotencyToken: IdempotencyToken<TResponse> | null;
  respond: RouteResponder<TResponse>;
}

interface PrepareApiRouteRequestOptions {
  request: NextRequest;
  route: string;
  allowedContentTypes: string[];
  maxBodyBytes: number;
  idempotencyScope: string;
  requireIdempotencyKey?: boolean;
}

type PrepareApiRouteRequestResult<TResponse> =
  | { response: NextResponse }
  | { prepared: PreparedApiRouteRequest<TResponse> };

type RedisAvailabilityResult =
  | { ok: true }
  | { ok: false; response: NextResponse<{ error: string }> };

let hasWarnedMissingRedis = false;

async function checkRedisAvailability(
  context: ReturnType<typeof createRequestContext>
): Promise<RedisAvailabilityResult> {
  const redis = getRedisClient();
  if (redis) {
    return { ok: true };
  }

  const requireRedis =
    process.env.REQUIRE_REDIS === "true" ||
    process.env.REQUIRE_REDIS_FOR_RATE_LIMITS === "true";

  if (!hasWarnedMissingRedis) {
    // Claim the notification before awaiting it so concurrent requests cannot
    // all send the same startup warning.
    hasWarnedMissingRedis = true;
    logWarn("redis.missing", context, { requireRedis });
    await sendAlert("redis.missing", context, { requireRedis });
  }

  if (requireRedis) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Service temporarily unavailable." },
        { status: 503 }
      ),
    };
  }

  return { ok: true };
}

export async function prepareApiRouteRequest<TResponse>(
  options: PrepareApiRouteRequestOptions
): Promise<PrepareApiRouteRequestResult<TResponse>> {
  try {
    return await prepareRequest<TResponse>(options);
  } catch (error) {
    const context = createRequestContext(options.request, options.route);
    logError("request.prepare_failed", context, error);
    return {
      response: NextResponse.json(
        { error: "Service temporarily unavailable. Please try again shortly." },
        { status: 503 }
      ),
    };
  }
}

async function prepareRequest<TResponse>(
  options: PrepareApiRouteRequestOptions
): Promise<PrepareApiRouteRequestResult<TResponse>> {
  const {
    request,
    route,
    allowedContentTypes,
    maxBodyBytes,
    idempotencyScope,
  } = options;

  const context = createRequestContext(request, route);

  const redisStatus = await checkRedisAvailability(context);
  if (!redisStatus.ok) {
    return { response: redisStatus.response };
  }

  if (!isAllowedOrigin(request)) {
    return {
      response: NextResponse.json({ error: "Invalid request origin." }, { status: 403 }),
    };
  }

  if (!hasAllowedContentType(request, allowedContentTypes)) {
    return {
      response: NextResponse.json({ error: "Invalid content type." }, { status: 415 }),
    };
  }

  try {
    if (await exceedsMaxBodyBytes(request, maxBodyBytes)) {
      return {
        response: NextResponse.json({ error: "Request body is too large." }, { status: 413 }),
      };
    }
  } catch {
    return {
      response: NextResponse.json({ error: "Invalid request body." }, { status: 400 }),
    };
  }

  const { key: idempotencyKey, error: idempotencyError } = readIdempotencyKey(request);
  if (idempotencyError) {
    return {
      response: NextResponse.json({ error: idempotencyError }, { status: 400 }),
    };
  }

  if (options.requireIdempotencyKey && !idempotencyKey) {
    return {
      response: NextResponse.json({ error: "An idempotency key is required." }, { status: 400 }),
    };
  }

  let idempotencyToken: IdempotencyToken<TResponse> | null = null;

  const respond: RouteResponder<TResponse> = async (status, body, headers) => {
    if (idempotencyToken) {
      if (status === 429 || status >= 500) {
        await rollbackIdempotency(idempotencyToken);
      } else {
        const headerRecord = headers
          ? Object.fromEntries(new Headers(headers).entries())
          : undefined;
        await commitIdempotency(idempotencyToken, status, body, headerRecord);
      }
    }

    return NextResponse.json(body, { status, headers });
  };

  if (idempotencyKey) {
    let requestHash: string;
    try {
      requestHash = await getRequestHash(request);
    } catch {
      return {
        response: NextResponse.json({ error: "Invalid request body." }, { status: 400 }),
      };
    }
    const idempotencyState = await beginIdempotency<TResponse>({
      scope: idempotencyScope,
      key: idempotencyKey,
      requestHash,
    });

    if (idempotencyState.state === "replay") {
      return { response: replayCachedResponse(idempotencyState.cached) };
    }

    if (idempotencyState.state === "in_progress") {
      return {
        response: NextResponse.json(
          {
            error: "A matching request is already in progress. Please retry shortly.",
          },
          { status: 409 }
        ),
      };
    }

    if (idempotencyState.state === "conflict") {
      return {
        response: NextResponse.json(
          { error: "This request key was used for different form contents. Please start a new submission." },
          { status: 409 }
        ),
      };
    }

    idempotencyToken = idempotencyState.token;
  }

  return {
    prepared: {
      context,
      idempotencyToken,
      respond,
    },
  };
}

export async function rollbackIdempotencyIfNeeded<TResponse>(
  token: IdempotencyToken<TResponse> | null,
  context: ReturnType<typeof createRequestContext>,
  discardReserved = false
): Promise<void> {
  if (!token) {
    return;
  }

  try {
    await rollbackIdempotency(token, discardReserved);
  } catch (error) {
    // Cleanup must not replace the API's controlled JSON error response. The
    // owned lease expires; a reserved delivery outcome remains available.
    logError("idempotency.rollback_failed", context, error);
  }
}
