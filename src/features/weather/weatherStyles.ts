import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

const card = {
  backgroundColor: Colors.surface,
  borderWidth: 1,
  borderColor: Colors.border,
  borderRadius: 16,
} as const;

const weatherStyles = StyleSheet.create({
  // screen
  cardHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { color: Colors.textPrimary, fontSize: 13, fontWeight: "700" },
  screen: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16, gap: 16 },
  sectionTitle: { color: Colors.textPrimary, fontSize: 26, fontWeight: "700" },
  sectionPara: { color: Colors.textSecondary, fontSize: 13, marginTop: 4 },
  sectionSubTitle: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 8,
  },
  expiry: { color: Colors.textMuted, fontSize: 11, textAlign: "center" },

  // loading / error
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  centerTxt: { color: Colors.textSecondary, textAlign: "center" },
  retryBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: Colors.primary,
  },
  retryTxt: { color: Colors.textOnPrimary, fontWeight: "600" },

  // WeatherCard
  weatherCard: { ...card, padding: 16 },
  weatherDate: { color: Colors.textSecondary, fontSize: 16, fontWeight: "300" },
  weatherRow: { flexDirection: "row" },
  weatherTemp: {
    flexDirection: "column-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  temp: { color: Colors.textPrimary, fontSize: 56, fontWeight: "300" },
  aqiRow: { marginTop: 10 },
  aqiTxt: { color: Colors.textPrimary, fontSize: 14 },
  aqiBold: { fontWeight: "700" },

  // WeatherTile
  tileWrap: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  tile: {
    ...card,
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 4,
  },
  tileTxt: { color: Colors.textPrimary, fontSize: 15 },
  tileLabel: { color: Colors.textMuted, fontSize: 10 },

  // Hourly
  hourWrap: {
    ...card,
    width: 92,
    height: 150,
    padding: 12,
    alignItems: "center",
    justifyContent: "space-between",
  },
  hourLabel: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "300",
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 4,
  },
  hourTemp: {
    color: Colors.textPrimary,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 4,
  },

  // Daily
  dailyWrap: { ...card, width: 220, padding: 14, gap: 12 },
  dailyTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dailyDate: { color: Colors.textSecondary, fontSize: 18 },
  dailyTemp: { color: Colors.textPrimary, fontSize: 28, fontWeight: "600" },
  dailySunWrap: { flexDirection: "row", justifyContent: "space-between" },
  dailySun: { flexDirection: "row", alignItems: "center", gap: 4 },
  dailySunTxt: { color: Colors.textSecondary, fontSize: 13 },
});

export default weatherStyles;
