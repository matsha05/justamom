import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config";

export const runtime = "edge";

export const alt = `${siteConfig.site.name} | ${siteConfig.site.tagline}`;
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3001";

const newsreaderSemiBold = fetch(
  new URL("/fonts/newsreader-latin-600-normal.woff", baseUrl)
).then((res) => res.arrayBuffer());

const sourceSansRegular = fetch(
  new URL("/fonts/source-sans-3-latin-400-normal.woff", baseUrl)
).then((res) => res.arrayBuffer());

export default async function Image() {
  const [newsreaderData, sourceSansData] = await Promise.all([
    newsreaderSemiBold,
    sourceSansRegular,
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          background: "#faf8f5",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            right: 24,
            bottom: 24,
            border: "2px solid #e5e2dd",
            borderRadius: 12,
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "#4a7c7c",
            marginBottom: 40,
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <img
            src={new URL("/images/peony-logo-v4.png", baseUrl).toString()}
            width={140}
            height={140}
            alt=""
            style={{ objectFit: "cover" }}
          />
        </div>

        <div
          style={{
            fontSize: 72,
            fontFamily: "Newsreader",
            fontWeight: 600,
            color: "#1a1a1a",
            marginBottom: 18,
            textAlign: "center",
            letterSpacing: "-0.02em",
          }}
        >
          {siteConfig.site.name}
        </div>

        <div
          style={{
            fontSize: 28,
            color: "#737373",
            textAlign: "center",
            fontFamily: "Source Sans 3",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          {siteConfig.site.tagline}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Newsreader",
          data: newsreaderData,
          weight: 600,
          style: "normal",
        },
        {
          name: "Source Sans 3",
          data: sourceSansData,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );
}
