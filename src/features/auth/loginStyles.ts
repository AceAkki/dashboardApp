import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

// login.css wasn't provided, so these are sensible defaults - adjust to match.
const loginStyles = StyleSheet.create({
  loginSection: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  formWrap: {
    gap: 16,
    padding: 24,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  formIcon: {
    alignItems: "center",
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  input: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
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
    color: "#c62828",
    marginTop: 4,
  },
  locationBtn: {
    padding: 8,
  },
  submitBtn: {
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.orange,
  },
  submitTxt: {
    color: Colors.primary,
    fontSize: 16,
  },
});

export default loginStyles;
