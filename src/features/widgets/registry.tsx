import React from "react";
import type { ReactElement } from "react";
import { requestWidgetUpdate } from "react-native-android-widget";

import { usePomodoroStore } from "@/features/pomodoro/hooks/pomodoroStore";
import { useTaskStore } from "@/features/tasks/hooks/useTasksStore";
import type { TaskActionData } from "@/features/tasks/taskTypes";
import { Pomodoro2x2, Pomodoro4x1, Pomodoro4x2 } from "./PomodoroWidgets";
import { TasksListWidget } from "./TasksListWidget";
import { AddTask, TaskCount } from "./TaskWidgets";
import {
  buildPomoProps,
  snapshotPomodoro,
  type PomoSnapshot,
} from "./pomodoroWidgetData";
import {
  buildWidgetProps,
  countTasks,
  readWidgetState,
  type WidgetState,
} from "./tasksWidgetData";

// Every home screen widget, by the name given to it in the app.json plugin.
export const WIDGET_NAMES = [
  "TasksList", //       4 x 4  recent tasks, current / priority tabs
  "TaskCountActive", // 2 x 2  how many active tasks
  "TaskCountP0", //     2 x 2  how many P0 tasks
  "AddTask", //         4 x 1  tap to add a task
  "PomodoroBar", //     4 x 1
  "PomodoroCard", //    4 x 2
  "PomodoroTile", //    2 x 2
] as const;
export type WidgetName = (typeof WIDGET_NAMES)[number];
export const isWidgetName = (n: string): n is WidgetName =>
  (WIDGET_NAMES as readonly string[]).includes(n);

export type WidgetContext = {
  tasks: TaskActionData[];
  tasksState: WidgetState;
  pomo: PomoSnapshot;
  now: number;
};

// Reads everything the widgets show. Works with the app closed: the saved data is loaded first.
// It also finishes a Pomodoro phase whose time ran out while nothing was running (same as opening the app would).
export async function loadContext(): Promise<WidgetContext> {
  if (!useTaskStore.persist.hasHydrated()) await useTaskStore.persist.rehydrate();
  if (!usePomodoroStore.persist.hasHydrated())
    await usePomodoroStore.persist.rehydrate();
  usePomodoroStore.getState().complete();
  return {
    tasks: useTaskStore.getState().tasks,
    tasksState: await readWidgetState(),
    pomo: snapshotPomodoro(),
    now: Date.now(),
  };
}

export function renderByName(name: WidgetName, ctx: WidgetContext): ReactElement {
  switch (name) {
    case "TasksList":
      return <TasksListWidget {...buildWidgetProps(ctx.tasks, ctx.tasksState, ctx.now)} />;
    case "TaskCountActive":
      return <TaskCount kind="active" {...countTasks(ctx.tasks, "active", ctx.now)} />;
    case "TaskCountP0":
      return <TaskCount kind="P0" {...countTasks(ctx.tasks, "P0", ctx.now)} />;
    case "AddTask":
      return <AddTask />;
    case "PomodoroBar":
      return <Pomodoro4x1 {...buildPomoProps(ctx.pomo, ctx.now)} />;
    case "PomodoroCard":
      return <Pomodoro4x2 {...buildPomoProps(ctx.pomo, ctx.now)} />;
    case "PomodoroTile":
      return <Pomodoro2x2 {...buildPomoProps(ctx.pomo, ctx.now)} />;
  }
}

// Redraws every widget that is on the home screen (except the one that is being redrawn right now).
// Several can be on screen, e.g. a tasks list and a count: a change in one must show in all.
export async function refreshWidgets(except?: WidgetName) {
  try {
    const ctx = await loadContext();
    for (const name of WIDGET_NAMES) {
      if (name === except) continue;
      try {
        await requestWidgetUpdate({
          widgetName: name,
          renderWidget: () => renderByName(name, ctx),
        });
      } catch {
        // that widget is not on the home screen
      }
    }
  } catch {
    // the launcher is busy: the next change tries again
  }
}
