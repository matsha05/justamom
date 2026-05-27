import { beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { isAllowedOrigin } from "@/lib/server/request";

function createRequest(url: string, origin: string): NextRequest {
  return new NextRequest(url, {
    method: "POST",
    headers: {
      origin,
      "content-type": "application/json",
      "x-forwarded-host": new URL(url).host,
      "x-forwarded-proto": "https",
    },
    body: "{}",
  });
}

describe("request origin checks", () => {
  beforeEach(() => {
    delete process.env.ALLOWED_ORIGINS;
    delete process.env.ALLOW_MISSING_ORIGIN;
    delete process.env.TRUST_PROXY;
  });

  it("allows the configured site origin", () => {
    const request = createRequest(
      "https://lizishaw.com/api/newsletter",
      "https://lizishaw.com"
    );

    expect(isAllowedOrigin(request)).toBe(true);
  });

  it("does not trust the request host as an automatic allowed origin", () => {
    const request = createRequest(
      "https://preview.example.com/api/newsletter",
      "https://preview.example.com"
    );

    expect(isAllowedOrigin(request)).toBe(false);
  });

  it("allows explicit preview origins through ALLOWED_ORIGINS", () => {
    process.env.ALLOWED_ORIGINS = "https://preview.example.com";
    const request = createRequest(
      "https://preview.example.com/api/newsletter",
      "https://preview.example.com"
    );

    expect(isAllowedOrigin(request)).toBe(true);
  });
});
