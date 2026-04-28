import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { detectGender, Gender } from "@/lib/gender-detect";

const GUEST_VIEW_KEY = process.env.GUEST_VIEW_KEY || "royal-guests-2026";

let redis: Redis | null = null;
if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
  redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
}

interface Companion {
  name: string;
  gender: Gender;
}

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
  gender?: Gender;
  plusOneGender?: Gender;
  companions?: Companion[];
  manuallyAdded?: boolean;
}

function generateId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const seg = () => Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `${seg()}-${seg()}-${seg()}`;
}

/** Normalize old single-companion records into companions array */
function getCompanions(r: RSVPRecord): Companion[] {
  if (r.companions && r.companions.length > 0) return r.companions;
  if (r.companion === "yes" && r.plusOneName) {
    return [{ name: r.plusOneName, gender: r.plusOneGender || detectGender(r.plusOneName) }];
  }
  if (r.companion === "yes") {
    return [{ name: "Unnamed", gender: "unknown" }];
  }
  return [];
}

function auth(request: NextRequest) {
  return request.nextUrl.searchParams.get("key") === GUEST_VIEW_KEY;
}

/* ─── GET — Fetch all guests ─────────────────────────── */

export async function GET(request: NextRequest) {
  if (!auth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!redis) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  try {
    const keys = await redis.keys("rsvp:*");
    const rsvps: RSVPRecord[] = [];
    for (const k of keys) {
      const data = await redis.get<RSVPRecord>(k);
      if (data) rsvps.push(data);
    }

    rsvps.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const attending = rsvps.filter((r) => r.attendance === "yes");
    const declined = rsvps.filter((r) => r.attendance === "no");

    const genderStats = { men: 0, women: 0, unknown: 0 };
    let totalCompanions = 0;

    for (const r of attending) {
      const g = r.gender || detectGender(r.fullName);
      if (g === "male") genderStats.men++;
      else if (g === "female") genderStats.women++;
      else genderStats.unknown++;

      const comps = getCompanions(r);
      totalCompanions += comps.length;
      for (const c of comps) {
        const cg = c.gender || detectGender(c.name);
        if (cg === "male") genderStats.men++;
        else if (cg === "female") genderStats.women++;
        else genderStats.unknown++;
      }
    }

    return NextResponse.json({
      stats: {
        total: rsvps.length,
        attending: attending.length,
        declined: declined.length,
        companions: totalCompanions,
        totalHeadcount: attending.length + totalCompanions,
        men: genderStats.men,
        women: genderStats.women,
        unknownGender: genderStats.unknown,
      },
      rsvps: rsvps.map((r) => {
        const comps = getCompanions(r);
        return {
          id: r.id,
          fullName: r.fullName,
          attendance: r.attendance,
          songSuggestion: r.songSuggestion,
          timestamp: r.timestamp,
          gender: r.gender || detectGender(r.fullName),
          companions: comps.map((c) => ({
            name: c.name,
            gender: c.gender || detectGender(c.name),
          })),
          manuallyAdded: r.manuallyAdded || false,
        };
      }),
    });
  } catch (error) {
    console.error("Failed to fetch guests:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/* ─── POST — Manually add a guest ────────────────────── */

export async function POST(request: NextRequest) {
  if (!auth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!redis) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  try {
    const body = await request.json();
    const { fullName, gender, companions } = body;

    if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const id = generateId();
    const comps: Companion[] = Array.isArray(companions)
      ? companions
          .filter((c: { name?: string }) => c.name && typeof c.name === "string" && c.name.trim())
          .map((c: { name: string; gender?: string }) => ({
            name: c.name.trim(),
            gender: (["male", "female"].includes(c.gender || "") ? c.gender : detectGender(c.name.trim())) as Gender,
          }))
      : [];

    const record: RSVPRecord = {
      id,
      fullName: fullName.trim(),
      attendance: "yes",
      companion: comps.length > 0 ? "yes" : "no",
      plusOneName: comps[0]?.name || "",
      songSuggestion: "",
      timestamp: new Date().toISOString(),
      emailSent: false,
      signature: "",
      gender: (["male", "female"].includes(gender) ? gender : detectGender(fullName.trim())) as Gender,
      plusOneGender: comps[0]?.gender,
      companions: comps,
      manuallyAdded: true,
    };

    await redis.set(`rsvp:${id}`, record);
    return NextResponse.json({ success: true, rsvpId: id });
  } catch (error) {
    console.error("Failed to add guest:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/* ─── PATCH — Edit guest record ──────────────────────── */

export async function PATCH(request: NextRequest) {
  if (!auth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!redis) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  try {
    const body = await request.json();
    const { rsvpId } = body;

    if (!rsvpId) return NextResponse.json({ error: "Missing rsvpId" }, { status: 400 });

    const record = await redis.get<RSVPRecord>(`rsvp:${rsvpId}`);
    if (!record) return NextResponse.json({ error: "RSVP not found" }, { status: 404 });

    const { fullName, gender, companions } = body;
    const updated = { ...record };

    if (fullName && typeof fullName === "string" && fullName.trim()) {
      updated.fullName = fullName.trim();
    }
    if (gender && ["male", "female"].includes(gender)) {
      updated.gender = gender;
    }

    if (Array.isArray(companions)) {
      const comps: Companion[] = companions
        .filter((c: { name?: string }) => c.name && typeof c.name === "string" && c.name.trim())
        .map((c: { name: string; gender?: string }) => ({
          name: c.name.trim(),
          gender: (["male", "female"].includes(c.gender || "") ? c.gender : detectGender(c.name.trim())) as Gender,
        }));
      updated.companions = comps;
      updated.companion = comps.length > 0 ? "yes" : "no";
      updated.plusOneName = comps[0]?.name || "";
      updated.plusOneGender = comps[0]?.gender;
    }

    await redis.set(`rsvp:${rsvpId}`, updated);
    return NextResponse.json({ success: true, rsvpId });
  } catch (error) {
    console.error("Failed to update guest:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/* ─── DELETE — Delete a guest entirely ───────────────── */

export async function DELETE(request: NextRequest) {
  if (!auth(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!redis) return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  try {
    const body = await request.json();
    const { rsvpId } = body;

    if (!rsvpId) return NextResponse.json({ error: "Missing rsvpId" }, { status: 400 });

    const deleted = await redis.del(`rsvp:${rsvpId}`);
    return NextResponse.json({ success: true, rsvpId, deleted });
  } catch (error) {
    console.error("Failed to delete:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
