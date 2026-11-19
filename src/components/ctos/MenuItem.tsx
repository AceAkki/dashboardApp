import { StyleSheet, Text } from "react-native";

import { Colors } from "@/constants/Colors";
import { insetBase, spacing, text, opacity } from "@/style/globalStyles";
import CtosPressable from "./CtosPressable";
import { feedback } from "@/hooks/useFeedback";

type Props = {
  label: string;
  isDisabled?: boolean;
  onPress: () => void;
  haptic?: "tap" | "select" | "none";
};

// one row in a popup menu: inset tile that fills cyan while pressed
export default function MenuItem({
  label,
  isDisabled = false,
  onPress,
  haptic = "tap",
}: Props) {
  return (
    <CtosPressable
      haptic={haptic}
      style={[styles.item, isDisabled && styles.disabled]}
      pressedStyle={styles.pressed}
      onPress={() =>
        isDisabled ? (() => feedback.warn("Not Allowed"))() : onPress()
      }
      accessibilityRole="menuitem"
    >
      {({ pressed }: { pressed: boolean }) => (
        <Text
          style={[
            styles.label,
            pressed && styles.labelPressed,
            isDisabled && styles.disabled,
          ]}
        >
          {label}
        </Text>
      )}
    </CtosPressable>
  );
}

const styles = StyleSheet.create({
  item: {
    ...insetBase,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    alignSelf: "stretch",
  },
  pressed: { backgroundColor: Colors.primary },
  label: { ...text.small, color: Colors.textPrimary, letterSpacing: 2 },
  labelPressed: { color: Colors.textOnPrimary },
  disabled: { opacity: opacity.disabled },
});
