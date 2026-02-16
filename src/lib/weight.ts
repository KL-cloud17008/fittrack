// Pure computation functions for weight tracking

export type SerializedWeightEntry = {
  id: string;
  userId: string;
  date: string; // ISO "YYYY-MM-DD"
  weight: number;
  bodyFatPercent: number | null;
  status: "BASELINE" | "FASTING" | "NORMAL";
  timeOfDay: string | null;
  notes: string | null;
  createdAt: string;
};

export type WeightStats = {
  currentWeight: number | null;
  startWeight: number | null;
  totalChange: number | null;
  avg7Day: number | null;
  avg30Day: number | null;
  trend: "down" | "up" | "stable";
  lastEntryDate: string | null;
};

export type ChartPoint = {
  date: string;
  weight: number | null;
  avg7: number | null;
};

/**
 * Compute dashboard stats from entries (assumed sorted by date desc).
 */
export function computeWeightStats(
  entries: SerializedWeightEntry[],
  startWeight: number | null
): WeightStats {
  if (entries.length === 0) {
    return {
      currentWeight: null,
      startWeight,
      totalChange: null,
      avg7Day: null,
      avg30Day: null,
      trend: "stable",
      lastEntryDate: null,
    };
  }

  // Most recent entry is the current weight (entries are desc)
  const currentWeight = entries[0].weight;
  const lastEntryDate = entries[0].date;

  const totalChange =
    startWeight != null ? currentWeight - startWeight : null;

  const now = new Date();
  const avg7Day = computeMovingAverageFromEntries(entries, now, 7);
  const avg30Day = computeMovingAverageFromEntries(entries, now, 30);

  // Trend: compare 7-day avg to 14-day avg
  const avg14Day = computeMovingAverageFromEntries(entries, now, 14);
  let trend: "down" | "up" | "stable" = "stable";
  if (avg7Day != null && avg14Day != null) {
    const diff = avg7Day - avg14Day;
    if (diff < -0.3) trend = "down";
    else if (diff > 0.3) trend = "up";
  }

  return {
    currentWeight,
    startWeight,
    totalChange,
    avg7Day,
    avg30Day,
    trend,
    lastEntryDate,
  };
}

/**
 * Compute moving average over the last `windowDays` from `targetDate`.
 * Multiple entries on the same day are averaged together first.
 */
function computeMovingAverageFromEntries(
  entries: SerializedWeightEntry[],
  targetDate: Date,
  windowDays: number
): number | null {
  const cutoff = new Date(targetDate);
  cutoff.setDate(cutoff.getDate() - windowDays);
  const cutoffStr = formatDateISO(cutoff);
  const targetStr = formatDateISO(targetDate);

  const inWindow = entries.filter(
    (e) => e.date >= cutoffStr && e.date <= targetStr
  );

  if (inWindow.length === 0) return null;

  // Average per day first, then average across days
  const byDay = new Map<string, number[]>();
  for (const e of inWindow) {
    const arr = byDay.get(e.date) ?? [];
    arr.push(e.weight);
    byDay.set(e.date, arr);
  }

  let sum = 0;
  let count = 0;
  for (const weights of byDay.values()) {
    const dayAvg = weights.reduce((a, b) => a + b, 0) / weights.length;
    sum += dayAvg;
    count++;
  }

  return count > 0 ? Math.round((sum / count) * 10) / 10 : null;
}

/**
 * Build chart data with daily weight points and 7-day moving average.
 * Entries should be sorted by date desc (as returned from DB).
 * Output is sorted by date asc for Recharts.
 */
export function buildChartData(entries: SerializedWeightEntry[]): ChartPoint[] {
  if (entries.length === 0) return [];

  // Sort ascending for chart
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));

  // Group by date — average multiple entries per day
  const byDay = new Map<string, number[]>();
  for (const e of sorted) {
    const arr = byDay.get(e.date) ?? [];
    arr.push(e.weight);
    byDay.set(e.date, arr);
  }

  const dates = Array.from(byDay.keys()).sort();
  const dailyAvgs = new Map<string, number>();
  for (const [date, weights] of byDay) {
    dailyAvgs.set(date, weights.reduce((a, b) => a + b, 0) / weights.length);
  }

  // Compute 7-day moving average for each date
  return dates.map((date, i) => {
    const weight = dailyAvgs.get(date) ?? null;

    // Look back up to 7 days worth of entries
    let avg7: number | null = null;
    if (i >= 6) {
      const windowDates = dates.slice(i - 6, i + 1);
      const windowSum = windowDates.reduce(
        (sum, d) => sum + (dailyAvgs.get(d) ?? 0),
        0
      );
      avg7 = Math.round((windowSum / windowDates.length) * 10) / 10;
    }

    return { date, weight, avg7 };
  });
}

/**
 * Parse M/D/YYYY date string to ISO YYYY-MM-DD.
 */
export function parseCSVDate(mdy: string): string | null {
  const parts = mdy.trim().split("/");
  if (parts.length !== 3) return null;

  const month = parseInt(parts[0], 10);
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  if (isNaN(month) || isNaN(day) || isNaN(year)) return null;
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
