import type { NextRequest } from "next/server";
import { getClientIp, getRequestFingerprint, getRequestId, getUserAgent } from "@/lib/server/request";

type LogLevel = "info" | "warn" | "error";

interface RequestContext {
  route: string;
  requestId: string;
  ip: string;
  fingerprint: string;
  userAgent: string;
  origin: string | null;
}

function serializeError(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    value: String(error),
  };
}

export function createRequestContext(request: NextRequest, route: string): RequestContext {
  return {
    route,
    requestId: getRequestId(request),
    ip: getClientIp(request),
    fingerprint: getRequestFingerprint(request),
    userAgent: getUserAgent(request),
    origin: request.headers.get("origin"),
  };
}

function log(level: LogLevel, event: string, context: RequestContext, data?: Record<string, unknown>) {
  const payload = {
    level,
    event,
    route: context.route,
    requestId: context.requestId,
    ip: context.ip,
    fingerprint: context.fingerprint,
    origin: context.origin,
    userAgent: context.userAgent,
    timestamp: new Date().toISOString(),
    ...data,
  };

  if (level === "error") {
    console.error("[api]", JSON.stringify(payload));
    return;
  }

  if (level === "warn") {
    console.warn("[api]", JSON.stringify(payload));
    return;
  }

  console.info("[api]", JSON.stringify(payload));
}

export function logInfo(event: string, context: RequestContext, data?: Record<string, unknown>) {
  log("info", event, context, data);
}

export function logWarn(event: string, context: RequestContext, data?: Record<string, unknown>) {
  log("warn", event, context, data);
}

export function logError(
  event: string,
  context: RequestContext,
  error: unknown,
  data?: Record<string, unknown>
) {
  log("error", event, context, {
    ...data,
    error: serializeError(error),
  });
}

export async function sendAlert(
  event: string,
  context: RequestContext,
  details: Record<string, unknown>
) {
  const webhookUrl = process.env.ALERT_WEBHOOK_URL;
  if (!webhookUrl) {
    return;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3_000);

    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event,
          requestId: context.requestId,
          route: context.route,
          ip: context.ip,
          fingerprint: context.fingerprint,
          origin: context.origin,
          timestamp: new Date().toISOString(),
          details,
        }),
        cache: "no-store",
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    logError("alert.send_failed", context, error, { event });
  }
}
