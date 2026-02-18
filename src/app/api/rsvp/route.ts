import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/rsvp
 * 
 * Receives RSVP form data, generates a unique guest ID,
 * sends an email notification to the couple, and returns
 * a QR code payload for the guest.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, attendance, companion } = body;

    if (!fullName || !attendance || !companion) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate a unique RSVP ID
    const rsvpId = generateRSVPId();
    const timestamp = new Date().toISOString();

    // QR code payload — this is what gets encoded into the QR
    const qrPayload = JSON.stringify({
      id: rsvpId,
      guest: fullName,
      attendance,
      companion,
      event: "Wasim & Rayan Wedding",
      date: "17-05-2026",
      issued: timestamp,
    });

    // Send email notification to the couple
    const emailSent = await sendEmailNotification({
      fullName,
      attendance,
      companion,
      rsvpId,
      timestamp,
    });

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

function generateRSVPId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const segments = [4, 4, 4];
  return segments
    .map((len) =>
      Array.from({ length: len }, () =>
        chars[Math.floor(Math.random() * chars.length)]
      ).join("")
    )
    .join("-");
}

interface EmailData {
  fullName: string;
  attendance: string;
  companion: string;
  rsvpId: string;
  timestamp: string;
}

async function sendEmailNotification(data: EmailData): Promise<boolean> {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL;

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
    data.companion === "yes" ? "Yes (1 companion)" : "No companion";

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
        <tr>
          <td style="padding: 8px 0; color: #8B7536;">Companion</td>
          <td style="padding: 8px 0;">${companionText}</td>
        </tr>
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
        <p style="color: #8B7536; font-size: 12px; margin: 0;">This guest has been issued a unique QR code for entry.</p>
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
