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
// ctOS panels are square. `pill` is only for true circles.
export const radius = { xs: 0, sm: 0, md: 0, lg: 0, pill: 999 };

// HUD colours: cyan at low opacity, for panel edges, dividers and glow
export const hud = {
  edge: Colors.primary + "80", // 50%
  faint: Colors.primary + "33", // 20%
  bracket: Colors.primary, // corner marks
} as const;
const hudEdge = hud.edge;
const hudFaint = hud.faint;

// soft cyan glow (iOS + web; Android cannot tint shadows)
export const glowBase = {
  shadowColor: Colors.primary,
  shadowOpacity: 0.35,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 0 },
} as const;
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };
export const fontSize = {
  xs: 10,
  sm: 11,
  md: 13,
  lg: 15,
  xl: 22,
  xxl: 26,
  xxxl: 30,
  display_sml: 38,
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
  borderTopWidth: 2, // HUD header line
  borderTopColor: hudEdge,
  shadowColor: Colors.primary,
  shadowOpacity: 0.12,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 0 },
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
  borderWidth: 1,
  borderColor: Colors.border,
  borderLeftWidth: 2, // status-bar edge
  borderLeftColor: hudEdge,
} as const;

// text inputs
export const fieldBase = {
  fontFamily: Typography.primary, // terminal input
  fontSize: fontSize.md,
  paddingVertical: spacing.sm,
  paddingHorizontal: 10,
  color: Colors.textPrimary,
  backgroundColor: Colors.secondarySoft,
  borderWidth: 1,
  borderColor: Colors.border,
  borderLeftWidth: 2, // prompt marker
  borderLeftColor: Colors.primary,
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
  ...glowBase,
} as const;

// square tag used for tabs, filters and engine chips (+ its selected state)
export const chipBase = {
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: radius.lg,
  borderWidth: 1,
  borderColor: Colors.border,
  backgroundColor: Colors.secondarySoft,
} as const;

export const chipActiveBase = {
  backgroundColor: Colors.primarySoft,
  borderColor: Colors.primary,
  ...glowBase,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// TEXT
// ─────────────────────────────────────────────────────────────────────────────
export const text = {
  display: {
    fontFamily: Typography.primary_bold,
    color: Colors.textPrimary,
    fontSize: fontSize.display,
    letterSpacing: 1,
  },
  heading: {
    fontFamily: Typography.primary_bold,
    color: Colors.textPrimary,
    fontSize: fontSize.xxl,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: Typography.primary_bold,
    color: Colors.textPrimary,
    fontSize: fontSize.xl,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  cardTitle: {
    fontFamily: Typography.primary_bold,
    color: Colors.textPrimary,
    fontSize: fontSize.md,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  body: {
    fontFamily: Typography.secondary,
    color: Colors.textPrimary,
    fontSize: fontSize.md,
  },
  // meta / readout text: mono, uppercase, spaced (tabs, chips, dates, hints)
  small: {
    fontFamily: Typography.primary,
    color: Colors.textSecondary,
    fontSize: fontSize.sm,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  caption: {
    fontFamily: Typography.primary,
    color: Colors.textSecondary,
    fontSize: fontSize.xs,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  muted: {
    fontFamily: Typography.primary,
    color: Colors.textMuted,
    fontSize: fontSize.sm,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  // UPPERCASE section label above a group of cards
  label: {
    fontFamily: Typography.primary_medium,
    color: Colors.primary + "B3", // cyan at 70%
    fontSize: fontSize.xs,
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  // label on a primary button
  btn: {
    fontFamily: Typography.primary_bold,
    color: Colors.textOnPrimary,
    fontSize: fontSize.md,
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  // big numeric readout (counts, temperatures, timers)
  readout: {
    fontFamily: Typography.primary_medium,
    color: Colors.textPrimary,
    fontSize: fontSize.xxxl,
    letterSpacing: 1,
  },
  // digits (timers, temperatures)
  numbers: {
    fontFamily: Typography.numbers,
    color: Colors.textPrimary,
    fontSize: fontSize.md,
  },
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

  divider: {
    height: 1,
    marginVertical: 10,
    backgroundColor: hudFaint,
  },
  
  scene: { flex: 1, paddingHorizontal: 16, paddingBottom: 16 },
  screen: screenBase,
  card: cardBase,
  cardHead: cardHeadBase,
  cardTitle: text.cardTitle,
  inset: insetBase,
  field: fieldBase,
  primaryBtn: primaryBtnBase,
  primaryBtnTxt: text.btn,
  dangerBtn:{...primaryBtnBase, backgroundColor:Colors.danger},
  chip: chipBase,
  chipActive: chipActiveBase,

  textDisplay: text.display,
  textHeading: text.heading,
  textTitle: text.title,
  textBody: text.body,
  textSmall: text.small,
  textCaption: text.caption,
  textMuted: text.muted,
  textReadout: text.readout,

  scroll: { padding: 16, gap: 16 },

  // section based
  header: { paddingHorizontal: 16, paddingTop: 12, marginBottom:14 },
  sectionTitle: { ...text.heading },
  sectionPara: { ...text.small, fontSize: fontSize.md, marginTop: 4 },
  sectionSubTitle: {
    ...text.body,
    fontFamily: Typography.primary_medium,
    fontSize: 17,
    marginBottom: 8,
  },
  sectionLabel: text.label,

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
});

export default globalStyles;
