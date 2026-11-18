import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { TaskActionData, MoveTaskProps, TasksTypes } from "../taskTypes";
import type { Repeat } from "../taskRepeat";
import { tasksKey } from "@/global/storageKeys";
import { animateNext } from "@/global/motion";

// the last delete or move, kept so it can be taken back. Not saved: gone when the app closes.
export type TaskChange =
  | { kind: "delete"; task: TaskActionData; index: number }
  | { kind: "move"; id: string; before: TasksTypes };

export interface TaskStore {
  tasks: TaskActionData[];
  lastChange: TaskChange | null;
  /** takes back the last delete or move; false when there is nothing to take back */
  undoLast: () => boolean;
  deleteTask: (id: string) => void;
  moveTask: ({ id, targetType, currentType }: MoveTaskProps) => void;
  updateTasks: (task: TaskActionData) => void;
  clearAllTasks: () => void;
  taskID: string | null;
  setTaskID: (id: string | null) => void;
  taskPosition: { x: number | null; y: number | null };
  setTaskPosition: ({ x, y }: { x: number; y: number }) => void;
  setOpenTask: ({ id, x, y }: { id: string; x: number; y: number }) => void;
  isEditMode: boolean;
  toggleEditMode: () => void;
  // note / tags: left alone when not passed, removed when passed empty
  editTask: (args: {
    id: string;
    newTask: string;
    note?: string;
    tags?: string[];
  }) => void;
  // repeat: left alone when not passed, removed when null or when there is no time
  editRemind: (args: { id: string; newTime: string; repeat?: Repeat | null }) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      lastChange: null,
      undoLast: () => {
        const change = get().lastChange;
        if (!change) return false;
        if (change.kind === "delete") {
          if (get().tasks.some((t) => t.id === change.task.id)) return false;
          animateNext();
          set((state) => {
            const tasks = [...state.tasks];
            tasks.splice(Math.min(change.index, tasks.length), 0, change.task);
            return { tasks, lastChange: null };
          });
          return true;
        }
        if (!get().tasks.some((t) => t.id === change.id)) return false;
        animateNext();
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === change.id ? { ...t, type: change.before } : t)),
          lastChange: null,
        }));
        return true;
      },
      deleteTask: (id) => {
        animateNext();
        set((state) => {
          const index = state.tasks.findIndex((task) => task.id === id);
          if (index < 0) return { taskID: null };
          return {
            tasks: state.tasks.filter((task) => task.id !== id),
            taskID: null,
            lastChange: { kind: "delete", task: state.tasks[index], index },
          };
        });
      },
      moveTask: ({ id, targetType, currentType }) => {
        animateNext();
        set((state) => ({
          lastChange: (() => {
            const task = state.tasks.find((t) => t.id === id);
            return task ? ({ kind: "move", id, before: task.type } as TaskChange) : state.lastChange;
          })(),
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  type: {
                    ...task.type,
                    [targetType]: true,
                    [currentType]: false,
                  },
                }
              : task,
          ),
          taskID: null,
        }));
      },
      updateTasks: (task) => {
        animateNext();
        set((state) => ({
          tasks: [...state.tasks, task],
        }));
      },
      clearAllTasks: () => {
        set({ tasks: [], lastChange: null });
        AsyncStorage.removeItem(tasksKey);
      },
      taskID: null,
      setTaskID: (id) => set({ taskID: id }),
      taskPosition: { x: null, y: null },
      setTaskPosition: ({ x, y }) => set({ taskPosition: { x: x, y: y } }),
      setOpenTask: ({ id, x, y }) =>
        set(() => ({
          taskID: id,
          taskPosition: { x: x, y: y },
        })),
      isEditMode: false,
      toggleEditMode: () =>
        set((state) => ({
          isEditMode: !state.isEditMode,
          // keep taskID while editing so the form knows which task; clear on close
          taskID: state.isEditMode ? null : state.taskID,
        })),
      editTask: ({ id, newTask, note, tags }) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== id) return task;
            const next = { ...task, taskName: newTask };
            if (note !== undefined) {
              if (note) next.note = note;
              else delete next.note;
            }
            if (tags !== undefined) {
              if (tags.length) next.tags = tags;
              else delete next.tags;
            }
            return next;
          }),
          isEditMode: false,
          taskID: null,
        })),
      editRemind: ({ id, newTime, repeat }) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== id) return task;
            const next = { ...task, remindTime: newTime };
            // a repeat needs the time it repeats at
            if (!newTime || repeat === null) delete next.repeat;
            else if (repeat !== undefined) next.repeat = repeat;
            return next;
          }),
          isEditMode: false,
          taskID: null,
        })),
    }),
    {
      name: tasksKey,
      storage: createJSONStorage(() => AsyncStorage),
      // taskID / isEditMode are transient UI state, don't persist them
      partialize: ({ tasks }) => ({ tasks }),
    },
  ),
);
