import { useState, type ComponentProps } from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import Svg, { Polygon } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";
import useAsciiSpinner from "@/hooks/useAsciiSpinner";
import { buttonText, hitSlop, hud, opacity, screenPad, spacing } from "@/style/globalStyles";
import CtosPressable from "./CtosPressable";

type Variant = "primary" | "secondary" | "danger";

type Props = {
  onPress: () => void;
  accessibilityLabel: string;
  /** any Ionicons name; default is the plus */
  icon?: ComponentProps<typeof Ionicons>["name"];
  /** optional word next to the icon, in the same style as Button labels */
  text?: string;
  /** primary = solid cyan (default), secondary = outlined, danger = red */
  variant?: Variant;
  disabled?: boolean;
  /** shows a | / - \ spinner instead of the icon and ignores presses */
  loading?: boolean;
  /** height (and width, when there is no text) */
  size?: number;
  /** how much of the top-left corner is cut off */
  cut?: number;
  haptic?: "tap" | "select" | "none";
  /** pins it to the bottom-right of its parent. The parent must be the area ABOVE the nav bar (a flex:1 View) */
  floating?: boolean;
  /** distance from the right and bottom edges when floating; defaults to the screen padding */
  right?: number;
  bottom?: number;
  style?: StyleProp<ViewStyle>;
};

// fill / outline / pressed fill / icon colour for each variant, from the shared button colours
const LOOK: Record<Variant, { fill: string; edge: string; pressed: string; ink: string }> = {
  primary: {
    fill: Colors.primary,
    edge: Colors.primary,
    pressed: Colors.primaryHover,
    ink: Colors.textOnPrimary,
  },
  secondary: {
    fill: Colors.secondarySoft,
    edge: hud.edge,
    pressed: Colors.primarySoft,
    ink: Colors.textPrimary,
  },
  danger: {
    fill: Colors.danger,
    edge: Colors.danger,
    pressed: Colors.danger,
    ink: Colors.textOnPrimary,
  },
};

const NONE: ViewStyle = {};
const DIM: ViewStyle = { opacity: 0.8 };

// Square button with the top-left corner cut off, used for the floating "add" buttons.
// React Native cannot clip a View to a shape, so the fill is an SVG polygon with the content on top.
//   <CutCornerButton icon="add" accessibilityLabel="Add task" onPress={...} floating />
export default function CutCornerButton({
  onPress,
  accessibilityLabel,
  icon = "add",
  text,
  variant = "primary",
  disabled = false,
  loading = false,
  size = 46,
  cut = 10,
  haptic = "tap",
  floating = false,
  right = screenPad,
  bottom = screenPad,
  style,
}: Props) {
  const look = LOOK[variant];
  const spin = useAsciiSpinner(loading);
  const [measured, setMeasured] = useState(size);
  const inactive = disabled || loading;

  // a word makes the button wider than it is tall; the polygon follows the measured width
  const w = text ? Math.max(measured, size) : size;
  const c = Math.min(cut, size / 2 - 1); // a cut bigger than half the button would break the shape
  const half = 0.5; // keeps the 1 px outline inside the box
  const points = `${c},${half} ${w - half},${half} ${w - half},${size - half} ${half},${size - half} ${half},${c}`;

  return (
    <CtosPressable
      haptic={haptic}
      hitSlop={hitSlop}
      disabled={inactive}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: inactive, busy: loading }}
      // no box flash: the box is square, the shape is the polygon, which changes colour itself
      pressedStyle={variant === "danger" ? DIM : NONE}
      onLayout={(e) => setMeasured(e.nativeEvent.layout.width)}
      style={[
        {
          minWidth: size,
          height: size,
          paddingHorizontal: text ? spacing.lg : 0,
          alignItems: "center",
          justifyContent: "center",
        },
        floating && { position: "absolute", right, bottom },
        disabled && styles.off,
        style,
      ]}
    >
      {({ pressed }: { pressed: boolean }) => (
        <>
          <Svg width={w} height={size} style={StyleSheet.absoluteFill}>
            <Polygon
              points={points}
              fill={pressed ? look.pressed : look.fill}
              stroke={pressed && variant === "secondary" ? Colors.primary : look.edge}
              strokeWidth={1}
            />
          </Svg>
          <View style={styles.content}>
            {loading ? (
              <Text style={[styles.label, { color: look.ink }]}>{spin}</Text>
            ) : (
              <Ionicons name={icon} size={Math.round(size * 0.5)} color={look.ink} />
            )}
            {text ? <Text style={[styles.label, { color: look.ink }]}>{text}</Text> : null}
          </View>
        </>
      )}
    </CtosPressable>
  );
}

const styles = StyleSheet.create({
  content: { flexDirection: "row", alignItems: "center", gap: 6 },
  label: { ...buttonText },
  off: { opacity: opacity.disabled },
});
