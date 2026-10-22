import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

const tasksMainStyles = StyleSheet.create({
  tasksMainWrap: {
    padding: 16,
    height: 260,
    backgroundColor: "rgba(255,255,255,0.6)",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    overflow: "hidden",
  },
  tasksMainTitle: {
    fontSize: 19,
    fontWeight: "700",
    textAlign: "center",
    color: Colors.border,
    borderRadius: 5,
  },
  empty: {
    textAlign: "center",
    marginTop: 16,
    opacity: 0.6,
  },
});

export default tasksMainStyles;
