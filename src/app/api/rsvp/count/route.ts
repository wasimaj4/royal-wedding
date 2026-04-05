import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

let redis: Redis | null = null;
if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
  redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
}

interface RSVPRecord {
  attendance: string;
  companion: string;
}

export const revalidate = 30; // ISR: refresh every 30 seconds

export async function GET() {
  if (!redis) {
    return NextResponse.json({ attending: 0, totalGuests: 0 });
  }

  try {
    const keys = await redis.keys("rsvp:*");
    let attending = 0;
    let companions = 0;

    for (const key of keys) {
      const rec = await redis.get<RSVPRecord>(key);
      if (rec && rec.attendance === "yes") {
        attending++;
        if (rec.companion === "yes") companions++;
      }
    }

    return NextResponse.json(
      { attending, totalGuests: attending + companions },
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
