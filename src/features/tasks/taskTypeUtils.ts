import type { TasksTypes } from "@/features/tasks/taskTypes";
import { Colors } from "@/constants/Colors";

export const TABS = ["*/", "active", "urgent", "done"] as const;

export const getTaskTypes = (current = 1): TasksTypes => {
  let obj = {} as TasksTypes;
  for (let i = 0; i < TABS.length; i++) {
    if (i !== 0) {
      const txt = TABS[i] as keyof TasksTypes;
      obj[txt] = false;
    }
    if (i === current) {
      const txt = TABS[i] as keyof TasksTypes;
      obj[txt] = true;
    }
  }
  return obj as TasksTypes;
};

export const taskTypesArr = TABS.filter((Tab, i) => i !== 0);

export const taskColors = {
  active: Colors.primary,
  urgent: Colors.danger,
  done: Colors.success,
};

export const taskGlyphs = {
  active: "●",
  urgent: "▲",
  done: "✓",
} as const;

export type TaskKind = keyof typeof taskColors;

// the one type a task is currently in; "active" if the data is incomplete
export const taskKindOf = (type: TasksTypes): TaskKind =>
  (taskTypesArr.find((t) => type[t as keyof TasksTypes]) as TaskKind) ??
  "active";

// "T-3F9A": short readable code from the task id
export const taskCode = (id: string) => `T-${id.slice(-4).toUpperCase()}`;

// due-time label for a reminder ISO string; null when no reminder is set
export const formatDue = (iso: string, now = Date.now()) => {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return null;
  const diff = t - now;
  const abs = Math.abs(diff);
  const h = Math.floor(abs / 36e5);
  const d = Math.floor(h / 24);
  if (diff < 0)
    return { label: `OVERDUE ${d >= 1 ? `${d}D` : `${Math.max(h, 1)}H`}`, overdue: true };
  const date = new Date(t);
  const sameDay = date.toDateString() === new Date(now).toDateString();
  const time = date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false });
  if (sameDay) return { label: `DUE ${time}`, overdue: false };
  const tomorrow = new Date(now + 864e5).toDateString() === date.toDateString();
  return {
    label: tomorrow ? `DUE TOMORROW ${time}` : `DUE ${date.getDate().toString().padStart(2, "0")} ${date.toLocaleString("en", { month: "short" }).toUpperCase()}`,
    overdue: false,
  };
};
