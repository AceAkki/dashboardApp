import { Colors } from "@/constants/Colors";
import {
  MODE_LABEL,
  MODE_SECONDS,
  SESSIONS_BEFORE_LONG,
  usePomodoroStore,
  type PomodoroMode,
} from "@/features/pomodoro/hooks/pomodoroStore";

// What the Pomodoro widgets show, worked out from the saved timer. Pure, no React.
// A home screen widget cannot tick every second, so a RUNNING timer shows when it ENDS ("ENDS 14:35")
// instead of a countdown that would be wrong a minute later. Paused / idle show the exact time left.

export type PomoState = "idle" | "running" | "paused" | "done";

export type PomoSnapshot = {
  mode: PomodoroMode;
  remaining: number; // seconds, when not running
  endAt: number | null;
  completedSessions: number;
};

export type PomoProps = {
  mode: PomodoroMode;
  modeLabel: string; // "FOCUS", "SHORT BREAK", "LONG BREAK"
  color: string;
  state: PomoState;
  /** the line to show big: "18:24", "ENDS 14:35" or "TIME UP" */
  headline: string;
  minutes: number;
  /** how full the ring / bar is: the share of time left when stopped, full while running */
  fraction: number;
  sessions: number;
  sessionsTotal: number;
};

export const snapshotPomodoro = (): PomoSnapshot => {
  const s = usePomodoroStore.getState();
  return {
    mode: s.mode,
    remaining: s.remaining,
    endAt: s.endAt,
    completedSessions: s.completedSessions,
  };
};

const clock = (secs: number) =>
  `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;

export function buildPomoProps(s: PomoSnapshot, now = Date.now()): PomoProps {
  const total = MODE_SECONDS[s.mode];
  const state: PomoState =
    s.endAt !== null
      ? s.endAt > now
        ? "running"
        : "done"
      : s.remaining < total
        ? "paused"
        : "idle";

  const headline =
    state === "running"
      ? `ENDS ${new Date(s.endAt as number).toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}`
      : state === "done"
        ? "TIME UP"
        : clock(s.remaining);

  return {
    mode: s.mode,
    modeLabel: MODE_LABEL[s.mode].toUpperCase(),
    color:
      s.mode === "focus"
        ? Colors.primary
        : s.mode === "short"
          ? Colors.success
          : Colors.chart4,
    state,
    headline,
    minutes: Math.round(total / 60),
    fraction:
      state === "idle" || state === "paused"
        ? Math.min(1, Math.max(0, s.remaining / total))
        : 1,
    sessions:
      s.mode === "long"
        ? SESSIONS_BEFORE_LONG
        : s.completedSessions % SESSIONS_BEFORE_LONG,
    sessionsTotal: SESSIONS_BEFORE_LONG,
  };
}
