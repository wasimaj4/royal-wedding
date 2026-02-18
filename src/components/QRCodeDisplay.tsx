"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import QRCodeLib from "qrcode";

interface QRCodeDisplayProps {
  data: string;
  size?: number;
  guestName: string;
  rsvpId: string;
}

/**
 * Renders a QR code using the battle-tested `qrcode` library.
 * Draws to canvas with deep-brown color to match the theme.
 */
export default function QRCodeDisplay({
  data,
  size = 200,
  guestName,
  rsvpId,
}: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (!canvasRef.current) return;
    QRCodeLib.toCanvas(canvasRef.current, data, {
      width: size,
      margin: 2,
      errorCorrectionLevel: "M",
      color: {
        dark: "#3E2723", // deep brown to match theme
        light: "#FFFFFF",
      },
    }).catch((err: Error) => console.error("QR generation failed:", err));
  }, [data, size]);

  const handleDownload = () => {
    if (!canvasRef.current) return;

    // Create a composite image with guest info + QR code
    const exportCanvas = document.createElement("canvas");
    const exportSize = size + 120;
    exportCanvas.width = exportSize;
    exportCanvas.height = exportSize + 80;
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#FAF0E6";
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // Gold border
    ctx.strokeStyle = "#D4AF37";
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 4, exportCanvas.width - 8, exportCanvas.height - 8);
    ctx.strokeRect(8, 8, exportCanvas.width - 16, exportCanvas.height - 16);

    // Header text
    ctx.fillStyle = "#8B7536";
    ctx.font = "10px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("WASIM & RAYAN WEDDING", exportCanvas.width / 2, 35);

    // Guest name
    ctx.fillStyle = "#3E2723";
    ctx.font = "bold 14px Georgia, serif";
    ctx.fillText(guestName, exportCanvas.width / 2, 55);

    // QR code
    ctx.drawImage(canvasRef.current, 60, 70, size, size);

    // RSVP ID
    ctx.fillStyle = "#8B7536";
    ctx.font = "10px monospace";
    ctx.fillText(rsvpId, exportCanvas.width / 2, size + 95);

    // Date
    ctx.font = "9px Georgia, serif";
    ctx.fillText("17 May 2026", exportCanvas.width / 2, size + 112);

    // Download
    const link = document.createElement("a");
    link.download = `wedding-rsvp-${rsvpId}.png`;
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="p-4 bg-white rounded shadow-md border border-gold/20">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="block"
        />
      </div>

      <p className="text-xs text-gold-dark/50 font-mono tracking-wider">
        {rsvpId}
      </p>

      <button
        onClick={handleDownload}
        className="px-6 py-2 text-xs tracking-[0.2em] uppercase border border-gold/40 text-gold-dark/70 
          hover:bg-gold/10 transition-all duration-500 font-serif"
      >
        {t.saveQRCode}
      </button>
    </div>
  );
}
