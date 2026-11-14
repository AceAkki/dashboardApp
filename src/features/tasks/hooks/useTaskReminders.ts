import { useEffect } from "react";

import useNotifications, { TASK_CATEGORY } from "@/global/useNotifications";
import { useTaskStore } from "./useTasksStore";
import { isFinished, taskKindOf } from "../taskTypeUtils";
import { SNOOZE_SUFFIX, reminderPlan, type PlannedReminder } from "../taskRepeat";

// Keeps the phone's scheduled reminders in step with the SAVED tasks.
// Mount it once at the app root, so it works from any screen and not only while the
// task list is open. It runs when the app starts and again whenever the tasks change:
//   - an open task with a future reminder is scheduled; with a repeat it is scheduled to come back
//   - a task that was finished, deleted, cleared or whose reminder was removed is cancelled
//   - anything the phone still holds for a task that no longer needs it is cancelled too,
//     so a change made in an earlier session can't leave a stray reminder behind
// The task id is the notification id, so scheduling a task twice never duplicates it.
export default function useTaskReminders() {
  const { schedule, scheduleRepeat, listScheduled, cancel } = useNotifications();

  useEffect(() => {
    // what we have already told the phone this session: notification id -> key
    const sent = new Map<string, string>();
    let busy = false;
    let again = false;

    const send = (w: PlannedReminder) => {
      const input = {
        title: "Task reminder",
        body: w.name,
        categoryIdentifier: TASK_CATEGORY,
        data: { taskId: w.taskId },
      };
      return w.trigger.kind === "date"
        ? schedule(input, w.trigger.when, w.id)
        : scheduleRepeat(input, w.trigger, w.id);
    };

    const sync = async () => {
      // The saved tasks load asynchronously. Before that the list is empty, and an
      // empty list would look like "everything was deleted".
      if (!useTaskStore.persist.hasHydrated()) return;
      if (busy) {
        again = true; // tasks changed while we were working: go around once more
        return;
      }
      busy = true;
      try {
        do {
          again = false;

          const wanted = new Map<string, PlannedReminder>();
          const open = new Set<string>();
          for (const t of useTaskStore.getState().tasks) {
            if (isFinished(taskKindOf(t.type))) continue;
            open.add(t.id);
            for (const w of reminderPlan(t)) wanted.set(w.id, w);
          }

          const onPhone = await listScheduled();
          const live = new Set(onPhone.map((n) => n.id));

          for (const n of onPhone) {
            if (wanted.has(n.id)) continue;
            // a snoozed reminder belongs to its task: it stays while the task is open
            if (n.id.endsWith(SNOOZE_SUFFIX) && open.has(n.taskId)) continue;
            sent.delete(n.id);
            await cancel(n.id);
          }

          for (const [id, w] of wanted) {
            if (sent.get(id) === w.key && live.has(id)) continue; // the phone already has this one
            // null = refused (no permission): leave it unsent so the next change retries
            if (await send(w)) sent.set(id, w.key);
          }
        } while (again);
      } finally {
        busy = false;
      }
    };

    const unsubChange = useTaskStore.subscribe(sync);
    const unsubHydrated = useTaskStore.persist.onFinishHydration(sync);
    sync();
    return () => {
      unsubChange();
      unsubHydrated();
    };
  }, [schedule, scheduleRepeat, listScheduled, cancel]);
}
