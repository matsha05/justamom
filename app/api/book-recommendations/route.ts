import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { siteConfig } from "@/lib/config";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { getClientIp } from "@/lib/server/request";
import { getValidationMessage } from "@/lib/server/schemas";
import { logError } from "@/lib/server/observability";
import { prepareApiRouteRequest, rollbackIdempotencyIfNeeded } from "@/lib/server/api-route";
import { forwardFormspreeSubmission, isValidFormspreeEndpoint } from "@/lib/server/integrations/formspree";

const schema = z.object({
  recommendation: z.string().trim().min(1, "Please include a book recommendation.").max(4_000, "Please keep your recommendation under 4,000 characters."),
  company: z.string().trim().max(120).optional().default(""),
});
const successMessage = "Thank you! Your recommendation has been sent privately to Lizi.";
const errorMessage = "Your recommendation could not be sent. Please try again in a little while.";
type RouteResponse = { success: true; message: string } | { error: string };

export async function POST(request: NextRequest) {
  const preparedResult = await prepareApiRouteRequest<RouteResponse>({
    request,
    route: "/api/book-recommendations",
    allowedContentTypes: ["multipart/form-data", "application/x-www-form-urlencoded"],
    maxBodyBytes: 16 * 1024,
    idempotencyScope: "book-recommendations",
  });
  if ("response" in preparedResult) return preparedResult.response;
  const { context, idempotencyToken, respond } = preparedResult.prepared;

  try {
    const limit = await checkRateLimit({
      key: `book-recommendations:ip:${getClientIp(request)}`,
      limit: 6,
      windowMs: 5 * 60_000,
    });
    if (limit.limited) {
      return respond(429, { error: "Too many recommendations at once. Please wait a few minutes and try again." }, { "Retry-After": String(limit.retryAfterSeconds) });
    }

    let incoming: FormData;
    try {
      incoming = await request.formData();
    } catch {
      return respond(400, { error: "Invalid form data." });
    }
    const parsed = schema.safeParse({
      recommendation: incoming.get("recommendation"),
      company: incoming.get("company") ?? "",
    });
    if (!parsed.success) return respond(400, { error: getValidationMessage(parsed.error) });
    if (parsed.data.company) return respond(200, { success: true, message: successMessage });

    if (!isValidFormspreeEndpoint(siteConfig.contact.formspreeEndpoint)) {
      return respond(503, { error: "Book recommendations are temporarily unavailable. Please try again later." });
    }
    const forwarded = new FormData();
    forwarded.set("message", parsed.data.recommendation);
    forwarded.set("form_type", "book-recommendation");
    forwarded.set("subject", "New book recommendation");
    forwarded.set("_subject", "New book recommendation");
    const result = await forwardFormspreeSubmission(siteConfig.contact.formspreeEndpoint, forwarded);
    if (!result.ok) {
      logError("book-recommendations.formspree_failed", context, new Error("formspree_error"), { status: result.status });
      return respond(502, { error: errorMessage });
    }
    return respond(200, { success: true, message: successMessage });
  } catch (error) {
    await rollbackIdempotencyIfNeeded(idempotencyToken);
    logError("book-recommendations.request_failed", context, error);
    return NextResponse.json({ error: errorMessage }, { status: 502 });
  }
}
