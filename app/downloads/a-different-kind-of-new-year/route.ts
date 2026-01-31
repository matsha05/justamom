import { NextRequest, NextResponse } from "next/server";
import { track } from "@vercel/analytics/server";

export async function GET(request: NextRequest) {
  const url = new URL(
    "/downloads/a-different-kind-of-new-year.pdf",
    request.url
  );

  const response = NextResponse.redirect(url, 302);
  // Keep the redirect fresh so we can swap the PDF without cache surprises.
  response.headers.set("Cache-Control", "no-store");

  try {
    await track(
      "Download",
      {
        asset: "a-different-kind-of-new-year",
        type: "pdf",
      },
      { headers: request.headers }
    );
  } catch {
    // Never block the download if analytics fails.
  }

  return response;
}
