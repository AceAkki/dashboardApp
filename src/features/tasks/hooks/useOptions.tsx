import { leaveThen } from "@/global/motion";
import MenuItem from "@/components/ctos/MenuItem";
import { feedback, type StatusAction } from "@/hooks/useFeedback";
import { useTaskStore } from "./useTasksStore";

import type { MoveBtnsProps, TasksTypes } from "../taskTypes";

// the UNDO button on the status strip after a delete or a move
export const UNDO_ACTION: StatusAction = {
  label: "Undo",
  run: () => {
    if (useTaskStore.getState().undoLast()) feedback.success("TASK RESTORED");
  },
};

export default function useOptions() {
  return {
    MoveBtns,
    getCurrentType,
  };
}

function MoveBtns({
  typesArr,
  moveTask,
  taskObject,
  currentType,
}: MoveBtnsProps) {
  return (
    <>
      {typesArr.map((targetType) => (
        <MenuItem
          key={targetType}
          label={targetType}
          haptic="none"
          onPress={() => {
            leaveThen(taskObject.id, () => moveTask({ id: taskObject.id, currentType, targetType }), "move");
            feedback.success(`MOVED TO ${targetType.toUpperCase()}`, UNDO_ACTION);
          }}
        />
      ))}
    </>
  );
}

function getCurrentType(object: TasksTypes): string {
  for (const [key, value] of Object.entries(object)) {
    if (value === true) {
      return key;
    }
  }
  return "";
}
