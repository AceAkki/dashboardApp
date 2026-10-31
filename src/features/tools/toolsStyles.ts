import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import {
  cardBase,
  glowBase,
  fieldBase,
  fontSize,
  hud,
  insetBase,
  primaryBtnBase,
  text,
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
  output: { ...text.caption, marginTop: 8 },

  // standup
  standupRow: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: hud.faint,
  },
  standupFirst: { borderTopWidth: 0 },
  standupLabel: { ...text.caption, width: 74, paddingTop: 4 },
  standupInput: {
    flex: 1,
    fontFamily: Typography.secondary,
    color: Colors.textPrimary,
    fontSize: fontSize.md,
    paddingVertical: 2,
  },

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
  snippetActions: { flexDirection: "row", gap: 14 },
  snippetAct: { ...text.caption, color: Colors.primary },
  snippetDel: { ...text.caption, color: Colors.danger },
  editSnippetForm: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,4,6,0.8)",
  },
  editSnippetContent: {
    ...cardBase,
    ...glowBase,
    overflow: "visible",
    width: "85%",
    gap: 16,
    padding: 16,
  },
  addForm: { gap: 8, marginTop: 10 },
  addInput: { ...fieldBase, fontSize: fontSize.sm },
  addCode: {
    ...fieldBase,
    fontSize: fontSize.sm,
    minHeight: 64,
    textAlignVertical: "top",
  },
  addBtn: { ...primaryBtnBase, paddingVertical: 8 },
  toggle: { ...text.caption, color: Colors.primary },
});

export default toolsStyles;
