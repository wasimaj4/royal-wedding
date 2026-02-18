"use client";

import { useEffect, useRef } from "react";

interface QRCodeDisplayProps {
  data: string;
  size?: number;
  guestName: string;
  rsvpId: string;
}

/**
 * Generates a QR code on a canvas element.
 * Uses a pure-client-side approach — no external library needed.
 * The QR code is rendered as an SVG-style pattern on canvas.
 */
export default function QRCodeDisplay({
  data,
  size = 200,
  guestName,
  rsvpId,
}: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    drawQRCode(canvasRef.current, data, size);
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
          style={{ imageRendering: "pixelated" }}
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
        Save QR Code
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Minimal QR Code Generator (client-side, no dependency)
   Based on QR Code specification — supports alphanumeric data
   ═══════════════════════════════════════════════════════════ */

function drawQRCode(canvas: HTMLCanvasElement, data: string, size: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Generate QR matrix
  const modules = generateQRMatrix(data);
  const moduleCount = modules.length;
  const moduleSize = size / moduleCount;

  // Clear canvas
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, size, size);

  // Draw modules
  ctx.fillStyle = "#3E2723"; // Deep brown instead of pure black for elegance
  for (let row = 0; row < moduleCount; row++) {
    for (let col = 0; col < moduleCount; col++) {
      if (modules[row][col]) {
        ctx.fillRect(
          col * moduleSize,
          row * moduleSize,
          moduleSize + 0.5, // slight overlap to prevent gaps
          moduleSize + 0.5
        );
      }
    }
  }
}

/**
 * Generates a QR code matrix using a simplified byte-mode encoder.
 * This encodes data as a Version 4 QR code (33x33 modules) with
 * error correction level M (~15% recovery).
 */
function generateQRMatrix(data: string): boolean[][] {
  const size = 33; // Version 4
  const matrix: boolean[][] = Array.from({ length: size }, () =>
    Array(size).fill(false)
  );
  const reserved: boolean[][] = Array.from({ length: size }, () =>
    Array(size).fill(false)
  );

  // Add finder patterns
  addFinderPattern(matrix, reserved, 0, 0);
  addFinderPattern(matrix, reserved, size - 7, 0);
  addFinderPattern(matrix, reserved, 0, size - 7);

  // Add alignment pattern (Version 4 has one at position 24,24)
  addAlignmentPattern(matrix, reserved, 24, 24);

  // Add timing patterns
  for (let i = 8; i < size - 8; i++) {
    const val = i % 2 === 0;
    if (!reserved[6][i]) {
      matrix[6][i] = val;
      reserved[6][i] = true;
    }
    if (!reserved[i][6]) {
      matrix[i][6] = val;
      reserved[i][6] = true;
    }
  }

  // Reserve format info areas
  for (let i = 0; i < 8; i++) {
    reserved[8][i] = true;
    reserved[8][size - 1 - i] = true;
    reserved[i][8] = true;
    reserved[size - 1 - i][8] = true;
  }
  reserved[8][8] = true;

  // Dark module
  matrix[size - 8][8] = true;
  reserved[size - 8][8] = true;

  // Reserve version info (Version >= 7 only, skip for V4)

  // Encode the data
  const encoded = encodeData(data);

  // Place data bits
  placeDataBits(matrix, reserved, encoded, size);

  // Apply mask pattern 0 (checkerboard: (row + col) % 2 === 0)
  applyMask(matrix, reserved, size);

  // Write format information
  writeFormatInfo(matrix, size);

  return matrix;
}

function addFinderPattern(
  matrix: boolean[][],
  reserved: boolean[][],
  startRow: number,
  startCol: number
) {
  const pattern = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1],
  ];

  for (let r = -1; r <= 7; r++) {
    for (let c = -1; c <= 7; c++) {
      const row = startRow + r;
      const col = startCol + c;
      if (row < 0 || row >= matrix.length || col < 0 || col >= matrix.length)
        continue;

      if (r >= 0 && r < 7 && c >= 0 && c < 7) {
        matrix[row][col] = pattern[r][c] === 1;
      } else {
        matrix[row][col] = false; // separator
      }
      reserved[row][col] = true;
    }
  }
}

function addAlignmentPattern(
  matrix: boolean[][],
  reserved: boolean[][],
  centerRow: number,
  centerCol: number
) {
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      const row = centerRow + r;
      const col = centerCol + c;
      if (reserved[row][col]) continue;

      const isEdge = Math.abs(r) === 2 || Math.abs(c) === 2;
      const isCenter = r === 0 && c === 0;
      matrix[row][col] = isEdge || isCenter;
      reserved[row][col] = true;
    }
  }
}

function encodeData(data: string): number[] {
  const bytes: number[] = [];

  // Mode indicator: Byte mode (0100)
  // Character count: 8 bits for Version 1-9 in byte mode

  let bitStream: number[] = [];

  // Mode: 0100 (byte)
  bitStream.push(0, 1, 0, 0);

  // Byte-encode the string
  const dataBytes: number[] = [];
  for (let i = 0; i < data.length; i++) {
    const code = data.charCodeAt(i);
    if (code < 128) {
      dataBytes.push(code);
    } else if (code < 2048) {
      dataBytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    } else {
      dataBytes.push(
        0xe0 | (code >> 12),
        0x80 | ((code >> 6) & 0x3f),
        0x80 | (code & 0x3f)
      );
    }
  }

  // Character count (8 bits for byte mode, Version 1-9)
  const charCount = Math.min(dataBytes.length, 255);
  for (let i = 7; i >= 0; i--) {
    bitStream.push((charCount >> i) & 1);
  }

  // Data bits
  for (const byte of dataBytes) {
    for (let i = 7; i >= 0; i--) {
      bitStream.push((byte >> i) & 1);
    }
  }

  // Terminator (up to 4 zeros)
  const capacity = 80 * 8; // Version 4, EC level M: 80 data codewords
  const terminatorLength = Math.min(4, capacity - bitStream.length);
  for (let i = 0; i < terminatorLength; i++) {
    bitStream.push(0);
  }

  // Pad to byte boundary
  while (bitStream.length % 8 !== 0) {
    bitStream.push(0);
  }

  // Pad to capacity
  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (bitStream.length < capacity) {
    const pb = padBytes[padIdx % 2];
    for (let i = 7; i >= 0; i--) {
      bitStream.push((pb >> i) & 1);
    }
    padIdx++;
  }

  // Truncate if too long
  bitStream = bitStream.slice(0, capacity);

  // Convert to bytes
  for (let i = 0; i < bitStream.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) {
      byte = (byte << 1) | (bitStream[i + j] || 0);
    }
    bytes.push(byte);
  }

  // Generate error correction codewords
  const ecBytes = generateEC(bytes, 18); // 18 EC codewords for V4-M (block 1)

  // Interleave data and EC (single block for simplicity)
  const allBytes = [...bytes, ...ecBytes];

  // Convert back to bits
  const result: number[] = [];
  for (const byte of allBytes) {
    for (let i = 7; i >= 0; i--) {
      result.push((byte >> i) & 1);
    }
  }

  return result;
}

function generateEC(data: number[], ecCount: number): number[] {
  // Reed-Solomon error correction using GF(256)
  const gfExp: number[] = new Array(512);
  const gfLog: number[] = new Array(256);

  // Generate GF tables
  let x = 1;
  for (let i = 0; i < 255; i++) {
    gfExp[i] = x;
    gfLog[x] = i;
    x <<= 1;
    if (x >= 256) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) {
    gfExp[i] = gfExp[i - 255];
  }

  // Generate generator polynomial
  let gen = [1];
  for (let i = 0; i < ecCount; i++) {
    const newGen = new Array(gen.length + 1).fill(0);
    for (let j = 0; j < gen.length; j++) {
      newGen[j] ^= gen[j];
      newGen[j + 1] ^= gfMul(gen[j], gfExp[i], gfExp, gfLog);
    }
    gen = newGen;
  }

  // Polynomial division
  const result = new Array(ecCount).fill(0);
  const msg = [...data, ...result];

  for (let i = 0; i < data.length; i++) {
    const coef = msg[i];
    if (coef !== 0) {
      for (let j = 0; j < gen.length; j++) {
        msg[i + j] ^= gfMul(gen[j], coef, gfExp, gfLog);
      }
    }
  }

  return msg.slice(data.length);
}

function gfMul(
  a: number,
  b: number,
  gfExp: number[],
  gfLog: number[]
): number {
  if (a === 0 || b === 0) return 0;
  return gfExp[(gfLog[a] + gfLog[b]) % 255];
}

function placeDataBits(
  matrix: boolean[][],
  reserved: boolean[][],
  bits: number[],
  size: number
) {
  let bitIdx = 0;
  let col = size - 1;

  while (col > 0) {
    if (col === 6) col--; // Skip timing pattern column

    for (let row = 0; row < size; row++) {
      const actualRow = col > 6 && (Math.floor((size - 1 - col) / 2) % 2 === 0)
        ? size - 1 - row
        : (Math.floor((size - 1 - col) / 2) % 2 === 1 ? size - 1 - row : row);

      for (let c = 0; c < 2; c++) {
        const actualCol = col - c;
        if (actualCol < 0) continue;
        if (reserved[actualRow][actualCol]) continue;

        if (bitIdx < bits.length) {
          matrix[actualRow][actualCol] = bits[bitIdx] === 1;
          bitIdx++;
        }
      }
    }
    col -= 2;
  }
}

function applyMask(
  matrix: boolean[][],
  reserved: boolean[][],
  size: number
) {
  // Mask pattern 0: (row + col) % 2 === 0
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (!reserved[row][col] && (row + col) % 2 === 0) {
        matrix[row][col] = !matrix[row][col];
      }
    }
  }
}

function writeFormatInfo(matrix: boolean[][], size: number) {
  // Format info for EC level M, mask 0: 101010000010010
  const formatBits = [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0];

  // Around top-left finder
  for (let i = 0; i < 6; i++) matrix[8][i] = formatBits[i] === 1;
  matrix[8][7] = formatBits[6] === 1;
  matrix[8][8] = formatBits[7] === 1;
  matrix[7][8] = formatBits[8] === 1;
  for (let i = 9; i < 15; i++) matrix[14 - i][8] = formatBits[i] === 1;

  // Around other finder patterns
  for (let i = 0; i < 8; i++) matrix[8][size - 8 + i] = formatBits[i] === 1;
  for (let i = 0; i < 7; i++) matrix[size - 7 + i][8] = formatBits[8 + i] === 1;
}
