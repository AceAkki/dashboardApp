import { Colors } from "@/constants/Colors";
import type { PomodoroMode } from "./hooks/pomodoroStore";

export const modeColor = (mode: PomodoroMode) =>
  mode === "focus"
    ? Colors.primary
    : mode === "short"
      ? Colors.success
      : Colors.chart4;
