import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

const bentoStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16, paddingBottom: 32, gap: 20 },

  // header
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  locationPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  locationTxt: { color: Colors.textPrimary, fontSize: 12 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTxt: { color: Colors.textOnPrimary, fontWeight: "700", fontSize: 13 },

  greetWrap: { marginTop: 16 },
  greet: { color: Colors.textPrimary, fontSize: 22, fontWeight: "700" },
  greetSub: { color: Colors.textSecondary, fontSize: 13, fontWeight: "400" },
  synced: { color: Colors.textSecondary, fontSize: 11, marginTop: 4 },
  syncedDot: { color: Colors.success },

  // sections
  sectionLabel: {
    color: Colors.textSecondary,
    fontSize: 10,
    letterSpacing: 0.4,
    marginTop: 16,
    marginBottom: 6,
  },
  row: { flexDirection: "row", gap: 10 },
  card: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  cardHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { color: Colors.textPrimary, fontSize: 13, fontWeight: "700" },
  small: { color: Colors.textSecondary, fontSize: 11 },

  // section 1
  focusRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  focusTxtWrap: { flex: 1, gap: 12 },
  focusLabel: { color: Colors.textPrimary, fontWeight: "700", fontSize: 14 },
  barChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    height: 56,
  },
  bar: { width: 12, borderRadius: 3 },

  // weather
  weatherTemp: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: "700",
    marginTop: 4,
  },
  sparkRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
    height: 28,
    marginTop: 8,
  },
  sparkBar: { flex: 1, borderRadius: 2, backgroundColor: Colors.primarySoft },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  hourCell: { alignItems: "center", gap: 2 },

  // fav links
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: Colors.secondarySoft,
    marginTop: 6,
  },
  linkTxt: { color: Colors.textPrimary, fontSize: 12 },

  // pomodoro
  timerWrap: { alignItems: "center", marginVertical: 12 },
  timerRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 6,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  timerTxt: { color: Colors.textPrimary, fontSize: 26, fontWeight: "700" },
  timerControls: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    alignItems: "center",
  },
  playBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondarySoft,
    alignItems: "center",
    justifyContent: "center",
  },

  // notes
  noteLabel: { color: Colors.textSecondary, fontSize: 11, marginTop: 8 },
  noteInput: {
    color: Colors.textPrimary,
    backgroundColor: Colors.secondarySoft,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginTop: 4,
    fontSize: 12,
  },
  noteBody: { minHeight: 70, textAlignVertical: "top" },
  saveBtn: {
    marginTop: 8,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: "center",
  },
  saveTxt: { color: Colors.textOnPrimary, fontWeight: "600", fontSize: 13 },

  // news / link storage
  newsItem: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: Colors.secondarySoft,
    marginTop: 6,
  },
  newsTitle: { color: Colors.textPrimary, fontSize: 12, fontWeight: "600" },
  newsSub: { color: Colors.textSecondary, fontSize: 10 },
  linkTile: {
    height: 64,
    borderRadius: 8,
    backgroundColor: Colors.secondarySoft,
    marginTop: 6,
    padding: 6,
    justifyContent: "flex-end",
  },
});

export default bentoStyles;
