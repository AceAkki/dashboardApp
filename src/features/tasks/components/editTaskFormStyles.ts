import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import {
  cardBase,
  fieldBase,
  fontSize,
  glowBase,
  radius,
} from "@/style/globalStyles";

const editTaskFormStyles = StyleSheet.create({
  // overlay (replaces fixed full-screen blurred layer)
  editTaskForm: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,4,6,0.8)",
  },
  editTaskContent: {
    ...cardBase,
    ...glowBase,
    overflow: "visible",
    width: "85%",
    gap: 16,
    padding: 16,
  },
  taskEdit: { ...fieldBase },
  // Text does not inherit colour or font from the field around it
  fieldTxt: {
    fontFamily: Typography.primary,
    fontSize: fontSize.md,
    color: Colors.textPrimary,
  },
  reminderBlock: { gap: 8 },
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
  btnDisabled: { opacity: 0.4 },
  confirmBtn: {
    backgroundColor: Colors.success,
  },
  cancelBtn: {
    backgroundColor: Colors.danger,
  },
});

export default editTaskFormStyles;
