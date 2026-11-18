import { StyleSheet, Text } from "react-native";

import { Colors } from "@/constants/Colors";
import { hitSlop, text } from "@/style/globalStyles";
import CtosPressable from "./CtosPressable";

type Props = {
  label: string;
  onPress: () => void;
  /** danger: red, for things like DEL */
  tone?: "default" | "danger";
  haptic?: "tap" | "select" | "none";
};

// A small word-button (COPY, PASTE, CLEAR, EDIT, DEL, + NEW) that sits in a header or a row.
// For a real button with a box, use Button.
export default function TextAction({ label, onPress, tone = "default", haptic = "select" }: Props) {
  return (
    <CtosPressable
      haptic={haptic}
      hitSlop={hitSlop}
      pressedStyle={{ opacity: 0.5 }}
      onPress={onPress}
      accessibilityRole="button"
    >
      <Text style={[styles.label, tone === "danger" && styles.danger]}>{label}</Text>
    </CtosPressable>
  );
}

const styles = StyleSheet.create({
  label: { ...text.caption, color: Colors.primary },
  danger: { color: Colors.danger },
});
