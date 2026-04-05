import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

let redis: Redis | null = null;
if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
  redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
}

interface Companion {
  name: string;
}

interface RSVPRecord {
  attendance: string;
  companion: string;
  plusOneName?: string;
  companions?: Companion[];
}

/** Count companions the same way as the guest list API */
function countCompanions(r: RSVPRecord): number {
  if (r.companions && r.companions.length > 0) return r.companions.length;
  if (r.companion === "yes") return 1;
  return 0;
}

export const revalidate = 30; // ISR: refresh every 30 seconds

export async function GET() {
  if (!redis) {
    return NextResponse.json({ attending: 0, totalGuests: 0 });
  }

  try {
    const keys = await redis.keys("rsvp:*");
    let attending = 0;
    let totalCompanions = 0;

    for (const key of keys) {
      const rec = await redis.get<RSVPRecord>(key);
      if (rec && rec.attendance === "yes") {
        attending++;
        totalCompanions += countCompanions(rec);
      }
    }

    return NextResponse.json(
      { attending, totalGuests: attending + totalCompanions },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (err) {
    console.error("Count API error:", err);
    return NextResponse.json({ attending: 0, totalGuests: 0 });
  }
}
