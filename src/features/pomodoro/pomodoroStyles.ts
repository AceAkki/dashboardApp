import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import {
  cardBase,
  fontSize,
  radius,
  screenBase,
  text,
} from "@/style/globalStyles";

const pomodoroStyles = StyleSheet.create({
  // dashboard card
  card: { ...cardBase, flex: 1 },
  cardRingWrap: { alignItems: "center", marginVertical: 12 },
  cardTime: { ...text.title },
  cardMode: { ...text.caption },

  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },

  // full screen
  screen: { ...screenBase, backgroundColor: "transparent", padding: 16 },
  modeTabs: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 8,
  },

  ringWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  bigTime: { ...text.display },
  bigMode: { ...text.small, fontSize: 16, marginTop: 4 },

  bigControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 28,
    marginBottom: 24,
  },

  sessionRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 8,
  },
  sessionDot: {
    width: 12,
    height: 12,
    borderRadius: radius.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sessionDotDone: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sessionTxt: {
    ...text.small,
    textAlign: "center",
    fontSize: 12,
    marginBottom: 16,
  },
});

export default pomodoroStyles;
