import { StyleSheet } from "react-native";
import { cardBase, text } from "@/style/globalStyles";

const tasksMainStyles = StyleSheet.create({
  tasksMainWrap: { ...cardBase, padding: 16, flex: 1 },
  tasksMainTitle: { ...text.label, marginBottom: 6 },
  empty: { ...text.small, textAlign: "center", marginTop: 24, lineHeight: 20 },
});

export default tasksMainStyles;
