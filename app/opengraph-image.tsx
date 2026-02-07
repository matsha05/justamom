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
  const [literataBuffer, plusJakartaBuffer, logoBuffer] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/literata-latin-700-normal.ttf")),
    readFile(join(process.cwd(), "public/fonts/plus-jakarta-sans-latin-500-normal.ttf")),
    readFile(join(process.cwd(), "public/images/peony-logo-v4.png")),
  ]);

  const logoDataUrl = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          background: "#f8f4ed",
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
            border: "2px solid #ddd4c8",
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
            background: "#2f6058",
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
            fontFamily: "Literata",
            fontWeight: 700,
            color: "#1a1715",
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
            color: "#6f645c",
            textAlign: "center",
            fontFamily: "Plus Jakarta Sans",
            letterSpacing: "0.14em",
            fontWeight: 500,
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
          name: "Literata",
          data: toArrayBuffer(literataBuffer),
          weight: 700,
          style: "normal",
        },
        {
          name: "Plus Jakarta Sans",
          data: toArrayBuffer(plusJakartaBuffer),
          weight: 500,
          style: "normal",
        },
      ],
    }
  );
}
