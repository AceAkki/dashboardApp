import { useState } from "react";
import { useShallow } from "zustand/shallow";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
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
import { Typography } from "@/constants/Typography";
import globalStyles, {
  fieldBase,
  fontSize,
  primaryBtnBase,
  text,
} from "@/style/globalStyles";
import { useTaskStore } from "../hooks/useTasksStore";
import { getTaskTypes, taskCode } from "../taskTypeUtils";
import { MAX_NOTE, cleanNote, tagCounts } from "../taskTags";
import type { TaskActionData } from "../taskTypes";
import {
  REPEATS,
  repeatChipLabel,
  repeatSummary,
  type Repeat,
} from "../taskRepeat";
import TagEditor, { useTagField } from "./TagEditor";

const makeId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

// a sensible starting point for a new reminder: one hour from now, on the minute
const inAnHour = () => {
  const d = new Date(Date.now() + 36e5);
  d.setSeconds(0, 0);
  return d;
};

// One bottom sheet for both: edit a task (taskObject given) or add one (no taskObject, onClose given).
type Props = { taskObject?: TaskActionData; onClose?: () => void };

export default function TaskSheet({ taskObject, onClose }: Props) {
  const { editTask, editRemind, updateTasks, toggleEditMode } = useTaskStore(
    useShallow((state) => ({
      editTask: state.editTask,
      editRemind: state.editRemind,
      updateTasks: state.updateTasks,
      toggleEditMode: state.toggleEditMode,
    })),
  );
  const close = () => (onClose ? onClose() : toggleEditMode());

  const [title, setTitle] = useState(taskObject?.taskName ?? "");
  const [note, setNote] = useState(taskObject?.note ?? "");
  const tagField = useTagField(taskObject?.tags ?? []);
  // tags used on OTHER tasks, offered as tap-to-add
  const known = tagCounts(
    useTaskStore.getState().tasks.filter((t) => t.id !== taskObject?.id),
  )
    .slice(0, 8)
    .map((t) => t.tag);

  // null = no reminder. This is the whole truth about the reminder: add sets it, clear empties it, and save stores exactly this.
  const [remind, setRemind] = useState<Date | null>(
    taskObject?.remindTime ? new Date(taskObject.remindTime) : null,
  );
  // null = does not repeat. It takes its time of day from `remind`, so it only exists with one.
  const [repeat, setRepeat] = useState<Repeat | null>(taskObject?.repeat ?? null);
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
    // Android: nothing is set until a date is actually picked
    if (Platform.OS === "android") setPickerMode("date");
    else setRemind(suggested);
  };
  const clearReminder = () => {
    setRemind(null);
    setRepeat(null);
    setPickerMode(null);
  };

  const name = title.trim();
  const newTime = remind ? remind.toISOString() : "";
  // An overdue reminder that was already there may stay (renaming must still work);
  // a reminder the user just picked has to be in the future.
  const pickedPast =
    !!remind &&
    newTime !== (taskObject?.remindTime ?? "") &&
    remind.getTime() <= Date.now();
  const hint = !name
    ? "TASK NAME CAN'T BE EMPTY"
    : pickedPast
      ? "PICK A TIME IN THE FUTURE"
      : null;
  const [tried, setTried] = useState(false);

  const save = () => {
    if (hint) {
      setTried(true);
      feedback.error(hint);
      return;
    }
    const n = cleanNote(note);
    const tags = tagField.final;
    if (taskObject) {
      editTask({ id: taskObject.id, newTask: name, note: n ?? "", tags });
      editRemind({ id: taskObject.id, newTime, repeat: newTime ? repeat : null });
      feedback.success("TASK UPDATED");
      return;
    }
    updateTasks({
      id: makeId(),
      taskName: name,
      type: getTaskTypes(),
      remindTime: newTime,
      ...(newTime && repeat ? { repeat } : {}),
      ...(n ? { note: n } : {}),
      ...(tags.length ? { tags } : {}),
    });
    feedback.success("TASK ADDED");
    close();
  };

  return (
    <Modal transparent visible animationType="slide" onRequestClose={close}>
      <KeyboardAvoidingView
        style={s.root}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable
          style={s.backdrop}
          onPress={close}
          accessibilityLabel="Close"
        />
        <View style={s.sheet}>
          <View style={s.handle} />
          <View style={s.head}>
            <Text style={s.headTxt}>
              {taskObject
                ? `// EDIT TASK · ${taskCode(taskObject.id)}`
                : "// NEW TASK"}
            </Text>
            <CtosPressable haptic="select" hitSlop={10} onPress={close}>
              <Text style={text.caption}>CLOSE</Text>
            </CtosPressable>
          </View>

          <ScrollView
            contentContainerStyle={s.body}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <FocusInput
              autoFocus={!taskObject}
              error={tried && !name}
              style={s.title}
              value={title}
              onChangeText={setTitle}
              placeholder="> task"
              placeholderTextColor={Colors.textMuted}
              accessibilityLabel="Task name"
            />

            <View style={s.group}>
              <Text style={text.caption}>NOTE</Text>
              <FocusInput
                style={s.note}
                value={note}
                onChangeText={setNote}
                placeholder="note (optional)"
                placeholderTextColor={Colors.textMuted}
                maxLength={MAX_NOTE}
                multiline
                accessibilityLabel="Task note"
              />
            </View>

            <TagEditor field={tagField} known={known} />

            <View style={s.group}>
              <Text style={text.caption}>REMINDER</Text>
              {remind === null ? (
                <CtosPressable
                  style={s.field}
                  onPress={addReminder}
                  accessibilityRole="button"
                  accessibilityLabel="Add reminder"
                >
                  <Text style={s.fieldTxt}>+ Add reminder</Text>
                </CtosPressable>
              ) : (
                <View style={s.group}>
                  {Platform.OS === "ios" ? (
                    <DateTimePicker
                      value={remind}
                      mode="datetime"
                      onChange={onPickerChange}
                    />
                  ) : (
                    <CtosPressable
                      style={s.field}
                      onPress={() => setPickerMode("date")}
                    >
                      <Text style={s.fieldTxt}>{remind.toLocaleString()}</Text>
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
                    <Text style={s.clearTxt}>Clear reminder</Text>
                  </CtosPressable>
                </View>
              )}
              <Text style={text.caption}>REPEAT</Text>
              <View style={s.chips}>
                {([null, ...REPEATS] as (Repeat | null)[]).map((r) => {
                  const on = r === repeat;
                  return (
                    <CtosPressable
                      key={r ?? "none"}
                      haptic="select"
                      disabled={remind === null}
                      style={[
                        globalStyles.chip,
                        on && globalStyles.chipActive,
                        remind === null && s.chipOff,
                      ]}
                      onPress={() => setRepeat(r)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: on, disabled: remind === null }}
                    >
                      <Text style={[globalStyles.textSmall, on && { color: Colors.primary }]}>
                        {r ? repeatChipLabel(r, remind) : "NONE"}
                      </Text>
                    </CtosPressable>
                  );
                })}
              </View>
              <Text style={text.caption}>
                {remind === null
                  ? "SET A TIME FIRST, THE REPEAT FOLLOWS IT"
                  : repeat
                    ? repeatSummary(repeat, remind)
                    : "ONLY ONCE"}
              </Text>
              {Platform.OS === "android" && pickerMode && (
                <DateTimePicker
                  value={remind ?? suggested}
                  mode={pickerMode}
                  onChange={onPickerChange}
                />
              )}
            </View>

            {tried && hint ? <Text style={s.errorTxt}>{hint}</Text> : null}

            <View style={s.btns}>
              <CtosPressable
                style={[s.btn, s.cancel]}
                pressedStyle={{ opacity: 0.7 }}
                onPress={close}
              >
                <Text style={s.cancelTxt}>CANCEL</Text>
              </CtosPressable>
              <CtosPressable
                haptic="none"
                style={[s.btn, primaryBtnBase, { flex: 1 }]}
                pressedStyle={{ opacity: 0.7 }}
                onPress={save}
                accessibilityRole="button"
                accessibilityLabel={taskObject ? "Save task" : "Add task"}
              >
                <Text style={globalStyles.primaryBtnTxt}>
                  {taskObject ? "SAVE" : "ADD TASK"}
                </Text>
              </CtosPressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,4,6,0.75)",
  },
  sheet: {
    maxHeight: "90%",
    backgroundColor: Colors.surface,
    borderTopWidth: 2,
    borderTopColor: Colors.primary,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  handle: {
    alignSelf: "center",
    width: 36,
    height: 4,
    backgroundColor: Colors.border,
    marginBottom: 14,
  },
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  headTxt: { ...text.caption, color: Colors.primary },
  body: { gap: 16, paddingBottom: 28 },
  group: { gap: 8 },
  title: { ...fieldBase, paddingVertical: 12 },
  note: { ...fieldBase, minHeight: 64, textAlignVertical: "top" },
  field: { ...fieldBase },
  fieldTxt: {
    fontFamily: Typography.primary,
    fontSize: fontSize.md,
    color: Colors.textPrimary,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chipOff: { opacity: 0.35 },
  clearTxt: {
    fontFamily: Typography.primary,
    fontSize: fontSize.sm,
    color: Colors.danger,
    textAlign: "right",
  },
  errorTxt: {
    fontFamily: Typography.primary,
    fontSize: fontSize.xs,
    letterSpacing: 1,
    color: Colors.danger,
  },
  btns: { flexDirection: "row", gap: 8, marginTop: 4 },
  btn: { paddingVertical: 14, alignItems: "center", justifyContent: "center" },
  cancel: { flex: 1, borderWidth: 1, borderColor: Colors.border },
  cancelTxt: { ...text.caption, color: Colors.textSecondary },
});
