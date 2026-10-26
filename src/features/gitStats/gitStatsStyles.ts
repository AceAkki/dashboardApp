import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import {
  cardBase,
  chipActiveBase,
  chipBase,
  fieldBase,
  fontSize,
  insetBase,
  primaryBtnBase,
  radius,
  text,
} from "@/style/globalStyles";

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
