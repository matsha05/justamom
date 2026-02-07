import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/lib/config";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { getClientIp } from "@/lib/server/request";
import {
  contactFormSchema,
  getValidationMessage,
} from "@/lib/server/schemas";
import {
  logError,
  sendAlert,
} from "@/lib/server/observability";
import {
  prepareApiRouteRequest,
  rollbackIdempotencyIfNeeded,
} from "@/lib/server/api-route";
import {
  forwardFormspreeSubmission,
  isValidFormspreeEndpoint,
} from "@/lib/server/integrations/formspree";

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
  const preparedResult = await prepareApiRouteRequest<ContactRouteResponse>({
    request,
    route: "/api/contact",
    allowedContentTypes: ["multipart/form-data", "application/x-www-form-urlencoded"],
    maxBodyBytes: CONTACT_MAX_BODY_BYTES,
    idempotencyScope: CONTACT_IDEMPOTENCY_SCOPE,
  });

  if ("response" in preparedResult) {
    return preparedResult.response;
  }

  const { context, idempotencyToken, respond } = preparedResult.prepared;

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

    if (!isValidFormspreeEndpoint(siteConfig.contact.formspreeEndpoint)) {
      logError("contact.invalid_formspree_endpoint", context, new Error("invalid_endpoint"));
      return respond(500, { error: "Contact form is temporarily unavailable." });
    }

    const upstreamResult = await forwardFormspreeSubmission(
      siteConfig.contact.formspreeEndpoint,
      buildForwardedFormData(data)
    );

    if (!upstreamResult.ok) {
      logError("contact.formspree_failed", context, new Error("formspree_error"), {
        status: upstreamResult.status,
        message: upstreamResult.message,
      });
      await sendAlert("contact.formspree_failed", context, {
        status: upstreamResult.status,
        message: upstreamResult.message,
      });

      return respond(502, {
        error: "Unable to send your message right now. Please try again.",
      });
    }

    return respond(200, { success: true, message: successMessage });
  } catch (error) {
    await rollbackIdempotencyIfNeeded(idempotencyToken);

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
