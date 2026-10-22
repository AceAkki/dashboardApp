import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

const pomodoroStyles = StyleSheet.create({
  // dashboard card
  card: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { color: Colors.textPrimary, fontSize: 13, fontWeight: "700" },
  cardRingWrap: { alignItems: "center", marginVertical: 12 },
  cardTime: { color: Colors.textPrimary, fontSize: 22, fontWeight: "700" },
  cardMode: { color: Colors.textSecondary, fontSize: 10 },

  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  playBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondarySoft,
    alignItems: "center",
    justifyContent: "center",
  },

  // full screen
  screen: { flex: 1, backgroundColor: Colors.background, padding: 16 },
  modeTabs: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginTop: 8,
  },
  modeTab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modeTabActive: {
    backgroundColor: Colors.primarySoft,
    borderColor: Colors.primary,
  },
  modeTabTxt: { color: Colors.textSecondary, fontSize: 13 },
  modeTabTxtActive: { color: Colors.primary },

  ringWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  bigTime: { color: Colors.textPrimary, fontSize: 56, fontWeight: "700" },
  bigMode: { color: Colors.textSecondary, fontSize: 16, marginTop: 4 },

  bigControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 28,
    marginBottom: 24,
  },
  bigPlayBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
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
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sessionDotDone: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sessionTxt: {
    color: Colors.textSecondary,
    textAlign: "center",
    fontSize: 12,
    marginBottom: 16,
  },
});

export default pomodoroStyles;
