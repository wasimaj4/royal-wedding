import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import crypto from "crypto";

/* ─── Module-scope config (read once at cold start) ────── */

const BREVO_API_KEY = process.env.BREVO_API_KEY ?? "";
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL ?? "";
const SENDER_EMAIL = process.env.SENDER_EMAIL ?? "waseemaj4@gmail.com";
const QR_SECRET = process.env.QR_SECRET || "wedding-default-secret-change-me";
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["https://wasimandrayan.eu"]; // locked to production domain
const GUEST_VIEW_KEY = process.env.GUEST_VIEW_KEY || "royal-guests-2026";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wasimandrayan.eu";

// Rate-limit: max POST requests per IP within window
const RATE_LIMIT_MAX = 5;       // max 5 RSVP attempts
const RATE_LIMIT_WINDOW = 3600; // per hour (seconds)

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
  // Admin key check
  const adminKey = request.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_KEY || !process.env.ADMIN_KEY) {
    // Intentional delay to slow brute-force attempts
    await new Promise((r) => setTimeout(r, 1000));
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Optional: IP allowlist for admin endpoint
  const adminIPs = process.env.ADMIN_ALLOWED_IPS
    ? process.env.ADMIN_ALLOWED_IPS.split(",").map((ip) => ip.trim())
    : []; // empty = no IP restriction
  if (adminIPs.length > 0) {
    const clientIP = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
    if (!adminIPs.includes(clientIP)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
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

    // ── Rate limiting (per IP, via Redis) ─────────────────
    const clientIP = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (redis) {
      const rateLimitKey = `ratelimit:${clientIP}`;
      const currentCount = await redis.incr(rateLimitKey);
      if (currentCount === 1) {
        await redis.expire(rateLimitKey, RATE_LIMIT_WINDOW);
      }
      if (currentCount > RATE_LIMIT_MAX) {
        return NextResponse.json(
          { error: "Too many requests. Please try again later." },
          { status: 429 }
        );
      }
    }

    const body = await request.json();
    const { fullName, attendance, companion, plusOneName, songSuggestion, admin } = body;
    const isAdmin = admin === true;

    // ── Honeypot check — reject if hidden field is filled ──
    if (body._website || body._email_confirm) {
      // Bot detected — return fake success to not reveal detection
      return NextResponse.json({
        success: true,
        rsvpId: "BOT-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
        emailSent: true,
      });
    }

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

    // ── Duplicate check (by normalized name) — skipped for admin ──
    const nameKey = `rsvp-name:${cleanName.toLowerCase().replace(/\s+/g, "-")}`;
    if (redis && !isAdmin) {
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

/** Sanitize input: strip dangerous patterns + escape HTML entities */
function sanitize(str: string): string {
  return str
    // Strip script tags and event handlers
    .replace(/<script[^>]*>.*?<\/script>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    // Strip HTML tags entirely
    .replace(/<[^>]*>/g, "")
    // Remove null bytes & zero-width characters
    .replace(/[\x00\u200B\u200C\u200D\uFEFF]/g, "")
    // Escape remaining HTML entities
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

/* ─── Cumulative Stats Helper ─────────────────────────────── */

interface CumulativeStats {
  totalRSVPs: number;
  attending: number;
  declined: number;
  companions: number;
  totalHeadcount: number;
  recentSongs: string[];
  companionNames: string[];
}

async function getCumulativeStats(): Promise<CumulativeStats> {
  const empty: CumulativeStats = {
    totalRSVPs: 0, attending: 0, declined: 0, companions: 0,
    totalHeadcount: 0, recentSongs: [], companionNames: [],
  };

  if (!redis) return empty;

  try {
    const keys = await redis.keys("rsvp:*");
    const rsvps: RSVPRecord[] = [];
    for (const key of keys) {
      const rec = await redis.get<RSVPRecord>(key);
      if (rec) rsvps.push(rec);
    }

    const attending = rsvps.filter((r) => r.attendance === "yes");
    const declined = rsvps.filter((r) => r.attendance === "no");
    const withCompanion = attending.filter((r) => r.companion === "yes");
    const songs = rsvps
      .filter((r) => r.songSuggestion)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5)
      .map((r) => r.songSuggestion);
    const companionNames = withCompanion
      .filter((r) => r.plusOneName)
      .map((r) => r.plusOneName);

    return {
      totalRSVPs: rsvps.length,
      attending: attending.length,
      declined: declined.length,
      companions: withCompanion.length,
      totalHeadcount: attending.length + withCompanion.length,
      recentSongs: songs,
      companionNames,
    };
  } catch (err) {
    console.error("Failed to fetch cumulative stats:", err);
    return empty;
  }
}

/* ─── Email Notification ──────────────────────────────────── */

async function sendEmailNotification(data: EmailData): Promise<boolean> {
  if (!BREVO_API_KEY || !NOTIFICATION_EMAIL) {
    console.warn(
      "Email not configured. Set BREVO_API_KEY and NOTIFICATION_EMAIL in .env.local"
    );
    return false;
  }

  const recipients = NOTIFICATION_EMAIL.split(",")
    .map((email) => email.trim().replace(/\\n/g, "").replace(/\n/g, ""))
    .filter(Boolean);

  if (recipients.length === 0) {
    console.warn("Email not configured. NOTIFICATION_EMAIL has no valid recipients");
    return false;
  }

  // ── Fetch cumulative stats ────────────────────────────
  const stats = await getCumulativeStats();

  // ── Wedding countdown ─────────────────────────────────
  const weddingDate = new Date("2026-05-17T00:00:00+02:00");
  const now = new Date();
  const daysLeft = Math.max(0, Math.ceil((weddingDate.getTime() - now.getTime()) / 86400000));

  const attendanceText =
    data.attendance === "yes" ? "✅ Will Attend" : "❌ Will Not Attend";
  const companionText =
    data.companion === "yes"
      ? data.plusOneName
        ? `Yes — ${data.plusOneName}`
        : "Yes (1 companion)"
      : "No companion";

  // ── Capacity warning (set your venue limit here) ──────
  const VENUE_CAPACITY = 150;
  const capacityPct = Math.round((stats.totalHeadcount / VENUE_CAPACITY) * 100);
  const capacityColor = capacityPct >= 90 ? "#D32F2F" : capacityPct >= 70 ? "#F57C00" : "#4CAF50";
  const capacityWarning = capacityPct >= 90
    ? `⚠️ <span style="color: #D32F2F; font-weight: bold;">ALERT: ${capacityPct}% venue capacity reached!</span>`
    : capacityPct >= 70
      ? `⚡ <span style="color: #F57C00;">Heads up: ${capacityPct}% capacity</span>`
      : "";

  // ── Guest detail rows ─────────────────────────────────
  const guestRows = [
    `<tr>
      <td style="padding: 10px 12px; color: #8B7536; width: 130px; vertical-align: top;">Guest Name</td>
      <td style="padding: 10px 12px; font-weight: bold;">${data.fullName}</td>
    </tr>`,
    `<tr>
      <td style="padding: 10px 12px; color: #8B7536;">Attendance</td>
      <td style="padding: 10px 12px;">${attendanceText}</td>
    </tr>`,
    data.attendance === "yes"
      ? `<tr>
          <td style="padding: 10px 12px; color: #8B7536;">Companion</td>
          <td style="padding: 10px 12px;">${companionText}</td>
        </tr>`
      : "",
    data.songSuggestion
      ? `<tr>
          <td style="padding: 10px 12px; color: #8B7536;">Song Request</td>
          <td style="padding: 10px 12px;">🎵 ${data.songSuggestion}</td>
        </tr>`
      : "",
    `<tr>
      <td style="padding: 10px 12px; color: #8B7536;">RSVP ID</td>
      <td style="padding: 10px 12px; font-family: monospace; font-size: 13px;">${data.rsvpId}</td>
    </tr>`,
    `<tr>
      <td style="padding: 10px 12px; color: #8B7536;">Time</td>
      <td style="padding: 10px 12px; font-size: 13px;">${new Date(data.timestamp).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</td>
    </tr>`,
  ].filter(Boolean).join("\n");

  // ── Song playlist section ─────────────────────────────
  const songSection = stats.recentSongs.length > 0
    ? `<div style="margin-top: 16px; padding: 12px 16px; background: #FFF8E7; border-radius: 8px; border-left: 3px solid #D4AF37;">
        <p style="margin: 0 0 6px; font-size: 13px; color: #8B7536; font-weight: bold;">🎶 Latest Song Requests</p>
        ${stats.recentSongs.map((s) => `<p style="margin: 2px 0; font-size: 13px; color: #3E2723;">• ${s}</p>`).join("")}
      </div>`
    : "";

  // ── Build full HTML ───────────────────────────────────
  const emailHTML = `
    <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; background: #FAF0E6; border: 1px solid #D4AF37; border-radius: 4px; overflow: hidden;">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #3E2723 0%, #5D4037 100%); padding: 24px 20px; text-align: center;">
        <h1 style="color: #D4AF37; font-size: 22px; margin: 0; letter-spacing: 1px;">New RSVP Received</h1>
        <p style="color: #C4A86C; font-size: 11px; letter-spacing: 3px; margin: 6px 0 0;">WASIM & RAYAN WEDDING</p>
        <p style="color: #FFD54F; font-size: 13px; margin: 8px 0 0;">📅 ${daysLeft} days to go</p>
      </div>
      
      <!-- Guest Details -->
      <div style="padding: 20px;">
        <table style="width: 100%; font-size: 15px; color: #3E2723; border-collapse: collapse;">
          ${guestRows}
        </table>
        
        <div style="text-align: center; margin: 16px 0 0; padding: 10px; background: ${data.attendance === "yes" ? "#E8F5E9" : "#FFEBEE"}; border-radius: 6px;">
          <p style="margin: 0; font-size: 12px; color: ${data.attendance === "yes" ? "#2E7D32" : "#C62828"};">${
            data.attendance === "yes"
              ? "✓ QR code issued for entry verification"
              : "✗ Guest has declined the invitation"
          }</p>
        </div>
      </div>

      <!-- Divider -->
      <div style="height: 1px; background: linear-gradient(90deg, transparent, #D4AF37, transparent); margin: 0 20px;"></div>
      
      <!-- Cumulative Dashboard -->
      <div style="padding: 20px;">
        <p style="margin: 0 0 14px; font-size: 14px; color: #8B7536; font-weight: bold; letter-spacing: 1px; text-transform: uppercase;">📊 Live Dashboard</p>
        
        <!-- Stats Grid -->
        <table style="width: 100%; border-collapse: collapse; text-align: center;">
          <tr>
            <td style="padding: 12px 4px; width: 25%;">
              <div style="background: #FFF8E7; border-radius: 8px; padding: 12px 6px; border: 1px solid #E8D5A3;">
                <div style="font-size: 28px; font-weight: bold; color: #3E2723;">${stats.totalRSVPs}</div>
                <div style="font-size: 10px; color: #8B7536; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px;">Total RSVPs</div>
              </div>
            </td>
            <td style="padding: 12px 4px; width: 25%;">
              <div style="background: #E8F5E9; border-radius: 8px; padding: 12px 6px; border: 1px solid #A5D6A7;">
                <div style="font-size: 28px; font-weight: bold; color: #2E7D32;">${stats.attending}</div>
                <div style="font-size: 10px; color: #2E7D32; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px;">Attending</div>
              </div>
            </td>
            <td style="padding: 12px 4px; width: 25%;">
              <div style="background: #FFEBEE; border-radius: 8px; padding: 12px 6px; border: 1px solid #EF9A9A;">
                <div style="font-size: 28px; font-weight: bold; color: #C62828;">${stats.declined}</div>
                <div style="font-size: 10px; color: #C62828; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px;">Declined</div>
              </div>
            </td>
            <td style="padding: 12px 4px; width: 25%;">
              <div style="background: #E3F2FD; border-radius: 8px; padding: 12px 6px; border: 1px solid #90CAF9;">
                <div style="font-size: 28px; font-weight: bold; color: #1565C0;">${stats.companions}</div>
                <div style="font-size: 10px; color: #1565C0; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px;">+1 Guests</div>
              </div>
            </td>
          </tr>
        </table>

        <!-- Total Headcount Highlight -->
        <div style="margin-top: 14px; padding: 14px 16px; background: linear-gradient(135deg, #3E2723 0%, #5D4037 100%); border-radius: 8px; text-align: center;">
          <span style="color: #C4A86C; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Total Headcount</span>
          <div style="color: #FFD54F; font-size: 36px; font-weight: bold; margin: 4px 0;">${stats.totalHeadcount}</div>
          <span style="color: #A1887F; font-size: 12px;">${stats.attending} guests + ${stats.companions} companions</span>
        </div>

        <!-- Capacity Bar -->
        <div style="margin-top: 14px;">
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: #8B7536; margin-bottom: 4px;">
            <span>Venue Capacity</span>
            <span style="color: ${capacityColor}; font-weight: bold;">${stats.totalHeadcount} / ${VENUE_CAPACITY} (${capacityPct}%)</span>
          </div>
          <div style="background: #E8D5A3; border-radius: 10px; height: 10px; overflow: hidden;">
            <div style="background: ${capacityColor}; height: 100%; width: ${Math.min(capacityPct, 100)}%; border-radius: 10px; transition: width 0.3s;"></div>
          </div>
          ${capacityWarning ? `<p style="margin: 6px 0 0; font-size: 12px;">${capacityWarning}</p>` : ""}
        </div>

        ${songSection}
      </div>

      <!-- Divider -->
      <div style="height: 1px; background: linear-gradient(90deg, transparent, #D4AF37, transparent); margin: 0 20px;"></div>

      <!-- Organiser Quick Tips -->
      <div style="padding: 16px 20px; background: #F5F0E5;">
        <p style="margin: 0 0 8px; font-size: 13px; color: #8B7536; font-weight: bold;">💡 Organiser Notes</p>
        <table style="width: 100%; font-size: 12px; color: #5D4037; border-collapse: collapse;">
          <tr>
            <td style="padding: 3px 0;">📅 Wedding date:</td>
            <td style="padding: 3px 0; text-align: right; font-weight: bold;">17 May 2026 · ${daysLeft} days left</td>
          </tr>
          <tr>
            <td style="padding: 3px 0;">🪑 Seats to prepare:</td>
            <td style="padding: 3px 0; text-align: right; font-weight: bold;">${stats.totalHeadcount}</td>
          </tr>
          <tr>
            <td style="padding: 3px 0;">🍽️ Meals to order:</td>
            <td style="padding: 3px 0; text-align: right; font-weight: bold;">${stats.totalHeadcount}</td>
          </tr>
          <tr>
            <td style="padding: 3px 0;">👫 Companion ratio:</td>
            <td style="padding: 3px 0; text-align: right; font-weight: bold;">${stats.attending > 0 ? Math.round((stats.companions / stats.attending) * 100) : 0}% bringing +1</td>
          </tr>
          <tr>
            <td style="padding: 3px 0;">📩 Acceptance rate:</td>
            <td style="padding: 3px 0; text-align: right; font-weight: bold; color: ${stats.totalRSVPs > 0 ? (stats.attending / stats.totalRSVPs >= 0.7 ? "#2E7D32" : "#F57C00") : "#8B7536"};">${stats.totalRSVPs > 0 ? Math.round((stats.attending / stats.totalRSVPs) * 100) : 0}%</td>
          </tr>
        </table>
      </div>

      <!-- View Full Guest List Button -->
      <div style="padding: 16px 20px; text-align: center;">
        <a href="${SITE_URL}/guests?key=${encodeURIComponent(GUEST_VIEW_KEY)}" 
           style="display: inline-block; background: linear-gradient(135deg, #D4AF37 0%, #C4A86C 100%); color: #3E2723; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; font-size: 14px; letter-spacing: 0.5px; box-shadow: 0 2px 8px rgba(212,175,55,0.3);">
          📋 View Full Guest List
        </a>
        <p style="margin: 8px 0 0; font-size: 11px; color: #A1887F;">See all RSVPs, stats & song requests in real-time</p>
      </div>

      <!-- Divider -->
      <div style="height: 1px; background: linear-gradient(90deg, transparent, #D4AF37, transparent); margin: 0 20px;"></div>

      <!-- Footer -->
      <div style="padding: 16px 20px; text-align: center; background: #3E2723;">
        <p style="color: #A1887F; font-size: 11px; margin: 0;">Wasim & Rayan Wedding · 17 May 2026 · Vlaardingen</p>
      </div>
    </div>
  `;

  const subjectEmoji = data.attendance === "yes" ? "💍" : "📩";
  const subjectStats = `[${stats.totalHeadcount} guests]`;

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Wedding RSVP", email: SENDER_EMAIL },
        to: recipients.map((email) => ({ email })),
        subject: `${subjectEmoji} ${subjectStats} ${data.fullName} — ${attendanceText}`,
        htmlContent: emailHTML,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Brevo API error:", response.status, errorData);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Email send failed:", error);
    return false;
  }
}
