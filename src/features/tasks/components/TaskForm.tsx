import { Pressable, Text, TextInput, View } from "react-native";
import { Colors } from "@/constants/Colors";
import taskManagerStyles from "./taskManagerStyles";

type TaskFormProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
};

const TaskForm = ({ value, onChangeText, onSubmit }: TaskFormProps) => {
  return (
    <View style={taskManagerStyles.form}>
      <TextInput
        style={taskManagerStyles.formInput}
        placeholder="> add a new task"
        accessibilityLabel="New task"
        placeholderTextColor={Colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="done"
      />
      <Pressable
        style={taskManagerStyles.formBtn}
        onPress={onSubmit}
        accessibilityRole="button"
        accessibilityLabel="Add task"
      >
        <Text style={taskManagerStyles.formBtnTxt}>+</Text>
      </Pressable>
    </View>
  );
};

export default TaskForm;
