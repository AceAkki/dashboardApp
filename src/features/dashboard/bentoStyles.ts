import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import {
  cardBase,
  cardHeadBase,
  fontSize,
  insetBase,
  primaryBtnBase,
  radius,
  screenBase,
  text,
} from "@/style/globalStyles";

const bentoStyles = StyleSheet.create({
  root: { ...screenBase },
  scroll: { padding: 16, paddingBottom: 32, gap: 20 },

  // header
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  locationPill: {
    ...cardBase,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  locationTxt: { ...text.body, fontSize: 12 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTxt: { ...text.btn, fontFamily: Typography.primary_bold },

  greetWrap: { marginTop: 16 },
  greet: { ...text.title },
  greetSub: { ...text.small, fontSize: fontSize.md },
  synced: { ...text.small, marginTop: 4 },
  syncedDot: { color: Colors.success },

  // sections
  sectionLabel: { ...text.label, marginTop: 16, marginBottom: 6 },
  row: { flexDirection: "row", gap: 10 },
  card: { ...cardBase, flex: 1 },
  cardHead: { ...cardHeadBase },
  cardTitle: { ...text.cardTitle },
  small: { ...text.small },

  // section 1
  focusRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  focusTxtWrap: { flex: 1, gap: 12 },
  focusLabel: { ...text.cardTitle, fontSize: 14 },
  barChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    height: 56,
  },
  bar: { width: 12, borderRadius: 3 },

  // weather
  weatherTemp: { ...text.title, marginTop: 4 },
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
    ...insetBase,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginTop: 6,
  },
  linkTxt: { ...text.body, fontSize: 12 },

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
  timerTxt: { ...text.heading },
  timerControls: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    alignItems: "center",
  },
  playBtn: {
    ...insetBase,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  // notes
  noteLabel: { ...text.small, marginTop: 8 },
  noteInput: {
    ...insetBase,
    fontFamily: Typography.secondary,
    color: Colors.textPrimary,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginTop: 4,
    fontSize: 12,
  },
  noteBody: { minHeight: 70, textAlignVertical: "top" },
  saveBtn: { ...primaryBtnBase, marginTop: 8, borderRadius: radius.xs },
  saveTxt: { ...text.btn },

  // news / link storage
  newsItem: { ...insetBase, padding: 8, marginTop: 6 },
  newsTitle: { ...text.body, fontFamily: Typography.secondary_semibold, fontSize: 12 },
  newsSub: { ...text.caption },
  linkTile: {
    ...insetBase,
    height: 64,
    marginTop: 6,
    padding: 6,
    justifyContent: "flex-end",
  },
});

export default bentoStyles;
