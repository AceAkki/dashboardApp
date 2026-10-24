import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { cardBase, insetBase, text } from "@/style/globalStyles";

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
    ...cardBase,
    alignItems: "flex-start",
    gap: 8,
    padding: 16,
    borderTopRightRadius: 64,
    // visible so the iOS shadow isn't clipped
    overflow: "visible",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  optionBtn: {
    ...insetBase,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 32,
  },
  optionBtnPressed: {
    backgroundColor: Colors.primary,
  },
  optionTxt: { ...text.body },
  optionTxtPressed: {
    color: Colors.textOnPrimary,
  },
});

export default optionsStyles;
