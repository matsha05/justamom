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

const IP_RATE_LIMIT = { limit: 10, windowMs: 60_000 };
const EMAIL_RATE_LIMIT = { limit: 4, windowMs: 60_000 };

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const ip = getClientIp(request);
  const ipLimit = await checkRateLimit({
    key: `newsletter:ip:${ip}`,
    ...IP_RATE_LIMIT,
  });

  if (ipLimit.limited) {
    return rateLimitResponse(
      "Too many requests. Please wait a minute and try again.",
      ipLimit.retryAfterSeconds
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const rawEmail =
    payload && typeof payload === "object" && "email" in payload
      ? (payload as { email?: unknown }).email
      : undefined;

  if (typeof rawEmail !== "string") {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  const email = normalizeEmail(rawEmail);
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  const emailLimit = await checkRateLimit({
    key: `newsletter:email:${email}`,
    ...EMAIL_RATE_LIMIT,
  });

  if (emailLimit.limited) {
    return rateLimitResponse(
      "Too many requests. Please wait a minute and try again.",
      emailLimit.retryAfterSeconds
    );
  }

  const apiKey = process.env.MAILER_LITE_API_KEY;
  const groupId = process.env.MAILERLITE_GROUP_ID;

  if (!apiKey || !groupId) {
    console.error("MailerLite API key or group ID not configured");
    return NextResponse.json(
      { error: "Newsletter signup is temporarily unavailable." },
      { status: 500 }
    );
  }

  const authorizationHeaders = {
    Accept: "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  try {
    const lookupResponse = await fetchWithTimeout(
      `${siteConfig.integrations.mailerLiteApiBaseUrl}/subscribers/${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: authorizationHeaders,
      }
    );

    if (lookupResponse.status === 200) {
      return NextResponse.json(
        {
          success: true,
          alreadySubscribed: true,
          message: siteConfig.newsletter.alreadySubscribedMessage,
        },
        { status: 200 }
      );
    }

    if (lookupResponse.status !== 404) {
      const lookupPayload = await parseJsonSafely(lookupResponse);
      console.error("MailerLite lookup failed", {
        status: lookupResponse.status,
        message: getErrorMessage(lookupPayload),
      });
      return NextResponse.json(
        { error: "Newsletter signup is temporarily unavailable." },
        { status: 502 }
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
        return NextResponse.json(
          {
            success: true,
            alreadySubscribed: true,
            message: siteConfig.newsletter.alreadySubscribedMessage,
          },
          { status: 200 }
        );
      }

      console.error("MailerLite create subscriber failed", {
        status: createResponse.status,
        message: upstreamMessage || null,
      });
      return NextResponse.json(
        { error: "Newsletter signup is temporarily unavailable." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: siteConfig.newsletter.welcomeMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Newsletter subscription request failed", {
      ip,
      error,
    });
    return NextResponse.json(
      { error: "Newsletter signup is temporarily unavailable." },
      { status: 502 }
    );
  }
}
