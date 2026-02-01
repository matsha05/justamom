import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Lizi Shaw | Speaker, Writer, Encourager";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3001";

const loraSemiBold = fetch(
  new URL("/fonts/lora-latin-600-normal.woff", baseUrl)
).then((res) => res.arrayBuffer());

const interRegular = fetch(
  new URL("/fonts/inter-latin-400-normal.woff", baseUrl)
).then((res) => res.arrayBuffer());

export default async function Image() {
  const [loraData, interData] = await Promise.all([
    loraSemiBold,
    interRegular,
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
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
            fontFamily: "Lora",
            fontWeight: 600,
            color: "#1a1a1a",
            marginBottom: 18,
            textAlign: "center",
            letterSpacing: "-0.02em",
          }}
        >
          Lizi Shaw
        </div>

        <div
          style={{
            fontSize: 28,
            color: "#737373",
            textAlign: "center",
            fontFamily: "Inter",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Speaker · Writer · Encourager
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Lora",
          data: loraData,
          weight: 600,
          style: "normal",
        },
        {
          name: "Inter",
          data: interData,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );
}
