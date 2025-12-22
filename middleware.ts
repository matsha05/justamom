import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 301 Redirects from old Wix URLs to new clean URLs
const redirects: Record<string, string> = {
    "/about-me": "/about",
    "/general-4": "/speaking",
    "/contact-8": "/contact",
};

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Check if this path needs a redirect
    if (redirects[pathname]) {
        const url = request.nextUrl.clone();
        url.pathname = redirects[pathname];
        return NextResponse.redirect(url, 301);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/about-me", "/general-4", "/contact-8"],
};
