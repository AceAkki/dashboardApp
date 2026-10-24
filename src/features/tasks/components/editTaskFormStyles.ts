import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { cardBase, fieldBase, radius } from "@/style/globalStyles";

const editTaskFormStyles = StyleSheet.create({
  // overlay (replaces fixed full-screen blurred layer)
  editTaskForm: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  editTaskContent: { ...cardBase, width: "85%", gap: 16, padding: 16 },
  taskEdit: { ...fieldBase },
  btnWrap: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
  },
  btn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: radius.sm,
  },
  confirmBtn: {
    backgroundColor: Colors.success,
  },
  cancelBtn: {
    backgroundColor: Colors.danger,
  },
});

export default editTaskFormStyles;
