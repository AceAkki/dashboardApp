import { Colors } from "@/constants/Colors";
import type { StatusLevel, StorySource } from "./devTypes";

// "3H", "12M", "2D" from a unix-seconds or ISO timestamp
export const timeAgo = (time: number | string | null, now = Date.now()): string => {
  if (time === null) return "--";
  const ms = typeof time === "number" ? time * 1000 : Date.parse(time);
  if (Number.isNaN(ms)) return "--";
  const s = Math.max(0, Math.floor((now - ms) / 1000));
  if (s < 3600) return `${Math.max(1, Math.floor(s / 60))}M`;
  if (s < 86400) return `${Math.floor(s / 3600)}H`;
  return `${Math.floor(s / 86400)}D`;
};

export const SOURCE_LABEL: Record<StorySource, string> = {
  hn: "HN",
  dev: "DEV.TO",
  lobsters: "LOBSTERS",
};

export const STATUS_TEXT: Record<StatusLevel, string> = {
  ok: "OPERATIONAL",
  minor: "DEGRADED",
  major: "PARTIAL OUTAGE",
  critical: "MAJOR OUTAGE",
  unknown: "NO DATA",
};

export const STATUS_COLOR: Record<StatusLevel, string> = {
  ok: Colors.success,
  minor: Colors.warning,
  major: Colors.danger,
  critical: Colors.danger,
  unknown: Colors.textMuted,
};

// ISO week number (the "WK 44" in the dashboard header)
export const isoWeek = (d = new Date()): number => {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t.getTime() - yearStart.getTime()) / 864e5 + 1) / 7);
};
