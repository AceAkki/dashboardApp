import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import {
  fieldBase,
  fontSize,
  hud,
  text,
} from "@/style/globalStyles";

const taskManagerStyles = StyleSheet.create({
  container: { padding: 16, gap: 16 },
  scene: { flex: 1, paddingHorizontal: 16, paddingBottom: 16 },


  // tabs: count over label, glowing underline on the active one
  tabsRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: hud.faint,
  },
  tabItem: { flex: 1, alignItems: "center", paddingTop: 8, paddingBottom: 11 },
  tabCount: {
    fontFamily: Typography.primary_medium,
    fontSize: fontSize.lg,
    color: Colors.textSecondary,
    marginBottom: 3,
  },
  tabCountOn: { color: Colors.primary },
  tabLabel: { ...text.caption, color: Colors.textSecondary },
  tabLabelOn: { color: Colors.primary },
  tabUnderline: {
    position: "absolute",
    bottom: -1,
    left: "14%",
    right: "14%",
    height: 2,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },

  // search box + tag chips under the tabs
  filters: { marginHorizontal: 16, marginBottom: 10, gap: 10 },
  search: {
    ...fieldBase,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 0,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontFamily: Typography.primary,
    color: Colors.textPrimary,
    fontSize: fontSize.md,
    paddingVertical: 0,
  },
  chipRow: { gap: 8, paddingRight: 16 },
});

export default taskManagerStyles;
