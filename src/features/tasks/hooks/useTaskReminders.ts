import { useEffect } from "react";

import useNotifications from "@/global/useNotifications";
import { useTaskStore } from "./useTasksStore";
import { isFinished, taskKindOf } from "../taskTypeUtils";

// Keeps the phone's scheduled reminders in step with the SAVED tasks.
// Mount it once at the app root, so it works from any screen and not only while the
// task list is open. It runs when the app starts and again whenever the tasks change:
//   - every task that is open and has a future reminder is scheduled
//   - a task that was finished, deleted, cleared or moved to the past is cancelled
// The task id is the notification id, so scheduling a task twice never duplicates it.
export default function useTaskReminders() {
  const { schedule, cancel } = useNotifications();

  useEffect(() => {
    // what we have already told the phone this session: task id -> "time|name"
    const sent = new Map<string, string>();
    let busy = false;
    let again = false;

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

          const wanted = new Map<
            string,
            { key: string; when: Date; name: string }
          >();
          for (const t of useTaskStore.getState().tasks) {
            const when = new Date(t.remindTime); // "" gives an invalid date
            if (isFinished(taskKindOf(t.type))) continue;
            if (!(when.getTime() > Date.now())) continue; // none set, or already past
            wanted.set(t.id, {
              key: `${t.remindTime}|${t.taskName}`,
              when,
              name: t.taskName,
            });
          }

          for (const id of [...sent.keys()]) {
            if (wanted.has(id)) continue;
            sent.delete(id);
            await cancel(id);
          }

          for (const [id, w] of wanted) {
            if (sent.get(id) === w.key) continue; // the phone already has this one
            const scheduled = await schedule(
              { title: "Task reminder", body: w.name, data: { taskId: id } },
              w.when,
              id,
            );
            // null = refused (no permission): leave it unsent so the next change retries
            if (scheduled) sent.set(id, w.key);
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
  }, [schedule, cancel]);
}
