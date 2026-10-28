import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { fontSize, text } from "@/style/globalStyles";

const taskStyles = StyleSheet.create({
  taskWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 16,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  taskTxt: {
    ...text.body,
    fontSize: fontSize.lg,
    flex: 1,
    marginRight: 8,
  },
  taskTxtWrap: {
    gap: 5,
  },
  taskBtn: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "flex-end",
  },
});

export default taskStyles;
