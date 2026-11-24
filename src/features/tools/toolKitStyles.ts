import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import {
  fontSize,
  insetBase,
  text,
} from "@/style/globalStyles";

const kit = StyleSheet.create({
  // screen
  scroll: { padding: 16, paddingBottom: 40, gap: 16 },
  back: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  backTxt: { ...text.caption, color: Colors.primary },

  // Tools tab
  groupHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary,
  },
  groupCount: { ...text.muted, fontSize: fontSize.xs },
  toolGroup: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tile: {
    ...insetBase,
    height: 112,
    padding: 14,
    overflow: "hidden",
    borderLeftWidth: 2,
    borderLeftColor: Colors.primary,
  },
  tileMark: { position: "absolute", right: -14, bottom: -20, opacity: 0.07 },
  tileIcon: {
    marginBottom: 8,
    textShadowColor: Colors.primary,
    textShadowRadius: 12,
    textShadowOffset: { width: 0, height: 0 },
  },
  tileTitle: {
    fontFamily: Typography.primary_bold,
    color: Colors.textPrimary,
    fontSize: fontSize.md,
  },
  tileBlurb: { ...text.muted, fontSize: fontSize.xs, marginTop: 2 },

  // inside a panel
  stack: { gap: 12, marginVertical:5 },
  sub: { ...text.caption, color: Colors.primary, marginTop: 4 },

  // text field
  fieldActions: { flexDirection: "row", gap: 14 },

  // chips

  // buttons
  btn: { flex: 1 },

  // results
  blockText: {
    fontFamily: Typography.primary,
    color: Colors.primary,
    fontSize: fontSize.sm + 1,
    lineHeight: 18,
  },
  hit: { backgroundColor: Colors.primarySoft, color: Colors.textPrimary },
});

export default kit;
