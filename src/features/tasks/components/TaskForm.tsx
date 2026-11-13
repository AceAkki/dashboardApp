import { useState } from "react";
import { Text, View } from "react-native";
import { Colors } from "@/constants/Colors";
import CtosPressable from "@/components/ctos/CtosPressable";
import FocusInput from "@/components/ctos/FocusInput";
import { feedback } from "@/global/useFeedback";
import taskManagerStyles from "./taskManagerStyles";

type TaskFormProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
};

const TaskForm = ({ value, onChangeText, onSubmit }: TaskFormProps) => {
  const [tried, setTried] = useState(false);

  // the same for the + button and the keyboard's Done
  const submit = () => {
    if (!value.trim()) {
      setTried(true);
      feedback.error("TYPE A TASK FIRST");
      return;
    }
    setTried(false);
    onSubmit();
    feedback.success("TASK ADDED");
  };

  return (
    <View style={taskManagerStyles.form}>
      <FocusInput
        error={tried && !value.trim()}
        style={taskManagerStyles.formInput}
        placeholder="> add a new task"
        accessibilityLabel="New task"
        placeholderTextColor={Colors.textMuted}
        value={value}
        onChangeText={onChangeText}
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
  );
};

export default TaskForm;
