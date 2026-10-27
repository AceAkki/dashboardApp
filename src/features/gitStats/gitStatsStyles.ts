import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { cardBase, text } from "@/style/globalStyles";

const gitStatsStyles = StyleSheet.create({
  cardBase: {
    ...cardBase,
    padding: 16,
    gap: 20,
    flex: 1,
    justifyContent: "space-between",
  },

  sectionLabel: { ...text.label, marginBottom: 8 },
});

export default gitStatsStyles;
