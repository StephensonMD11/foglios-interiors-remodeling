import { createHash } from "crypto";
import { put, get } from "@vercel/blob";

const STATS_PATH = "content/stats.json";
const VISITOR_RETENTION_DAYS = 35;

export type SiteStats = {
  inquiryCount: number;
  inquiryMonth: string;
  inquiriesThisMonth: number;
  /** YYYY-MM-DD → hashed visitor ids seen that day */
  dailyVisitors: Record<string, string[]>;
  updatedAt: string;
};

export type StatsSummary = {
  inquiryCount: number;
  inquiriesThisMonth: number;
  uniqueVisitorsToday: number;
  uniqueVisitorsThisMonth: number;
  trackingEnabled: boolean;
};

function hasBlobToken() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function emptyStats(): SiteStats {
  const month = monthKey(new Date());
  return {
    inquiryCount: 0,
    inquiryMonth: month,
    inquiriesThisMonth: 0,
    dailyVisitors: {},
    updatedAt: new Date().toISOString(),
  };
}

function monthKey(d: Date) {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function dayKey(d: Date) {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

function hashVisitor(ip: string) {
  const salt =
    process.env.SESSION_SECRET ||
    process.env.STATS_SALT ||
    "foglios-stats-fallback";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 16);
}

function normalizeStats(raw: Partial<SiteStats>): SiteStats {
  const base = emptyStats();
  return {
    inquiryCount: raw.inquiryCount ?? base.inquiryCount,
    inquiryMonth: raw.inquiryMonth ?? base.inquiryMonth,
    inquiriesThisMonth: raw.inquiriesThisMonth ?? base.inquiriesThisMonth,
    dailyVisitors: raw.dailyVisitors ?? base.dailyVisitors,
    updatedAt: raw.updatedAt ?? base.updatedAt,
  };
}

function pruneOldDays(stats: SiteStats, now = new Date()) {
  const cutoff = new Date(now);
  cutoff.setUTCDate(cutoff.getUTCDate() - VISITOR_RETENTION_DAYS);
  const cutoffStr = dayKey(cutoff);
  for (const key of Object.keys(stats.dailyVisitors)) {
    if (key < cutoffStr) delete stats.dailyVisitors[key];
  }
}

async function streamToText(stream: ReadableStream<Uint8Array>) {
  return new Response(stream).text();
}

export async function readStats(): Promise<SiteStats> {
  if (!hasBlobToken()) return emptyStats();

  try {
    const result = await get(STATS_PATH, {
      access: "private",
      useCache: false,
    });
    if (!result || result.statusCode !== 200 || !result.stream) {
      const seed = emptyStats();
      await writeStats(seed);
      return seed;
    }
    const raw = await streamToText(result.stream);
    return normalizeStats(JSON.parse(raw) as Partial<SiteStats>);
  } catch {
    return emptyStats();
  }
}

export async function writeStats(stats: SiteStats): Promise<void> {
  if (!hasBlobToken()) return;

  await put(STATS_PATH, JSON.stringify(stats, null, 2), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function recordInquiry(): Promise<void> {
  if (!hasBlobToken()) return;

  const stats = await readStats();
  const month = monthKey(new Date());
  stats.inquiryCount += 1;
  if (stats.inquiryMonth !== month) {
    stats.inquiryMonth = month;
    stats.inquiriesThisMonth = 1;
  } else {
    stats.inquiriesThisMonth += 1;
  }
  stats.updatedAt = new Date().toISOString();
  await writeStats(stats);
}

export async function recordVisit(ip: string): Promise<void> {
  if (!hasBlobToken() || !ip || ip === "unknown") return;

  const stats = await readStats();
  const today = dayKey(new Date());
  const hash = hashVisitor(ip);
  const day = stats.dailyVisitors[today] ?? [];
  if (!day.includes(hash)) {
    stats.dailyVisitors[today] = [...day, hash];
  }
  pruneOldDays(stats);
  stats.updatedAt = new Date().toISOString();
  await writeStats(stats);
}

export function summarizeStats(stats: SiteStats): StatsSummary {
  const now = new Date();
  const today = dayKey(now);
  const month = monthKey(now);

  const monthHashes = new Set<string>();
  for (const [day, hashes] of Object.entries(stats.dailyVisitors)) {
    if (day.startsWith(month)) {
      for (const h of hashes) monthHashes.add(h);
    }
  }

  return {
    inquiryCount: stats.inquiryCount,
    inquiriesThisMonth:
      stats.inquiryMonth === month ? stats.inquiriesThisMonth : 0,
    uniqueVisitorsToday: stats.dailyVisitors[today]?.length ?? 0,
    uniqueVisitorsThisMonth: monthHashes.size,
    trackingEnabled: hasBlobToken(),
  };
}

export async function getStatsSummary(): Promise<StatsSummary> {
  return summarizeStats(await readStats());
}
