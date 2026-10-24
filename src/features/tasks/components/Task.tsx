import { useState } from "react";
import { useShallow } from "zustand/shallow";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";
import { useTaskStore } from "../hooks/useTasksStore";
import type { TaskType } from "../taskTypes";
import OptionsPopup from "./OptionsPopup";
import taskStyles from "./taskStyles";

const Task = ({ taskTxt }: TaskType) => {
  const { taskID, setTaskID, isEditMode } = useTaskStore(
    useShallow((state) => ({
      taskID: state.taskID,
      setTaskID: state.setTaskID,
      isEditMode: state.isEditMode,
    })),
  );

  // Popup position is derived from the press, so it lives with the Task
  // (replaces the --optionLeft / --optionTop CSS variables).
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isOpen = taskID === taskTxt.id && !isEditMode;

  return (
    <View style={taskStyles.taskWrap}>
      <Text style={taskStyles.taskTxt}>{taskTxt.taskName}</Text>
      <Pressable
        style={taskStyles.taskBtn}
        hitSlop={10}
        onPress={(e) => {
          setPosition({ x: e.nativeEvent.pageX, y: e.nativeEvent.pageY });
          setTaskID(taskID === taskTxt.id ? null : taskTxt.id);
        }}
      >
        <Ionicons name="options-outline" size={24} color={Colors.textSecondary} />
      </Pressable>
      {isOpen && (
        <OptionsPopup
          taskObject={taskTxt}
          position={position}
          onClose={() => setTaskID(null)}
        />
      )}
    </View>
  );
};

export default Task;
