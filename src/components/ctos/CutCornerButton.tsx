import type { ComponentProps } from "react";
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import Svg, { Polygon } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "@/constants/Colors";
import CtosPressable from "./CtosPressable";

type Props = {
  onPress: () => void;
  accessibilityLabel: string;
  /** any Ionicons name; default is the plus */
  icon?: ComponentProps<typeof Ionicons>["name"];
  /** width and height */
  size?: number;
  /** how much of the top-left corner is cut off */
  cut?: number;
  color?: string;
  iconColor?: string;
  /** pins it to the bottom-right of its parent (the parent needs room: put it in a flex:1 View) */
  floating?: boolean;
  style?: StyleProp<ViewStyle>;
};

// Small square button with the top-left corner cut off. React Native cannot clip a View
// to a shape, so the cyan fill is an SVG polygon and the icon sits on top of it.
// Reuse it anywhere an icon button is needed:
//   <CutCornerButton icon="add" accessibilityLabel="Add task" onPress={...} floating />
export default function CutCornerButton({
  onPress,
  accessibilityLabel,
  icon = "add",
  size = 46,
  cut = 10,
  color = Colors.primary,
  iconColor = Colors.textOnPrimary,
  floating = false,
  style,
}: Props) {
  const points = `${cut},0 ${size},0 ${size},${size} 0,${size} 0,${cut}`;
  return (
    <CtosPressable
      haptic="tap"
      pressedStyle={{ opacity: 0.7 }}
      hitSlop={6}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[
        { width: size, height: size, alignItems: "center", justifyContent: "center" },
        floating && styles.floating,
        style,
      ]}
    >
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Polygon points={points} fill={color} />
      </Svg>
      <Ionicons name={icon} size={Math.round(size * 0.6)} color={iconColor} />
    </CtosPressable>
  );
}

const styles = StyleSheet.create({
  floating: { position: "absolute", right: 16, bottom: 16 },
});
