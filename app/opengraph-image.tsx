import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config";

export const runtime = "nodejs";

export const alt = `${siteConfig.site.name} | ${siteConfig.site.tagline}`;
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

function toArrayBuffer(buffer: Buffer): ArrayBuffer {
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer;
}

export default async function Image() {
  const [newsreaderBuffer, sourceSansBuffer, logoBuffer] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/newsreader-latin-600-normal.woff")),
    readFile(join(process.cwd(), "public/fonts/source-sans-3-latin-400-normal.woff")),
    readFile(join(process.cwd(), "public/images/peony-logo-v4.png")),
  ]);

  const logoDataUrl = `data:image/png;base64,${logoBuffer.toString("base64")}`;

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
            overflow: "hidden",
          }}
        >
          <img
            src={logoDataUrl}
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
          data: toArrayBuffer(newsreaderBuffer),
          weight: 600,
          style: "normal",
        },
        {
          name: "Source Sans 3",
          data: toArrayBuffer(sourceSansBuffer),
          weight: 400,
          style: "normal",
        },
      ],
    }
  );
}
