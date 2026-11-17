import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { text } from "@/style/globalStyles";

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
  form: { gap: 16 }, // room for the check mark
  coordRow: { flexDirection: "row", gap: 12 },
  coordCol: { flex: 1 },



  footer: { alignItems: "center", gap: 4 },
  footerTxt: { ...text.caption },
  footerOk: { ...text.caption, color: Colors.success },


});

export default loginStyles;
