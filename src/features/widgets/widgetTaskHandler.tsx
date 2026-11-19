import * as Notifications from "expo-notifications";
import type { WidgetTaskHandlerProps } from "react-native-android-widget";

import { usePomodoroStore } from "@/features/pomodoro/hooks/pomodoroStore";
import type { PomodoroMode } from "@/features/pomodoro/hooks/pomodoroStore";
import { useTaskStore } from "@/features/tasks/hooks/useTasksStore";
import { taskKindOf } from "@/features/tasks/taskTypeUtils";
import {
  isWidgetName,
  loadContext,
  refreshWidgets,
  renderByName,
} from "./registry";
import { readWidgetState, writeWidgetState } from "./tasksWidgetData";

// Runs every time the home screen asks a widget to draw or the user taps it.
// Android can start this with the app CLOSED: then this file runs on its own, so the saved data is
// read from storage first (loadContext). When the app is open, the very same stores are updated,
// so the open app shows the change at once.

async function handleClick(action: string | undefined, data: Record<string, unknown>) {
  // makes sure the saved tasks and timer are loaded before anything is changed
  await loadContext();

  // ── tasks list widget ──
  if (action === "TAB" || action === "DONE" || action === "UNDO") {
    const store = useTaskStore.getState();
    const state = await readWidgetState();

    if (action === "TAB") {
      state.tab = data.tab === "priority" ? "priority" : "current";
      state.lastDone = null;
    } else if (action === "DONE") {
      const task = store.tasks.find((t) => t.id === data.id);
      const kind = task ? taskKindOf(task.type) : null;
      if (task && (kind === "active" || kind === "P0")) {
        store.moveTask({ id: task.id, targetType: "done", currentType: kind });
        // a finished task must not ring later; the app does the same when it is open
        try {
          await Notifications.cancelScheduledNotificationAsync(task.id);
        } catch {
          // nothing was scheduled
        }
        state.lastDone = { id: task.id, name: task.taskName, from: kind, at: Date.now() };
      }
    } else if (state.lastDone) {
      const { id, from } = state.lastDone;
      const task = store.tasks.find((t) => t.id === id);
      if (task && taskKindOf(task.type) === "done") {
        store.moveTask({ id, targetType: from, currentType: "done" });
      }
      state.lastDone = null;
    }
    await writeWidgetState(state);
    return;
  }

  // ── pomodoro widgets ──
  const pomo = usePomodoroStore.getState();
  if (action === "POMO_TOGGLE") {
    // loadContext already finished a phase whose time had run out, so this is: running -> pause, otherwise start
    if (pomo.endAt !== null) pomo.pause();
    else pomo.start();
  } else if (action === "POMO_SKIP") {
    pomo.skip();
  } else if (action === "POMO_MODE") {
    const mode = data.mode;
    if (mode === "focus" || mode === "short" || mode === "long") {
      pomo.setMode(mode as PomodoroMode);
    }
  }
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const name = props.widgetInfo.widgetName;
  if (!isWidgetName(name)) return;

  switch (props.widgetAction) {
    case "WIDGET_ADDED":
    case "WIDGET_UPDATE":
    case "WIDGET_RESIZED":
      props.renderWidget(renderByName(name, await loadContext()));
      break;

    case "WIDGET_CLICK":
      await handleClick(
        props.clickAction,
        (props.clickActionData ?? {}) as Record<string, unknown>,
      );
      props.renderWidget(renderByName(name, await loadContext()));
      // other widgets on the home screen show the same data: redraw them too
      await refreshWidgets(name);
      break;

    default:
      break;
  }
}
