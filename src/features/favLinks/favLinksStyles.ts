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

  sectionLabel: { ...text.label, marginBottom: 8 },

  // search bar
  searchBar: {
    ...fieldBase,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 0,
    height: 48,
    borderRadius: radius.md,
  },
  searchBarFocused: {
    borderColor: Colors.primary,
    ...glowBase,
  },
  searchInput: {
    flex: 1,
    fontFamily: Typography.secondary,
    color: Colors.textPrimary,
    fontSize: fontSize.lg,
    paddingVertical: 0,
    width: "100%",
  },
  clearBtn: { padding: 4 },
  goBtn: {
    ...primaryBtnBase,
    width: 25,
    height: 25,
    padding: 0,
  },
  goBtnDisabled: {
    backgroundColor: Colors.secondary,
    opacity: 0.5,
  },

  // engine chips
  chipsList: { gap: 8, paddingRight: 8 },
  chip: {
    ...chipBase,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
  },
  chipSelected: { ...chipActiveBase },
  chipPressed: { opacity: 0.7 },
  chipTxt: { ...text.small, fontSize: fontSize.md },
  chipTxtSelected: { color: Colors.primary, fontFamily: Typography.primary_bold },

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
