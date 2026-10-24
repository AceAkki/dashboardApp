import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
//   npx expo install @react-native-async-storage/async-storage @react-native-community/datetimepicker @expo/vector-icons
// npx expo install expo-clipboard @react-native-community/netinfo @react-native-async-storage/async-storage
// npx expo install lottie-react-native @react-native-async-storage/async-storage @expo/vector-icons
// npx expo install expo-location
// npx expo install react-native-svg

// Set all headers, numbers, percentages, and CTAs ("EXECUTE", "HACK") to JetBrains Mono or Space Grotesk.
// Keep Inter (or swap to Geist) for small labels and body text.
// -> Fonts are set ONCE, in the `text` entries below (fontFamily from Typography).
//    Do NOT add fontWeight next to a custom fontFamily: Android ignores it.
//    Pick the weight by picking the family (primary_bold, secondary_semibold, ...).

// ─────────────────────────────────────────────────────────────────────────────
// DESIGN TOKENS  - change a number here, it changes everywhere
// ─────────────────────────────────────────────────────────────────────────────
export const radius = { xs: 8, sm: 10, md: 16, lg: 20, pill: 999 };
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };
export const fontSize = {
  xs: 10,
  sm: 11,
  md: 13,
  lg: 15,
  xl: 22,
  xxl: 26,
  display: 56,
};

// ─────────────────────────────────────────────────────────────────────────────
// BUILDING BLOCKS
// Plain objects (not StyleSheet ids) on purpose: feature stylesheets spread them
// and override what they need, e.g.  card: { ...cardBase, flex: 1 }
// ─────────────────────────────────────────────────────────────────────────────

// full screen on the app background
export const screenBase = {
  flex: 1,
  backgroundColor: Colors.background,
} as const;

// THE card: dashboard cards, weather cards, panels, popups, forms
export const cardBase = {
  padding: spacing.md,
  borderRadius: radius.md,
  backgroundColor: Colors.surface,
  borderWidth: 1,
  borderColor: Colors.border,
  overflow: "hidden",
} as const;

// header row inside a card: title on the left, action icon on the right
export const cardHeadBase = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
} as const;

// a darker tile sitting INSIDE a card (list rows, link tiles, note inputs)
export const insetBase = {
  backgroundColor: Colors.secondarySoft,
  borderRadius: radius.xs,
} as const;

// text inputs
export const fieldBase = {
  fontFamily: Typography.secondary,
  paddingVertical: spacing.sm,
  paddingHorizontal: 10,
  color: Colors.textPrimary,
  backgroundColor: Colors.secondarySoft,
  borderWidth: 1,
  borderColor: Colors.border,
  borderRadius: radius.sm,
} as const;

// main call-to-action button + its label
export const primaryBtnBase = {
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.lg,
  borderRadius: radius.sm,
  backgroundColor: Colors.primary,
} as const;

// pill used for tabs, filters and engine chips (+ its selected state)
export const chipBase = {
  paddingVertical: 6,
  paddingHorizontal: 14,
  borderRadius: radius.lg,
  borderWidth: 1,
  borderColor: Colors.border,
  backgroundColor: Colors.secondarySoft,
} as const;

export const chipActiveBase = {
  backgroundColor: Colors.primarySoft,
  borderColor: Colors.primary,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// TEXT
// ─────────────────────────────────────────────────────────────────────────────
export const text = {
  display: { fontFamily: Typography.primary_bold, color: Colors.textPrimary, fontSize: fontSize.display },
  heading: { fontFamily: Typography.primary_bold, color: Colors.textPrimary, fontSize: fontSize.xxl },
  title: { fontFamily: Typography.primary_bold, color: Colors.textPrimary, fontSize: fontSize.xl },
  cardTitle: { fontFamily: Typography.primary_bold, color: Colors.textPrimary, fontSize: fontSize.md },
  body: { fontFamily: Typography.secondary, color: Colors.textPrimary, fontSize: fontSize.md },
  small: { fontFamily: Typography.secondary, color: Colors.textSecondary, fontSize: fontSize.sm },
  caption: { fontFamily: Typography.secondary, color: Colors.textSecondary, fontSize: fontSize.xs },
  muted: { fontFamily: Typography.secondary, color: Colors.textMuted, fontSize: fontSize.sm },
  // UPPERCASE section label above a group of cards
  label: {
    fontFamily: Typography.secondary_semibold,
    color: Colors.textSecondary,
    fontSize: fontSize.sm,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  // label on a primary button
  btn: { fontFamily: Typography.primary_medium, color: Colors.textOnPrimary, fontSize: fontSize.md },
  // digits (timers, temperatures)
  numbers: { fontFamily: Typography.numbers, color: Colors.textPrimary, fontSize: fontSize.md },
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Ready-to-use registered styles, for new components:
//   <View style={globalStyles.card}><Text style={globalStyles.cardTitle}>…
// ─────────────────────────────────────────────────────────────────────────────
const globalStyles = StyleSheet.create({
  containerFull: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  screen: screenBase,
  card: cardBase,
  cardHead: cardHeadBase,
  cardTitle: text.cardTitle,
  inset: insetBase,
  field: fieldBase,
  primaryBtn: primaryBtnBase,
  primaryBtnTxt: text.btn,
  chip: chipBase,
  chipActive: chipActiveBase,

  textDisplay: text.display,
  textHeading: text.heading,
  textTitle: text.title,
  textBody: text.body,
  textSmall: text.small,
  textCaption: text.caption,
  textMuted: text.muted,
  sectionLabel: text.label,
});

export default globalStyles;
