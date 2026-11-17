import { Text, View } from "react-native";

import { Colors } from "@/constants/Colors";
import IconButton from "@/components/ctos/IconButton";
import Chip from "@/components/ctos/Chip";
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

import taskStyles from "./taskStyles";

type Props = TaskType & {
  /** show the "▲ URGENT" tag. Hide it in a tab that already says the type. */
  showType?: boolean;
};

const Task = ({ taskTxt, showType = true }: Props) => {
  const setOpenTask = useTaskStore((state) => state.setOpenTask);
  const kind = taskKindOf(taskTxt.type);
  const { taskColor: color, taskGlyph } = taskMain[kind];
  const done = isFinished(kind);
  const due = done ? null : formatDue(taskTxt.remindTime, Date.now(), taskTxt.repeat);

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

        {taskTxt.note ? (
          <Text style={taskStyles.noteTxt} numberOfLines={2}>
            {taskTxt.note}
          </Text>
        ) : null}

        {taskTxt.tags?.length || due ? (
          <View style={taskStyles.footRow}>
            <View style={taskStyles.tagRow}>
              {(taskTxt.tags ?? []).map((t) => (
                <Chip key={t} label={`#${t}`} size="sm" />
              ))}
            </View>
            {due ? (
              <Text
                style={[
                  text.caption,
                  taskStyles.dueTxt,
                  due.overdue && { color: Colors.danger },
                ]}
              >
                {due.label}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>

      <IconButton
        icon="options-outline"
        label={`Options for ${taskTxt.taskName}`}
        onPress={(e) => {
          setOpenTask({
            id: taskTxt.id,
            x: e.nativeEvent.pageX,
            y: e.nativeEvent.pageY,
          });
        }}
      />
    </View>
  );
};

export default Task;