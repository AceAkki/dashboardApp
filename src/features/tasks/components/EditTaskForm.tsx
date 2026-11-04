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
import editStyles from "./editTaskFormStyles";
import { useTaskStore } from "../hooks/useTasksStore";
import type { TaskActionData } from "../taskTypes";

// a sensible starting point for a new reminder: one hour from now, on the minute
const inAnHour = () => {
  const d = new Date(Date.now() + 36e5);
  d.setSeconds(0, 0);
  return d;
};

const EditTaskForm = ({ taskObject }: { taskObject: TaskActionData }) => {
  const { editTask, toggleEditMode, editRemind } = useTaskStore(
    useShallow((state) => ({
      editTask: state.editTask,
      toggleEditMode: state.toggleEditMode,
      editRemind: state.editRemind,
    })),
  );
  const [newTaskTxt, setNewTaskTxt] = useState<string>(taskObject.taskName);
  // null = no reminder. This is the whole truth about the reminder: add sets it, clear empties it, and confirm saves exactly this.
  const [remind, setRemind] = useState<Date | null>(
    taskObject.remindTime ? new Date(taskObject.remindTime) : null,
  );
  // where the Android picker starts when there is no reminder yet
  const [suggested] = useState(inAnHour);
  // Android shows date and time in separate native dialogs
  const [pickerMode, setPickerMode] = useState<"date" | "time" | null>(null);

  const onPickerChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") {
      const wasDate = pickerMode === "date";
      if (event.type === "dismissed" || !selected) {
        setPickerMode(null);
        return;
      }
      setRemind(selected);
      setPickerMode(wasDate ? "time" : null);
      return;
    }
    if (selected) setRemind(selected);
  };

  const addReminder = () => {
    // Android: nothing is set until a date is actually picked, so closing the
    // dialog leaves the task without a reminder
    if (Platform.OS === "android") setPickerMode("date");
    else setRemind(suggested);
  };

  const clearReminder = () => {
    setRemind(null);
    setPickerMode(null);
  };

  const name = newTaskTxt.trim();
  const newTime = remind ? remind.toISOString() : "";
  // An overdue reminder that was already there may stay (renaming must still work);
  // a reminder the user just picked has to be in the future.
  const pickedPast =
    !!remind && newTime !== taskObject.remindTime && remind.getTime() <= Date.now();
  const hint = !name
    ? "TASK NAME CAN'T BE EMPTY"
    : pickedPast
      ? "PICK A TIME IN THE FUTURE"
      : null;
  const canSave = hint === null;

  const confirm = () => {
    if (!canSave) return;
    editTask({ id: taskObject.id, newTask: name });
    editRemind({ id: taskObject.id, newTime });
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
            placeholder="Task name"
            placeholderTextColor={Colors.textMuted}
          />

          {remind === null ? (
            <Pressable
              style={editStyles.taskEdit}
              onPress={addReminder}
              accessibilityRole="button"
              accessibilityLabel="Add reminder"
            >
              <Text style={editStyles.fieldTxt}>+ Add reminder</Text>
            </Pressable>
          ) : (
            <View style={editStyles.reminderBlock}>
              {Platform.OS === "ios" ? (
                <DateTimePicker
                  value={remind}
                  mode="datetime"
                  onChange={onPickerChange}
                />
              ) : (
                <Pressable
                  style={editStyles.taskEdit}
                  onPress={() => setPickerMode("date")}
                >
                  <Text style={editStyles.fieldTxt}>
                    {remind.toLocaleString()}
                  </Text>
                </Pressable>
              )}
              <Pressable
                onPress={clearReminder}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Clear reminder"
              >
                <Text style={editStyles.clearTxt}>Clear reminder</Text>
              </Pressable>
            </View>
          )}
          {Platform.OS === "android" && pickerMode && (
            <DateTimePicker
              value={remind ?? suggested}
              mode={pickerMode}
              onChange={onPickerChange}
            />
          )}

          {hint ? <Text style={editStyles.errorTxt}>{hint}</Text> : null}

          <View style={editStyles.btnWrap}>
            <Pressable
              onPress={confirm}
              disabled={!canSave}
              accessibilityState={{ disabled: !canSave }}
              style={[
                editStyles.btn,
                editStyles.confirmBtn,
                !canSave && editStyles.btnDisabled,
              ]}
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
