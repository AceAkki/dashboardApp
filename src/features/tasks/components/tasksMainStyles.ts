import { StyleSheet } from "react-native";
import { cardBase, text } from "@/style/globalStyles";

const tasksMainStyles = StyleSheet.create({
  tasksMainWrap: { ...cardBase, padding: 16},
  tasksMainTitle: { ...text.cardTitle, fontSize: 19, textAlign: "center" },
  empty: { ...text.small, textAlign: "center", marginTop: 16 },
});

export default tasksMainStyles;
