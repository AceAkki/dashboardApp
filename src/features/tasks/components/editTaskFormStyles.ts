import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

const editTaskFormStyles = StyleSheet.create({
  // overlay (replaces fixed full-screen blurred layer)
  editTaskForm: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  editTaskContent: {
    width: "85%",
    gap: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.primary,
  },
  taskEdit: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 10,
  },
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
    borderRadius: 10,
  },
  confirmBtn: {
    backgroundColor: "#4caf50",
  },
  cancelBtn: {
    backgroundColor: "#e57373",
  },
});

export default editTaskFormStyles;
