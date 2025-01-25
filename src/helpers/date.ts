// Use a 4-day window for logs, anything after that and we
// don't need to discuss what we did last.
// This ensures I'll have my logs from previous workdays,
// including after weekends or short breaks.
const FOUR_DAYS_MS = 4 * 24 * 60 * 60 * 1000;

/**
 * Returns the cutoff ISO string from 4 days ago (UTC).
 */
export function getLogCutoff(): string {
  // Just subtract 4 days from "now" and return ISO
  const cutoffTime = Date.now() - FOUR_DAYS_MS;
  return new Date(cutoffTime).toISOString();
}

/**
 * Checks if a UTC ISO8601 date falls on the current date in Pacific Time.
 *
 * @param dateStr - A UTC ISO8601 date string (e.g. "2025-01-05T20:00:00.000Z").
 * @returns true if `dateStr` is "today" in "America/Los_Angeles", false otherwise.
 */
export function isCurrentLocalDate(dateStr: string): boolean {
  const parsedDate = new Date(dateStr);
  if (isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid date string: ${dateStr}`);
  }

  // Compare just the date portion in Pacific Time
  const pacificDateString = parsedDate.toLocaleDateString("en-US", {
    timeZone: "America/Los_Angeles",
  });
  const pacificTodayString = new Date().toLocaleDateString("en-US", {
    timeZone: "America/Los_Angeles",
  });

  return pacificDateString === pacificTodayString;
}
