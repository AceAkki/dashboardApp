import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

const optionsStyles = StyleSheet.create({
  // full-screen transparent layer that closes the popup when tapped outside
  backdrop: {
    flex: 1,
  },
  optionsWrap: {
    position: "absolute",
    zIndex: 5,
  },
  optionsList: {
    alignItems: "flex-start",
    gap: 8,
    padding: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 64,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  optionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 32,
    backgroundColor: "#f0f0f0",
  },
  optionBtnPressed: {
    backgroundColor: "#333",
  },
  optionTxt: {
    color: Colors.border,
  },
  optionTxtPressed: {
    color: "#f0f0f0",
  },
});

export default optionsStyles;
