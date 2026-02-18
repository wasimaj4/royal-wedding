import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #E8D5A8 0%, #F5E6C8 30%, #E8D5A8 60%, #DCC699 100%)",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Gold border */}
        <div
          style={{
            position: "absolute",
            inset: "16px",
            border: "2px solid #D4AF37",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "24px",
            border: "1px solid rgba(212,175,55,0.4)",
            display: "flex",
          }}
        />

        {/* Corner ornaments */}
        <div
          style={{
            position: "absolute",
            top: "32px",
            left: "32px",
            width: "60px",
            height: "60px",
            borderTop: "2px solid #D4AF37",
            borderLeft: "2px solid #D4AF37",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "32px",
            right: "32px",
            width: "60px",
            height: "60px",
            borderTop: "2px solid #D4AF37",
            borderRight: "2px solid #D4AF37",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            left: "32px",
            width: "60px",
            height: "60px",
            borderBottom: "2px solid #D4AF37",
            borderLeft: "2px solid #D4AF37",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            right: "32px",
            width: "60px",
            height: "60px",
            borderBottom: "2px solid #D4AF37",
            borderRight: "2px solid #D4AF37",
            display: "flex",
          }}
        />

        {/* Top ornament line */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "1px",
              background: "linear-gradient(90deg, transparent, #D4AF37)",
              display: "flex",
            }}
          />
          <div
            style={{
              width: "10px",
              height: "10px",
              background: "#D4AF37",
              transform: "rotate(45deg)",
              display: "flex",
            }}
          />
          <div
            style={{
              width: "120px",
              height: "1px",
              background: "linear-gradient(270deg, transparent, #D4AF37)",
              display: "flex",
            }}
          />
        </div>

        {/* "The Wedding of" */}
        <p
          style={{
            fontSize: "24px",
            color: "rgba(139,117,54,0.8)",
            letterSpacing: "8px",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}
        >
          The Wedding of
        </p>

        {/* Names */}
        <h1
          style={{
            fontSize: "96px",
            color: "#3E2723",
            textShadow: "0 0 20px rgba(212,175,55,0.3)",
            marginBottom: "8px",
            display: "flex",
            alignItems: "baseline",
            gap: "20px",
          }}
        >
          <span>Wasim</span>
          <span style={{ fontSize: "64px", color: "#D4AF37" }}>&</span>
          <span>Rayan</span>
        </h1>

        {/* Bottom ornament */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginTop: "20px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "120px",
              height: "1px",
              background: "linear-gradient(90deg, transparent, #D4AF37)",
              display: "flex",
            }}
          />
          <div
            style={{
              width: "10px",
              height: "10px",
              background: "#D4AF37",
              transform: "rotate(45deg)",
              display: "flex",
            }}
          />
          <div
            style={{
              width: "120px",
              height: "1px",
              background: "linear-gradient(270deg, transparent, #D4AF37)",
              display: "flex",
            }}
          />
        </div>

        {/* Date */}
        <p
          style={{
            fontSize: "28px",
            color: "#8B7536",
            letterSpacing: "6px",
          }}
        >
          17 MAY 2026
        </p>

        {/* Subtitle */}
        <p
          style={{
            fontSize: "16px",
            color: "rgba(62,39,35,0.5)",
            letterSpacing: "4px",
            marginTop: "12px",
          }}
        >
          YOU ARE CORDIALLY INVITED
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
