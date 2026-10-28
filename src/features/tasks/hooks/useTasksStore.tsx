import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { TaskActionData, MoveTaskProps } from "../taskTypes";
import { tasksKey } from "@/global/storageKeys";

export interface TaskStore {
  tasks: TaskActionData[];
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
  editTask: ({ id, newTask }: { id: string; newTask: string }) => void;
  editRemind: ({ id, newTime }: { id: string; newTime: string }) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
          taskID: null,
        })),
      moveTask: ({ id, targetType, currentType }) =>
        set((state) => ({
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
        })),
      updateTasks: (task) =>
        set((state) => ({
          tasks: [...state.tasks, task],
        })),
      clearAllTasks: () => {
        set({ tasks: [] });
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
      editTask: ({ id, newTask }) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, taskName: newTask } : task,
          ),
          isEditMode: false,
          taskID: null,
        })),
      editRemind: ({ id, newTime }) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, remindTime: newTime } : task,
          ),
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
