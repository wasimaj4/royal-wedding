import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FDFBF7",
          fontFamily: "serif",
        }}
      >
        {/* Border */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            right: 20,
            bottom: 20,
            border: "1px solid #C4A265",
            display: "flex",
          }}
        />

        {/* Subtitle */}
        <p
          style={{
            fontSize: 18,
            letterSpacing: "0.3em",
            color: "#6B6B6B",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          YOU ARE INVITED
        </p>

        {/* Names */}
        <h1
          style={{
            fontSize: 80,
            color: "#2A2A2A",
            fontStyle: "italic",
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          Wasim & Rayan
        </h1>

        {/* Line */}
        <div
          style={{
            width: 60,
            height: 1,
            background: "#C4A265",
            margin: "24px 0",
          }}
        />

        {/* Date */}
        <p
          style={{
            fontSize: 22,
            color: "#6B6B6B",
            letterSpacing: "0.15em",
          }}
        >
          17 MAY 2026
        </p>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
