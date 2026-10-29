import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import {
  cardBase,
  cardHeadBase,
  fontSize,
  primaryBtnBase,
  screenBase,
  text,
} from "@/style/globalStyles";

const weatherStyles = StyleSheet.create({
  // screen
  cardHead: { ...cardHeadBase },
  cardTitle: { ...text.cardTitle },
  screen: { ...screenBase, backgroundColor: "transparent" },
  scroll: { padding: 16, gap: 16 },
  sectionTitle: { ...text.heading },
  sectionPara: { ...text.small, fontSize: fontSize.md, marginTop: 4 },
  sectionSubTitle: {
    ...text.label,
    fontSize: fontSize.sm,
    marginBottom: 10,
  },
  expiry: { ...text.muted, textAlign: "center" },

  // loading / error
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  centerTxt: { ...text.small, fontSize: fontSize.lg, textAlign: "center" },
  retryBtn: { ...primaryBtnBase, paddingHorizontal: 18 },
  retryTxt: { ...text.btn, fontSize: 14 },

  // WeatherCard
  weatherCard: { ...cardBase, padding: 16, flex: 1 },
  weatherDate: { ...text.small, fontSize: 16, paddingVertical: 10 },
  weatherRow: { flexDirection: "row" },
  weatherTemp: {
    flexDirection: "column-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  temp: {
    ...text.body,
    fontFamily: Typography.numbers,
    fontSize: fontSize.display,
  },
  aqiRow: { marginTop: 10 },
  aqiTxt: { ...text.body, fontSize: 14 },
  aqiBold: { fontFamily: Typography.secondary_bold },

  // WeatherTile
  tileWrap: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  tile: {
    ...cardBase,
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 4,
  },
  tileTxt: { ...text.body, fontSize: 15 },
  tileLabel: { ...text.muted, fontSize: fontSize.xs },

  // Hourly
  hourWrap: {
    ...cardBase,
    width: 92,
    height: 150,
    alignItems: "center",
    justifyContent: "space-between",
  },
  hourLabel: {
    ...text.small,
    fontSize: fontSize.md,
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 4,
  },
  hourTemp: {
    ...text.body,
    fontFamily: Typography.primary_medium,
    fontSize: 15,
    textAlign: "center",
    marginTop: 4,
  },

  // Daily
  dailyWrap: { ...cardBase, width: 220, padding: 14, gap: 12 },
  dailyTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dailyDate: { ...text.small, fontSize: 18 },
  dailyTemp: {
    ...text.body,
    fontFamily: Typography.primary_medium,
    fontSize: 28,
  },
  dailySunWrap: { flexDirection: "row", justifyContent: "space-between" },
  dailySun: { flexDirection: "row", alignItems: "center", gap: 4 },
  dailySunTxt: { ...text.small, fontSize: fontSize.md },
});

export default weatherStyles;
