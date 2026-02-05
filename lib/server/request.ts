import type { NextRequest } from "next/server";
import { siteConfig } from "@/lib/config";

const localOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
];

function normalizeOrigin(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

function getAllowedOrigins(): Set<string> {
  const configuredOrigins = (process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((value) => normalizeOrigin(value))
    .filter(Boolean);

  return new Set([
    normalizeOrigin(siteConfig.site.url),
    ...localOrigins.map((originValue) => normalizeOrigin(originValue)),
    ...configuredOrigins,
  ]);
}

function hashString(value: string): string {
  let hash = 5381;

  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }

  return (hash >>> 0).toString(36);
}

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}

export function getUserAgent(request: NextRequest): string {
  return request.headers.get("user-agent")?.trim() || "unknown";
}

export function getRequestId(request: NextRequest): string {
  const incoming = request.headers.get("x-request-id")?.trim();
  if (incoming) {
    return incoming;
  }

  return crypto.randomUUID();
}

export function getRequestFingerprint(request: NextRequest): string {
  const ip = getClientIp(request);
  const userAgent = getUserAgent(request).slice(0, 200);
  const origin = request.headers.get("origin")?.slice(0, 120) ?? "no-origin";
  return hashString(`${ip}|${userAgent}|${origin}`);
}

export function hasAllowedContentType(request: NextRequest, allowed: string[]): boolean {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType) {
    return false;
  }

  return allowed.some((candidate) => contentType.startsWith(candidate.toLowerCase()));
}

export function getContentLength(request: NextRequest): number | null {
  const raw = request.headers.get("content-length");
  if (!raw) {
    return null;
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }

  return parsed;
}

export function exceedsContentLength(request: NextRequest, maxBytes: number): boolean {
  const contentLength = getContentLength(request);
  return contentLength !== null && contentLength > maxBytes;
}

export function isAllowedOrigin(
  request: NextRequest,
  options?: { requireOriginHeader?: boolean }
): boolean {
  const requireOriginHeader = options?.requireOriginHeader ?? true;
  const origin = request.headers.get("origin");

  if (!origin) {
    if (!requireOriginHeader) {
      return true;
    }

    return process.env.ALLOW_MISSING_ORIGIN === "true";
  }

  return getAllowedOrigins().has(normalizeOrigin(origin));
}
