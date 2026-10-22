import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type PomodoroMode = "focus" | "short" | "long";

export const MODE_SECONDS: Record<PomodoroMode, number> = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};
export const MODE_LABEL: Record<PomodoroMode, string> = {
  focus: "Focus",
  short: "Short Break",
  long: "Long Break",
};
// a long break after this many focus sessions
export const SESSIONS_BEFORE_LONG = 4;

interface PomodoroState {
  mode: PomodoroMode;
  // seconds left when paused/idle; while running, derive from endAt instead
  remaining: number;
  endAt: number | null;
  completedSessions: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
  setMode: (mode: PomodoroMode) => void;
  skip: () => void;
  complete: () => void;
}

const nextMode = (mode: PomodoroMode, sessions: number): PomodoroMode =>
  mode !== "focus"
    ? "focus"
    : sessions % SESSIONS_BEFORE_LONG === 0
      ? "long"
      : "short";

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      mode: "focus",
      remaining: MODE_SECONDS.focus,
      endAt: null,
      completedSessions: 0,

      start: () => {
        const { endAt, remaining } = get();
        if (endAt) return;
        set({ endAt: Date.now() + remaining * 1000 });
      },

      pause: () => {
        const { endAt } = get();
        if (!endAt) return;
        set({
          remaining: Math.max(0, Math.ceil((endAt - Date.now()) / 1000)),
          endAt: null,
        });
      },

      reset: () =>
        set((s) => ({ endAt: null, remaining: MODE_SECONDS[s.mode] })),

      setMode: (mode) =>
        set({ mode, endAt: null, remaining: MODE_SECONDS[mode] }),

      // jump to the next phase without counting the session
      skip: () =>
        set((s) => {
          const mode = nextMode(s.mode, s.completedSessions);
          return { mode, endAt: null, remaining: MODE_SECONDS[mode] };
        }),

      // idempotent: both the dashboard card and the screen tick, only one completes
      complete: () => {
        const { endAt, mode, completedSessions } = get();
        if (!endAt || Date.now() < endAt) return;
        const sessions =
          mode === "focus" ? completedSessions + 1 : completedSessions;
        const next = nextMode(mode, sessions);
        set({
          mode: next,
          completedSessions: sessions,
          endAt: null,
          remaining: MODE_SECONDS[next],
        });
      },
    }),
    {
      name: "pomodoro-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // only data, not the action functions
      partialize: ({ mode, remaining, endAt, completedSessions }) => ({
        mode,
        remaining,
        endAt,
        completedSessions,
      }),
    },
  ),
);
