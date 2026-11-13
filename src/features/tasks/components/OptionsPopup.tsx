import { useShallow } from "zustand/shallow";
import {
  Modal,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useState } from "react";

import CtosPressable from "@/components/ctos/CtosPressable";
import { feedback } from "@/global/useFeedback";

import { taskTypesArr } from "../taskTypeUtils";
import useOptions from "../hooks/useOptions";
import { useTaskStore } from "../hooks/useTasksStore";

import type { optionPopupProps } from "../taskTypes";
import optionsStyles from "./optionsStyles";

export default function OptionsPopup({
  taskObject,
  position,
  onClose,
}: optionPopupProps) {
  const { MoveBtns, getCurrentType } = useOptions();
  const { width: screenWidth } = useWindowDimensions();
  const [popupWidth, setPopupWidth] = useState(0);
  const { moveTask, deleteTask, toggleEditMode } = useTaskStore(
    useShallow((state) => ({
      moveTask: state.moveTask,
      deleteTask: state.deleteTask,
      toggleEditMode: state.toggleEditMode,
    })),
  );

  const currentType = getCurrentType(taskObject.type);
  const newArr = taskTypesArr.filter((type) => type !== currentType);

  // Popup's right edge sits at the tap point (same as the web calc(x - width)),
  // clamped so it never leaves the screen.
  const left = Math.max(
    8,
    Math.min(position.x - popupWidth, screenWidth - popupWidth - 8),
  );

  const handleToggleEdit = () => {
    // keep taskID so the edit form knows which task; Task hides this popup
    // automatically once isEditMode is true
    toggleEditMode();
  };

  return (
    <Modal transparent visible animationType="fade" onRequestClose={onClose}>
      <Pressable style={optionsStyles.backdrop} onPress={onClose}>
        <View
          style={[optionsStyles.optionsWrap, { top: position.y, left }]}
          onLayout={(e) => setPopupWidth(e.nativeEvent.layout.width)}
        >
          <View style={optionsStyles.optionsList}>
            <MoveBtns
              typesArr={newArr}
              moveTask={moveTask}
              taskObject={taskObject}
              currentType={currentType}
            />
            <CtosPressable
              style={optionsStyles.optionBtn}
              pressedStyle={optionsStyles.optionBtnPressed}
              onPress={handleToggleEdit}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    optionsStyles.optionTxt,
                    pressed && optionsStyles.optionTxtPressed,
                  ]}
                >
                  Remind Me
                </Text>
              )}
            </CtosPressable>
            <CtosPressable
              style={optionsStyles.optionBtn}
              pressedStyle={optionsStyles.optionBtnPressed}
              onPress={handleToggleEdit}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    optionsStyles.optionTxt,
                    pressed && optionsStyles.optionTxtPressed,
                  ]}
                >
                  Edit Task
                </Text>
              )}
            </CtosPressable>
            <CtosPressable
              haptic="none"
              style={optionsStyles.optionBtn}
              pressedStyle={optionsStyles.optionBtnPressed}
              onPress={() => {
                deleteTask(taskObject.id);
                feedback.warn("TASK DELETED");
              }}
            >
              {({ pressed }) => (
                <Text
                  style={[
                    optionsStyles.optionTxt,
                    pressed && optionsStyles.optionTxtPressed,
                  ]}
                >
                  Delete Task
                </Text>
              )}
            </CtosPressable>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}
