import { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useShallow } from "zustand/shallow";
import DateTimePicker, {
  type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import Button from "@/components/ctos/Button";
import ButtonRow from "@/components/ctos/ButtonRow";
import Chip from "@/components/ctos/Chip";
import ChipRow from "@/components/ctos/ChipRow";
import Field from "@/components/ctos/Field";
import FieldLabel from "@/components/ctos/FieldLabel";
import Hint from "@/components/ctos/Hint";
import Sheet from "@/components/ctos/Sheet";
import Status from "@/components/ctos/Status";
import { feedback } from "@/global/useFeedback";
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
    <Sheet
      onClose={close}
      title={taskObject ? `EDIT TASK · ${taskCode(taskObject.id)}` : "NEW TASK"}
    >
      <Field
        label="Task"
        autoFocus={!taskObject}
        value={title}
        onChangeText={setTitle}
        placeholder="> task"
        error={tried && !name ? "TASK NAME CAN'T BE EMPTY" : undefined}
      />

      <Field
        label="Note"
        value={note}
        onChangeText={setNote}
        placeholder="note (optional)"
        maxCount={MAX_NOTE}
        multiline
      />

      <TagEditor field={tagField} known={known} />

      <View style={s.group}>
        <FieldLabel>Reminder</FieldLabel>
        {remind === null ? (
          <Button label="+ Add reminder" variant="secondary" onPress={addReminder} />
        ) : (
          <>
            {Platform.OS === "ios" ? (
              <DateTimePicker value={remind} mode="datetime" onChange={onPickerChange} />
            ) : (
              <Button
                label={remind.toLocaleString()}
                variant="secondary"
                onPress={() => setPickerMode("date")}
              />
            )}
            <Button label="Clear reminder" variant="text" size="sm" onPress={clearReminder} style={s.clear} />
          </>
        )}
        {tried && pickedPast ? <Status tone="err">{hint}</Status> : null}
      </View>

      <View style={s.group}>
        <FieldLabel>Repeat</FieldLabel>
        <ChipRow>
          {([null, ...REPEATS] as (Repeat | null)[]).map((r) => (
            <Chip
              key={r ?? "none"}
              label={r ? repeatChipLabel(r, remind) : "None"}
              selected={r === repeat}
              disabled={remind === null}
              onPress={() => setRepeat(r)}
            />
          ))}
        </ChipRow>
        <Hint>
          {remind === null
            ? "SET A TIME FIRST, THE REPEAT FOLLOWS IT"
            : repeat
              ? repeatSummary(repeat, remind)
              : "ONLY ONCE"}
        </Hint>
        {Platform.OS === "android" && pickerMode && (
          <DateTimePicker value={remind ?? suggested} mode={pickerMode} onChange={onPickerChange} />
        )}
      </View>

      <ButtonRow>
        <Button label="Cancel" variant="secondary" onPress={close} style={s.flex} />
        <Button
          label={taskObject ? "Save" : "Add task"}
          haptic="none"
          onPress={save}
          style={s.flex}
        />
      </ButtonRow>
    </Sheet>
  );
}

const s = StyleSheet.create({
  group: { gap: 8 },
  flex: { flex: 1 },
  clear: { alignSelf: "flex-end" },
});
