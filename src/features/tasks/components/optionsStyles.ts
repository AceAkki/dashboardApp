import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { cardBase, glowBase } from "@/style/globalStyles";

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
});

export default optionsStyles;
