import AsyncStorage from "@react-native-async-storage/async-storage";

import { widgetStateKey } from "@/global/storageKeys";
import { taskKindOf } from "@/features/tasks/taskTypeUtils";
import type { TaskActionData } from "@/features/tasks/taskTypes";

// Everything the tasks widget needs, worked out from the saved tasks.
// Pure functions + a tiny saved state (which tab is open, the last task completed from the widget).
// No React here, so the widget's click handler can use it while the app is closed.

export const WIDGET_NAME = "TasksList";
// the "UNDO" row of a task completed from the widget goes away on the next refresh after this long
const UNDO_MS = 10 * 60 * 1000;

export type WidgetTab = "current" | "priority";
type OpenKind = "active" | "P0";

export type WidgetState = {
  tab: WidgetTab;
  lastDone: { id: string; name: string; from: OpenKind; at: number } | null;
};

export type WidgetRow = {
  id: string;
  name: string;
  tag?: string;
  due?: string;
  overdue: boolean;
  p0: boolean;
};

export type WidgetProps = {
  tab: WidgetTab;
  rows: WidgetRow[];
  counts: { current: number; priority: number };
  /** how many tasks the open tab has in total */
  total: number;
  lastDone: { name: string } | null;
};

const DEFAULT_STATE: WidgetState = { tab: "current", lastDone: null };

export async function readWidgetState(): Promise<WidgetState> {
  try {
    const raw = await AsyncStorage.getItem(widgetStateKey);
    if (!raw) return { ...DEFAULT_STATE };
    const v = JSON.parse(raw);
    const ld = v?.lastDone;
    const okDone =
      ld &&
      typeof ld.id === "string" &&
      typeof ld.name === "string" &&
      (ld.from === "active" || ld.from === "P0") &&
      typeof ld.at === "number";
    return {
      tab: v?.tab === "priority" ? "priority" : "current",
      lastDone: okDone ? ld : null,
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export async function writeWidgetState(state: WidgetState) {
  try {
    await AsyncStorage.setItem(widgetStateKey, JSON.stringify(state));
  } catch {
    // a lost tab choice is harmless
  }
}

// "OVERDUE 2D", "TODAY 19:00", "TOMORROW 10:30", "12 NOV"; short, the widget is narrow
export function shortDue(iso: string, now = Date.now()) {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return null;
  if (t < now) {
    const mins = Math.floor((now - t) / 6e4);
    const days = Math.floor(mins / 1440);
    const hours = Math.floor(mins / 60);
    const span =
      days >= 1 ? `${days}D` : hours >= 1 ? `${hours}H` : `${Math.max(mins, 1)}M`;
    return { label: `OVERDUE ${span}`, overdue: true };
  }
  const d = new Date(t);
  const time = d.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  if (d.toDateString() === new Date(now).toDateString())
    return { label: `TODAY ${time}`, overdue: false };
  if (d.toDateString() === new Date(now + 864e5).toDateString())
    return { label: `TOMORROW ${time}`, overdue: false };
  return {
    label: `${String(d.getDate()).padStart(2, "0")} ${d.toLocaleString("en", { month: "short" }).toUpperCase()}`,
    overdue: false,
  };
}

// soonest due first (overdue naturally on top), then tasks without a time, newest added first
function order(list: TaskActionData[]) {
  const timed = list
    .filter((t) => t.remindTime && !Number.isNaN(Date.parse(t.remindTime)))
    .sort((a, b) => Date.parse(a.remindTime) - Date.parse(b.remindTime));
  const untimed = list
    .filter((t) => !(t.remindTime && !Number.isNaN(Date.parse(t.remindTime))))
    .reverse();
  return [...timed, ...untimed];
}

export function buildWidgetProps(
  tasks: TaskActionData[],
  state: WidgetState,
  now = Date.now(),
): WidgetProps {
  const current = tasks.filter((t) => taskKindOf(t.type) === "active");
  const priority = tasks.filter((t) => taskKindOf(t.type) === "P0");
  const list = order(state.tab === "current" ? current : priority);

  const lastDone =
    state.lastDone && now - state.lastDone.at < UNDO_MS ? state.lastDone : null;

  return {
    tab: state.tab,
    counts: { current: current.length, priority: priority.length },
    total: list.length,
    lastDone: lastDone ? { name: lastDone.name } : null,
    rows: list.map((t) => {
      const due = shortDue(t.remindTime, now);
      return {
        id: t.id,
        name: t.taskName,
        tag: t.tags?.[0],
        due: due?.label,
        overdue: !!due?.overdue,
        p0: taskKindOf(t.type) === "P0",
      };
    }),
  };
}

// the 2x2 count widgets: how many tasks of one kind, and how many of those are overdue
export function countTasks(
  tasks: TaskActionData[],
  kind: "active" | "P0",
  now = Date.now(),
) {
  const list = tasks.filter((t) => taskKindOf(t.type) === kind);
  const overdue = list.filter((t) => {
    const at = Date.parse(t.remindTime);
    return !Number.isNaN(at) && at < now;
  }).length;
  return { count: list.length, overdue };
}
