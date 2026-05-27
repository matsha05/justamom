/* oxlint-disable react-doctor/only-export-components react-doctor/nextjs-no-img-element */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { CSSProperties } from "react";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/config";

export const runtime = "nodejs";

export const alt = `${siteConfig.site.name} | ${siteConfig.site.tagline}`;
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const rootStyle: CSSProperties = {
  background: "#f8f4ed",
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
};

const frameStyle: CSSProperties = {
  position: "absolute",
  top: 24,
  left: 24,
  right: 24,
  bottom: 24,
  border: "2px solid #ddd4c8",
  borderRadius: 12,
};

const logoContainerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 140,
  height: 140,
  borderRadius: "50%",
  background: "#2f6058",
  marginBottom: 40,
  overflow: "hidden",
};

const logoImageStyle: CSSProperties = {
  objectFit: "cover",
};

const titleStyle: CSSProperties = {
  fontSize: 72,
  fontFamily: "Newsreader",
  fontWeight: 600,
  color: "#1a1715",
  marginBottom: 18,
  textAlign: "center",
  letterSpacing: "-0.02em",
};

const taglineStyle: CSSProperties = {
  fontSize: 28,
  color: "#6f645c",
  textAlign: "center",
  fontFamily: "Source Sans 3",
  letterSpacing: "0.14em",
  fontWeight: 400,
  textTransform: "uppercase",
};

function toArrayBuffer(buffer: Buffer): ArrayBuffer {
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer;
}

export default async function Image() {
  const [newsreaderBuffer, sourceSans3Buffer, logoBuffer] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/newsreader-latin-600-normal.woff")),
    readFile(join(process.cwd(), "public/fonts/source-sans-3-latin-400-normal.woff")),
    readFile(join(process.cwd(), "public/images/peony-logo-v4.png")),
  ]);

  const logoDataUrl = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={rootStyle}>
        <div style={frameStyle} />

        <div style={logoContainerStyle}>
          <img
            src={logoDataUrl}
            width={140}
            height={140}
            alt=""
            style={logoImageStyle}
          />
        </div>

        <div style={titleStyle}>
          {siteConfig.site.name}
        </div>

        <div style={taglineStyle}>
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
          data: toArrayBuffer(sourceSans3Buffer),
          weight: 400,
          style: "normal",
        },
      ],
    }
  );
}
