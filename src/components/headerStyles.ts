import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { radius } from "@/style/globalStyles";

const headerStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});

export default headerStyles;
