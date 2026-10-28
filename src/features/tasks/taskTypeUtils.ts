import type { TasksTypes } from "@/features/tasks/taskTypes";
import { Colors } from "@/constants/Colors";

export const TABS = ["*/", "active", "urgent", "done"] as const;

export const getTaskTypes = (current = 1): TasksTypes => {
  let obj = {} as TasksTypes;
  for (let i = 0; i < TABS.length; i++) {
    if (i !== 0) {
      const txt = TABS[i] as keyof TasksTypes;
      obj[txt] = false;
    }
    if (i === current) {
      const txt = TABS[i] as keyof TasksTypes;
      obj[txt] = true;
    }
  }
  return obj as TasksTypes;
};

export const taskTypesArr = TABS.filter((Tab, i) => i !== 0);

export const taskColors = {
  active: Colors.primary,
  urgent: Colors.warning,
  done: Colors.secondary,
};
