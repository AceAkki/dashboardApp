import { Pressable, Text } from "react-native";

import type { MoveBtnsProps, TasksTypes } from "../taskTypes";
import optionsStyles from "../components/optionsStyles";

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
        <Pressable
          key={targetType}
          style={({ pressed }) => [
            optionsStyles.optionBtn,
            pressed && optionsStyles.optionBtnPressed,
          ]}
          onPress={() =>
            moveTask({
              id: taskObject.id,
              currentType,
              targetType,
            })
          }
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
        </Pressable>
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
