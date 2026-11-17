import { type ComponentProps } from "react";
import { StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import useAsciiSpinner from "@/global/useAsciiSpinner";
import {
  buttonLook,
  buttonSize,
  buttonText,
  iconSize,
  opacity,
  type ButtonSize,
  type ButtonVariant,
} from "@/style/globalStyles";
import CtosPressable from "./CtosPressable";

type Props = {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Ionicons name shown left of the label, coloured like the label */
  icon?: ComponentProps<typeof Ionicons>["name"];
  disabled?: boolean;
  /** shows "| WORKING" and blocks presses */
  loading?: boolean;
  /** feel of the press; "none" when the action gives its own feedback */
  haptic?: "tap" | "select" | "none";
  style?: StyleProp<ViewStyle>;
};

// The one button. Cancel = secondary, main action = primary/danger, at most one of those per row.
export default function Button({
  label,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  disabled = false,
  loading = false,
  haptic = "tap",
  style,
}: Props) {
  const look = buttonLook[variant];
  const off = disabled || loading;
  const spin = useAsciiSpinner(loading);

  return (
    <CtosPressable
      onPress={onPress}
      haptic={haptic}
      disabled={off}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: off, busy: loading }}
      style={[look.box, buttonSize[size], off && styles.off, style]}
      pressedStyle={look.pressed}
    >
      {icon ? <Ionicons name={icon} size={iconSize.sm + 1} color={look.textColor} /> : null}
      <Text style={[buttonText, { color: look.textColor }]}>
        {loading ? `${spin} WORKING` : label}
      </Text>
    </CtosPressable>
  );
}

const styles = StyleSheet.create({
  off: { opacity: opacity.disabled },
});
