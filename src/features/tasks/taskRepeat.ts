import type { TaskActionData } from "./taskTypes";

// Repeat reminders. A repeat never has a time of its own: it takes the time of day (and, for
// weekly, the weekday) from the reminder time picked in the date picker. Change the picker's
// time and the repeat follows; clear the reminder and the repeat goes with it.

export const REPEATS = ["daily", "weekdays", "weekly"] as const;
export type Repeat = (typeof REPEATS)[number];

// anything that is not one of the three is "no repeat"
export const cleanRepeat = (raw: unknown): Repeat | undefined =>
  REPEATS.find((r) => r === raw);

// a snoozed reminder of a repeating task is its own one-off notification with this id suffix
export const SNOOZE_SUFFIX = ":snooze";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const pad = (n: number) => String(n).padStart(2, "0");
const clock = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

// the chip text; weekly shows the weekday of the picked date
export const repeatChipLabel = (repeat: Repeat, anchor: Date | null) =>
  repeat === "weekly" && anchor ? `WEEKLY · ${DAYS[anchor.getDay()]}` : repeat.toUpperCase();

// the plain-language line under the chips
export const repeatSummary = (repeat: Repeat, anchor: Date) => {
  const at = clock(anchor);
  if (repeat === "daily") return `Every day at ${at}`;
  if (repeat === "weekdays") return `Monday to Friday at ${at}`;
  return `Every ${DAY_NAMES[anchor.getDay()]} at ${at}`;
};

// the label on a task card instead of DUE / OVERDUE
export const repeatDue = (iso: string, repeat: Repeat) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const day = repeat === "weekly" ? ` ${DAYS[d.getDay()]}` : "";
  return { label: `↻ ${repeat.toUpperCase()}${day} ${clock(d)}`, overdue: false };
};

// ── what to hand to the phone ───────────────────────────────────────────────

export type ReminderTrigger =
  | { kind: "date"; when: Date }
  | { kind: "daily"; hour: number; minute: number }
  | { kind: "weekly"; weekday: number; hour: number; minute: number }; // 1 = Sunday ... 7 = Saturday

export type PlannedReminder = {
  /** the notification id; the task id, or "<task id>:<weekday>" for the Monday-to-Friday set */
  id: string;
  taskId: string;
  /** changes whenever the notification would have to be scheduled again */
  key: string;
  name: string;
  trigger: ReminderTrigger;
};

// Every notification an OPEN task needs. No reminder, or a one-off that is already past: none.
export const reminderPlan = (t: TaskActionData, now = Date.now()): PlannedReminder[] => {
  const anchor = new Date(t.remindTime); // "" gives an invalid date
  if (Number.isNaN(anchor.getTime())) return [];
  const hour = anchor.getHours();
  const minute = anchor.getMinutes();
  const base = { taskId: t.id, name: t.taskName };
  const key = (extra: string) => `${extra}|${hour}:${minute}|${t.taskName}`;

  if (t.repeat === "daily")
    return [{ ...base, id: t.id, key: key("daily"), trigger: { kind: "daily", hour, minute } }];

  if (t.repeat === "weekly") {
    const weekday = anchor.getDay() + 1;
    return [{ ...base, id: t.id, key: key(`weekly${weekday}`), trigger: { kind: "weekly", weekday, hour, minute } }];
  }

  if (t.repeat === "weekdays")
    return [2, 3, 4, 5, 6].map((weekday) => ({
      ...base,
      id: `${t.id}:${weekday}`,
      key: key("weekdays"),
      trigger: { kind: "weekly" as const, weekday, hour, minute },
    }));

  if (!(anchor.getTime() > now)) return [];
  return [{ ...base, id: t.id, key: `${t.remindTime}|${t.taskName}`, trigger: { kind: "date", when: anchor } }];
};
