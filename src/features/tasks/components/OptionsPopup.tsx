import { useShallow } from "zustand/shallow";
import {
  Modal,
  Pressable,
  View,
  useWindowDimensions,
} from "react-native";
import { useState } from "react";

import MenuItem from "@/components/ctos/MenuItem";
import { feedback } from "@/global/useFeedback";

import { taskTypesArr } from "../taskTypeUtils";
import useOptions, { UNDO_ACTION } from "../hooks/useOptions";
import { useTaskStore } from "../hooks/useTasksStore";

import type { optionPopupProps } from "../taskTypes";
import optionsStyles from "./optionsStyles";

export default function OptionsPopup({
  taskObject,
  position,
  onClose,
}: optionPopupProps) {
  const { MoveBtns, getCurrentType } = useOptions();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const popupWidth = size.width;
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

  // The popup's top edge is the tap point, pulled up when it would run off the bottom.
  const top = Math.max(8, Math.min(position.y, screenHeight - size.height - 8));

  const handleToggleEdit = () => {
    // keep taskID so the edit form knows which task; Task hides this popup
    // automatically once isEditMode is true.
    // Only ever turns edit mode ON here: a second tap must not switch it back off.
    if (!useTaskStore.getState().isEditMode) toggleEditMode();
  };

  return (
    <Modal transparent visible statusBarTranslucent animationType="fade" onRequestClose={onClose}>
      <Pressable style={optionsStyles.backdrop} onPress={onClose}>
        <View
          style={[optionsStyles.optionsWrap, { top, left }]}
          onLayout={(e) => setSize(e.nativeEvent.layout)}
        >
          <View style={optionsStyles.optionsList}>
            <MoveBtns
              typesArr={newArr}
              moveTask={moveTask}
              taskObject={taskObject}
              currentType={currentType}
            />
            <MenuItem label="Remind Me" onPress={handleToggleEdit} />
            <MenuItem label="Edit Task" onPress={handleToggleEdit} />
            <MenuItem
              label="Delete Task"
              haptic="none"
              onPress={() => {
                deleteTask(taskObject.id);
                feedback.warn("TASK DELETED", UNDO_ACTION);
              }}
            />
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}
