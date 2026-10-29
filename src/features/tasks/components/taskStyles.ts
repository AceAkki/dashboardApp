import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { fontSize, hud, insetBase, text } from "@/style/globalStyles";

const taskStyles = StyleSheet.create({
  // a row is a small panel with a status bar on its left edge
  // (Task.tsx sets the bar colour from the task type)
  taskWrap: {
    ...insetBase,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderLeftWidth: 3,
  },
  taskBody: { flex: 1, gap: 6, marginRight: 10 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  taskTxt: { ...text.body, fontSize: fontSize.lg },
  taskTxtDone: {
    color: Colors.textMuted,
    textDecorationLine: "line-through",
    textDecorationColor: hud.edge,
  },
  typeTag: { ...text.caption },
  taskBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
});

export default taskStyles;
