import { Text } from "react-native";

import CtosPressable from "@/components/ctos/CtosPressable";
import { feedback, type StatusAction } from "@/global/useFeedback";
import { useTaskStore } from "./useTasksStore";

import type { MoveBtnsProps, TasksTypes } from "../taskTypes";
import optionsStyles from "../components/optionsStyles";

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
        <CtosPressable
          key={targetType}
          haptic="none"
          style={optionsStyles.optionBtn}
          pressedStyle={optionsStyles.optionBtnPressed}
          onPress={() => {
            moveTask({
              id: taskObject.id,
              currentType,
              targetType,
            });
            feedback.success(`MOVED TO ${targetType.toUpperCase()}`, UNDO_ACTION);
          }}
        >
          {({ pressed }) => (
            <Text
              style={[
                optionsStyles.optionTxt,
                pressed && optionsStyles.optionTxtPressed,
              ]}
            >
              {targetType}
            </Text>
          )}
        </CtosPressable>
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
