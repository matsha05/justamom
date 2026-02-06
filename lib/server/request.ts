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

function parseOrigin(value: string): URL | null {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function addOriginWithAliases(target: Set<string>, value: string): void {
  const normalized = normalizeOrigin(value);
  if (!normalized) {
    return;
  }

  const parsed = parseOrigin(normalized);
  if (!parsed) {
    target.add(normalized);
    return;
  }

  target.add(normalizeOrigin(parsed.origin));

  const hostname = parsed.hostname.toLowerCase();
  const isLocalhost =
    hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
  const isIpv4 = /^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname);

  // Accept both www/non-www variants for the same site host.
  if (hostname.includes(".") && !isLocalhost && !isIpv4) {
    const aliasHostname = hostname.startsWith("www.")
      ? hostname.slice(4)
      : `www.${hostname}`;
    const aliasOrigin = `${parsed.protocol}//${aliasHostname}${parsed.port ? `:${parsed.port}` : ""}`;
    target.add(normalizeOrigin(aliasOrigin));
  }
}

function getAllowedOrigins(request?: NextRequest): Set<string> {
  const configuredOrigins = (process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((value) => normalizeOrigin(value))
    .filter(Boolean);
  const allowedOrigins = new Set<string>();

  addOriginWithAliases(allowedOrigins, siteConfig.site.url);
  for (const localOrigin of localOrigins) {
    addOriginWithAliases(allowedOrigins, localOrigin);
  }
  for (const configuredOrigin of configuredOrigins) {
    addOriginWithAliases(allowedOrigins, configuredOrigin);
  }

  if (request) {
    addOriginWithAliases(allowedOrigins, request.nextUrl.origin);

    const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
    const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
    if (forwardedHost && forwardedProto) {
      addOriginWithAliases(allowedOrigins, `${forwardedProto}://${forwardedHost}`);
    }
  }

  return allowedOrigins;
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
  return getAllowedOrigins(request).has(normalizeOrigin(origin));
}
