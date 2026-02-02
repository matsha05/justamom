import { NextRequest, NextResponse } from "next/server";

const MAILERLITE_API_URL = "https://connect.mailerlite.com/api";
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const requestBuckets = new Map<string, { count: number; windowStart: number }>();

function getClientIp(request: NextRequest): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        return forwarded.split(",")[0]?.trim() || "unknown";
    }
    return request.headers.get("x-real-ip") || "unknown";
}

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const bucket = requestBuckets.get(ip);

    if (!bucket || now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
        requestBuckets.set(ip, { count: 1, windowStart: now });
        return false;
    }

    bucket.count += 1;
    if (bucket.count > RATE_LIMIT_MAX) {
        return true;
    }
    return false;
}

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        const ip = getClientIp(request);
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: "Too many requests. Please wait a minute and try again." },
                { status: 429, headers: { "Retry-After": "60" } }
            );
        }

        // Validate email
        if (!email || typeof email !== "string" || !email.includes("@")) {
            return NextResponse.json(
                { error: "Please provide a valid email address." },
                { status: 400 }
            );
        }

        const apiKey = process.env.MAILER_LITE_API_KEY;
        const groupId = process.env.MAILERLITE_GROUP_ID;

        if (!apiKey || !groupId) {
            console.error("MailerLite API key or Group ID not configured");
            return NextResponse.json(
                { error: "Newsletter signup is temporarily unavailable." },
                { status: 500 }
            );
        }

        const normalizedEmail = email.toLowerCase().trim();

        // First, check if subscriber already exists
        const checkResponse = await fetch(
            `${MAILERLITE_API_URL}/subscribers/${encodeURIComponent(normalizedEmail)}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );

        if (checkResponse.ok) {
            // Subscriber already exists
            return NextResponse.json(
                {
                    success: true,
                    alreadySubscribed: true,
                    message: "You're already on the list! Check your inbox for past notes."
                },
                { status: 200 }
            );
        }

        // Add new subscriber to MailerLite group
        const response = await fetch(`${MAILERLITE_API_URL}/subscribers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                email: normalizedEmail,
                groups: [groupId],
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("MailerLite API error:", data);
            return NextResponse.json(
                { error: "Something went wrong. Please try again." },
                { status: response.status }
            );
        }

        return NextResponse.json(
            { success: true, message: "Welcome! Check your inbox for a confirmation." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Newsletter subscription error:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
