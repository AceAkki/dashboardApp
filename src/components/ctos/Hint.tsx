import { type ReactNode } from "react";
import { StyleSheet, Text } from "react-native";

import { fontSize, text } from "@/style/globalStyles";

// the one hint look: small muted caps under a control or inside a block
export default function Hint({ children }: { children: ReactNode }) {
  return <Text style={styles.hint}>{children}</Text>;
}

const styles = StyleSheet.create({
  hint: { ...text.muted, fontSize: fontSize.xs },
});
