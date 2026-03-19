import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import crypto from "crypto";

/* ─── Module-scope config (read once at cold start) ────── */

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL ?? "";
const QR_SECRET = process.env.QR_SECRET || "wedding-default-secret-change-me";
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : []; // empty = allow all (dev-friendly default)

// Upstash Redis — optional, gracefully degrades if not configured
let redis: Redis | null = null;
if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
  redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
}

/* ─── Types ───────────────────────────────────────────────── */

interface RSVPRecord {
  id: string;
  fullName: string;
  attendance: string;
  companion: string;
  plusOneName: string;
  songSuggestion: string;
  timestamp: string;
  emailSent: boolean;
  signature: string;
}

interface EmailData {
  fullName: string;
  attendance: string;
  companion: string;
  plusOneName: string;
  songSuggestion: string;
  rsvpId: string;
  timestamp: string;
}

/* ─── GET /api/rsvp — Retrieve all RSVPs (admin) ─────────── */

export async function GET(request: NextRequest) {
  // Simple admin key check
  const adminKey = request.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_KEY || !process.env.ADMIN_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!redis) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }

  try {
    const keys = await redis.keys("rsvp:*");
    const rsvps: RSVPRecord[] = [];
    for (const key of keys) {
      const data = await redis.get<RSVPRecord>(key);
      if (data) rsvps.push(data);
    }
    // Sort newest first
    rsvps.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const stats = {
      total: rsvps.length,
      attending: rsvps.filter((r) => r.attendance === "yes").length,
      declined: rsvps.filter((r) => r.attendance === "no").length,
      companions: rsvps.filter((r) => r.companion === "yes").length,
      totalGuests: rsvps.filter((r) => r.attendance === "yes").length +
        rsvps.filter((r) => r.attendance === "yes" && r.companion === "yes").length,
    };

    return NextResponse.json({ stats, rsvps });
  } catch (error) {
    console.error("Failed to fetch RSVPs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/* ─── POST /api/rsvp — Submit RSVP ──────────────────────── */

export async function POST(request: NextRequest) {
  try {
    // ── Origin validation ─────────────────────────────────
    if (ALLOWED_ORIGINS.length > 0) {
      const origin = request.headers.get("origin") ?? "";
      if (!ALLOWED_ORIGINS.some((o) => origin.startsWith(o))) {
        return NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const { fullName, attendance, companion, plusOneName, songSuggestion } = body;

    if (!fullName || !attendance) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ── Input validation ──────────────────────────────────
    const cleanName = sanitize(String(fullName).trim()).slice(0, 100);
    const cleanAttendance = attendance === "yes" ? "yes" : "no";
    // Companion only matters when attending
    const cleanCompanion = cleanAttendance === "yes" && companion === "yes" ? "yes" : "no";
    const cleanPlusOneName = cleanCompanion === "yes" && plusOneName
      ? sanitize(String(plusOneName).trim()).slice(0, 100)
      : "";
    const cleanSong = songSuggestion
      ? sanitize(String(songSuggestion).trim()).slice(0, 200)
      : "";

    if (!cleanName) {
      return NextResponse.json(
        { error: "Invalid name" },
        { status: 400 }
      );
    }

    // ── Plus-one name must differ from guest name ─────────
    if (cleanPlusOneName && cleanPlusOneName.toLowerCase().replace(/\s+/g, "") === cleanName.toLowerCase().replace(/\s+/g, "")) {
      return NextResponse.json(
        { error: "Companion name must differ from your name" },
        { status: 400 }
      );
    }

    // ── Duplicate check (by normalized name) ──────────────
    const nameKey = `rsvp-name:${cleanName.toLowerCase().replace(/\s+/g, "-")}`;
    if (redis) {
      const existing = await redis.get<string>(nameKey);
      if (existing) {
        return NextResponse.json(
          {
            error: "duplicate",
            message: "An RSVP with this name already exists",
            existingId: existing,
          },
          { status: 409 }
        );
      }
    }

    // ── Generate cryptographically secure RSVP ID ─────────
    const rsvpId = generateSecureRSVPId();
    const timestamp = new Date().toISOString();

    // ── Sign the QR payload with HMAC-SHA256 (only for attending) ──
    let qrPayload: string | null = null;
    let signature = "";

    if (cleanAttendance === "yes") {
      const qrData = {
        id: rsvpId,
        guest: cleanName,
        attendance: cleanAttendance,
        companion: cleanCompanion,
        plusOne: cleanPlusOneName || undefined,
        event: "Wasim & Rayan Wedding",
        date: "17-05-2026",
        issued: timestamp,
      };
      signature = signPayload(qrData);
      qrPayload = JSON.stringify({ ...qrData, sig: signature });
    }

    // ── Persist to Redis ──────────────────────────────────
    const record: RSVPRecord = {
      id: rsvpId,
      fullName: cleanName,
      attendance: cleanAttendance,
      companion: cleanCompanion,
      plusOneName: cleanPlusOneName,
      songSuggestion: cleanSong,
      timestamp,
      emailSent: false,
      signature,
    };

    if (redis) {
      await redis.set(`rsvp:${rsvpId}`, record);
      await redis.set(nameKey, rsvpId); // duplicate-check index
    } else {
      console.warn("Redis not configured — RSVP not persisted:", record);
    }

    // ── Send email notification ───────────────────────────
    const emailSent = await sendEmailNotification({
      fullName: cleanName,
      attendance: cleanAttendance,
      companion: cleanCompanion,
      plusOneName: cleanPlusOneName,
      songSuggestion: cleanSong,
      rsvpId,
      timestamp,
    });

    // Update email status in DB
    if (redis && emailSent) {
      await redis.set(`rsvp:${rsvpId}`, { ...record, emailSent: true });
    }

    return NextResponse.json({
      success: true,
      rsvpId,
      qrPayload,
      emailSent,
      timestamp,
    });
  } catch (error) {
    console.error("RSVP API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/* ─── Helpers ─────────────────────────────────────────────── */

/** Escape HTML entities to prevent XSS in email templates */
function sanitize(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/** Cryptographically secure RSVP ID using crypto.randomBytes */
function generateSecureRSVPId(): string {
  const bytes = crypto.randomBytes(9); // 9 bytes = 12 base32 chars
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const result: string[] = [];
  for (let i = 0; i < bytes.length; i++) {
    result.push(chars[bytes[i] % chars.length]);
    if ((i + 1) % 3 === 0 && i < bytes.length - 1) result.push("-");
  }
  return result.join(""); // e.g. "K7H-N4P-XR2"
}

/** HMAC-SHA256 signature for QR payload verification */
function signPayload(data: object): string {
  return crypto
    .createHmac("sha256", QR_SECRET)
    .update(JSON.stringify(data))
    .digest("hex")
    .slice(0, 16); // first 16 hex chars (64-bit security, sufficient for wedding)
}

async function sendEmailNotification(data: EmailData): Promise<boolean> {
  if (!RESEND_API_KEY || !NOTIFICATION_EMAIL) {
    console.warn(
      "Email not configured. Set RESEND_API_KEY and NOTIFICATION_EMAIL in .env.local"
    );
    return false;
  }

  const recipients = NOTIFICATION_EMAIL.split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    console.warn("Email not configured. NOTIFICATION_EMAIL has no valid recipients");
    return false;
  }

  const attendanceText =
    data.attendance === "yes" ? "✅ Will Attend" : "❌ Will Not Attend";
  const companionText =
    data.companion === "yes"
      ? data.plusOneName
        ? `Yes — ${data.plusOneName}`
        : "Yes (1 companion)"
      : "No companion";

  const extraRows = [
    data.plusOneName
      ? `<tr><td style="padding: 8px 0; color: #8B7536;">Companion</td><td style="padding: 8px 0;">${companionText}</td></tr>`
      : data.attendance === "yes"
        ? `<tr><td style="padding: 8px 0; color: #8B7536;">Companion</td><td style="padding: 8px 0;">${companionText}</td></tr>`
        : "",
    data.songSuggestion
      ? `<tr><td style="padding: 8px 0; color: #8B7536;">Song</td><td style="padding: 8px 0;">🎵 ${data.songSuggestion}</td></tr>`
      : "",
  ].filter(Boolean).join("\n");

  // data.fullName is already sanitized — safe for HTML embedding
  const emailHTML = `
    <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; background: #FAF0E6; border: 1px solid #D4AF37;">
      <div style="text-align: center; border-bottom: 1px solid #D4AF37; padding-bottom: 20px; margin-bottom: 20px;">
        <h1 style="color: #3E2723; font-size: 24px; margin: 0;">New RSVP Received</h1>
        <p style="color: #8B7536; font-size: 12px; letter-spacing: 3px; margin-top: 8px;">WASIM & RAYAN WEDDING</p>
      </div>
      
      <table style="width: 100%; font-size: 16px; color: #3E2723;">
        <tr>
          <td style="padding: 8px 0; color: #8B7536; width: 130px;">Guest Name</td>
          <td style="padding: 8px 0; font-weight: bold;">${data.fullName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #8B7536;">Attendance</td>
          <td style="padding: 8px 0;">${attendanceText}</td>
        </tr>
        ${extraRows}
        <tr>
          <td style="padding: 8px 0; color: #8B7536;">RSVP ID</td>
          <td style="padding: 8px 0; font-family: monospace; font-size: 14px;">${data.rsvpId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #8B7536;">Received</td>
          <td style="padding: 8px 0; font-size: 14px;">${new Date(data.timestamp).toLocaleString("en-US", { dateStyle: "full", timeStyle: "short" })}</td>
        </tr>
      </table>
      
      <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #D4AF37;">
        <p style="color: #8B7536; font-size: 12px; margin: 0;">${
          data.attendance === "yes"
            ? "This guest has been issued a unique QR code for entry."
            : "This guest has declined the invitation."
        }</p>
      </div>
    </div>
  `;

  let successCount = 0;

  for (const recipient of recipients) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Wedding RSVP <onboarding@resend.dev>",
          to: recipient,
          subject: `💍 New RSVP: ${data.fullName} — ${attendanceText}`,
          html: emailHTML,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`Resend API error for ${recipient}:`, errorData);
        continue;
      }

      successCount += 1;
    } catch (error) {
      console.error(`Email send failed for ${recipient}:`, error);
    }
  }

  return successCount > 0;
}
