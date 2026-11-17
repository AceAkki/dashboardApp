import { type ReactNode } from "react";
import { StyleSheet, Text } from "react-native";

import { fontSize, text, tone, type Tone } from "@/style/globalStyles";

// glyph + words, never colour alone
export default function Status({ tone: t, children }: { tone: Tone; children: ReactNode }) {
  const { glyph, color } = tone[t];
  return (
    <Text style={[styles.status, { color }]}>
      {glyph} {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  status: { ...text.caption, fontSize: fontSize.sm },
});
