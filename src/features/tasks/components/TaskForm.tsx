import { useState } from "react";
import { Text, View } from "react-native";
import { Colors } from "@/constants/Colors";
import CtosPressable from "@/components/ctos/CtosPressable";
import FocusInput from "@/components/ctos/FocusInput";
import { feedback } from "@/global/useFeedback";
import { MAX_NOTE } from "../taskTags";
import TagEditor, { type TagField } from "./TagEditor";
import taskManagerStyles from "./taskManagerStyles";

type TaskFormProps = {
  value: string;
  onChangeText: (text: string) => void;
  note: string;
  onNoteChange: (text: string) => void;
  tagField: TagField;
  /** tags used on other tasks, offered as tap-to-add */
  knownTags: string[];
  onSubmit: () => void;
};

const TaskForm = ({
  value,
  onChangeText,
  note,
  onNoteChange,
  tagField,
  knownTags,
  onSubmit,
}: TaskFormProps) => {
  const [tried, setTried] = useState(false);
  // note + tags are out of the way until the title is focused or "+ NOTE · TAGS" is tapped,
  // so a quick add stays one line and +
  const [more, setMore] = useState(false);

  // the same for the + button and the keyboard's Done
  const submit = () => {
    if (!value.trim()) {
      setTried(true);
      feedback.error("TYPE A TASK FIRST");
      return;
    }
    setTried(false);
    onSubmit();
    setMore(false);
    feedback.success("TASK ADDED");
  };

  return (
    <View>
      <View style={taskManagerStyles.form}>
        <FocusInput
          error={tried && !value.trim()}
          style={taskManagerStyles.formInput}
          placeholder="> add a new task"
          accessibilityLabel="New task"
          placeholderTextColor={Colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setMore(true)}
          onSubmitEditing={submit}
          returnKeyType="done"
        />
        <CtosPressable
          haptic="none"
          pressedStyle={{ opacity: 0.7 }}
          style={taskManagerStyles.formBtn}
          onPress={submit}
          accessibilityRole="button"
          accessibilityLabel="Add task"
        >
          <Text style={taskManagerStyles.formBtnTxt}>+</Text>
        </CtosPressable>
      </View>

      {more ? (
        <View style={taskManagerStyles.formMore}>
          <View style={taskManagerStyles.moreRow}>
            <Text style={taskManagerStyles.moreTxt}>{"// NOTE · TAGS"}</Text>
            <CtosPressable
              haptic="select"
              hitSlop={10}
              onPress={() => setMore(false)}
              accessibilityRole="button"
              accessibilityLabel="Hide note and tags"
            >
              <Text style={taskManagerStyles.moreTxt}>HIDE</Text>
            </CtosPressable>
          </View>
          <FocusInput
            style={taskManagerStyles.noteInput}
            value={note}
            onChangeText={onNoteChange}
            placeholder="note (optional)"
            placeholderTextColor={Colors.textMuted}
            maxLength={MAX_NOTE}
            multiline
            accessibilityLabel="Task note"
          />
          <TagEditor field={tagField} known={knownTags} />
        </View>
      ) : (
        <CtosPressable
          haptic="select"
          hitSlop={8}
          style={{ alignSelf: "flex-end", marginTop: 6 }}
          onPress={() => setMore(true)}
          accessibilityRole="button"
          accessibilityLabel="Add a note or tags"
        >
          <Text style={taskManagerStyles.moreTxt}>+ NOTE · TAGS</Text>
        </CtosPressable>
      )}
    </View>
  );
};

export default TaskForm;
