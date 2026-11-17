import { StyleSheet, Text } from "react-native";

import { Colors } from "@/constants/Colors";
import { insetBase, spacing, text } from "@/style/globalStyles";
import CtosPressable from "./CtosPressable";

type Props = {
  label: string;
  onPress: () => void;
  haptic?: "tap" | "select" | "none";
};

// one row in a popup menu: inset tile that fills cyan while pressed
export default function MenuItem({ label, onPress, haptic = "tap" }: Props) {
  return (
    <CtosPressable
      haptic={haptic}
      style={styles.item}
      pressedStyle={styles.pressed}
      onPress={onPress}
      accessibilityRole="menuitem"
    >
      {({ pressed }: { pressed: boolean }) => (
        <Text style={[styles.label, pressed && styles.labelPressed]}>{label}</Text>
      )}
    </CtosPressable>
  );
}

const styles = StyleSheet.create({
  item: { ...insetBase, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, alignSelf: "stretch" },
  pressed: { backgroundColor: Colors.primary },
  label: { ...text.small, color: Colors.textPrimary, letterSpacing: 2 },
  labelPressed: { color: Colors.textOnPrimary },
});
