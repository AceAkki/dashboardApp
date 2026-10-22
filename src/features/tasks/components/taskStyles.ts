import { StyleSheet } from "react-native";

const taskStyles = StyleSheet.create({
  taskWrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 16,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  taskTxt: {
    flex: 1,
    marginRight: 8,
  },
  taskBtn: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "flex-end",
  },
});

export default taskStyles;
