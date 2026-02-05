import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "invalid_origin"
  | "invalid_content_type"
  | "payload_too_large"
  | "invalid_request"
  | "rate_limited"
  | "request_in_progress"
  | "upstream_error"
  | "server_error";

export interface ApiSuccessEnvelope<T> {
  success: true;
  requestId: string;
  data: T;
}

export interface ApiErrorEnvelope {
  success: false;
  requestId: string;
  error: {
    code: ApiErrorCode;
    message: string;
  };
}

interface ResponseOptions {
  headers?: HeadersInit;
}

export function successEnvelope<T>(requestId: string, data: T): ApiSuccessEnvelope<T> {
  return {
    success: true,
    requestId,
    data,
  };
}

export function errorEnvelope(
  requestId: string,
  code: ApiErrorCode,
  message: string
): ApiErrorEnvelope {
  return {
    success: false,
    requestId,
    error: {
      code,
      message,
    },
  };
}

function buildHeaders(requestId: string, headers?: HeadersInit): Headers {
  const responseHeaders = new Headers(headers);
  responseHeaders.set("x-request-id", requestId);
  responseHeaders.set("cache-control", "no-store");
  return responseHeaders;
}

export function ok<T>(requestId: string, data: T, options?: ResponseOptions) {
  return NextResponse.json<ApiSuccessEnvelope<T>>(
    successEnvelope(requestId, data),
    {
      status: 200,
      headers: buildHeaders(requestId, options?.headers),
    }
  );
}

export function accepted<T>(requestId: string, data: T, options?: ResponseOptions) {
  return NextResponse.json<ApiSuccessEnvelope<T>>(
    successEnvelope(requestId, data),
    {
      status: 202,
      headers: buildHeaders(requestId, options?.headers),
    }
  );
}

export function fail(
  requestId: string,
  status: number,
  code: ApiErrorCode,
  message: string,
  options?: ResponseOptions
) {
  return NextResponse.json<ApiErrorEnvelope>(
    errorEnvelope(requestId, code, message),
    {
      status,
      headers: buildHeaders(requestId, options?.headers),
    }
  );
}
