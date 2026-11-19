import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";

import { useTaskStore } from "@/features/tasks/hooks/useTasksStore";
import { SNOOZE_SUFFIX } from "@/features/tasks/taskRepeat";
import { isFinished, taskKindOf } from "@/features/tasks/taskTypeUtils";
import { CHANNEL_ID, SOUND, TASK_CATEGORY } from "../hooks/useNotifications";

// The three buttons under a task reminder: +10 MIN, +1 HOUR, TOMORROW.
// Tapping one moves the reminder without opening the app.

// This file has to load when the app starts (app/_layout.tsx imports it), because Android
// starts the app in the background to run the task below when the button is tapped while the
// app is closed. expo-notifications runs the task for us; it must be defined here, at the top
// level of a module, and not inside a component.

const TASK_NAME = "task-reminder-actions";

export const SNOOZE_TIMES = {
  "snooze-10m": "+10 MIN",
  "snooze-1h": "+1 HOUR",
  "snooze-tomorrow": "TOMORROW",
} as const;
type SnoozeAction = keyof typeof SNOOZE_TIMES;

const isSnooze = (id: string): id is SnoozeAction => id in SNOOZE_TIMES;

// when the reminder should come back; null for any other button (or a plain tap)
export const snoozeTime = (action: string, now = new Date()): Date | null => {
  if (!isSnooze(action)) return null;
  const d = new Date(now);
  if (action === "snooze-10m") d.setMinutes(d.getMinutes() + 10);
  else if (action === "snooze-1h") d.setHours(d.getHours() + 1);
  else {
    d.setDate(d.getDate() + 1);
    d.setHours(9, 0, 0, 0); // tomorrow morning
  }
  d.setSeconds(0, 0);
  return d;
};

export async function handleSnooze(response: Notifications.NotificationResponse) {
  const at = snoozeTime(response.actionIdentifier);
  if (!at) return;
  const { identifier, content } = response.notification.request;
  const taskId = typeof content.data?.taskId === "string" ? content.data.taskId : null;
  if (!taskId) return;

  Notifications.dismissNotificationAsync(identifier).catch(() => {});

  // when the app was closed this is a fresh start: wait for the saved tasks to load
  await useTaskStore.persist.rehydrate();
  const task = useTaskStore.getState().tasks.find((t) => t.id === taskId);
  if (!task || isFinished(taskKindOf(task.type))) return;

  // A repeating task keeps its schedule: the snooze is one extra reminder.
  // A normal task simply gets the new time, which also keeps the edit form and the list right.
  const id = task.repeat ? `${taskId}${SNOOZE_SUFFIX}` : taskId;
  if (!task.repeat) useTaskStore.getState().editRemind({ id: taskId, newTime: at.toISOString() });

  await Notifications.scheduleNotificationAsync({
    identifier: id,
    content: {
      title: "Task reminder",
      body: task.taskName,
      sound: SOUND,
      categoryIdentifier: TASK_CATEGORY,
      data: { taskId },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: at,
      channelId: CHANNEL_ID,
    },
  });
}

const run = (response: Notifications.NotificationResponse) =>
  handleSnooze(response).catch((e) => {
    if (__DEV__) console.warn("snooze failed", e);
  });

// Android only: the buttons are not set up on the web, and this app is not built for iOS.
if (Platform.OS === "android") {
  // app closed or in the background
  if (!TaskManager.isTaskDefined(TASK_NAME)) {
    TaskManager.defineTask<Notifications.NotificationTaskPayload>(TASK_NAME, async ({ data, error }) => {
      if (error || !data || !("actionIdentifier" in data)) return;
      await run(data);
    });
  }
  Notifications.registerTaskAsync(TASK_NAME).catch(() => {});

  // app open: the same tap arrives here instead
  Notifications.addNotificationResponseReceivedListener(run);

  Notifications.setNotificationCategoryAsync(
    TASK_CATEGORY,
    (Object.keys(SNOOZE_TIMES) as SnoozeAction[]).map((identifier) => ({
      identifier,
      buttonTitle: SNOOZE_TIMES[identifier],
      options: { opensAppToForeground: false },
    })),
  ).catch(() => {});
}
