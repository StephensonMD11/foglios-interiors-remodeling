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

export type DayVisitorCount = {
  /** YYYY-MM-DD (UTC) */
  date: string;
  count: number;
};

export type WeekVisitorCount = {
  /** Monday of the week (UTC), YYYY-MM-DD */
  weekStart: string;
  label: string;
  count: number;
};

export type StatsSummary = {
  inquiryCount: number;
  inquiriesThisMonth: number;
  uniqueVisitorsToday: number;
  uniqueVisitorsThisMonth: number;
  /** Newest first — last ~14 calendar days with data retained */
  visitorsByDay: DayVisitorCount[];
  /** Newest first — unique visitors per ISO week */
  visitorsByWeek: WeekVisitorCount[];
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

function mondayOf(d: Date) {
  const copy = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
  const day = copy.getUTCDay(); // 0 Sun … 6 Sat
  const diff = day === 0 ? -6 : 1 - day;
  copy.setUTCDate(copy.getUTCDate() + diff);
  return copy;
}

function formatWeekLabel(weekStartIso: string) {
  const start = new Date(`${weekStartIso}T00:00:00.000Z`);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  return `${fmt(start)} – ${fmt(end)}`;
}

function formatDayLabel(dateIso: string) {
  return new Date(`${dateIso}T00:00:00.000Z`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
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

  // Last 14 calendar days (including today), newest first
  const visitorsByDay: DayVisitorCount[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - i);
    const key = dayKey(d);
    visitorsByDay.push({
      date: key,
      count: stats.dailyVisitors[key]?.length ?? 0,
    });
  }

  // Last 5 ISO weeks (Mon–Sun), unique hashes per week, newest first
  const visitorsByWeek: WeekVisitorCount[] = [];
  const thisMonday = mondayOf(now);
  for (let w = 0; w < 5; w++) {
    const weekStart = new Date(thisMonday);
    weekStart.setUTCDate(weekStart.getUTCDate() - w * 7);
    const weekStartKey = dayKey(weekStart);
    const hashes = new Set<string>();
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setUTCDate(d.getUTCDate() + i);
      const key = dayKey(d);
      for (const h of stats.dailyVisitors[key] ?? []) hashes.add(h);
    }
    visitorsByWeek.push({
      weekStart: weekStartKey,
      label: formatWeekLabel(weekStartKey),
      count: hashes.size,
    });
  }

  return {
    inquiryCount: stats.inquiryCount,
    inquiriesThisMonth:
      stats.inquiryMonth === month ? stats.inquiriesThisMonth : 0,
    uniqueVisitorsToday: stats.dailyVisitors[today]?.length ?? 0,
    uniqueVisitorsThisMonth: monthHashes.size,
    visitorsByDay,
    visitorsByWeek,
    trackingEnabled: hasBlobToken(),
  };
}

export { formatDayLabel };

export async function getStatsSummary(): Promise<StatsSummary> {
  return summarizeStats(await readStats());
}
