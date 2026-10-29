import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";
import { text } from "@/style/globalStyles";
import { useTaskStore } from "../hooks/useTasksStore";
import CtosText from "@/components/CtosText";
import {
  formatDue,
  taskCode,
  taskColors,
  taskGlyphs,
  taskKindOf,
} from "../taskTypeUtils";
import type { TaskType } from "../taskTypes";
import taskStyles from "./taskStyles";

type Props = TaskType & {
  /** show the "▲ URGENT" tag. Hide it in a tab that already says the type. */
  showType?: boolean;
};

const Task = ({ taskTxt, showType = true }: Props) => {
  const setOpenTask = useTaskStore((state) => state.setOpenTask);

  const kind = taskKindOf(taskTxt.type);
  const color = taskColors[kind];
  const done = kind === "done";
  const due = done ? null : formatDue(taskTxt.remindTime);

  return (
    <View style={[taskStyles.taskWrap, { borderLeftColor: color }]}>
      <View style={taskStyles.taskBody}>
        <View style={taskStyles.metaRow}>
          <Text style={text.caption}>{taskCode(taskTxt.id)}</Text>
          {showType ? (
            <CtosText style={[taskStyles.typeTag, { color }]}>
              {taskGlyphs[kind]} {kind}
            </CtosText>
          ) : null}
        </View>

        <Text style={[taskStyles.taskTxt, done && taskStyles.taskTxtDone]}>
          {taskTxt.taskName}
        </Text>

        {due ? (
          <Text style={[text.caption, due.overdue && { color: Colors.danger }]}>
            {due.label}
          </Text>
        ) : null}
      </View>

      <Pressable
        style={taskStyles.taskBtn}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={`Options for ${taskTxt.taskName}`}
        onPress={(e) => {
          setOpenTask({
            id: taskTxt.id,
            x: e.nativeEvent.pageX,
            y: e.nativeEvent.pageY,
          });
        }}
      >
        <Ionicons name="options-outline" size={20} color={Colors.primary} />
      </Pressable>
    </View>
  );
};

export default Task;
