import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

const favLinksStyles = StyleSheet.create({
  favLinks: {
    padding: 16,
    gap: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    flex: 1,
    justifyContent: "space-between",
  },

  sectionLabel: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },

  // search bar
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingLeft: 12,
    paddingRight: 6,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    backgroundColor: Colors.secondarySoft,
  },
  searchBarFocused: {
    borderColor: Colors.primary,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 15,
    paddingVertical: 0,
    width: "100%",
  },
  clearBtn: { padding: 4 },
  goBtn: {
    width: 25,
    height: 25,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  goBtnDisabled: {
    backgroundColor: Colors.secondary,
    opacity: 0.5,
  },

  // engine chips
  chipsList: { gap: 8, paddingRight: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    backgroundColor: Colors.secondarySoft,
  },
  chipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySoft,
  },
  chipPressed: { opacity: 0.7 },
  chipTxt: { color: Colors.textSecondary, fontSize: 13 },
  chipTxtSelected: { color: Colors.primary, fontWeight: "600" },

  // favicon with fallback
  icon: { width: 20, height: 20, borderRadius: 10 },
  iconFallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.secondary,
  },
  iconFallbackTxt: {
    color: Colors.textPrimary,
    fontSize: 10,
    fontWeight: "700",
  },

  // quick links
  quickRow: { gap: 8 },
  quickItem: {
    flex: 1,
    alignItems: "center",
    gap: 6,
    padding: 10,
    width: 100,
    borderRadius: 12,
    backgroundColor: Colors.secondarySoft,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  quickItemPressed: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySoft,
  },
  quickTxt: { color: Colors.textSecondary, fontSize: 11 },
});

export default favLinksStyles;
