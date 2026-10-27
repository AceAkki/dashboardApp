import { useState } from "react";
import { useShallow } from "zustand/shallow";
import {
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { Colors } from "@/constants/Colors";
import { useTaskStore } from "../hooks/useTasksStore";
import type { TaskActionData } from "../taskTypes";
import editStyles from "./editTaskFormStyles";

const EditTaskForm = ({ taskObject }: { taskObject: TaskActionData }) => {
  const { editTask, toggleEditMode, editRemind } = useTaskStore(
    useShallow((state) => ({
      editTask: state.editTask,
      toggleEditMode: state.toggleEditMode,
      editRemind: state.editRemind,
    })),
  );
  const [newTaskTxt, setNewTaskTxt] = useState<string>(taskObject.taskName);
  const [remindDate, setRemindDate] = useState<Date>(
    taskObject.remindTime ? new Date(taskObject.remindTime) : new Date(),
  );
  // Android shows date and time in separate native dialogs
  const [pickerMode, setPickerMode] = useState<"date" | "time" | null>(null);

  const onPickerChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (selected && event.type !== "dismissed") setDateTouched(true);
    if (Platform.OS === "android") {
      const wasDate = pickerMode === "date";
      if (event.type === "dismissed" || !selected) {
        setPickerMode(null);
        return;
      }
      setRemindDate(selected);
      setPickerMode(wasDate ? "time" : null);
      return;
    }
    if (selected) setRemindDate(selected);
  };

  const [dateTouched, setDateTouched] = useState(false);

  const confirm = () => {
    editTask({ id: taskObject.id, newTask: newTaskTxt });
    // only change the reminder if the user actually picked one, otherwise
    // renaming a task would silently add a reminder for "now"
    editRemind({
      id: taskObject.id,
      newTime: dateTouched ? remindDate.toISOString() : taskObject.remindTime,
    });
  };

  return (
    <Modal
      transparent
      visible
      animationType="fade"
      onRequestClose={() => toggleEditMode()}
    >
      <View style={editStyles.editTaskForm}>
        <View style={editStyles.editTaskContent}>
          <TextInput
            value={newTaskTxt}
            onChangeText={setNewTaskTxt}
            style={editStyles.taskEdit}
            placeholderTextColor={Colors.textMuted}
          />

          {Platform.OS === "ios" ? (
            <DateTimePicker
              value={remindDate}
              mode="datetime"
              onChange={onPickerChange}
            />
          ) : (
            <Pressable
              style={editStyles.taskEdit}
              onPress={() => setPickerMode("date")}
            >
              <Text>{remindDate.toLocaleString()}</Text>
            </Pressable>
          )}
          {Platform.OS === "android" && pickerMode && (
            <DateTimePicker
              value={remindDate}
              mode={pickerMode}
              onChange={onPickerChange}
            />
          )}

          <View style={editStyles.btnWrap}>
            <Pressable
              onPress={confirm}
              style={[editStyles.btn, editStyles.confirmBtn]}
            >
              <Text>Confirm</Text>
            </Pressable>
            <Pressable
              onPress={() => toggleEditMode()}
              style={[editStyles.btn, editStyles.cancelBtn]}
            >
              <Text>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditTaskForm;
