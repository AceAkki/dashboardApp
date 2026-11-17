import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import {
  radius,
  screenBase,
  text,
} from "@/style/globalStyles";

const bentoStyles = StyleSheet.create({
  root: { ...screenBase, backgroundColor: "transparent" },
  scroll: { padding: 16, paddingBottom: 32, gap: 20 },

  // header
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: radius.xs,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTxt: { ...text.btn, fontFamily: Typography.primary_bold },

  greetWrap: { marginTop: 4 },
  counts: { flexDirection: "row", marginTop: 2 },
  countCell: { flex: 1, gap: 2, alignItems:"center" },
  countLabel: { ...text.caption },
  segBar: { flexDirection: "row", height: 4, gap: 2, marginTop: 14 },
  greet: { ...text.title },
  synced: { ...text.small, marginTop: 4 },

  row: { flexDirection: "row", gap: 10 },
  small: { ...text.small },






});

export default bentoStyles;
