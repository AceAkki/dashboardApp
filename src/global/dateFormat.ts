// Small date helpers for the reminder pickers. Everything is local time and built by hand:
// never parse locale strings on Hermes.
export const MONTHS = [
  "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
  "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER",
] as const;
export const MONTHS_SHORT = MONTHS.map((m) => m.slice(0, 3));
export const WEEKDAYS_SHORT = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

export const pad = (n: number) => String(n).padStart(2, "0");

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** the day `n` days from `d`, at midnight */
export const addDays = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

export const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/** 18:00 */
export const timeText = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

/** WED 19 NOV */
export const dayText = (d: Date) =>
  `${WEEKDAYS_SHORT[d.getDay()]} ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
