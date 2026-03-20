#!/usr/bin/env npx tsx
/**
 * Database Cleanup Script
 *
 * Connects to Upstash Redis and:
 * 1. Removes duplicate entries (keeps latest per normalized name)
 * 2. Normalizes names (trim, collapse spaces, title-case)
 * 3. Removes invalid entries (missing name, missing attendance)
 * 4. Rebuilds the name-index (rsvp-name:*) for consistency
 *
 * Usage:
 *   KV_REST_API_URL=... KV_REST_API_TOKEN=... npx tsx scripts/clean-db.ts
 *
 * Add --dry-run to preview without making changes:
 *   KV_REST_API_URL=... KV_REST_API_TOKEN=... npx tsx scripts/clean-db.ts --dry-run
 */

import { Redis } from "@upstash/redis";

const DRY_RUN = process.argv.includes("--dry-run");

const url = process.env.KV_REST_API_URL;
const token = process.env.KV_REST_API_TOKEN;

if (!url || !token) {
  console.error("❌ Set KV_REST_API_URL and KV_REST_API_TOKEN environment variables.");
  process.exit(1);
}

const redis = new Redis({ url, token });

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

function normalizeName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, " ") // collapse whitespace
    .replace(/\b\w/g, (c) => c.toUpperCase()); // title-case (safe for Latin)
}

function nameKey(name: string): string {
  return `rsvp-name:${name.toLowerCase().replace(/\s+/g, "-")}`;
}

async function main() {
  console.log(`\n🧹 Database Cleanup ${DRY_RUN ? "(DRY RUN)" : ""}\n${"─".repeat(45)}`);

  // ── Load all rsvp:* records ──
  const keys = await redis.keys("rsvp:*");
  console.log(`Found ${keys.length} RSVP records.`);

  const records: RSVPRecord[] = [];
  const invalidKeys: string[] = [];

  for (const key of keys) {
    const data = await redis.get<RSVPRecord>(key);
    if (!data || !data.fullName || !data.attendance || !data.id) {
      invalidKeys.push(key);
    } else {
      records.push(data);
    }
  }

  // ── 1. Remove invalid entries ──
  console.log(`\n⚠️  Invalid entries: ${invalidKeys.length}`);
  for (const key of invalidKeys) {
    console.log(`  🗑  ${key}`);
    if (!DRY_RUN) await redis.del(key);
  }

  // ── 2. Detect duplicates (group by normalized name, keep latest) ──
  const byName = new Map<string, RSVPRecord[]>();
  for (const r of records) {
    const normalized = normalizeName(r.fullName).toLowerCase().replace(/\s+/g, "-");
    const group = byName.get(normalized) || [];
    group.push(r);
    byName.set(normalized, group);
  }

  let duplicatesRemoved = 0;
  let namesNormalized = 0;
  const kept: RSVPRecord[] = [];

  for (const [, group] of byName.entries()) {
    // Sort by timestamp descending — keep the newest
    group.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const keeper = group[0];

    // Normalize the name on the kept record
    const cleanName = normalizeName(keeper.fullName);
    if (cleanName !== keeper.fullName) {
      console.log(`  ✏️  Normalize: "${keeper.fullName}" → "${cleanName}"`);
      namesNormalized++;
      if (!DRY_RUN) {
        keeper.fullName = cleanName;
        await redis.set(`rsvp:${keeper.id}`, keeper);
      }
    }

    kept.push(keeper);

    // Remove older duplicates
    for (let i = 1; i < group.length; i++) {
      const dup = group[i];
      console.log(`  🗑  Duplicate: "${dup.fullName}" (${dup.id}, ${dup.timestamp})`);
      duplicatesRemoved++;
      if (!DRY_RUN) {
        await redis.del(`rsvp:${dup.id}`);
      }
    }
  }

  // ── 3. Rebuild name-index for consistency ──
  console.log("\n🔄 Rebuilding name index...");

  // Delete all existing name keys first
  const nameKeys = await redis.keys("rsvp-name:*");
  console.log(`  Clearing ${nameKeys.length} old name-index entries.`);
  if (!DRY_RUN) {
    for (const nk of nameKeys) {
      await redis.del(nk);
    }
  }

  // Re-create from kept records
  for (const r of kept) {
    const nk = nameKey(r.fullName);
    if (!DRY_RUN) {
      await redis.set(nk, r.id);
    }
  }
  console.log(`  Created ${kept.length} name-index entries.`);

  // ── Summary ──
  console.log(`\n${"─".repeat(45)}`);
  console.log(`📊 Summary:`);
  console.log(`   Invalid removed:    ${invalidKeys.length}`);
  console.log(`   Duplicates removed: ${duplicatesRemoved}`);
  console.log(`   Names normalized:   ${namesNormalized}`);
  console.log(`   Clean records:      ${kept.length}`);
  console.log(`   Attending:          ${kept.filter((r) => r.attendance === "yes").length}`);
  console.log(`   Declined:           ${kept.filter((r) => r.attendance === "no").length}`);
  console.log(`   With companion:     ${kept.filter((r) => r.companion === "yes").length}`);
  if (DRY_RUN) console.log(`\n⚠️  DRY RUN — no changes made. Remove --dry-run to apply.`);
  console.log("");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
