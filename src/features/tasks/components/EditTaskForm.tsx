import { useState } from "react";
import { useShallow } from "zustand/shallow";
import {
  Modal,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import { Colors } from "@/constants/Colors";
import CtosPressable from "@/components/ctos/CtosPressable";
import FocusInput from "@/components/ctos/FocusInput";
import { feedback } from "@/global/useFeedback";
import editStyles from "./editTaskFormStyles";
import TagEditor, { useTagField } from "./TagEditor";
import { useTaskStore } from "../hooks/useTasksStore";
import { MAX_NOTE, cleanNote, tagCounts } from "../taskTags";
import { getTaskTypes } from "../taskTypeUtils";
import type { TaskActionData } from "../taskTypes";

// a sensible starting point for a new reminder: one hour from now, on the minute
const inAnHour = () => {
  const d = new Date(Date.now() + 36e5);
  d.setSeconds(0, 0);
  return d;
};

const makeId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

// One form for both: edit a task (taskObject given) or add a new one (no taskObject, onClose given).
type Props = { taskObject?: TaskActionData; onClose?: () => void };

const EditTaskForm = ({ taskObject, onClose }: Props) => {
  const { editTask, toggleEditMode, editRemind, updateTasks } = useTaskStore(
    useShallow((state) => ({
      editTask: state.editTask,
      toggleEditMode: state.toggleEditMode,
      editRemind: state.editRemind,
      updateTasks: state.updateTasks,
    })),
  );
  const close = () => (onClose ? onClose() : toggleEditMode());
  const [newTaskTxt, setNewTaskTxt] = useState<string>(taskObject?.taskName ?? "");
  // old tasks have neither: the note box starts empty and the tag list starts empty
  const [note, setNote] = useState(taskObject?.note ?? "");
  const tagField = useTagField(taskObject?.tags ?? []);
  // tags used on OTHER tasks, offered as tap-to-add
  const known = tagCounts(
    useTaskStore.getState().tasks.filter((t) => t.id !== taskObject?.id),
  )
    .slice(0, 8)
    .map((t) => t.tag);
  // null = no reminder. This is the whole truth about the reminder: add sets it, clear empties it, and confirm saves exactly this.
  const [remind, setRemind] = useState<Date | null>(
    taskObject?.remindTime ? new Date(taskObject.remindTime) : null,
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
    !!remind && newTime !== (taskObject?.remindTime ?? "") && remind.getTime() <= Date.now();
  const hint = !name
    ? "TASK NAME CAN'T BE EMPTY"
    : pickedPast
      ? "PICK A TIME IN THE FUTURE"
      : null;
  const canSave = hint === null;

  const confirm = () => {
    if (!canSave) return;
    const n = cleanNote(note);
    const tags = tagField.final;
    if (taskObject) {
      editTask({
        id: taskObject.id,
        newTask: name,
        note: n ?? "",
        tags,
      });
      editRemind({ id: taskObject.id, newTime });
      feedback.success("TASK UPDATED");
      return;
    }
    updateTasks({
      id: makeId(),
      taskName: name,
      type: getTaskTypes(),
      remindTime: newTime,
      ...(n ? { note: n } : {}),
      ...(tags.length ? { tags } : {}),
    });
    feedback.success("TASK ADDED");
    close();
  };

  return (
    <Modal
      transparent
      visible
      animationType="fade"
      onRequestClose={close}
    >
      <View style={editStyles.editTaskForm}>
        <View style={editStyles.editTaskContent}>
         <ScrollView
          contentContainerStyle={editStyles.editScroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
         >
          <FocusInput
            autoFocus={!taskObject}
            error={!name}
            value={newTaskTxt}
            onChangeText={setNewTaskTxt}
            style={editStyles.taskEdit}
            placeholder="Task name"
            placeholderTextColor={Colors.textMuted}
          />

          <View style={{ gap: 8 }}>
            <Text style={editStyles.fieldLabel}>NOTE</Text>
            <FocusInput
              value={note}
              onChangeText={setNote}
              style={editStyles.noteInput}
              placeholder="add a note…"
              placeholderTextColor={Colors.textMuted}
              maxLength={MAX_NOTE}
              multiline
              accessibilityLabel="Task note"
            />
          </View>

          <TagEditor field={tagField} known={known} />

          {remind === null ? (
            <CtosPressable
              style={editStyles.taskEdit}
              onPress={addReminder}
              accessibilityRole="button"
              accessibilityLabel="Add reminder"
            >
              <Text style={editStyles.fieldTxt}>+ Add reminder</Text>
            </CtosPressable>
          ) : (
            <View style={editStyles.reminderBlock}>
              {Platform.OS === "ios" ? (
                <DateTimePicker
                  value={remind}
                  mode="datetime"
                  onChange={onPickerChange}
                />
              ) : (
                <CtosPressable
                  style={editStyles.taskEdit}
                  onPress={() => setPickerMode("date")}
                >
                  <Text style={editStyles.fieldTxt}>
                    {remind.toLocaleString()}
                  </Text>
                </CtosPressable>
              )}
              <CtosPressable
                haptic="select"
                pressedStyle={{ opacity: 0.5 }}
                onPress={clearReminder}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Clear reminder"
              >
                <Text style={editStyles.clearTxt}>Clear reminder</Text>
              </CtosPressable>
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
            <CtosPressable
              haptic="none"
              pressedStyle={{ opacity: 0.7 }}
              onPress={confirm}
              disabled={!canSave}
              accessibilityState={{ disabled: !canSave }}
              style={[
                editStyles.btn,
                editStyles.confirmBtn,
                !canSave && editStyles.btnDisabled,
              ]}
            >
              <Text>{taskObject ? "Confirm" : "Add"}</Text>
            </CtosPressable>
            <CtosPressable
              pressedStyle={{ opacity: 0.7 }}
              onPress={close}
              style={[editStyles.btn, editStyles.cancelBtn]}
            >
              <Text>Cancel</Text>
            </CtosPressable>
          </View>
         </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default EditTaskForm;
