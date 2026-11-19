import { useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { Colors } from "@/constants/Colors";
import { feedback } from "@/hooks/useFeedback";
import { ease } from "@/global/motion";
import { motion } from "@/style/globalStyles";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = Omit<PressableProps, "style"> & {
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  /** what the press feels like: a light tap (default), a selection tick (chips, tabs) or nothing */
  haptic?: "tap" | "select" | "none";
  /** how it looks while held down; default is the cyan flash */
  pressedStyle?: StyleProp<ViewStyle>;
};

// Drop-in <Pressable>: cyan flash + a tiny scale-down while pressed, and a haptic on press.
// Swap it in anywhere a Pressable is a button; style / onPress / hitSlop work as before.
export default function CtosPressable({
  style,
  pressedStyle,
  haptic = "tap",
  onPress,
  onPressIn,
  onPressOut,
  ...rest
}: Props) {
  const [pressed, setPressed] = useState(false);
  const [scale] = useState(() => new Animated.Value(1));

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(e) => {
        setPressed(true);
        // JS-driven on purpose: a Chip passes colour animations (JS-only) to this same view, and one view can
        // not mix native- and JS-driven animations
        ease(scale, motion.pressScale, motion.pressIn, false);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        setPressed(false);
        ease(scale, 1, motion.pressOut, false);
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic === "tap") feedback.tap();
        else if (haptic === "select") feedback.select();
        onPress?.(e);
      }}
      style={[style, pressed && (pressedStyle ?? styles.pressed), { transform: [{ scale }] }]}
    />
  );
}

const styles = StyleSheet.create({
  pressed: { backgroundColor: Colors.primarySoft, borderColor: Colors.primary },
});
