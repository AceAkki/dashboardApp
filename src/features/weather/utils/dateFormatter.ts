/**
 * Open-Meteo returns local times like "2026-10-22T14:00" (no offset) and dates
 * like "2026-10-23". `new Date("2026-10-23")` is parsed as UTC, which can show
 * the wrong day, so always build the Date from its parts.
 */
export const parseLocal = (iso: string): Date => {
  const [datePart, timePart = "00:00"] = iso.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm] = timePart.split(":").map(Number);
  return new Date(y, m - 1, d, hh || 0, mm || 0);
};

export const formatHour = (iso: string): string =>
  parseLocal(iso).toLocaleTimeString(undefined, { hour: "numeric" });

export const formatTime = (iso: string): string =>
  parseLocal(iso).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

export const formatDayShort = (iso: string): string =>
  parseLocal(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
  });

export const formatFullDate = (iso: string): string =>
  parseLocal(iso).toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

/**
 * Indexes of the next `count` hourly entries starting at the current hour.
 * `currentTime` is the API's own "now" (location time), so this stays correct
 * when the phone is in a different timezone than the weather location.
 * (The web version paired each hour label with the previous hour's values.)
 */
export const getUpcomingHourIndexes = (
  hourTimes: string[],
  currentTime: string,
  count = 24,
): number[] => {
  const currentHour = `${currentTime.slice(0, 13)}:00`; // "YYYY-MM-DDTHH:00"
  const first = hourTimes.findIndex((t) => t >= currentHour);
  if (first === -1) return [];
  return hourTimes.slice(first, first + count).map((_, i) => first + i);
};
