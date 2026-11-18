import { StyleSheet, Text } from "react-native";

import { Colors } from "@/constants/Colors";
import { chipStyles, fontSize, hud, opacity } from "@/style/globalStyles";
import CtosPressable from "./CtosPressable";

type Props = {
  label: string;
  onPress: () => void;
  selected?: boolean;
  /** outlined, for "today" in a calendar */
  marked?: boolean;
  disabled?: boolean;
};

// One square in a calendar or a hour/minute grid. Selected = cyan + glow, like a Chip.
export default function PickCell({ label, onPress, selected = false, marked = false, disabled = false }: Props) {
  return (
    <CtosPressable
      haptic="select"
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      style={[styles.cell, marked && styles.marked, selected && chipStyles.selected, disabled && styles.off]}
      pressedStyle={chipStyles.pressed}
    >
      <Text style={[styles.text, selected && { color: Colors.primary }, disabled && { color: Colors.textMuted }]}>
          {label}
      </Text>
    </CtosPressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.secondarySoft,
  },
  marked: { borderColor: hud.edge },
  off: { opacity: opacity.disabled, backgroundColor: "transparent", borderColor: "transparent" },
  text: { fontFamily: chipStyles.label.fontFamily, fontSize: fontSize.sm + 1, color: Colors.textSecondary },
});
