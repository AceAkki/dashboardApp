import { type ComponentProps } from "react";
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";
import { glowBase, hitSlop, hud, iconSize, opacity, radius } from "@/style/globalStyles";
import CtosPressable from "./CtosPressable";

type Props = {
  icon: ComponentProps<typeof Ionicons>["name"];
  onPress: (e: Parameters<NonNullable<ComponentProps<typeof CtosPressable>["onPress"]>>[0]) => void;
  /** read by screen readers: icons have no text */
  label: string;
  /** plain: just the icon; box: bordered square; primary: filled cyan with glow */
  variant?: "plain" | "box" | "primary";
  /** width and height of the square */
  size?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

// The one icon-only button (pomodoro controls, task options ...).
export default function IconButton({
  icon,
  onPress,
  label,
  variant = "box",
  size = 36,
  disabled = false,
  style,
}: Props) {
  const color =
    variant === "primary" ? Colors.textOnPrimary : variant === "box" ? Colors.primary : Colors.textSecondary;
  const glyph = variant === "plain" ? iconSize.lg : size >= 60 ? iconSize.lg + 10 : iconSize.md + 2;

  return (
    <CtosPressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={hitSlop}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={[styles.base, variant !== "plain" && { width: size, height: size }, variantStyle[variant], disabled && styles.off, style]}
      pressedStyle={{ opacity: opacity.pressed }}
    >
      <Ionicons name={icon} size={glyph} color={color} />
    </CtosPressable>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: "center", justifyContent: "center" },
  off: { opacity: opacity.disabled },
});

const variantStyle = StyleSheet.create({
  plain: {},
  box: { borderWidth: 1, borderColor: hud.edge, backgroundColor: Colors.secondarySoft, borderRadius: radius.xs },
  primary: { backgroundColor: Colors.primary, borderRadius: radius.xs, ...glowBase },
});
