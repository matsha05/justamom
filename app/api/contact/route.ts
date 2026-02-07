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
  contactFormSchema,
  getValidationMessage,
} from "@/lib/server/schemas";
import {
  createRequestContext,
  logError,
  sendAlert,
} from "@/lib/server/observability";

const CONTACT_RATE_LIMIT = { limit: 12, windowMs: 5 * 60_000 };
const CONTACT_MAX_BODY_BYTES = 64 * 1024;
const CONTACT_IDEMPOTENCY_SCOPE = "contact";

interface ContactSuccess {
  success: true;
  message: string;
}

interface ContactError {
  error: string;
}

type ContactRouteResponse = ContactSuccess | ContactError;
type IdempotencyToken = Parameters<typeof commitIdempotency<ContactRouteResponse>>[0];

function toFormRecord(formData: FormData): Record<string, string> {
  const output: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value !== "string") continue;
    output[key] = value;
  }
  return output;
}

function successMessageFor(formType: "contact" | "speaking") {
  return formType === "speaking"
    ? "Inquiry received! I will follow up soon."
    : "Message sent! I will get back to you as soon as I can.";
}

function buildForwardedFormData(data: ReturnType<typeof contactFormSchema.parse>): FormData {
  const forwarded = new FormData();
  const keys = [
    "name",
    "email",
    "form_type",
    "message",
    "organization",
    "event_date",
    "location",
    "event_type",
    "audience_size",
    "budget",
  ] as const;

  for (const key of keys) {
    const value = data[key];
    if (!value) continue;
    forwarded.set(key, value);
  }

  const resolvedSubject =
    data.subject ||
    (data.form_type === "speaking" ? "New Speaking Inquiry" : "New Contact Message");

  forwarded.set("subject", resolvedSubject);
  forwarded.set("_subject", resolvedSubject);

  return forwarded;
}

export async function POST(request: NextRequest) {
  const context = createRequestContext(request, "/api/contact");

  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  if (
    !hasAllowedContentType(request, [
      "multipart/form-data",
      "application/x-www-form-urlencoded",
    ])
  ) {
    return NextResponse.json({ error: "Invalid content type." }, { status: 415 });
  }

  if (exceedsContentLength(request, CONTACT_MAX_BODY_BYTES)) {
    return NextResponse.json({ error: "Request body is too large." }, { status: 413 });
  }

  const { key: idempotencyKey, error: idempotencyError } = readIdempotencyKey(request);
  if (idempotencyError) {
    return NextResponse.json({ error: idempotencyError }, { status: 400 });
  }

  let idempotencyToken: IdempotencyToken | null = null;

  const respond = async (
    status: number,
    body: ContactRouteResponse,
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
    const idempotencyState = await beginIdempotency<ContactRouteResponse>({
      scope: CONTACT_IDEMPOTENCY_SCOPE,
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
      key: `contact:ip:${ip}`,
      ...CONTACT_RATE_LIMIT,
    });

    if (ipLimit.limited) {
      return respond(
        429,
        { error: "Too many requests. Please wait a few minutes and try again." },
        { "Retry-After": String(ipLimit.retryAfterSeconds) }
      );
    }

    let incoming: FormData;
    try {
      incoming = await request.formData();
    } catch {
      return respond(400, { error: "Invalid form data." });
    }

    const parsed = contactFormSchema.safeParse(toFormRecord(incoming));
    if (!parsed.success) {
      return respond(400, { error: getValidationMessage(parsed.error) });
    }

    const data = parsed.data;
    const successMessage = successMessageFor(data.form_type);

    if (data.company) {
      return respond(200, { success: true, message: successMessage });
    }

    if (!siteConfig.contact.formspreeEndpoint.startsWith("https://formspree.io/")) {
      logError("contact.invalid_formspree_endpoint", context, new Error("invalid_endpoint"));
      return respond(500, { error: "Contact form is temporarily unavailable." });
    }

    const upstreamResponse = await fetchWithTimeout(siteConfig.contact.formspreeEndpoint, {
      method: "POST",
      body: buildForwardedFormData(data),
      headers: {
        Accept: "application/json",
      },
    });

    if (!upstreamResponse.ok) {
      const payload = await parseJsonSafely(upstreamResponse);
      const upstreamMessage = getErrorMessage(payload);

      logError("contact.formspree_failed", context, new Error("formspree_error"), {
        status: upstreamResponse.status,
        message: upstreamMessage,
      });
      await sendAlert("contact.formspree_failed", context, {
        status: upstreamResponse.status,
        message: upstreamMessage,
      });

      return respond(502, {
        error: "Unable to send your message right now. Please try again.",
      });
    }

    return respond(200, { success: true, message: successMessage });
  } catch (error) {
    if (idempotencyToken) {
      await rollbackIdempotency(idempotencyToken);
    }

    logError("contact.request_failed", context, error);
    await sendAlert("contact.request_failed", context, {
      reason: "unexpected_error",
    });

    return NextResponse.json(
      { error: "Unable to send your message right now. Please try again." },
      { status: 502 }
    );
  }
}
