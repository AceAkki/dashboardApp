import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";
import { text } from "@/style/globalStyles";
import { useTaskStore } from "../hooks/useTasksStore";
import CtosText from "@/components/CtosText";
import {
  formatDue,
  isFinished,
  taskCode,
  taskKindOf,
  taskMain,
} from "../taskTypeUtils";
import type { TaskType } from "../taskTypes";
import useNotifications from "@/global/useNotifications";

import taskStyles from "./taskStyles";
import { useEffect } from "react";

type Props = TaskType & {
  /** show the "▲ URGENT" tag. Hide it in a tab that already says the type. */
  showType?: boolean;
};

const Task = ({ taskTxt, showType = true }: Props) => {
  const setOpenTask = useTaskStore((state) => state.setOpenTask);
  const kind = taskKindOf(taskTxt.type);
  const { taskColor: color, taskGlyph } = taskMain[kind];
  const done = isFinished(kind);
  const due = done ? null : formatDue(taskTxt.remindTime);
  const { schedule, cancel } = useNotifications();

  // The task id is the notification id. Scheduling again replaces the old one, so a
  // Task that mounts twice (All tab + its own tab) or remounts never makes duplicates.
  useEffect(() => {
    const id = taskTxt.id;
    const when = new Date(taskTxt.remindTime); // "" gives an invalid date

    // finished, no reminder set, or the time has passed: make sure nothing is waiting
    if (done || !(when.getTime() > Date.now())) {
      cancel(id);
      return;
    }

    schedule(
      { title: "Task reminder", body: taskTxt.taskName, data: { taskId: id } },
      when,
      id,
    );

    // Do NOT cancel just because this component unmounted: leaving the screen must not
    // kill the reminder. Cancel only when the task itself is gone from the store.
    return () => {
      if (!useTaskStore.getState().tasks.some((t) => t.id === id)) cancel(id);
    };
  }, [taskTxt.id, taskTxt.taskName, taskTxt.remindTime, done, schedule, cancel]);

  return (
    <View style={[taskStyles.taskWrap, { borderLeftColor: color }]}>
      <View style={taskStyles.taskBody}>
        <View style={taskStyles.metaRow}>
          <Text style={text.caption}>{taskCode(taskTxt.id)}</Text>
          {showType ? (
            <CtosText style={[taskStyles.typeTag, { color }]}>
              {taskGlyph} {kind}
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