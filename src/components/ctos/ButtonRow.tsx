import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { type ReactNode } from "react";

import { spacing } from "@/style/globalStyles";

type Props = {
  children: ReactNode;
  /** "row": buttons share the width, "stack": one under the other */
  layout?: "row" | "stack";
  style?: StyleProp<ViewStyle>;
};

// Puts buttons side by side (each takes equal width) or stacked. Cancel goes first (left).
export default function ButtonRow({ children, layout = "row", style }: Props) {
  return <View style={[layout === "row" ? styles.row : styles.stack, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: spacing.sm, alignItems: "stretch" },
  stack: { gap: spacing.sm },
});
