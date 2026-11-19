import { useEffect } from "react";
import { Platform } from "react-native";

import { usePomodoroStore } from "@/features/pomodoro/hooks/pomodoroStore";
import { useTaskStore } from "@/features/tasks/hooks/useTasksStore";
import { refreshWidgets } from "./registry";

// Redraws the home screen widgets whenever the saved tasks or the Pomodoro timer change inside the app
// (add, edit, complete, delete, start, pause...). Mount it once at the app root, next to useTaskReminders.
export default function useWidgetSync() {
  useEffect(() => {
    if (Platform.OS !== "android") return;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const push = () => {
      clearTimeout(timer);
      // wait a moment so a burst of changes redraws the widgets once
      timer = setTimeout(() => {
        // an empty list before the saved data has loaded would blank the widgets
        if (
          !useTaskStore.persist.hasHydrated() ||
          !usePomodoroStore.persist.hasHydrated()
        )
          return;
        refreshWidgets();
      }, 400);
    };

    const unsubscribers = [
      useTaskStore.subscribe(push),
      usePomodoroStore.subscribe(push),
      useTaskStore.persist.onFinishHydration(push),
      usePomodoroStore.persist.onFinishHydration(push),
    ];
    push();
    return () => {
      clearTimeout(timer);
      unsubscribers.forEach((u) => u());
    };
  }, []);
}
