import { useShallow } from "zustand/shallow";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";
import { useTaskStore } from "../hooks/useTasksStore";
import { taskColors } from "../taskTypeUtils";
import type { TaskType, TasksTypes } from "../taskTypes";
import CtosText from "@/components/CtosText";

import globalStyles from "@/style/globalStyles";
import taskStyles from "./taskStyles";

const Task = ({ taskTxt }: TaskType) => {
  const { setOpenTask } = useTaskStore(
    useShallow((state) => ({
      setOpenTask: state.setOpenTask,
    })),
  );
  const currentType = Object.keys(taskTxt.type).filter(
    (typ) => taskTxt.type[typ as keyof TasksTypes],
  )[0] as keyof typeof taskColors;

  return (
    <View
      style={[
        taskStyles.taskWrap,
        { borderLeftColor: taskColors[currentType], borderLeftWidth: 3 },
      ]}
    >
      <View style={taskStyles.taskTxtWrap}>
        <Text style={taskStyles.taskTxt}>{taskTxt.taskName}</Text>

        <CtosText style={globalStyles.sectionLabel}>[{currentType}]</CtosText>
      </View>

      <Pressable
        style={taskStyles.taskBtn}
        hitSlop={10}
        onPress={(e) => {
          setOpenTask({
            id: taskTxt.id,
            x: e.nativeEvent.pageX,
            y: e.nativeEvent.pageY,
          });
        }}
      >
        <Ionicons
          name="options-outline"
          size={24}
          color={Colors.textSecondary}
        />
      </Pressable>
    </View>
  );
};

export default Task;
