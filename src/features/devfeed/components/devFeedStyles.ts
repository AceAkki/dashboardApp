import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { fontSize, hud, insetBase, text } from "@/style/globalStyles";

const devFeedStyles = StyleSheet.create({
  // one line inside a panel: marker, name, right-aligned value
  line: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: hud.faint,
  },
  lineFirst: { borderTopWidth: 0 },
  lineName: { ...text.body, flex: 1, fontSize: fontSize.md },
  lineValue: { ...text.caption, textAlign: "right" },
  points: {
    width: 40,
    fontFamily: Typography.primary_medium,
    fontSize: fontSize.md,
    color: Colors.primary,
  },
  hint: { ...text.caption, color: Colors.textMuted, marginTop: 6 },
  error: { ...text.caption, color: Colors.warning, marginTop: 6 },

  // full story card (Feed screen)
  story: {
    ...insetBase,
    flexDirection: "row",
    gap: 12,
    padding: 12,
    marginBottom: 10,
  },
  storyScore: { width: 44, alignItems: "center" },
  storyScoreNum: {
    fontFamily: Typography.primary_medium,
    fontSize: fontSize.lg,
    color: Colors.primary,
  },
  storyBody: { flex: 1 },
  storyTitle: { ...text.body, fontSize: 14, lineHeight: 19 },
  storyMeta: { ...text.caption, marginTop: 7 },
  storySource: { color: Colors.primary + "B3" },

  // source switcher
  chips: { flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingVertical: 12 },
});

export default devFeedStyles;
