import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { cardBase, glowBase, insetBase, text } from "@/style/globalStyles";

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
    // visible so the iOS glow isn't clipped
    overflow: "visible",
    borderTopColor: Colors.primary,
    ...glowBase,
    elevation: 6,
  },
  optionBtn: {
    ...insetBase,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "stretch",
  },
  optionBtnPressed: {
    backgroundColor: Colors.primary,
  },
  optionTxt: { ...text.small, color: Colors.textPrimary, letterSpacing: 2 },
  optionTxtPressed: {
    color: Colors.textOnPrimary,
  },
});

export default optionsStyles;
