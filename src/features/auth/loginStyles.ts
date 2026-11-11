import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { fieldBase, primaryBtnBase, text } from "@/style/globalStyles";

const loginStyles = StyleSheet.create({
  // the screen scrolls, so the keyboard can never hide the button
  scroll: { flexGrow: 1, justifyContent: "center", padding: 24, gap: 22 },

  // logo + name
  brand: { alignItems: "center", gap: 10 },
  logoBox: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.secondarySoft,
  },
  logoTxt: {
    fontFamily: Typography.primary_bold,
    fontSize: 22,
    color: Colors.primary,
  },
  loginTitle: {
    ...text.heading,
    fontSize: 26,
    letterSpacing: 5,
    textAlign: "center",
  },

  // fields
  form: { gap: 16 },
  fieldWrap: { gap: 6 },
  input: { ...fieldBase },
  inputError: { borderColor: Colors.danger },
  inputPad: { paddingRight: 38 }, // room for the check mark
  checkWrap: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  errTxt: {
    fontFamily: Typography.primary,
    color: Colors.danger,
    letterSpacing: 1,
    marginTop: 4,
  },
  coordRow: { flexDirection: "row", gap: 12 },
  coordCol: { flex: 1 },

  // "Use my location": outlined, so Initialize stays the one filled button
  locateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  locateTxt: { ...text.btn, color: Colors.primary, fontSize: 13 },
  hint: { ...text.caption },

  submitBtn: { ...primaryBtnBase, paddingVertical: 12, flexDirection: "row", gap: 8 },
  submitTxt: { ...text.btn, fontSize: 16 },

  footer: { alignItems: "center", gap: 4 },
  footerTxt: { ...text.caption },
  footerOk: { ...text.caption, color: Colors.success },

  // still used by the User Profile screen
  locationBtn: {
    flexDirection: "row",
    alignSelf: "center",
    gap: 10,
  },

  imageBox: {
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.secondarySoft,
  },
});

export default loginStyles;
