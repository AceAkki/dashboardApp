import { Colors } from "@/constants/Colors";

// The widget library only accepts colors written as "#..." (or rgba), so the app's colors are typed that way once, here.
type Hex = `#${string}`;
const h = (c: string) => c as Hex;

export const C = {
  primary: h(Colors.primary),
  danger: h(Colors.danger),
  success: h(Colors.success),
  chart4: h(Colors.chart4),
  surface: h(Colors.surface),
  border: h(Colors.border),
  textPrimary: h(Colors.textPrimary),
  textSecondary: h(Colors.textSecondary),
  textMuted: h(Colors.textMuted),
  textOnPrimary: h(Colors.textOnPrimary),
} as const;

export const hex = h;
// font names are the font file names (see the fonts list in the app.json widget plugin)
export const REGULAR = "JetBrainsMono-Regular";
export const BOLD = "JetBrainsMono-Bold";
export const LINE = h("#0E2028"); // a row divider, a shade lighter than the panel
