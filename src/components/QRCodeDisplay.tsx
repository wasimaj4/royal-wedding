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
        dark: "#2A2A2A",
        light: "#FFFFFF",
      },
    }).catch((err: Error) => console.error("QR generation failed:", err));
  }, [data, size]);

  const handleDownload = () => {
    if (!canvasRef.current) return;

    const exportCanvas = document.createElement("canvas");
    const exportSize = size + 80;
    exportCanvas.width = exportSize;
    exportCanvas.height = exportSize + 60;
    const ctx = exportCanvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#FDFBF7";
    ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    ctx.strokeStyle = "#C4A265";
    ctx.lineWidth = 1;
    ctx.strokeRect(6, 6, exportCanvas.width - 12, exportCanvas.height - 12);

    const qrX = (exportSize - size) / 2;
    ctx.drawImage(canvasRef.current, qrX, 20);

    ctx.fillStyle = "#2A2A2A";
    ctx.font = "14px serif";
    ctx.textAlign = "center";
    ctx.fillText(guestName, exportSize / 2, size + 40);

    ctx.fillStyle = "#9A9A9A";
    ctx.font = "9px sans-serif";
    ctx.fillText(rsvpId, exportSize / 2, size + 56);

    const link = document.createElement("a");
    link.download = `wedding-pass-${rsvpId}.png`;
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="p-3 bg-white border border-border inline-block">
        <canvas ref={canvasRef} />
      </div>

      <button
        onClick={handleDownload}
        className="text-xs tracking-wider text-accent hover:text-accent-dark transition-colors duration-300 font-body flex items-center gap-1.5"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        {t.saveQRCode}
      </button>
    </div>
  );
}
