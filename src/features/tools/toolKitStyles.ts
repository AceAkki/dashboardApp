import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import {
  chipActiveBase,
  chipBase,
  fieldBase,
  fontSize,
  hud,
  insetBase,
  radius,
  text,
} from "@/style/globalStyles";

const kit = StyleSheet.create({
  // screen
  scroll: { padding: 16, paddingBottom: 40, gap: 16 },
  back: { flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-start", marginBottom: 10 },
  backTxt: { ...text.caption, color: Colors.primary },

  // inside a panel
  stack: { gap: 12 },
  sub: { ...text.caption, color: Colors.primary, marginTop: 4 },
  hint: { ...text.muted, fontSize: fontSize.xs },

  // text field
  fieldWrap: { gap: 6 },
  fieldHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  fieldActions: { flexDirection: "row", gap: 14 },
  action: { ...text.caption, color: Colors.primary },
  input: { ...fieldBase, fontSize: fontSize.sm + 1 },
  inputMulti: { minHeight: 96, textAlignVertical: "top" },

  // chips
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { ...chipBase, paddingVertical: 6, paddingHorizontal: 10, borderRadius: radius.xs },
  chipOn: { ...chipActiveBase, shadowOpacity: 0 },
  chipTxt: { ...text.caption },
  chipTxtOn: { color: Colors.primary },

  // buttons
  btnRow: { flexDirection: "row", gap: 10 },
  btn: { flex: 1, paddingVertical: 10 },
  btnGhost: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: hud.edge,
    backgroundColor: Colors.secondarySoft,
  },
  btnGhostTxt: { ...text.btn, color: Colors.primary },
  btnOff: { opacity: 0.45 },

  // results
  row: { ...insetBase, padding: 10, flexDirection: "row", alignItems: "center", gap: 10 },
  rowLabel: { ...text.caption, width: 88 },
  rowValue: {
    flex: 1,
    fontFamily: Typography.primary,
    color: Colors.textPrimary,
    fontSize: fontSize.sm + 1,
  },
  block: { ...insetBase, padding: 10, gap: 8 },
  blockHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  blockText: {
    fontFamily: Typography.primary,
    color: Colors.primary,
    fontSize: fontSize.sm + 1,
    lineHeight: 18,
  },
  status: { ...text.caption, fontSize: fontSize.sm },
  hit: { backgroundColor: Colors.primarySoft, color: Colors.textPrimary },
});

export default kit;
