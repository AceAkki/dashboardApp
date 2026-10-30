import type {
  TaskActionData,
  TasksTypes,
  TaskKind,
  TaskKindArr,
  TaskTab,
} from "@/features/tasks/taskTypes";
import { Colors } from "@/constants/Colors";

// ─────────────────────────────────────────────────────────────────────────────
// THE one place task types are defined.
//   taskDefault   new tasks start in this type (mark exactly one)
//   taskFinished  counts as completed: no due time, struck through, not "open"
// ─────────────────────────────────────────────────────────────────────────────
export const taskMain = {
  active: {
    taskColor: Colors.primary,
    taskGlyph: "●",
    taskDefault: true,
    taskFinished: false,
  },
  P0: {
    taskColor: Colors.danger,
    taskGlyph: "▲",
    taskDefault: false,
    taskFinished: false,
  },
  done: {
    taskColor: Colors.success,
    taskGlyph: "✓",
    taskDefault: false,
    taskFinished: true,
  },
};

// the "show everything" tab; it is not a task type
export const ALL_TAB = "*/";

export const taskTypesArr = Object.keys(taskMain) as TaskKindArr;
export const TABS: TaskTab[] = [ALL_TAB, ...taskTypesArr];

export const DEFAULT_KIND: TaskKind =
  taskTypesArr.find((k) => taskMain[k].taskDefault) ?? taskTypesArr[0];

export const isFinished = (kind: TaskKind) => taskMain[kind].taskFinished;

// terminal flag for a type is "--" + its name; matching ignores case
export const taskFlagOf = (kind: TaskKind) => `--${kind}`;
export const TASK_FLAGS = taskTypesArr.map(taskFlagOf);
export const kindFromFlag = (word: string): TaskKind | undefined =>
  taskTypesArr.find((k) => taskFlagOf(k).toLowerCase() === word.toLowerCase());

// a task's `type` object: true for `kind`, false for every other type
export const getTaskTypes = (kind: TaskKind = DEFAULT_KIND): TasksTypes =>
  Object.fromEntries(taskTypesArr.map((k) => [k, k === kind])) as TasksTypes;

// the one type a task is currently in; the default type if the data is incomplete
export const taskKindOf = (type: TasksTypes): TaskKind =>
  taskTypesArr.find((k) => type[k]) ?? DEFAULT_KIND;

// fresh counts per type, worked out from the list every time
export const countTasks = (
  tasks: TaskActionData[],
): Record<TaskKind, number> => {
  const counts = Object.fromEntries(taskTypesArr.map((k) => [k, 0])) as Record<
    TaskKind,
    number
  >;
  tasks.forEach((t) => {
    counts[taskKindOf(t.type)] += 1;
  });
  return counts;
};

// tasks that are not finished
export const openCount = (counts: Record<TaskKind, number>) =>
  taskTypesArr.filter((k) => !isFinished(k)).reduce((n, k) => n + counts[k], 0);

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
    return {
      label: `OVERDUE ${d >= 1 ? `${d}D` : `${Math.max(h, 1)}H`}`,
      overdue: true,
    };
  const date = new Date(t);
  const sameDay = date.toDateString() === new Date(now).toDateString();
  const time = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  if (sameDay) return { label: `DUE ${time}`, overdue: false };
  const tomorrow = new Date(now + 864e5).toDateString() === date.toDateString();
  return {
    label: tomorrow
      ? `DUE TOMORROW ${time}`
      : `DUE ${date.getDate().toString().padStart(2, "0")} ${date.toLocaleString("en", { month: "short" }).toUpperCase()}`,
    overdue: false,
  };
};
