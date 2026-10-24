import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import {
  cardBase,
  fieldBase,
  primaryBtnBase,
  text,
} from "@/style/globalStyles";

const loginStyles = StyleSheet.create({
  loginSection: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  formWrap: { ...cardBase, gap: 16, padding: 24 },
  formIcon: {
    alignItems: "center",
  },
  loginTitle: { ...text.heading, fontSize: 28, textAlign: "center" },
  input: { ...fieldBase },
  locationMainWrap: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  locationGrpWrap: {
    flex: 1,
    gap: 12,
  },
  errTxt: {
    fontFamily: Typography.secondary,
    color: Colors.danger,
    marginTop: 4,
  },
  locationBtn: {
    padding: 8,
  },
  submitBtn: { ...primaryBtnBase, paddingVertical: 10 },
  submitTxt: { ...text.btn, fontSize: 16 },
});

export default loginStyles;
