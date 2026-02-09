import { NextRequest, NextResponse } from "next/server";
import { beginIdempotency, commitIdempotency, rollbackIdempotency } from "@/lib/server/idempotency";
import { readIdempotencyKey, replayCachedResponse } from "@/lib/server/idempotency-request";
import { createRequestContext, logWarn, sendAlert } from "@/lib/server/observability";
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
}

type PrepareApiRouteRequestResult<TResponse> =
  | { response: NextResponse }
  | { prepared: PreparedApiRouteRequest<TResponse> };

let hasWarnedMissingRedis = false;

async function checkRedisAvailability(context: ReturnType<typeof createRequestContext>) {
  const redis = getRedisClient();
  if (redis) {
    return { ok: true };
  }

  const requireRedis =
    process.env.REQUIRE_REDIS === "true" ||
    process.env.REQUIRE_REDIS_FOR_RATE_LIMITS === "true";

  if (!hasWarnedMissingRedis) {
    logWarn("redis.missing", context, { requireRedis });
    await sendAlert("redis.missing", context, { requireRedis });
    hasWarnedMissingRedis = true;
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

  let idempotencyToken: IdempotencyToken<TResponse> | null = null;

  const respond: RouteResponder<TResponse> = async (status, body, headers) => {
    if (idempotencyToken) {
      if (status === 429) {
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
    const idempotencyState = await beginIdempotency<TResponse>({
      scope: idempotencyScope,
      key: idempotencyKey,
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
  token: IdempotencyToken<TResponse> | null
): Promise<void> {
  if (!token) {
    return;
  }

  await rollbackIdempotency(token);
}
