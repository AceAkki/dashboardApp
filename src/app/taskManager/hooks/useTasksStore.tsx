import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { TaskActionData, MoveTaskProps } from "../taskTypes";
import { tasksKey } from "../../../global/storageKeys";

interface useTaskStore {
  tasks: TaskActionData[];
  deleteTask: (id: string) => void;
  moveTask: ({ id, targetType, currentType }: MoveTaskProps) => void;
  updateTasks: (task: TaskActionData) => void;
  clearAllTasks: () => void;
  taskID: string | null;
  setTaskID: (id: string | null) => void;
  isEditMode: boolean;
  toggleEditMode: () => void;
  editTask: ({ id, newTask }: { id: string; newTask: string }) => void;
  editRemind: ({ id, newTime }: { id: string; newTime: string }) => void;
}

export const useTaskStore = create<useTaskStore>()(
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
        localStorage.removeItem(tasksKey);
      },
      taskID: null,
      setTaskID: (id) => set({ taskID: id }),
      isEditMode: false,
      toggleEditMode: () =>
        set((state) => ({
          isEditMode: state.isEditMode ? false : true,
          taskID: state.isEditMode ? null : state.taskID,
        })),
      editTask: ({ id, newTask }) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  taskName: newTask,
                }
              : task,
          ),
          isEditMode: false,
          taskID: null,
        })),
      editRemind: ({ id, newTime }) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  remindTime: newTime,
                }
              : task,
          ),
          isEditMode: false,
          taskID: null,
        })),
    }),
    // partialize code deters mentioned from storing to local storage
    { name: tasksKey, partialize: ({ taskID, ...rest }) => rest }, // localStorage key)
  ),
);
