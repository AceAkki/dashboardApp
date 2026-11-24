import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import {
  fieldBase,
  fontSize,
  hud,
  insetBase,
  text,
  screenPad,
  spacing,
} from "@/style/globalStyles";

const toolsStyles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 32, gap: 16 },

  // terminal
  prompt: {
    ...fieldBase,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 0,
    height: 50,
    borderColor: hud.edge,
  },
  promptSign: {
    fontFamily: Typography.primary_bold,
    color: Colors.primary,
    fontSize: fontSize.lg,
  },
  promptInput: {
    flex: 1,
    fontFamily: Typography.primary,
    color: Colors.textPrimary,
    fontSize: fontSize.md,
    paddingVertical: 0,
  },
  outputRow: { marginTop: 8 },

  // header + filter
  headRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  count: { ...text.muted, fontSize: fontSize.xs, marginBottom: 6 },

  // snippets
  snippet: { ...insetBase, padding: 10, marginTop: 8 },
  snippetHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  snippetTitle: { ...text.caption, color: Colors.textSecondary, flex: 1 },
  snippetCode: {
    fontFamily: Typography.primary,
    color: Colors.primary,
    fontSize: fontSize.sm + 0.5,
    lineHeight: 17,
  },
  snippetTag: { ...text.caption, color: Colors.primary, marginBottom: 4 },
  snippetActions: { flexDirection: "row", gap: 14 },
  vaultScroll: { paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  vaultBody: { flex: 1, paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
  vaultPanel: { flex: 1 },

  // cheatsheet
  sheetScroll: {paddingBottom: 16, gap: 12 },
  sheetBody: { flex: 1, paddingHorizontal: 0, paddingBottom: 16, gap: 12 },
});

export default toolsStyles;
