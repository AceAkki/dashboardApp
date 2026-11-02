// Understands unix seconds, unix milliseconds, ISO dates and "2026-11-02 14:30".
export function parseTimeInput(input: string): Date | null {
  const s = input.trim();
  if (!s) return null;

  let date: Date;
  if (/^-?\d+(\.\d+)?$/.test(s)) {
    const n = Number(s);
    // 11 or more digits can only be milliseconds (as seconds it would be the year 5138+)
    date = new Date(Math.abs(n) >= 1e11 ? n : n * 1000);
  } else {
    // "2026-11-02 14:30" is not ISO, some engines refuse it: swap the space for a T
    date = new Date(s.replace(/^(\d{4}-\d{2}-\d{2}) (?=\d)/, "$1T"));
  }
  return Number.isNaN(date.getTime()) ? null : date;
}

const pad = (n: number) => String(n).padStart(2, "0");

function localString(d: Date): string {
  const offset = -d.getTimezoneOffset();
  const sign = offset >= 0 ? "+" : "-";
  const abs = Math.abs(offset);
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ` +
    `UTC${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`
  );
}

const UNITS: [string, number][] = [
  ["year", 31536000],
  ["month", 2592000],
  ["day", 86400],
  ["hour", 3600],
  ["minute", 60],
  ["second", 1],
];

function relative(d: Date, now: number): string {
  const diff = Math.round((d.getTime() - now) / 1000);
  const abs = Math.abs(diff);
  if (abs < 1) return "now";
  const [name, size] = UNITS.find(([, s]) => abs >= s) ?? UNITS[UNITS.length - 1];
  const n = Math.floor(abs / size);
  const label = `${n} ${name}${n === 1 ? "" : "s"}`;
  return diff < 0 ? `${label} ago` : `in ${label}`;
}

export type TimeRow = { label: string; value: string };

export function describeTime(d: Date, now = Date.now()): TimeRow[] {
  return [
    { label: "UNIX (S)", value: String(Math.floor(d.getTime() / 1000)) },
    { label: "UNIX (MS)", value: String(d.getTime()) },
    { label: "ISO · UTC", value: d.toISOString() },
    { label: "LOCAL", value: localString(d) },
    { label: "RELATIVE", value: relative(d, now) },
  ];
}
