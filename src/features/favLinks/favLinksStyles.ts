import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import {
  cardBase,
  chipActiveBase,
  chipBase,
  fieldBase,
  fontSize,
  glowBase,
  insetBase,
  primaryBtnBase,
  radius,
  text,
} from "@/style/globalStyles";

const favLinksStyles = StyleSheet.create({
  favLinks: {
    ...cardBase,
    padding: 16,
    gap: 20,
    flex: 1,
    justifyContent: "space-between",
  },

  section: { gap: 8 },
  chipsList: { gap: 8, paddingRight: 8 },



  // favicon with fallback
  icon: { width: 20, height: 20, borderRadius: radius.xs },
  iconFallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.secondary,
  },
  iconFallbackTxt: { ...text.body, fontFamily: Typography.secondary_bold, fontSize: fontSize.xs },

  // quick links
  quickRow: { gap: 8 },
  quickItem: {
    ...insetBase,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: radius.sm,
    flex: 1,
    alignItems: "center",
    gap: 6,
    padding: 10,
    width: 100,
  },
  quickItemPressed: { ...chipActiveBase },
  quickTxt: { ...text.small },
});

export default favLinksStyles;
