/**
 * Training day boundary logic.
 *
 * Sessions occur between ~2:00 AM and 4:00 AM.
 * Training day boundary is 12:00 PM (noon).
 * - Before noon → training date = current calendar date
 * - After noon  → training date = next calendar date
 *
 * Example: Session at 2:30 AM Monday = "Day 1 — Monday"
 */

/**
 * Convert a UTC Date to a local date string in the given timezone.
 */
export function toLocalDate(date: Date, timezone: string): Date {
  const local = new Date(
    date.toLocaleString("en-US", { timeZone: timezone })
  );
  return local;
}

/**
 * Get the training date for a given timestamp.
 * Before noon → current calendar date.
 * After noon  → next calendar date.
 */
export function getTrainingDate(timestamp: Date, userTimezone: string): Date {
  const localTime = toLocalDate(timestamp, userTimezone);
  const hour = localTime.getHours();

  if (hour < 12) {
    // Training date = today's calendar date
    return startOfDay(localTime);
  } else {
    // Training date = tomorrow
    const tomorrow = new Date(localTime);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return startOfDay(tomorrow);
  }
}

/**
 * Get start of day (midnight) for a date.
 */
export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Format a date as YYYY-MM-DD.
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Parse a YYYY-MM-DD string into a Date (at midnight local).
 */
export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Get the day of week (0=Sun, 1=Mon, ..., 6=Sat) for a training date.
 */
export function getTrainingDayOfWeek(
  timestamp: Date,
  userTimezone: string
): number {
  const trainingDate = getTrainingDate(timestamp, userTimezone);
  return trainingDate.getDay();
}

/**
 * Check if a given date is a training day for the user.
 */
export function isTrainingDay(
  date: Date,
  trainingDays: number[]
): boolean {
  return trainingDays.includes(date.getDay());
}

/**
 * Get the current training date based on the current time and timezone.
 */
export function getCurrentTrainingDate(userTimezone: string): Date {
  return getTrainingDate(new Date(), userTimezone);
}
