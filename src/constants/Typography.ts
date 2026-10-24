// Each value must equal BOTH the font file name (without .ttf, used by Android)
// and the font's internal PostScript name (used by iOS).
// Files in assets/fonts/ must be named exactly like this:
//   JetBrainsMono-Regular.ttf  JetBrainsMono-Medium.ttf  JetBrainsMono-Bold.ttf  JetBrainsMono-Italic.ttf
//   FiraCode-Light.ttf
//   Inter18pt-Regular.ttf  Inter18pt-Medium.ttf  Inter18pt-SemiBold.ttf  Inter18pt-Bold.ttf

export const Typography = {
  primary: "JetBrainsMono-Regular",
  primary_medium: "JetBrainsMono-Medium",
  primary_bold: "JetBrainsMono-Bold",
  primaryItalic: "JetBrainsMono-Italic",
  numbers: "FiraCode-Light",
  secondary: "Inter18pt-Regular",
  secondary_medium: "Inter18pt-Medium",
  secondary_semibold: "Inter18pt-SemiBold",
  secondary_bold: "Inter18pt-Bold",
} as const;
