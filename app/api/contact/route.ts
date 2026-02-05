import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/lib/config";
import { isValidEmail, normalizeEmail } from "@/lib/server/email";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { getClientIp, isAllowedOrigin } from "@/lib/server/request";
import {
  fetchWithTimeout,
  getErrorMessage,
  parseJsonSafely,
} from "@/lib/server/http";
import { rateLimitResponse } from "@/lib/server/response";

const CONTACT_RATE_LIMIT = { limit: 12, windowMs: 5 * 60_000 };

function getStringField(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function normalizeFormType(value: string): "contact" | "speaking" {
  return value === "speaking" ? "speaking" : "contact";
}

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const ip = getClientIp(request);
  const ipLimit = await checkRateLimit({
    key: `contact:ip:${ip}`,
    ...CONTACT_RATE_LIMIT,
  });

  if (ipLimit.limited) {
    return rateLimitResponse(
      "Too many requests. Please wait a few minutes and try again.",
      ipLimit.retryAfterSeconds
    );
  }

  let incoming: FormData;
  try {
    incoming = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const honeypot = getStringField(incoming, "company");
  const formType = normalizeFormType(getStringField(incoming, "form_type"));

  const successMessage =
    formType === "speaking"
      ? "Inquiry received! I will follow up soon."
      : "Message sent! I will get back to you as soon as I can.";

  if (honeypot) {
    return NextResponse.json({ success: true, message: successMessage }, { status: 200 });
  }

  const name = getStringField(incoming, "name");
  const email = normalizeEmail(getStringField(incoming, "email"));
  const message = getStringField(incoming, "message");

  if (!name) {
    return NextResponse.json({ error: "Please provide your name." }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
  }

  if (formType === "contact" && !message) {
    return NextResponse.json({ error: "Please include a message." }, { status: 400 });
  }

  if (formType === "speaking") {
    const eventType = getStringField(incoming, "event_type");
    const audienceSize = getStringField(incoming, "audience_size");
    if (!eventType || !audienceSize) {
      return NextResponse.json(
        { error: "Please select an event type and group size." },
        { status: 400 }
      );
    }
  }

  const forwarded = new FormData();
  for (const [key, value] of incoming.entries()) {
    if (typeof value !== "string") continue;
    forwarded.append(key, value.trim());
  }

  forwarded.set("email", email);
  forwarded.set("name", name);
  forwarded.set("form_type", formType);

  const subject = getStringField(incoming, "subject");
  const resolvedSubject =
    subject || (formType === "speaking" ? "New Speaking Inquiry" : "New Contact Message");
  forwarded.set("subject", resolvedSubject);
  forwarded.set("_subject", resolvedSubject);

  if (!siteConfig.contact.formspreeEndpoint.startsWith("https://formspree.io/")) {
    console.error("Invalid Formspree endpoint configuration");
    return NextResponse.json(
      { error: "Contact form is temporarily unavailable." },
      { status: 500 }
    );
  }

  try {
    const upstreamResponse = await fetchWithTimeout(siteConfig.contact.formspreeEndpoint, {
      method: "POST",
      body: forwarded,
      headers: {
        Accept: "application/json",
      },
    });

    if (!upstreamResponse.ok) {
      const payload = await parseJsonSafely(upstreamResponse);
      console.error("Formspree request failed", {
        status: upstreamResponse.status,
        message: getErrorMessage(payload),
      });
      return NextResponse.json(
        { error: "Unable to send your message right now. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, message: successMessage }, { status: 200 });
  } catch (error) {
    console.error("Contact request failed", { ip, error });
    return NextResponse.json(
      { error: "Unable to send your message right now. Please try again." },
      { status: 502 }
    );
  }
}
